"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/cars";

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="text-2xl font-bold text-vw-dark">Nothing to check out</h1>
        <p className="mt-2 text-vw-dark/60">Add a car to your cart first.</p>
        <Link href="/products" className="btn-primary mt-6">Browse cars</Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Mock order: store in localStorage so the success page can read it.
    const order = {
      id: "VOLW-" + Date.now().toString().slice(-6),
      items,
      total,
      customer: form,
      createdAt: new Date().toISOString(),
      status: "confirmed" as const,
    };
    try {
      localStorage.setItem("volw-last-order", JSON.stringify(order));
      // Persist a simple order history too.
      const histRaw = localStorage.getItem("volw-orders");
      const hist = histRaw ? JSON.parse(histRaw) : [];
      hist.unshift(order);
      localStorage.setItem("volw-orders", JSON.stringify(hist.slice(0, 50)));
    } catch {
      /* ignore */
    }
    setTimeout(() => {
      clear();
      router.push("/checkout/success");
    }, 700);
  };

  return (
    <div className="container-page py-12">
      <h1 className="section-title">Checkout</h1>
      <p className="mt-2 text-vw-dark/60">Almost there — complete your Volkswagen order.</p>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <fieldset className="card space-y-4 p-6">
            <legend className="px-2 text-sm font-semibold uppercase tracking-wider text-vw-dark/50">
              Contact details
            </legend>
            <Field label="Full name" required value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email" type="email" required value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
              <Field label="Phone" required value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
            </div>
            <Field label="Delivery address" required value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
          </fieldset>

          <fieldset className="card space-y-4 p-6">
            <legend className="px-2 text-sm font-semibold uppercase tracking-wider text-vw-dark/50">
              Payment (demo)
            </legend>
            <Field label="Card number" value="" onChange={() => {}} placeholder="4242 4242 4242 4242" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Expiry" value="" onChange={() => {}} placeholder="12/28" />
              <Field label="CVC" value="" onChange={() => {}} placeholder="123" />
            </div>
            <p className="text-xs text-vw-dark/50">This is a demo store — no real payment is processed.</p>
          </fieldset>
        </div>

        <div className="lg:col-span-1">
          <div className="card sticky top-20 p-6">
            <h2 className="text-lg font-bold text-vw-dark">Your order</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {items.map(({ car, quantity }) => (
                <li key={car.id} className="flex justify-between gap-2">
                  <span className="text-vw-dark/70">{car.name} × {quantity}</span>
                  <span className="font-medium">{formatPrice(car.price * quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t border-black/5 pt-4">
              <span className="font-bold">Total</span>
              <span className="text-xl font-black text-vw-blue">{formatPrice(total)}</span>
            </div>
            <button type="submit" disabled={submitting} className="btn-gold mt-6 w-full">
              {submitting ? "Processing…" : "Place order — SIUUU!"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-vw-dark/70">{label}{required && " *"}</span>
      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-vw-blue"
      />
    </label>
  );
}
