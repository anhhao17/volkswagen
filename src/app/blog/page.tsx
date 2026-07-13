import Link from "next/link";
import { blogPosts } from "@/lib/blog";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Blog — VOLW" };

export default function BlogPage() {
  return (
    <div className="container-page py-12">
      <h1 className="section-title">The VOLW blog</h1>
      <p className="mt-2 text-vw-dark/60">Heritage, performance, and electric futures.</p>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((p) => (
          <Link key={p.id} href={`/blog/${p.slug}`} className="card group flex flex-col p-6">
            <p className="text-xs text-vw-dark/50">{formatDate(p.date)}</p>
            <h2 className="mt-2 text-lg font-bold text-vw-dark group-hover:text-vw-blue">{p.title}</h2>
            <p className="mt-2 flex-1 text-sm text-vw-dark/60">{p.excerpt}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <span key={t} className="chip">{t}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
