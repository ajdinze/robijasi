import { redirect } from "next/navigation";
import { AdminSectionPlaceholder } from "@/components/admin-section-placeholder";
import { AdminShell } from "@/components/admin-shell";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "Historija | Admin | Robijaši Zenica 1988", robots: "noindex, nofollow" };
export const instant = false;

export default async function AdminHistoryPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return <AdminShell user={user}><AdminSectionPlaceholder eyebrow="Sadržaj portala" title="Historija" description="Ovdje ćemo uređivati timeline, statistike i ključne događaje kluba." /></AdminShell>;
}
