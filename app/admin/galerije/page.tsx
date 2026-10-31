import { redirect } from "next/navigation";
import { AdminSectionPlaceholder } from "@/components/admin-section-placeholder";
import { AdminShell } from "@/components/admin-shell";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "Galerije | Admin | Robijaši Zenica 1988", robots: "noindex, nofollow" };
export const instant = false;

export default async function AdminGalleriesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return <AdminShell user={user}><AdminSectionPlaceholder eyebrow="Medijska biblioteka" title="Galerije" description="Ovdje ćemo kreirati galerije, dodavati fotografije i uređivati njihov redoslijed." /></AdminShell>;
}
