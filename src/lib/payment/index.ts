import { isIyzicoConfigured, iyzicoCharge } from "./iyzico";
import { mockCharge } from "./mockProvider";
import type { ChargeParams, ChargeResult } from "./types";

export type { CardInput, ChargeBuyer, ChargeItem, ChargeParams, ChargeResult } from "./types";

/**
 * Charges a card via iyzico when IYZICO_API_KEY/IYZICO_SECRET_KEY are set
 * in the environment, otherwise falls back to a local test-mode simulator
 * so checkout works end-to-end without a merchant account.
 */
export async function chargeCard(params: ChargeParams): Promise<ChargeResult> {
  if (isIyzicoConfigured()) {
    return iyzicoCharge(params);
  }
  return mockCharge(params);
}

export function activePaymentProvider(): "iyzico" | "mock" {
  return isIyzicoConfigured() ? "iyzico" : "mock";
}
