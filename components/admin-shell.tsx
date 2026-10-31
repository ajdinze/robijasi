import { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import type { AuthUser } from "@/lib/auth";

export function AdminShell({ user, children }: { user: AuthUser; children: ReactNode }) {
  return (
    <div className="admin-workspace">
      <AdminSidebar name={user.name} email={user.email} role={user.role} />
      <main className="admin-workspace__content">{children}</main>
    </div>
  );
}
