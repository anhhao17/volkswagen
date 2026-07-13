import Link from "next/link";
import { DrivingCar } from "./DrivingCar";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-black/5 bg-vw-dark text-white/80">
      <div className="container-page py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 40 40" className="h-8 w-8" aria-hidden>
                <circle cx="20" cy="20" r="19" fill="#001E50" />
                <path d="M8 12 L20 30 L32 12" fill="none" stroke="#FFFFFF" strokeWidth="2.5" />
                <path d="M14 12 L20 21 L26 12" fill="none" stroke="#FFFFFF" strokeWidth="2.5" />
              </svg>
              <span className="text-xl font-black text-white">
                VOLW<span className="text-ronaldo-gold">.</span>
              </span>
            </div>
            <p className="mt-3 text-sm text-white/60">
              The Volkswagen store. Drive the legend. SIUUU!
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/50">
              Shop
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-ronaldo-gold">All cars</Link></li>
              <li><Link href="/products?bodyType=EV" className="hover:text-ronaldo-gold">Electric</Link></li>
              <li><Link href="/products?bodyType=SUV" className="hover:text-ronaldo-gold">SUVs</Link></li>
              <li><Link href="/cart" className="hover:text-ronaldo-gold">Cart</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/50">
              Company
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/blog" className="hover:text-ronaldo-gold">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-ronaldo-gold">Contact</Link></li>
              <li><Link href="/admin" className="hover:text-ronaldo-gold">Admin</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/50">
              Contact — Hải Volkswagen
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="tel:+84984596525" className="hover:text-ronaldo-gold">0984 596 525</a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/ngoc.hai.572716"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ronaldo-gold"
                >
                  Facebook: Ngoc Hai
                </a>
              </li>
            </ul>
            <p className="mt-3 text-sm text-white/60">Get new arrivals &amp; SIUUU moments.</p>
            <form className="mt-3 flex gap-2">
              <input
                type="email"
                placeholder="you@email.com"
                className="w-full rounded-full bg-white/10 px-4 py-2 text-sm text-white placeholder-white/40 outline-none focus:bg-white/20"
              />
              <button type="button" className="rounded-full bg-ronaldo-gold px-4 py-2 text-sm font-bold text-vw-dark">
                Go
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6">
          <DrivingCar bodyType="Coupe" color="#00B0F0" duration={9} />
        </div>

        <p className="mt-6 text-center text-xs text-white/40">
          &copy; {new Date().getFullYear()} VOLW. A demo Volkswagen store. Not affiliated with Volkswagen AG.
        </p>
      </div>
    </footer>
  );
}
