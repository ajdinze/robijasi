import { redirect } from "next/navigation";
import { AdminSectionPlaceholder } from "@/components/admin-section-placeholder";
import { AdminShell } from "@/components/admin-shell";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "Video | Admin | Robijaši Zenica 1988", robots: "noindex, nofollow" };
export const instant = false;

export default async function AdminVideosPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return <AdminShell user={user}><AdminSectionPlaceholder eyebrow="Medijska biblioteka" title="Video" description="Ovdje ćemo dodavati YouTube zapise, thumbnail slike i opise videa." /></AdminShell>;
}
