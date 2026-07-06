"use client";

import { useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import { useCartStore } from "@/store/cart";
import { formatPrice, calculateShipping, generateOrderWhatsAppMessage } from "@/lib/utils";
import { PAYMENT_METHODS, BANK_INFO, WHATSAPP_BASE_URL, WHATSAPP_NUMBER } from "@/lib/constants";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import type { PaymentMethod } from "@/types";

export default function OrderPage() {
  const { items, getSubtotal, clearCart } = useCartStore();
  const subtotal = getSubtotal();
  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("kredi_karti");
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    city: "",
    district: "",
    address: "",
    postalCode: "",
    notes: "",
  });
  const [cardForm, setCardForm] = useState({
    email: "",
    cardHolderName: "",
    cardNumber: "",
    expireMonth: "",
    expireYear: "",
    cvc: "",
  });
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [paymentReference, setPaymentReference] = useState<string | null>(null);
  const [paymentProvider, setPaymentProvider] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  function formatCardNumber(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  }

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "cardNumber") {
      setCardForm({ ...cardForm, cardNumber: formatCardNumber(value) });
    } else if (name === "expireMonth" || name === "expireYear" || name === "cvc") {
      setCardForm({ ...cardForm, [name]: value.replace(/\D/g, "").slice(0, name === "cvc" ? 4 : 2) });
    } else {
      setCardForm({ ...cardForm, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/checkout/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({ productId: item.product.id, quantity: item.quantity })),
          shipping: {
            full_name: formData.fullName,
            phone: formData.phone,
            city: formData.city,
            district: formData.district,
            address: formData.address,
            postal_code: formData.postalCode || undefined,
          },
          paymentMethod,
          notes: formData.notes || undefined,
          email: paymentMethod === "kredi_karti" ? cardForm.email : undefined,
          card:
            paymentMethod === "kredi_karti"
              ? {
                  cardHolderName: cardForm.cardHolderName,
                  cardNumber: cardForm.cardNumber,
                  expireMonth: cardForm.expireMonth,
                  expireYear: cardForm.expireYear,
                  cvc: cardForm.cvc,
                }
              : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error || "Sipariş oluşturulamadı. Lütfen tekrar deneyin.");
        setSubmitting(false);
        return;
      }

      setOrderNumber(data.orderNumber);
      setPaymentReference(data.paymentReference ?? null);
      setPaymentProvider(data.provider ?? null);
      setOrderCompleted(true);
      clearCart();
    } catch {
      setSubmitError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsAppOrder = () => {
    const message = generateOrderWhatsAppMessage(
      orderNumber,
      items.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price * item.quantity,
      })),
      total
    );
    const whatsappUrl = `${WHATSAPP_BASE_URL}/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    clearCart();
  };

  if (items.length === 0 && !orderCompleted) {
    return (
      <>
        <PageHeader
          title="Sipariş"
          breadcrumbs={[
            { label: "Ana Sayfa", href: "/" },
            { label: "Sepet", href: "/sepet" },
            { label: "Sipariş" },
          ]}
        />
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-earth-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">🛒</span>
          </div>
          <h2 className="font-heading text-lg font-semibold text-foreground mb-2">Sepetiniz boş</h2>
          <p className="text-sm text-muted mb-6">Sipariş vermek için önce ürün eklemelisiniz.</p>
          <Link href="/urunler"><Button>Alışverişe Başla</Button></Link>
        </div>
      </>
    );
  }

  if (orderCompleted) {
    return (
      <>
        <PageHeader
          title="Sipariş Alındı"
          breadcrumbs={[
            { label: "Ana Sayfa", href: "/" },
            { label: "Sipariş" },
          ]}
        />
        <section className="py-16">
          <div className="max-w-lg mx-auto px-4 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Siparişiniz Alındı!</h2>
            <p className="text-sm text-muted mb-2">Sipariş Numaranız:</p>
            <p className="text-lg font-bold text-primary-700 mb-6 bg-primary-50 inline-block px-4 py-2 rounded-xl">{orderNumber}</p>

            {paymentMethod === "havale_eft" && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
                <h3 className="font-heading text-sm font-semibold text-amber-800 mb-2">💳 Havale/EFT Bilgileri</h3>
                <div className="space-y-1 text-xs text-amber-700">
                  <p><strong>Banka:</strong> {BANK_INFO.bankName}</p>
                  <p><strong>Hesap Sahibi:</strong> {BANK_INFO.accountHolder}</p>
                  <p><strong>IBAN:</strong> {BANK_INFO.iban}</p>
                  <p className="mt-2 text-amber-600">Açıklama kısmına sipariş numaranızı yazmayı unutmayın.</p>
                </div>
              </div>
            )}

            {paymentMethod === "kredi_karti" && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-left">
                <h3 className="font-heading text-sm font-semibold text-green-800 mb-2">✅ Ödeme Onaylandı</h3>
                <div className="space-y-1 text-xs text-green-700">
                  {paymentReference && <p><strong>İşlem Referansı:</strong> {paymentReference}</p>}
                  {paymentProvider === "mock" && (
                    <p className="mt-2 text-green-600">
                      Test modu: gerçek bir tahsilat yapılmadı. Gerçek ödeme için iyzico API anahtarları tanımlanmalı.
                    </p>
                  )}
                </div>
              </div>
            )}

            <p className="text-sm text-muted mb-6">
              Siparişinizi WhatsApp üzerinden onaylayabilirsiniz.
            </p>

            <div className="flex flex-col gap-3">
              <Button onClick={handleWhatsAppOrder} fullWidth size="lg" className="!bg-green-500 hover:!bg-green-600">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp ile Onayla
              </Button>
              <Link href="/" className="text-xs text-muted hover:text-primary-700 transition-colors">
                Ana Sayfaya Dön
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Siparişi Tamamla"
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Sepet", href: "/sepet" },
          { label: "Sipariş" },
        ]}
      />

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-2xl border border-border p-6">
                <h2 className="font-heading text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-primary-700 text-white text-xs font-bold rounded-full flex items-center justify-center">1</span>
                  Teslimat Adresi
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Ad Soyad" name="fullName" value={formData.fullName} onChange={handleChange} required />
                  <Input label="Telefon" name="phone" type="tel" placeholder="05XX XXX XX XX" value={formData.phone} onChange={handleChange} required />
                  <Input label="İl" name="city" value={formData.city} onChange={handleChange} required />
                  <Input label="İlçe" name="district" value={formData.district} onChange={handleChange} required />
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-foreground block mb-1.5">Adres</label>
                    <textarea
                      name="address"
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm bg-white placeholder:text-muted hover:border-primary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all resize-none"
                      placeholder="Mahalle, sokak, bina no, daire no..."
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl border border-border p-6">
                <h2 className="font-heading text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-primary-700 text-white text-xs font-bold rounded-full flex items-center justify-center">2</span>
                  Ödeme Yöntemi
                </h2>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentMethod === method.id
                          ? "border-primary-500 bg-primary-50"
                          : "border-border hover:border-primary-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id)}
                        className="w-4 h-4 text-primary-600"
                      />
                      <span className="text-xl">{method.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-foreground">{method.label}</p>
                        <p className="text-xs text-muted">{method.description}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {paymentMethod === "kredi_karti" && (
                  <div className="mt-4 pt-4 border-t border-border space-y-4">
                    <Input
                      label="E-posta"
                      name="email"
                      type="email"
                      placeholder="ornek@mail.com"
                      value={cardForm.email}
                      onChange={handleCardChange}
                      required
                    />
                    <Input
                      label="Kart Üzerindeki İsim"
                      name="cardHolderName"
                      placeholder="Ad Soyad"
                      value={cardForm.cardHolderName}
                      onChange={handleCardChange}
                      required
                    />
                    <Input
                      label="Kart Numarası"
                      name="cardNumber"
                      inputMode="numeric"
                      placeholder="0000 0000 0000 0000"
                      value={cardForm.cardNumber}
                      onChange={handleCardChange}
                      required
                    />
                    <div className="grid grid-cols-3 gap-3">
                      <Input
                        label="Ay (AA)"
                        name="expireMonth"
                        inputMode="numeric"
                        placeholder="12"
                        value={cardForm.expireMonth}
                        onChange={handleCardChange}
                        required
                      />
                      <Input
                        label="Yıl (YY)"
                        name="expireYear"
                        inputMode="numeric"
                        placeholder="28"
                        value={cardForm.expireYear}
                        onChange={handleCardChange}
                        required
                      />
                      <Input
                        label="CVC"
                        name="cvc"
                        inputMode="numeric"
                        placeholder="123"
                        value={cardForm.cvc}
                        onChange={handleCardChange}
                        required
                      />
                    </div>
                    <p className="text-[11px] text-muted bg-cream-100 rounded-lg px-3 py-2">
                      🧪 Test modu: Gerçek bir tahsilat yapılmaz. Sonu <strong>0000</strong> ile biten kart
                      numaraları test amacıyla reddedilir, diğer geçerli (Luhn) kart numaraları onaylanır.
                    </p>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="bg-white rounded-2xl border border-border p-6">
                <h2 className="font-heading text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-primary-700 text-white text-xs font-bold rounded-full flex items-center justify-center">3</span>
                  Sipariş Notu (Opsiyonel)
                </h2>
                <textarea
                  name="notes"
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-border text-sm bg-white placeholder:text-muted hover:border-primary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all resize-none"
                  placeholder="Siparişiniz hakkında eklemek istediğiniz notlar..."
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-2xl border border-border p-6">
                <h3 className="font-heading text-base font-semibold text-foreground mb-4">Sipariş Özeti</h3>

                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-start text-sm">
                      <div className="flex-1 min-w-0 mr-2">
                        <p className="font-medium truncate">{item.product.name}</p>
                        <p className="text-xs text-muted">x{item.quantity}</p>
                      </div>
                      <span className="font-medium shrink-0">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-3 space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Ara Toplam</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Kargo</span>
                    <span className={`font-medium ${shipping === 0 ? "text-primary-600" : ""}`}>
                      {shipping === 0 ? "Ücretsiz" : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between text-base font-semibold">
                    <span>Toplam</span>
                    <span className="text-primary-700">{formatPrice(total)}</span>
                  </div>
                </div>

                {submitError && (
                  <p className="text-xs text-red-600 bg-red-50 rounded-xl px-3 py-2 mb-3">{submitError}</p>
                )}

                <Button type="submit" fullWidth size="lg" isLoading={submitting}>
                  {submitting ? "İşleniyor..." : "Siparişi Onayla"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
