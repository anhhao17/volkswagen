"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Car, CartItem } from "@/lib/types";

type CartContextValue = {
  items: CartItem[];
  add: (car: Car) => void;
  remove: (carId: string) => void;
  setQuantity: (carId: string, quantity: number) => void;
  clear: () => void;
  total: number;
  count: number;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "volw-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const add = (car: Car) =>
      setItems((prev) => {
        const existing = prev.find((i) => i.car.id === car.id);
        if (existing) {
          return prev.map((i) =>
            i.car.id === car.id ? { ...i, quantity: i.quantity + 1 } : i,
          );
        }
        return [...prev, { car, quantity: 1 }];
      });

    const remove = (carId: string) =>
      setItems((prev) => prev.filter((i) => i.car.id !== carId));

    const setQuantity = (carId: string, quantity: number) =>
      setItems((prev) =>
        quantity <= 0
          ? prev.filter((i) => i.car.id !== carId)
          : prev.map((i) => (i.car.id === carId ? { ...i, quantity } : i)),
      );

    const clear = () => setItems([]);

    const total = items.reduce((sum, i) => sum + i.car.price * i.quantity, 0);
    const count = items.reduce((sum, i) => sum + i.quantity, 0);

    return { items, add, remove, setQuantity, clear, total, count };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
