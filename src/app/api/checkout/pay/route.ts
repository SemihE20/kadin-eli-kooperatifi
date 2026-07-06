import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { chargeCard, activePaymentProvider } from "@/lib/payment";
import { calculateShipping } from "@/lib/utils";
import type { PaymentMethod, ShippingAddress } from "@/types";

interface PayRequestBody {
  items: { productId: string; quantity: number }[];
  shipping: ShippingAddress;
  paymentMethod: PaymentMethod;
  notes?: string;
  email?: string;
  card?: {
    cardHolderName: string;
    cardNumber: string;
    expireMonth: string;
    expireYear: string;
    cvc: string;
  };
}

export async function POST(request: Request) {
  let body: PayRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const { items, shipping, paymentMethod, notes, email, card } = body;

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "Sepetiniz boş." }, { status: 400 });
  }
  if (!shipping?.full_name || !shipping?.phone || !shipping?.city || !shipping?.district || !shipping?.address) {
    return NextResponse.json({ error: "Teslimat bilgileri eksik." }, { status: 400 });
  }
  if (paymentMethod === "kredi_karti" && !card) {
    return NextResponse.json({ error: "Kart bilgileri eksik." }, { status: 400 });
  }

  const supabase = await createClient();
  const admin = createAdminClient();

  // Recompute prices from the database — never trust client-submitted totals.
  const productIds = items.map((i) => i.productId);
  const { data: products, error: productsError } = await admin
    .from("products")
    .select("id, name, price, stock_quantity, is_active")
    .in("id", productIds);

  if (productsError || !products || products.length !== productIds.length) {
    return NextResponse.json({ error: "Sepetteki bazı ürünler bulunamadı." }, { status: 400 });
  }

  const productById = new Map(products.map((p) => [p.id, p]));
  let subtotal = 0;
  for (const item of items) {
    const product = productById.get(item.productId);
    if (!product || !product.is_active) {
      return NextResponse.json({ error: `Ürün artık satışta değil: ${product?.name ?? item.productId}` }, { status: 400 });
    }
    if (product.stock_quantity < item.quantity) {
      return NextResponse.json({ error: `Yetersiz stok: ${product.name}` }, { status: 400 });
    }
    subtotal += product.price * item.quantity;
  }
  const shippingCost = calculateShipping(subtotal);
  const total = subtotal + shippingCost;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let paymentReference: string | null = null;

  if (paymentMethod === "kredi_karti" && card) {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const [firstName, ...rest] = shipping.full_name.trim().split(" ");

    const chargeResult = await chargeCard({
      card,
      amount: total,
      orderNumber: `TMP-${Date.now()}`,
      buyer: {
        id: user?.id ?? `guest-${Date.now()}`,
        name: firstName || shipping.full_name,
        surname: rest.join(" ") || firstName || shipping.full_name,
        email: email || user?.email || "misafir@gozlerkooperatif.com",
        phone: shipping.phone,
        address: shipping.address,
        city: shipping.city,
        ip: forwardedFor?.split(",")[0]?.trim() || "127.0.0.1",
      },
      items: items.map((item) => {
        const product = productById.get(item.productId)!;
        return { id: product.id, name: product.name, price: product.price, quantity: item.quantity };
      }),
    });

    if (!chargeResult.success) {
      return NextResponse.json({ error: chargeResult.message }, { status: 402 });
    }
    paymentReference = chargeResult.paymentReference ?? null;
  }

  const { data: order, error: orderError } = await admin
    .from("orders")
    .insert({
      user_id: user?.id ?? null,
      status: "beklemede",
      subtotal,
      shipping_cost: shippingCost,
      total,
      shipping_address: shipping,
      payment_method: paymentMethod,
      payment_reference: paymentReference,
      notes: notes || null,
    })
    .select("id, order_number")
    .single();

  if (orderError || !order) {
    console.error("checkout/pay: order insert failed", orderError);
    return NextResponse.json({ error: "Sipariş oluşturulamadı. Lütfen tekrar deneyin." }, { status: 500 });
  }

  const orderItemsPayload = items.map((item) => {
    const product = productById.get(item.productId)!;
    return {
      order_id: order.id,
      product_id: product.id,
      quantity: item.quantity,
      unit_price: product.price,
      total_price: product.price * item.quantity,
    };
  });

  const { error: itemsError } = await admin.from("order_items").insert(orderItemsPayload);
  if (itemsError) {
    console.error("checkout/pay: order_items insert failed", itemsError);
    return NextResponse.json({ error: "Sipariş kalemleri kaydedilemedi." }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    orderNumber: order.order_number,
    paymentReference,
    provider: paymentMethod === "kredi_karti" ? activePaymentProvider() : null,
  });
}
