"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import type { Car } from "@/lib/types";
import { useCart } from "@/components/CartProvider";

export function AddToCartButton({ car }: { car: Car }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const handle = () => {
    if (!car.inStock) return;
    add(car);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handle}
      disabled={!car.inStock}
      className={added ? "btn-gold" : "btn-primary"}
    >
      {added ? <><Check size={16} /> Added!</> : <><Plus size={16} /> Add to cart</>}
    </button>
  );
}
