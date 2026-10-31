import { MockPage } from "@/components/mock-page";
import { NewsList } from "@/components/news-list";
import { getDatabase } from "@/lib/db";

export const instant = false;

export default async function NovostiPage() {
  const news = await getDatabase().news.findMany({
    where: { status: "PUBLISHED" },
    select: { id: true, slug: true, title: true, excerpt: true, coverImageUrl: true, category: { select: { name: true } } },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <MockPage eyebrow="Iz tribine" title="Najnovije." intro="Novosti, aktivnosti i priče iz života Robijaša Zenica 1988.">
      <NewsList databasePosts={news.map((item) => ({
        id: String(item.id),
        slug: item.slug,
        category: item.category.name,
        title: item.title,
        text: item.excerpt ?? "",
        image: item.coverImageUrl,
      }))} />
    </MockPage>
  );
}
