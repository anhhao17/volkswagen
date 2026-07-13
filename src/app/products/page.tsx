import { Suspense } from "react";
import { ProductsGrid } from "./ProductsGrid";

export const metadata = { title: "All Cars — VOLW" };

export default function ProductsPage() {
  return (
    <div className="container-page py-12">
      <header className="mb-8">
        <h1 className="section-title">All Volkswagen cars</h1>
        <p className="mt-2 text-vw-dark/60">
          Filter by body type or fuel to find your match.
        </p>
      </header>
      <Suspense fallback={<div className="py-20 text-center text-vw-dark/50">Loading cars…</div>}>
        <ProductsGrid />
      </Suspense>
    </div>
  );
}
