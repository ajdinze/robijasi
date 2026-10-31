import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getDatabase } from "@/lib/db";

const validStatuses = ["DRAFT", "PUBLISHED"] as const;
type RouteContext = { params: Promise<{ id: string }> };

function parseId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function PATCH(request: Request, context: RouteContext) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Nisi prijavljen." }, { status: 401 });
  const id = parseId((await context.params).id);
  if (!id) return NextResponse.json({ error: "Neispravna novost." }, { status: 400 });

  const existing = await getDatabase().news.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Novost nije pronađena." }, { status: 404 });

  let input: Record<string, unknown>;
  try {
    input = await request.json() as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Neispravan zahtjev." }, { status: 400 });
  }

  const title = typeof input.title === "string" ? input.title.trim() : existing.title;
  const content = typeof input.content === "string" ? input.content.trim() : existing.content;
  const excerpt = typeof input.excerpt === "string" ? input.excerpt.trim() : existing.excerpt;
  const coverImageUrl = typeof input.coverImageUrl === "string" ? input.coverImageUrl.trim() : existing.coverImageUrl;
  const status = typeof input.status === "string" ? input.status : existing.status;
  const categoryId = input.categoryId === undefined ? existing.categoryId : Number(input.categoryId);

  if (title.length < 3 || content.length < 3 || !Number.isInteger(categoryId) || categoryId < 1 || !validStatuses.includes(status as typeof validStatuses[number])) {
    return NextResponse.json({ error: "Naslov, sadržaj, kategorija i status su obavezni." }, { status: 400 });
  }
  if (!await getDatabase().category.findUnique({ where: { id: categoryId } })) {
    return NextResponse.json({ error: "Odabrana kategorija ne postoji." }, { status: 400 });
  }

  const updated = await getDatabase().news.update({
    where: { id },
    data: {
      title,
      content,
      excerpt: excerpt || null,
      coverImageUrl: coverImageUrl || null,
      categoryId,
      status,
      publishedAt: status === "PUBLISHED" ? existing.publishedAt ?? new Date() : null,
    },
    include: { category: { select: { name: true } }, author: { select: { name: true } } },
  });
  await getDatabase().auditLog.create({ data: { actorId: user.id, action: "NEWS_UPDATED", targetUserId: null } });
  return NextResponse.json({ news: updated });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Nisi prijavljen." }, { status: 401 });
  if (user.role !== "SUPER_ADMIN" && user.role !== "ADMIN") {
    return NextResponse.json({ error: "Samo admin može obrisati novost." }, { status: 403 });
  }
  const id = parseId((await context.params).id);
  if (!id) return NextResponse.json({ error: "Neispravna novost." }, { status: 400 });
  const existing = await getDatabase().news.findUnique({ where: { id }, select: { id: true } });
  if (!existing) return NextResponse.json({ error: "Novost nije pronađena." }, { status: 404 });
  await getDatabase().news.delete({ where: { id } });
  await getDatabase().auditLog.create({ data: { actorId: user.id, action: "NEWS_DELETED" } });
  return NextResponse.json({ ok: true });
}
