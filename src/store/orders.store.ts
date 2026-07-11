import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  isActiveOrderStatus,
  isTerminalOrderStatus,
} from "@/constants/orderStatus";
import {
  ordersApi,
  type CreateOrderPayload,
  type OrderData,
} from "@/lib/api";
import type { CartItem, Order } from "@/types";

import { asyncStorageAdapter } from "./_storage";

/** Map API order data to the UI Order type */
function toOrder(data: OrderData): Order {
  return {
    id: data.id,
    items: data.order_items.map((item) => ({
      id: item.id,
      productId: item.product_id ?? undefined,
      accompagnementId: item.accompagnement_id ?? undefined,
      variantId: item.variant_id ?? undefined,
      quantity: item.quantity,
      supplements: item.supplements.map((s) => s.id),
      notes: item.notes ?? undefined,
    })),
    totalEUR: data.total_eur,
    status: data.status as Order["status"],
    createdAt: data.created_at,
    estimatedReadyAt: data.estimated_ready_at,
    pickedUpAt: data.picked_up_at ?? undefined,
    customerName: data.customer_name,
    pickupMode: data.pickup_mode,
    deliveryAddress: data.delivery_address ?? undefined,
    deliveryLat: data.delivery_lat ?? undefined,
    deliveryLng: data.delivery_lng ?? undefined,
    deliveryFeeEUR: data.delivery_fee_eur,
    activeDriverId: data.active_driver_id ?? null,
    deliveryCode: data.delivery_code ?? null,
    driverRating: data.driver_rating ?? null,
  };
}

export type PlaceOrderDelivery =
  | { pickupMode: "pickup" }
  | {
      pickupMode: "delivery";
      address: string;
      lat: number;
      lng: number;
    };

/** Insert or replace an order in the active list, keeping newest first. */
function upsertActive(active: Order[], order: Order): Order[] {
  const rest = active.filter((o) => o.id !== order.id);
  return [order, ...rest];
}

export type PlaceOrderResult = {
  order: Order;
  clientSecret: string;
  publishableKey: string | null;
};

