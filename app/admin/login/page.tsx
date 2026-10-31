import { AdminLoginForm } from "@/components/admin-login-form";

export const metadata = {
  title: "Admin prijava | Robijaši Zenica 1988",
  robots: "noindex, nofollow",
};

export default function AdminLoginPage() {
  return (
    <main className="admin-login-page">
      <div className="admin-login-page__visual" aria-hidden="true">
        <div className="admin-login-page__mark">RZ</div>
      </div>
      <section className="admin-login-panel" aria-labelledby="admin-login-title">
        <div className="admin-login-panel__brand">
          <span>ROBIJAŠI</span>
          <small>ADMIN PANEL · 1988</small>
        </div>
        <div className="admin-login-panel__content">
          <p className="eyebrow">Zaštićeni pristup</p>
          <h1 id="admin-login-title">Dobro došao nazad.</h1>
          <p className="admin-login-panel__intro">
            Prijavi se za upravljanje novostima, galerijama i sadržajem portala.
          </p>
          <AdminLoginForm />
        </div>
        <p className="admin-login-panel__footer">
          Pristup je namijenjen samo ovlaštenim korisnicima.
        </p>
      </section>
    </main>
  );
}
