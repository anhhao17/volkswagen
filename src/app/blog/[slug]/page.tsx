import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getPostBySlug } from "@/lib/blog";
import { formatDate } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  return { title: post ? `${post.title} — VOLW Blog` : "Post not found" };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <article className="container-page py-12">
      <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-vw-dark/60 hover:text-vw-blue">
        <ArrowLeft size={14} /> Back to blog
      </Link>

      <div className="mx-auto mt-6 max-w-2xl">
        <p className="text-xs text-vw-dark/50">{formatDate(post.date)} · {post.author}</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-vw-dark sm:text-4xl">{post.title}</h1>
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <span key={t} className="chip">{t}</span>
          ))}
        </div>
        <div className="prose prose-vw mt-8 max-w-none text-vw-dark/80">
          <p className="text-lg leading-relaxed">{post.content}</p>
        </div>
      </div>
    </article>
  );
}