type OrdersState = {
  active: Order[];
  history: Order[];
  loading: boolean;
  error: string | null;
  placeOrder: (
    cartItems: CartItem[],
    customerName: string,
    delivery?: PlaceOrderDelivery,
  ) => Promise<PlaceOrderResult>;
  confirmPayment: (id: string) => Promise<void>;
  fetchOrders: () => Promise<void>;
  fetchOrderById: (id: string) => Promise<Order | null>;
  cancelOrder: (id: string) => Promise<void>;
  confirmPickedUp: (id: string) => Promise<Order>;
  refreshActive: () => Promise<void>;
  clearError: () => void;
};

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      active: [],
      history: [],
      loading: false,
      error: null,

      placeOrder: async (
        cartItems: CartItem[],
        customerName: string,
        delivery?: PlaceOrderDelivery,
      ) => {
        set({ loading: true, error: null });

        const payload: CreateOrderPayload = {
          customerName,
          items: cartItems.map((item) => ({
            productId: item.productId,
            accompagnementId: item.accompagnementId,
            variantId: item.variantId ?? undefined,
            quantity: item.quantity,
            supplements: item.supplements.length > 0 ? item.supplements : undefined,
            notes: item.notes ?? undefined,
          })),
        };

        if (delivery && delivery.pickupMode === "delivery") {
          payload.pickupMode = "delivery";
          payload.deliveryAddress = delivery.address;
          payload.deliveryLat = delivery.lat;
          payload.deliveryLng = delivery.lng;
        } else {
          payload.pickupMode = "pickup";
        }

        try {
          const data = await ordersApi.create(payload);
          const order = toOrder(data);
          // The order is created 'pending' — keep it as active so the customer
          // can see it while the PaymentSheet runs, but the cart is only
          // cleared by the checkout screen once payment succeeds.
          set((state) => ({
            active: upsertActive(state.active, order),
            loading: false,
          }));
          return {
            order,
            clientSecret: data.stripe_client_secret,
            publishableKey: data.stripe_publishable_key,
          };
        } catch (e: unknown) {
          const message =
            e instanceof Error ? e.message : "Erreur lors de la commande";
          set({ error: message, loading: false });
          throw e;
        }
      },

      // After the PaymentSheet reports success: confirm server-side, then pull
      // the fresh order (now paid / released) into `active`.
      confirmPayment: async (id: string) => {
        await ordersApi.confirmPayment(id);
        try {
          const data = await ordersApi.get(id);
          const order = toOrder(data);
          set((state) => ({ active: upsertActive(state.active, order) }));
        } catch {
          // Non-fatal — the webhook will finalise state; detail screen refetches.
        }
      },

      fetchOrders: async () => {
        set({ loading: true });
        try {
          const [activeData, pastData] = await Promise.all([
            ordersApi.list("active"),
            ordersApi.list("past"),
          ]);

          const active = activeData.map(toOrder);
          const history = pastData.map(toOrder);
          set({ active, history, loading: false });
        } catch {
          set({ loading: false });
        }
      },

      fetchOrderById: async (id: string) => {
        try {
          const data = await ordersApi.get(id);
          const order = toOrder(data);
          if (isActiveOrderStatus(order.status)) {
            set((state) => ({ active: upsertActive(state.active, order) }));
          }
          return order;
        } catch {
          return null;
        }
      },

      confirmPickedUp: async (id: string) => {
        try {
          const data = await ordersApi.confirmPickedUp(id);
          const order = toOrder(data);
          // Picked-up is terminal — drop from active, prepend to history.
          set((state) => ({
            active: state.active.filter((o) => o.id !== id),
            history: [order, ...state.history.filter((o) => o.id !== id)],
          }));
          return order;
        } catch (e: unknown) {
          const message =
            e instanceof Error ? e.message : "Confirmation impossible";
          set({ error: message });
          throw e;
        }
      },

      cancelOrder: async (id: string) => {
        try {
          const data = await ordersApi.cancel(id);
          const order = toOrder(data);
          set((state) => ({
            active: state.active.filter((o) => o.id !== id),
            history: [order, ...state.history],
          }));
        } catch (e: unknown) {
          const message = e instanceof Error ? e.message : "Annulation impossible";
          set({ error: message });
          throw e;
        }
      },

      refreshActive: async () => {
        const { active } = get();
        if (active.length === 0) return;
        const results = await Promise.all(
          active.map(async (a) => {
            try {
              return toOrder(await ordersApi.get(a.id));
            } catch {
              return null;
            }
          }),
        );

        const refreshed: Order[] = [];
        const nowTerminal: Order[] = [];
        for (const [i, order] of results.entries()) {
          // Failed refetch — keep the existing order in the active list.
          if (order === null) {
            refreshed.push(active[i]);
          } else if (isTerminalOrderStatus(order.status)) {
            nowTerminal.push(order);
          } else {
            refreshed.push(order);
          }
        }

        set((state) => ({
          active: refreshed,
          history:
            nowTerminal.length > 0
              ? [
                  ...nowTerminal,
                  ...state.history.filter(
                    (h) => !nowTerminal.some((t) => t.id === h.id),
                  ),
                ]
              : state.history,
        }));
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "pops.orders.v2",
      version: 1,
      storage: createJSONStorage(() => asyncStorageAdapter),
      // v0 persisted `active` as a single Order | null; v1 holds an array.
      migrate: (persisted: unknown, version) => {
        const state = (persisted ?? {}) as Partial<OrdersState>;
        if (version < 1) {
          const legacyActive = state.active as unknown as Order | null;
          return {
            ...state,
            active: legacyActive ? [legacyActive] : [],
          };
        }
        return state;
      },
      partialize: (state) => ({
        active: state.active,
        history: state.history,
      }),
    },
  ),
);
