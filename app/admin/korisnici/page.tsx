import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AdminUsers } from "@/components/admin-users";
import { AdminShell } from "@/components/admin-shell";

export const metadata = { title: "Korisnici | Admin | Robijaši Zenica 1988", robots: "noindex, nofollow" };
export const instant = false;

export default async function AdminUsersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (user.role !== "SUPER_ADMIN") redirect("/admin");
  return <AdminShell user={user}><div className="admin-page"><AdminUsers /></div></AdminShell>;
}
