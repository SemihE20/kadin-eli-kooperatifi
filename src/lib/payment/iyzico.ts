import Iyzipay from "iyzipay";
import type { ChargeParams, ChargeResult } from "./types";

export function isIyzicoConfigured(): boolean {
  return Boolean(process.env.IYZICO_API_KEY && process.env.IYZICO_SECRET_KEY);
}

function getClient(): Iyzipay {
  return new Iyzipay({
    apiKey: process.env.IYZICO_API_KEY!,
    secretKey: process.env.IYZICO_SECRET_KEY!,
    uri: process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com",
  });
}

/**
 * Real iyzico charge — only reachable when IYZICO_API_KEY/IYZICO_SECRET_KEY
 * are set. Untested in this environment (no merchant account available);
 * review against https://docs.iyzico.com before going live.
 */
export async function iyzicoCharge({ card, amount, orderNumber, buyer, items }: ChargeParams): Promise<ChargeResult> {
  const client = getClient();
  const price = amount.toFixed(2);

  const request = {
    locale: Iyzipay.LOCALE.TR,
    conversationId: orderNumber,
    price,
    paidPrice: price,
    currency: Iyzipay.CURRENCY.TRY,
    installments: 1,
    basketId: orderNumber,
    paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
    paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
    paymentCard: {
      cardHolderName: card.cardHolderName,
      cardNumber: card.cardNumber.replace(/\D/g, ""),
      expireMonth: card.expireMonth,
      expireYear: card.expireYear.length === 2 ? `20${card.expireYear}` : card.expireYear,
      cvc: card.cvc,
      registerCard: 0,
      cardAlias: "checkout",
    },
    buyer: {
      id: buyer.id,
      name: buyer.name,
      surname: buyer.surname || buyer.name,
      gsmNumber: buyer.phone,
      email: buyer.email,
      // iyzico sandbox accepts any syntactically valid TC kimlik no for testing.
      // Collect and pass the real value for production use.
      identityNumber: "11111111111",
      registrationAddress: buyer.address,
      ip: buyer.ip,
      city: buyer.city || "Denizli",
      country: "Turkey",
    },
    shippingAddress: {
      contactName: `${buyer.name} ${buyer.surname}`.trim(),
      city: buyer.city || "Denizli",
      country: "Turkey",
      address: buyer.address,
    },
    billingAddress: {
      contactName: `${buyer.name} ${buyer.surname}`.trim(),
      city: buyer.city || "Denizli",
      country: "Turkey",
      address: buyer.address,
    },
    basketItems: items.map((item) => ({
      id: item.id,
      name: item.name,
      category1: "Genel",
      itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
      price: (item.price * item.quantity).toFixed(2),
    })),
  };

  return new Promise((resolve) => {
    client.payment.create(request, (err, result) => {
      if (err) {
        resolve({ success: false, message: "iyzico servisine ulaşılamadı.", provider: "iyzico" });
        return;
      }

      // @types/iyzipay doesn't model the errorMessage/errorCode fields the
      // real API returns on failure — read them defensively.
      const raw = result as unknown as { status: string; paymentId?: string; errorMessage?: string };

      if (raw.status === "success") {
        resolve({
          success: true,
          message: "Ödeme onaylandı.",
          paymentReference: raw.paymentId,
          provider: "iyzico",
        });
      } else {
        resolve({
          success: false,
          message: raw.errorMessage || "Ödeme reddedildi.",
          provider: "iyzico",
        });
      }
    });
  });
}
