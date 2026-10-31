"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type AdminRole = "SUPER_ADMIN" | "ADMIN" | "EDITOR";

type AdminSidebarProps = {
  name: string;
  email: string;
  role: AdminRole;
};

const links: { href: string; label: string; roles: readonly AdminRole[] }[] = [
  { href: "/admin", label: "Pregled", roles: ["SUPER_ADMIN", "ADMIN", "EDITOR"] },
  { href: "/admin/novosti", label: "Novosti", roles: ["SUPER_ADMIN", "ADMIN", "EDITOR"] },
  { href: "/admin/galerije", label: "Galerije", roles: ["SUPER_ADMIN", "ADMIN", "EDITOR"] },
  { href: "/admin/videi", label: "Video", roles: ["SUPER_ADMIN", "ADMIN", "EDITOR"] },
  { href: "/admin/historija", label: "Historija", roles: ["SUPER_ADMIN", "ADMIN", "EDITOR"] },
  { href: "/admin/korisnici", label: "Korisnici", roles: ["SUPER_ADMIN"] },
];

const roleLabels: Record<AdminRole, string> = {
  SUPER_ADMIN: "Super admin",
  ADMIN: "Admin",
  EDITOR: "Editor",
};

export function AdminSidebar({ name, email, role }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <aside className="admin-sidebar">
      <div>
        <Link className="admin-sidebar__brand" href="/admin">
          <strong>ROBIJAŠI</strong>
          <span>ADMIN PANEL · 1988</span>
        </Link>
        <p className="admin-sidebar__label">Navigacija</p>
        <nav aria-label="Admin navigacija">
          {links.filter((link) => link.roles.includes(role)).map((link) => {
            const active = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(`${link.href}/`));
            return <Link className={active ? "is-active" : ""} href={link.href} key={link.href}>{link.label}<span aria-hidden="true">↗</span></Link>;
          })}
        </nav>
      </div>
      <div className="admin-sidebar__footer">
        <div className="admin-sidebar__user"><strong>{name}</strong><span>{email}</span><small>{roleLabels[role]}</small></div>
        <Link className="admin-sidebar__site-link" href="/">← Otvori stranicu</Link>
        <button className="admin-sidebar__logout" onClick={() => void logout()} type="button">Odjavi se <span aria-hidden="true">↗</span></button>
      </div>
    </aside>
  );
}
