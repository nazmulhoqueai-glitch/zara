"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, CartTotals } from "@/types/cart";

interface CartState {
  items: Record<string, CartItem>; // keyed by CartItem.key
  addItem: (item: Omit<CartItem, "key">) => void;
  removeItem: (key: string) => void;
  clear: () => void;
  increment: (key: string) => void;
  decrement: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  totals: () => CartTotals;
}

function makeKey(id: string, size?: string, color?: string) {
  return `${id}|${size || ""}|${color || ""}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: {},
      addItem: (item) =>
        set((state) => {
          const key = makeKey(item.id, item.size, item.color);
          const existing = state.items[key];
          const nextQty = (existing?.quantity || 0) + (item.quantity || 1);
          return {
            items: {
              ...state.items,
              [key]: {
                ...item,
                key,
                quantity: nextQty,
              },
            },
          };
        }),
      removeItem: (key) =>
        set((state) => {
          const copy = { ...state.items };
          delete copy[key];
          return { items: copy };
        }),
      clear: () => set({ items: {} }),
      increment: (key) =>
        set((state) => {
          const current = state.items[key];
          if (!current) return state;
          return {
            items: {
              ...state.items,
              [key]: { ...current, quantity: current.quantity + 1 },
            },
          };
        }),
      decrement: (key) =>
        set((state) => {
          const current = state.items[key];
          if (!current) return state;
          const next = Math.max(1, current.quantity - 1);
          return {
            items: {
              ...state.items,
              [key]: { ...current, quantity: next },
            },
          };
        }),
      setQuantity: (key, quantity) =>
        set((state) => {
          const current = state.items[key];
          if (!current) return state;
          const next = Math.max(1, Math.floor(quantity));
          return {
            items: {
              ...state.items,
              [key]: { ...current, quantity: next },
            },
          };
        }),
      totals: () => {
        const values = Object.values(get().items);
        const subtotal = values.reduce((sum, it) => sum + it.price * it.quantity, 0);
        const itemCount = values.reduce((sum, it) => sum + it.quantity, 0);
        return { subtotal, itemCount };
      },
    }),
    { name: "avaya-cart" }
  )
);
