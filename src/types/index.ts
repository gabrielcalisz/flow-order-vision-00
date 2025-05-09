
export interface Customer {
  firstName: string;
  lastName: string;
  phone: string;
  cpf: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Product {
  name: string;
  image?: File | string;
  quantity: number;
  price: number;
  shippingPrice: number;
  freeShipping: boolean;
}

export type BrazilianCapital =
  | "São Paulo"
  | "Rio de Janeiro"
  | "Brasília"
  | "Salvador"
  | "Fortaleza"
  | "Belo Horizonte"
  | "Manaus"
  | "Curitiba"
  | "Recife"
  | "Porto Alegre"
  | "Belém"
  | "Goiânia"
  | "Florianópolis";

export type TrackingStep = 
  | { type: "processed" }
  | { type: "forwarded"; city: BrazilianCapital }
  | { type: "inTransit"; origin: BrazilianCapital; destination: BrazilianCapital }
  | { type: "cancelled" }
  | { type: "outForDelivery"; city: string }
  | { type: "delivered" };

export interface Tracking {
  trackingCode: string;
  company: string;
  steps: TrackingStep[];
  estimatedDeliveryDate?: Date;
}

export interface Order {
  id?: string;
  customer: Customer;
  product: Product;
  tracking: Tracking;
  userId?: string;
  createdAt?: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
}
