import * as Crypto from "expo-crypto";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { PRODUCTS_BY_ID, SUPPLEMENTS_BY_ID } from "@/data/menu";
import type { CartItem } from "@/types";

import { asyncStorageAdapter } from "./_storage";

export type AddCartItemInput = {
  productId: string;
  variantId?: string;
  quantity: number;
  supplements: string[];
  notes?: string;
};

type CartState = {
  items: CartItem[];
  addItem: (input: AddCartItemInput) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateSupplements: (itemId: string, supplements: string[]) => void;
  clearCart: () => void;
  totalEUR: () => number;
  itemCount: () => number;
};

/**
 * Unit price for a single cart-line: product variant (or base) + supplements.
 * Exported so CartItemRow UI can call it without duplicating the price math.
 */
export function getLineUnitPrice(item: CartItem): number {
  const product = PRODUCTS_BY_ID[item.productId];
  if (!product) return 0;

  const basePrice =
    item.variantId !== undefined && product.variants
      ? (product.variants.find((v) => v.id === item.variantId)?.priceEUR ?? product.priceEUR)
      : product.priceEUR;

  const supplementsTotal = item.supplements.reduce((acc, id) => {
    const supplement = SUPPLEMENTS_BY_ID[id];
    return acc + (supplement?.priceEUR ?? 0);
  }, 0);

  return basePrice + supplementsTotal;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: ({ productId, variantId, quantity, supplements, notes }) => {
        const newItem: CartItem = {
          id: Crypto.randomUUID(),
          productId,
          variantId,
          quantity: Math.max(1, quantity),
          supplements,
          notes,
        };
        set((state) => ({ items: [...state.items, newItem] }));
      },

      removeItem: (itemId) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== itemId) }));
      },

      updateQuantity: (itemId, quantity) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === itemId ? { ...i, quantity: Math.max(1, quantity) } : i,
          ),
        }));
      },

      updateSupplements: (itemId, supplements) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === itemId ? { ...i, supplements } : i,
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      totalEUR: () => {
        return get().items.reduce(
          (sum, item) => sum + getLineUnitPrice(item) * item.quantity,
          0,
        );
      },

      itemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "pops.cart.v1",
      storage: createJSONStorage(() => asyncStorageAdapter),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
