import { notFound } from "next/navigation";
import Link from "next/link";
import { MockPage } from "@/components/mock-page";
import { getDatabase } from "@/lib/db";

export const instant = false;

type NewsDetailPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const news = await getDatabase().news.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: { title: true, excerpt: true },
  });
  return {
    title: news ? `${news.title} | Robijaši Zenica 1988` : "Novost | Robijaši Zenica 1988",
    description: news?.excerpt ?? "Novosti Robijaša Zenica 1988.",
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const news = await getDatabase().news.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { category: { select: { name: true } }, author: { select: { name: true } } },
  });

  if (!news) notFound();

  return (
    <MockPage eyebrow={news.category.name} title={news.title} intro={news.excerpt ?? ""}>
      <article className="news-detail">
        <div className="news-detail__meta">
          <span>{news.author?.name ?? "Robijaši Zenica 1988"}</span>
          <time dateTime={news.publishedAt?.toISOString()}>{news.publishedAt?.toLocaleDateString("bs-BA")}</time>
        </div>
        {news.coverImageUrl && <div className="news-detail__cover" style={{ backgroundImage: `url("${news.coverImageUrl}")` }} />}
        <div className="news-detail__content">
          {news.content.split(/\n{2,}/).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        <Link className="text-link" href="/novosti">← Nazad na sve novosti</Link>
      </article>
    </MockPage>
  );
}
