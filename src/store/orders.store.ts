import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { PRODUCTS_BY_ID } from "@/data/menu";
import type { CartItem, Order, OrderStatus } from "@/types";

import { asyncStorageAdapter } from "./_storage";

type OrdersState = {
  active: Order | null;
  history: Order[];
  placeOrder: (cartItems: CartItem[], total: number, customerName: string) => Order;
  advanceStatus: (orderId: string, nextStatus: OrderStatus) => void;
  markPickedUp: (orderId: string) => void;
};

function generateOrderId(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const suffix = String(1000 + Math.floor(Math.random() * 9000));
  return `POP-${yyyy}${mm}${dd}-${suffix}`;
}

function computeEstimatedReadyAt(items: CartItem[]): string {
  // Longest prep-time across all items drives the whole order + a 2 min buffer.
  const maxPrepMinutes = items.reduce((max, item) => {
    const product = PRODUCTS_BY_ID[item.productId];
    if (!product) return max;
    return Math.max(max, product.prepTimeMinutes);
  }, 0);
  const ready = new Date(Date.now() + (maxPrepMinutes + 2) * 60 * 1000);
  return ready.toISOString();
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set) => ({
      active: null,
      history: [],

      placeOrder: (cartItems, total, customerName) => {
        const order: Order = {
          id: generateOrderId(),
          items: cartItems.map((i) => ({ ...i })),
          totalEUR: total,
          status: "received",
          createdAt: new Date().toISOString(),
          estimatedReadyAt: computeEstimatedReadyAt(cartItems),
          customerName,
        };
        set({ active: order });
        return order;
      },

      advanceStatus: (orderId, nextStatus) => {
        set((state) => {
          if (state.active && state.active.id === orderId) {
            return { active: { ...state.active, status: nextStatus } };
          }
          return state;
        });
      },

      markPickedUp: (orderId) => {
        set((state) => {
          if (!state.active || state.active.id !== orderId) return state;
          const pickedUp: Order = {
            ...state.active,
            status: "picked_up",
            pickedUpAt: new Date().toISOString(),
          };
          return {
            active: null,
            history: [pickedUp, ...state.history],
          };
        });
      },
    }),
    {
      name: "pops.orders.v1",
      storage: createJSONStorage(() => asyncStorageAdapter),
      partialize: (state) => ({ active: state.active, history: state.history }),
    },
  ),
);
