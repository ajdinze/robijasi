import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { AdminShell } from "@/components/admin-shell";

export const metadata = {
  title: "Dashboard | Robijaši Zenica 1988",
  robots: "noindex, nofollow",
};

export const instant = false;

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  return (
    <AdminShell user={user}>
      <div className="admin-dashboard container">
        <div className="admin-dashboard__heading">
          <div><p className="eyebrow">Admin panel · {user.role}</p><h1>Dashboard.</h1><p>Dobro došao, {user.name}.</p></div>
          <span className="admin-dashboard__status"><i /> Sesija aktivna</span>
        </div>
        <section className="admin-stat-grid">
          <article><strong>04</strong><h2>Novosti</h2><p>Objavljene objave</p></article>
          <article><strong>06</strong><h2>Galerije</h2><p>Galerije spremne za unos</p></article>
          <article><strong>03</strong><h2>Video</h2><p>YouTube zapisi</p></article>
          <article><strong>—</strong><h2>Korisnici</h2><p>Upravljanje rolama</p></article>
        </section>
        <section className="admin-dashboard__grid">
          <div className="admin-panel-card"><p className="eyebrow">Brze akcije</p><h2>Šta želiš uraditi?</h2><div className="admin-actions"><Link href="/admin/novosti">+ Nova novost</Link><Link href="/admin/galerije">+ Nova galerija</Link><Link href="/admin/videi">+ Novi video</Link>{user.role === "SUPER_ADMIN" && <Link href="/admin/korisnici">+ Upravljaj korisnicima</Link>}</div></div>
          <div className="admin-panel-card"><p className="eyebrow">Tvoj pristup</p><h2>{user.role === "SUPER_ADMIN" ? "Puna kontrola" : user.role === "ADMIN" ? "Administratorski pristup" : "Urednički pristup"}</h2><p>Prijavljen si kao {user.email}. Dozvole se provjeravaju na serveru za svaku zaštićenu akciju.</p></div>
        </section>
      </div>
    </AdminShell>
  );
}
