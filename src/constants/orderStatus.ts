import type { OrderStatus } from "@/types";

export const ORDER_STATUS = {
  RECEIVED: "received",
  PREPARING: "preparing",
  READY: "ready",
  HANDED_TO_LIVREUR: "handed_to_livreur",
  PICKED_UP: "picked_up",
  CANCELLED: "cancelled",
} as const satisfies Record<string, OrderStatus>;

/** Statuses where the order is still progressing through the kitchen. */
export const ACTIVE_ORDER_STATUSES: readonly OrderStatus[] = [
  ORDER_STATUS.RECEIVED,
  ORDER_STATUS.PREPARING,
  ORDER_STATUS.READY,
  ORDER_STATUS.HANDED_TO_LIVREUR,
];

/** Statuses with no further transitions. */
export const TERMINAL_ORDER_STATUSES: readonly OrderStatus[] = [
  ORDER_STATUS.PICKED_UP,
  ORDER_STATUS.CANCELLED,
];

/**
 * Statuses where the customer may still cancel their own order — only before
 * the kitchen starts cooking. Mirrors the server's CUSTOMER_CANCELLABLE_STATUSES.
 */
export const CUSTOMER_CANCELLABLE_STATUSES: readonly OrderStatus[] = [
  ORDER_STATUS.RECEIVED,
];

export function isActiveOrderStatus(status: OrderStatus): boolean {
  return ACTIVE_ORDER_STATUSES.includes(status);
}

export function isTerminalOrderStatus(status: OrderStatus): boolean {
  return TERMINAL_ORDER_STATUSES.includes(status);
}

export function isCustomerCancellableStatus(status: OrderStatus): boolean {
  return CUSTOMER_CANCELLABLE_STATUSES.includes(status);
}
