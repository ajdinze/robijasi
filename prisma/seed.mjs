import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  { name: "Tribina", slug: "tribina" },
  { name: "Zajednica", slug: "zajednica" },
  { name: "Historija", slug: "historija" },
  { name: "Aktivnosti", slug: "aktivnosti" },
];

try {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: category,
    });
  }

  const categoryIds = Object.fromEntries(
    await prisma.category.findMany({ select: { id: true, slug: true } }).then((items) => items.map((item) => [item.slug, item.id])),
  );

  const demoNews = [
    {
      slug: "zeni-ka-tribina-spremna-za-novu-sezonu",
      title: "Zenička tribina spremna za novu sezonu",
      excerpt: "Nova sezona donosi nove utakmice, nove koreografije i isti glas sa tribine.",
      content: "Robijaši Zenica 1988 nastavljaju sa pripremama za novu sezonu. Na stadionu, u gradu i među ljudima, priča se nastavlja istom energijom i ponosom.",
      categorySlug: "tribina",
      coverImageUrl: "/image/hero/hero.webp",
    },
    {
      slug: "vise-od-90-minuta",
      title: "Više od 90 minuta",
      excerpt: "Podrška klubu ne završava posljednjim zviždukom.",
      content: "Naša tribina živi tokom cijele sedmice. Okupljanja, pripreme i zajednički rad dio su identiteta koji se gradi godinama.",
      categorySlug: "zajednica",
      coverImageUrl: "/image/hero/hero.webp",
    },
    {
      slug: "od-1988-do-danas",
      title: "Od 1988. do danas",
      excerpt: "Čuvamo sjećanja, ljude i trenutke koji traju.",
      content: "Historija Robijaša ispisana je generacijama, gostovanjima, koreografijama i ljudima koji su ostavili trag. Ovo je samo jedan novi zapis u toj priči.",
      categorySlug: "historija",
      coverImageUrl: "/image/logo/rz.webp",
    },
    {
      slug: "glas-koji-se-cuje",
      title: "Glas koji se čuje",
      excerpt: "Najave aktivnosti i važna obavještenja za našu zajednicu.",
      content: "Pratite novosti na portalu i društvenim mrežama. Sve važne informacije, najave i aktivnosti bit će dostupne na jednom mjestu.",
      categorySlug: "aktivnosti",
      coverImageUrl: "/image/hero/hero.webp",
    },
  ];

  for (const item of demoNews) {
    await prisma.news.upsert({
      where: { slug: item.slug },
      update: {
        title: item.title,
        excerpt: item.excerpt,
        content: item.content,
        coverImageUrl: item.coverImageUrl,
        categoryId: categoryIds[item.categorySlug],
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
      create: {
        slug: item.slug,
        title: item.title,
        excerpt: item.excerpt,
        content: item.content,
        coverImageUrl: item.coverImageUrl,
        categoryId: categoryIds[item.categorySlug],
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });
  }
} finally {
  await prisma.$disconnect();
}
