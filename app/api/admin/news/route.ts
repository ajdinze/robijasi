import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getDatabase } from "@/lib/db";

const validStatuses = ["DRAFT", "PUBLISHED"] as const;

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Nisi prijavljen." }, { status: 401 });

  const news = await getDatabase().news.findMany({
    include: { category: { select: { name: true, slug: true } }, author: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ news });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Nisi prijavljen." }, { status: 401 });
  if (user.role !== "SUPER_ADMIN" && user.role !== "ADMIN" && user.role !== "EDITOR") {
    return NextResponse.json({ error: "Nemaš dozvolu za dodavanje novosti." }, { status: 403 });
  }

  let input: Record<string, unknown>;
  try {
    input = await request.json() as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Neispravan zahtjev." }, { status: 400 });
  }

  const title = typeof input.title === "string" ? input.title.trim() : "";
  const content = typeof input.content === "string" ? input.content.trim() : "";
  const excerpt = typeof input.excerpt === "string" ? input.excerpt.trim() : null;
  const coverImageUrl = typeof input.coverImageUrl === "string" ? input.coverImageUrl.trim() : null;
  const status = input.status;
  const newsStatus = typeof status === "string" ? status : "";
  const categoryId = typeof input.categoryId === "number" ? input.categoryId : Number(input.categoryId);

  if (title.length < 3 || content.length < 3 || !Number.isInteger(categoryId) || categoryId < 1 || !validStatuses.includes(newsStatus as typeof validStatuses[number])) {
    return NextResponse.json({ error: "Naslov, sadržaj, kategorija i status su obavezni." }, { status: 400 });
  }

  const category = await getDatabase().category.findUnique({ where: { id: categoryId } });
  if (!category) return NextResponse.json({ error: "Odabrana kategorija ne postoji." }, { status: 400 });

  const baseSlug = slugify(title) || `novost-${Date.now()}`;
  let slug = baseSlug;
  let suffix = 2;
  while (await getDatabase().news.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  const news = await getDatabase().news.create({
    data: {
      title,
      slug,
      content,
      excerpt: excerpt || null,
      coverImageUrl: coverImageUrl || null,
      status: newsStatus,
      categoryId,
      authorId: user.id,
      publishedAt: newsStatus === "PUBLISHED" ? new Date() : null,
    },
    include: { category: { select: { name: true } } },
  });

  await getDatabase().auditLog.create({ data: { actorId: user.id, action: "NEWS_CREATED" } });
  return NextResponse.json({ news }, { status: 201 });
}
