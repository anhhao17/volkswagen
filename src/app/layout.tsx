import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SiuButton } from "@/components/SiuButton";

export const metadata: Metadata = {
  title: "VOLW — Volkswagen Store | Drive the legend. SIUUU!",
  description:
    "Buy Volkswagen cars online. Golf GTI, Passat, Tiguan R, ID.4, ID. Buzz and more. Car-themed animations and Ronaldo Siu celebration.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Navbar />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
          <SiuButton />
        </CartProvider>
      </body>
    </html>
  );
}
