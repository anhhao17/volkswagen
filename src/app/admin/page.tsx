"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cars, formatPrice } from "@/lib/cars";
import type { Order } from "@/lib/types";

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("volw-orders");
      if (raw) setOrders(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const revenue = orders.reduce((s, o) => s + o.total, 0);

  return (
    <div className="container-page py-12">
      <h1 className="section-title">Admin dashboard</h1>
      <p className="mt-2 text-vw-dark/60">Demo overview of inventory &amp; orders (mock data).</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Models in catalog" value={String(cars.length)} />
        <StatCard label="Orders" value={String(orders.length)} />
        <StatCard label="Revenue" value={formatPrice(revenue)} />
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-vw-dark">Inventory</h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-black/5">
          <table className="w-full text-left text-sm">
            <thead className="bg-vw-blue/5 text-vw-dark/60">
              <tr>
                <th className="px-4 py-3">Model</th>
                <th className="px-4 py-3">Body</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Rating</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((c) => (
                <tr key={c.id} className="border-t border-black/5">
                  <td className="px-4 py-3 font-medium text-vw-dark">
                    <Link href={`/products/${c.slug}`} className="hover:text-vw-blue">{c.name}</Link>
                  </td>
                  <td className="px-4 py-3 text-vw-dark/70">{c.bodyType}</td>
                  <td className="px-4 py-3 text-vw-dark/70">{formatPrice(c.price)}</td>
                  <td className="px-4 py-3">
                    {c.inStock ? (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">In stock</span>
                    ) : (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">Sold out</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-vw-dark/70">{c.rating} ★</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-vw-dark">Recent orders</h2>
        {orders.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-black/10 p-8 text-center text-vw-dark/60">
            No orders yet. Place an order from the{" "}
            <Link href="/checkout" className="text-vw-blue hover:underline">checkout</Link>.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-bold text-vw-dark">{o.id}</p>
                  <p className="text-xs text-vw-dark/50">
                    {o.customer.name || "Guest"} · {new Date(o.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-sm text-vw-dark/70">
                  {o.items.map((i) => i.car.name).join(", ")}
                </div>
                <div className="font-black text-vw-blue">{formatPrice(o.total)}</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-6">
      <p className="text-xs uppercase tracking-wider text-vw-dark/50">{label}</p>
      <p className="mt-1 text-2xl font-black text-vw-blue">{value}</p>
    </div>
  );
}
