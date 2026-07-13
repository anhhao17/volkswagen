import Link from "next/link";
import { notFound } from "next/navigation";
import { cars, getCarBySlug, formatPrice } from "@/lib/cars";
import { CarImage } from "@/components/CarImage";
import { DrivingCar } from "@/components/DrivingCar";
import { AddToCartButton } from "./AddToCartButton";
import { Gauge, Fuel, Zap, Users, Cog, Wind, Star, ArrowLeft } from "lucide-react";

export async function generateStaticParams() {
  return cars.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const car = getCarBySlug(params.slug);
  return { title: car ? `${car.name} — VOLW` : "Car not found" };
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const car = getCarBySlug(params.slug);
  if (!car) notFound();

  const related = cars.filter((c) => c.id !== car.id && c.bodyType === car.bodyType).slice(0, 3);

  return (
    <div className="container-page py-10">
      <Link href="/products" className="inline-flex items-center gap-1 text-sm text-vw-dark/60 hover:text-vw-blue">
        <ArrowLeft size={14} /> Back to all cars
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        {/* Visual */}
        <div>
          <div className="relative overflow-hidden rounded-3xl bg-vw-blue/10">
            <CarImage
              src={car.image}
              alt={car.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="aspect-[4/3] w-full"
            />
            {car.badge && (
              <span className="absolute left-4 top-4 rounded-full bg-ronaldo-gold px-3 py-1 text-xs font-bold text-vw-dark">
                {car.badge}
              </span>
            )}
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl bg-vw-blue/5 p-3">
            <DrivingCar bodyType={car.bodyType} color={car.colorHex} duration={6} />
          </div>

          {/* Color swatch */}
          <div className="mt-4 flex items-center gap-3">
            <span className="text-sm text-vw-dark/60">Colour:</span>
            <span
              className="h-8 w-8 rounded-full border border-black/10"
              style={{ background: car.colorHex }}
              title={car.color}
            />
            <span className="text-sm font-medium text-vw-dark">{car.color}</span>
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-vw-dark/50">{car.year} · {car.bodyType}</p>
              <h1 className="mt-1 text-3xl font-black tracking-tight text-vw-dark sm:text-4xl">{car.name}</h1>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-ronaldo-gold/20 px-3 py-1 text-sm font-bold text-ronaldo-gold-dark">
              <Star size={14} className="fill-ronaldo-gold text-ronaldo-gold" /> {car.rating}
            </span>
          </div>

          <p className="mt-4 text-vw-dark/70">{car.description}</p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Spec icon={<Gauge size={16} />} label="Power" value={`${car.horsepower} hp`} />
            <Spec icon={<Zap size={16} />} label="0–100" value={`${car.zeroToHundred} s`} />
            <Spec icon={<Wind size={16} />} label="Top speed" value={`${car.topSpeed} km/h`} />
            <Spec icon={<Fuel size={16} />} label="Range" value={`${car.range} km`} />
            <Spec icon={<Cog size={16} />} label="Gearbox" value={car.transmission} />
            <Spec icon={<Users size={16} />} label="Seats" value={`${car.seats}`} />
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-vw-dark/50">Features</h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {car.features.map((f) => (
                <li key={f} className="chip">{f}</li>
              ))}
            </ul>
          </div>

          <div className="mt-8 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-vw-dark/50">Price</p>
                <p className="text-3xl font-black text-vw-blue">{formatPrice(car.price)}</p>
              </div>
              <span className={`text-sm font-semibold ${car.inStock ? "text-green-600" : "text-red-500"}`}>
                {car.inStock ? "In stock" : "Sold out"}
              </span>
            </div>
            <div className="mt-4 flex gap-3">
              <AddToCartButton car={car} />
              <Link href="/cart" className="btn-outline">View cart</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-vw-dark">You might also like</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((c) => (
              <Link key={c.id} href={`/products/${c.slug}`} className="card group overflow-hidden p-0">
                <div className="relative h-32 overflow-hidden bg-vw-blue/5">
                  <CarImage src={c.image} alt={c.name} fill sizes="(max-width: 1024px) 50vw, 33vw" className="h-full w-full" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-vw-dark group-hover:text-vw-blue">{c.name}</h3>
                  <p className="text-sm text-vw-dark/60">{formatPrice(c.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Spec({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-black/5 bg-white p-3">
      <div className="flex items-center gap-1.5 text-vw-blue">{icon}<span className="text-xs text-vw-dark/50">{label}</span></div>
      <p className="mt-1 font-bold text-vw-dark">{value}</p>
    </div>
  );
}
