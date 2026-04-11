export type Category = {
  id: string;
  name: string;
  icon: string;
  order: number;
};

export type Supplement = {
  id: string;
  name: string;
  priceEUR: number;
};

export type ProductVariant = {
  id: string;
  label: string;
  priceEUR: number;
};

export type ProductTag = "NOUVEAU" | "PROMO" | "TOP" | "SPICY";

export type Product = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  priceEUR: number;
  variants?: ProductVariant[];
  imageUrl: string;
  tags: ProductTag[];
  availableSupplements: string[];
  prepTimeMinutes: number;
};

export type CartItem = {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  supplements: string[];
  notes?: string;
};

export type OrderStatus =
  | "received"
  | "preparing"
  | "ready"
  | "picked_up"
  | "cancelled";

export type Order = {
  id: string;
  items: CartItem[];
  totalEUR: number;
  status: OrderStatus;
  createdAt: string;
  estimatedReadyAt: string;
  pickedUpAt?: string;
  customerName: string;
};

export type Profile = {
  name: string;
  phone: string;
  orderCount: number;
};
