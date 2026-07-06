import type { ChargeParams, ChargeResult } from "./types";

function luhnCheck(digits: string): boolean {
  if (digits.length < 12) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

/**
 * Local, no-network payment simulator used whenever no real provider
 * (iyzico) API keys are configured. Lets the whole checkout flow —
 * including the decline path — be exercised without a merchant account.
 *
 * Test-mode convention: a card number ending in "0000" simulates a bank
 * decline; any other Luhn-valid number with a non-expired date succeeds.
 */
export async function mockCharge({ card, orderNumber }: ChargeParams): Promise<ChargeResult> {
  // Simulated network latency so the UI's loading state behaves like a real call
  await new Promise((resolve) => setTimeout(resolve, 900));

  const digits = card.cardNumber.replace(/\D/g, "");

  if (!luhnCheck(digits)) {
    return { success: false, message: "Geçersiz kart numarası.", provider: "mock" };
  }

  const expMonth = parseInt(card.expireMonth, 10);
  const expYear = parseInt(card.expireYear, 10);
  const expYear2 = expYear >= 100 ? expYear % 100 : expYear;
  const now = new Date();
  const currentYear2 = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;

  if (
    !expMonth || expMonth < 1 || expMonth > 12 || !expYear ||
    expYear2 < currentYear2 || (expYear2 === currentYear2 && expMonth < currentMonth)
  ) {
    return { success: false, message: "Kartın son kullanma tarihi geçersiz.", provider: "mock" };
  }

  if (card.cvc.replace(/\D/g, "").length < 3) {
    return { success: false, message: "Geçersiz CVC kodu.", provider: "mock" };
  }

  if (digits.endsWith("0000")) {
    return {
      success: false,
      message: "Kart bankanız tarafından reddedildi (test modu: 0000 ile biten kartlar reddedilir).",
      provider: "mock",
    };
  }

  return {
    success: true,
    message: "Ödeme onaylandı (test modu — gerçek bir tahsilat yapılmadı).",
    paymentReference: `MOCK-${orderNumber}-${Date.now()}`,
    provider: "mock",
  };
}
