import Link from "next/link";
import { Hero } from "@/components/Hero";
import { CarCard } from "@/components/CarCard";
import { DrivingCar } from "@/components/DrivingCar";
import { Car3DSection } from "@/components/Car3DSection";
import { cars, getFeaturedCars } from "@/lib/cars";
import { blogPosts } from "@/lib/blog";
import { formatDate } from "@/lib/utils";

export default function HomePage() {
  const featured = getFeaturedCars();

  return (
    <>
      <Hero />

      {/* Featured cars */}
      <section className="container-page py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="section-title">Featured models</h2>
            <p className="mt-2 text-vw-dark/60">
              Hand-picked Volkswagens, ready to drive off.
            </p>
          </div>
          <Link href="/products" className="btn-outline hidden sm:inline-flex">
            View all
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </section>

      {/* Driving divider */}
      <section className="container-page py-6">
        <div className="rounded-2xl bg-vw-blue/5 p-4">
          <DrivingCar bodyType="SUV" color="#0F3D5E" duration={7} />
        </div>
      </section>

      {/* 3D scroll walk-through */}
      <Car3DSection
        title="Step inside the legend"
        subtitle="Scroll to dive through the window into the cabin, look around, then pull back out."
        scrollPages={3}
      />

      {/* Categories */}
      <section className="container-page py-16">
        <h2 className="section-title">Shop by body type</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "Hatchback", desc: "Compact & punchy", color: "#C0C5C9" },
            { label: "Sedan", desc: "Executive comfort", color: "#0E0E10" },
            { label: "SUV", desc: "Space & 4MOTION", color: "#0F3D5E" },
            { label: "EV", desc: "Electric & silent", color: "#5A5F66" },
            { label: "Estate", desc: "Practical GT", color: "#D24A1F" },
            { label: "Coupe", desc: "Sleek & sporty", color: "#001E50" },
          ].map((c) => (
            <Link
              key={c.label}
              href={`/products?bodyType=${c.label}`}
              className="card group flex items-center justify-between p-5"
            >
              <div>
                <h3 className="font-bold text-vw-dark">{c.label}</h3>
                <p className="text-sm text-vw-dark/60">{c.desc}</p>
              </div>
              <span className="h-10 w-10 rounded-full transition group-hover:scale-110" style={{ background: c.color }} />
            </Link>
          ))}
        </div>
      </section>

      {/* Why VOLW */}
      <section className="bg-vw-blue text-white">
        <div className="container-page py-16">
          <h2 className="text-3xl font-bold sm:text-4xl">Why buy from VOLW?</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { t: "Full lineup", d: "Every current Volkswagen model, from GTI to ID. Buzz." },
              { t: "Transparent pricing", d: "No hidden fees. The price you see is the price you pay." },
              { t: "Siu guarantee", d: "Every purchase comes with a Ronaldo-style celebration. Seriously." },
            ].map((f) => (
              <div key={f.t} className="rounded-2xl bg-white/5 p-6">
                <h3 className="text-xl font-bold text-ronaldo-gold">{f.t}</h3>
                <p className="mt-2 text-white/70">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest blog */}
      <section className="container-page py-16">
        <div className="flex items-end justify-between">
          <h2 className="section-title">From the blog</h2>
          <Link href="/blog" className="btn-outline hidden sm:inline-flex">All posts</Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {blogPosts.map((p) => (
            <Link key={p.id} href={`/blog/${p.slug}`} className="card group p-6">
              <p className="text-xs text-vw-dark/50">{formatDate(p.date)}</p>
              <h3 className="mt-2 font-bold text-vw-dark group-hover:text-vw-blue">{p.title}</h3>
              <p className="mt-2 text-sm text-vw-dark/60">{p.excerpt}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span key={t} className="chip">{t}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-page pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-vw-dark p-10 text-center text-white">
          <DrivingCar bodyType="EV" color="#00B0F0" duration={8} className="opacity-60" />
          <h2 className="relative mt-4 text-3xl font-black sm:text-4xl">
            Ready to drive? <span className="text-ronaldo-gold">SIUUU!</span>
          </h2>
          <p className="relative mt-2 text-white/70">Find your Volkswagen today.</p>
          <Link href="/products" className="btn-gold relative mt-6">Browse all cars</Link>
        </div>
      </section>
    </>
  );
}
