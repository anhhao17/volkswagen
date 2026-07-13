"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { CarImage } from "@/components/CarImage";
import { formatPrice } from "@/lib/cars";

export default function CartPage() {
  const { items, setQuantity, remove, total, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-page py-20 text-center">
        <ShoppingBag className="mx-auto text-vw-blue/40" size={48} />
        <h1 className="mt-4 text-2xl font-bold text-vw-dark">Your cart is empty</h1>
        <p className="mt-2 text-vw-dark/60">Find a Volkswagen to drive home.</p>
        <Link href="/products" className="btn-primary mt-6">Browse cars</Link>
      </div>
    );
  }

  return (
    <div className="container-page py-12">
      <h1 className="section-title">Your cart</h1>
      <p className="mt-2 text-vw-dark/60">{items.length} model(s) selected</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map(({ car, quantity }) => (
            <div key={car.id} className="card flex items-center gap-4 p-4">
              <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl bg-vw-blue/5">
                <CarImage src={car.image} alt={car.name} fill sizes="128px" className="h-full w-full" />
              </div>
              <div className="flex-1">
                <Link href={`/products/${car.slug}`} className="font-bold text-vw-dark hover:text-vw-blue">
                  {car.name}
                </Link>
                <p className="text-xs text-vw-dark/50">{car.year} · {car.bodyType} · {car.fuel}</p>
                <p className="mt-1 font-bold text-vw-blue">{formatPrice(car.price)}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuantity(car.id, quantity - 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-vw-blue/10 text-vw-blue hover:bg-vw-blue hover:text-white"
                  aria-label="Decrease"
                >
                  <Minus size={14} />
                </button>
                <span className="w-6 text-center font-semibold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(car.id, quantity + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-vw-blue/10 text-vw-blue hover:bg-vw-blue hover:text-white"
                  aria-label="Increase"
                >
                  <Plus size={14} />
                </button>
              </div>

              <div className="w-28 text-right font-bold text-vw-dark">
                {formatPrice(car.price * quantity)}
              </div>

              <button
                type="button"
                onClick={() => remove(car.id)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-red-500 hover:bg-red-50"
                aria-label="Remove"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          <div className="flex justify-between">
            <button type="button" onClick={clear} className="text-sm text-red-500 hover:underline">
              Clear cart
            </button>
            <Link href="/products" className="text-sm text-vw-blue hover:underline">Continue shopping</Link>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-20 p-6">
            <h2 className="text-lg font-bold text-vw-dark">Order summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-vw-dark/60">Subtotal</dt><dd>{formatPrice(total)}</dd></div>
              <div className="flex justify-between"><dt className="text-vw-dark/60">Delivery</dt><dd>Free</dd></div>
              <div className="flex justify-between"><dt className="text-vw-dark/60">Tax (incl.)</dt><dd>—</dd></div>
            </dl>
            <div className="mt-4 flex justify-between border-t border-black/5 pt-4">
              <span className="font-bold">Total</span>
              <span className="text-xl font-black text-vw-blue">{formatPrice(total)}</span>
            </div>
            <Link href="/checkout" className="btn-gold mt-6 w-full">Checkout</Link>
            <p className="mt-3 text-center text-xs text-vw-dark/50">
              Includes a free Ronaldo Siu celebration on purchase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
