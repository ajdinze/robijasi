"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(false);
    setError("");
    setLoading(true);
    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/auth/login", {
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      if (!response.ok) {
        const result = await response.json();
        setError(result.error ?? "Prijava nije uspjela.");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Login servis nije dostupan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="admin-login-form" onSubmit={handleSubmit}>
      <label htmlFor="admin-email">Email ili korisničko ime</label>
      <input id="admin-email" name="email" placeholder="unesi korisničko ime" type="text" autoComplete="username" required />
      <label htmlFor="admin-password">Lozinka</label>
      <input id="admin-password" name="password" placeholder="unesi lozinku" type="password" autoComplete="current-password" required />
      <div className="admin-login-form__options">
        <label className="admin-login-form__remember">
          <input name="remember" type="checkbox" />
          <span>Zapamti sesiju</span>
        </label>
        <a href="mailto:press.robijasi1988@gmail.com?subject=Reset%20admin%20pristupa">Zaboravljena lozinka?</a>
      </div>
      <button className="button button--primary" disabled={loading} type="submit">{loading ? "Provjera..." : "Prijavi se"} <span aria-hidden="true">↗</span></button>
      {error && <p className="admin-login-form__notice admin-login-form__notice--error" role="alert">{error}</p>}
      {submitted && (
        <p className="admin-login-form__notice" role="status">
          Login servis još nije povezan. Ova forma je priprema za server-side autentikaciju.
        </p>
      )}
    </form>
  );
}
