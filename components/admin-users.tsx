"use client";

import { FormEvent, useEffect, useState } from "react";

type Role = "SUPER_ADMIN" | "ADMIN" | "EDITOR";
type User = { id: number; name: string; email: string; role: Role; status: "ACTIVE" | "INACTIVE"; createdAt: string; lastLoginAt: string | null };

export function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadUsers() {
    const response = await fetch("/api/admin/users");
    const result = await response.json();
    if (!response.ok) setError(result.error ?? "Korisnici nisu učitani.");
    else setUsers(result.users);
    setLoading(false);
  }

  useEffect(() => {
    let active = true;
    fetch("/api/admin/users")
      .then(async (response) => ({ response, result: await response.json() }))
      .then(({ response, result }) => {
        if (!active) return;
        if (!response.ok) setError(result.error ?? "Korisnici nisu učitani.");
        else setUsers(result.users);
        setLoading(false);
      })
      .catch(() => {
        if (active) {
          setError("Korisnici nisu učitani.");
          setLoading(false);
        }
      });
    return () => { active = false; };
  }, []);

  async function createUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const response = await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    const result = await response.json();
    if (!response.ok) setError(result.error ?? "Korisnik nije kreiran.");
    else { setMessage("Korisnik je uspješno kreiran."); form.reset(); await loadUsers(); }
  }

  async function updateUser(id: number, patch: Partial<User> & { password?: string }) {
    setError("");
    const response = await fetch(`/api/admin/users/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) });
    const result = await response.json();
    if (!response.ok) setError(result.error ?? "Izmjena nije sačuvana.");
    else { setMessage("Izmjena je sačuvana."); await loadUsers(); }
  }

  async function deleteUser(id: number) {
    if (!window.confirm("Obrisati ovog korisnika? Ova radnja se ne može poništiti.")) return;
    const response = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    const result = await response.json();
    if (!response.ok) setError(result.error ?? "Korisnik nije obrisan.");
    else await loadUsers();
  }

  return (
    <div className="admin-users">
      <div className="admin-users__intro"><div><p className="eyebrow">Pristup i ovlasti</p><h1>Korisnici.</h1></div><p>Dodaj članove tima, dodijeli im rolu i kontroliši aktivan pristup panelu.</p></div>
      <div className="admin-users__grid">
        <form className="admin-panel-card admin-user-form" onSubmit={createUser}>
          <p className="eyebrow">Novi nalog</p><h2>Dodaj korisnika</h2>
          <label>Ime i prezime<input name="name" required /></label>
          <label>Email<input name="email" type="email" required /></label>
          <label>Privremena lozinka<input name="password" minLength={10} type="password" required /></label>
          <label>Rola<select defaultValue="EDITOR" name="role"><option value="EDITOR">Editor</option><option value="ADMIN">Admin</option><option value="SUPER_ADMIN">Super admin</option></select></label>
          <button className="button button--primary" type="submit">Dodaj korisnika</button>
        </form>
        <section className="admin-panel-card admin-user-list"><p className="eyebrow">Postojeći nalozi</p><h2>Tim</h2>
          {loading ? <p>Učitavanje...</p> : users.map((user) => <article className="admin-user-row" key={user.id}>
            <div><strong>{user.name}</strong><span>{user.email}</span><small className={user.status === "ACTIVE" ? "is-active" : ""}>{user.status === "ACTIVE" ? "Aktivan" : "Deaktiviran"}</small></div>
            <div className="admin-user-row__controls"><select aria-label={`Rola za ${user.name}`} value={user.role} onChange={(event) => void updateUser(user.id, { role: event.target.value as Role })}><option value="EDITOR">Editor</option><option value="ADMIN">Admin</option><option value="SUPER_ADMIN">Super admin</option></select><button type="button" onClick={() => void updateUser(user.id, { status: user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" })}>{user.status === "ACTIVE" ? "Deaktiviraj" : "Aktiviraj"}</button><button className="danger" type="button" onClick={() => void deleteUser(user.id)}>Obriši</button></div>
          </article>)}
        </section>
      </div>
      {message && <p className="admin-login-form__notice" role="status">{message}</p>}
      {error && <p className="admin-login-form__notice admin-login-form__notice--error" role="alert">{error}</p>}
    </div>
  );
}
