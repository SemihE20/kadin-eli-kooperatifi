export interface CardInput {
  cardHolderName: string;
  cardNumber: string;
  expireMonth: string;
  expireYear: string;
  cvc: string;
}

export interface ChargeBuyer {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  ip: string;
}

export interface ChargeItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface ChargeParams {
  card: CardInput;
  amount: number;
  orderNumber: string;
  buyer: ChargeBuyer;
  items: ChargeItem[];
}

export interface ChargeResult {
  success: boolean;
  message: string;
  paymentReference?: string;
  provider: "iyzico" | "mock";
}
