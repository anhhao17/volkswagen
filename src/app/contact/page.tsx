"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="container-page py-12">
      <h1 className="section-title">Contact us</h1>
      <p className="mt-2 text-vw-dark/60">Questions about a car or your order? We&apos;re here.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <ContactRow icon={<Mail size={18} />} label="Email" value="hello@volw.example" />
          <ContactRow icon={<Phone size={18} />} label="Phone" value="+1 (555) 010-0017" />
          <ContactRow icon={<MapPin size={18} />} label="Showroom" value="17 Wolfsburg Way, Autostadt" />
          <div className="rounded-2xl bg-vw-blue/5 p-6">
            <h3 className="font-bold text-vw-dark">Showroom hours</h3>
            <ul className="mt-2 space-y-1 text-sm text-vw-dark/70">
              <li>Mon–Fri: 9:00 – 19:00</li>
              <li>Saturday: 10:00 – 18:00</li>
              <li>Sunday: Closed</li>
            </ul>
          </div>
        </div>

        <form onSubmit={submit} className="card space-y-4 p-6">
          <label className="block">
            <span className="text-sm font-medium text-vw-dark/70">Name</span>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-vw-blue"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-vw-dark/70">Email</span>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-vw-blue"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-vw-dark/70">Message</span>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="mt-1 w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-vw-blue"
            />
          </label>
          <button type="submit" className="btn-primary w-full">
            {sent ? "Sent! SIUUU!" : <><Send size={16} /> Send message</>}
          </button>
        </form>
      </div>
    </div>
  );
}

function ContactRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-vw-blue/10 text-vw-blue">{icon}</span>
      <div>
        <p className="text-xs uppercase tracking-wider text-vw-dark/50">{label}</p>
        <p className="font-semibold text-vw-dark">{value}</p>
      </div>
    </div>
  );
}
