import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { AdminNews } from "@/components/admin-news";
import { getCurrentUser } from "@/lib/auth";
import { getDatabase } from "@/lib/db";

export const metadata = { title: "Novosti | Admin | Robijaši Zenica 1988", robots: "noindex, nofollow" };
export const instant = false;

export default async function AdminNewsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  const categories = await getDatabase().category.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } });
  return <AdminShell user={user}><AdminNews categories={categories} /></AdminShell>;
}
