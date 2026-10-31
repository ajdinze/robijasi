"use client";

import { FormEvent, useEffect, useState } from "react";

type Category = { id: number; name: string };
type NewsItem = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImageUrl: string | null;
  categoryId: number;
  status: "DRAFT" | "PUBLISHED";
  createdAt: string;
  publishedAt: string | null;
  category: { name: string };
  author: { name: string } | null;
};

export function AdminNews({ categories }: { categories: Category[] }) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState<NewsItem | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/news")
      .then(async (response) => ({ response, result: await response.json() }))
      .then(({ response, result }) => {
        if (!active) return;
        if (!response.ok) setError(result.error ?? "Novosti nisu učitane.");
        else setNews(result.news);
        setLoading(false);
      })
      .catch(() => {
        if (active) {
          setError("Novosti nisu učitane.");
          setLoading(false);
        }
      });
    return () => { active = false; };
  }, []);

  async function createNews(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    const response = await fetch(editing ? `/api/admin/news/${editing.id}` : "/api/admin/news", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, categoryId: Number(values.categoryId) }),
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error ?? "Novost nije sačuvana.");
    } else {
      setMessage(editing ? "Novost je ažurirana." : result.news.status === "PUBLISHED" ? "Novost je objavljena." : "Novost je sačuvana kao draft.");
      form.reset();
      setEditing(null);
      setNews((current) => editing ? current.map((item) => item.id === result.news.id ? result.news : item) : [result.news, ...current]);
    }

    setSaving(false);
  }

  async function deleteNews(id: number) {
    if (!window.confirm("Obrisati ovu novost? Ova radnja se ne može poništiti.")) return;
    const response = await fetch(`/api/admin/news/${id}`, { method: "DELETE" });
    const result = await response.json();
    if (!response.ok) setError(result.error ?? "Novost nije obrisana.");
    else {
      setNews((current) => current.filter((item) => item.id !== id));
      setMessage("Novost je obrisana.");
    }
  }

  return (
    <div className="admin-news">
      <div className="admin-users__intro">
        <div><p className="eyebrow">Upravljanje sadržajem</p><h1>Novosti.</h1></div>
        <p>Dodaj objavu, odaberi kategoriju i odluči da li ide odmah javno ili ostaje u draftu.</p>
      </div>
      <div className="admin-news__grid">
        <form className="admin-panel-card admin-news-form" key={editing?.id ?? "new"} onSubmit={createNews}>
          <p className="eyebrow">{editing ? "Uređivanje objave" : "Nova objava"}</p><h2>{editing ? "Uredi novost" : "Kreiraj novost"}</h2>
          <label>Naslov<input defaultValue={editing?.title ?? ""} name="title" required /></label>
          <label>Kratki opis<textarea defaultValue={editing?.excerpt ?? ""} name="excerpt" rows={3} /></label>
          <label>Sadržaj<textarea defaultValue={editing?.content ?? ""} name="content" required rows={8} /></label>
          <label>URL naslovne slike<input defaultValue={editing?.coverImageUrl ?? ""} name="coverImageUrl" type="url" /></label>
          <label>Kategorija<select defaultValue={editing?.categoryId ?? categories[0]?.id ?? ""} name="categoryId" required>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
          <label>Status<select defaultValue={editing?.status ?? "DRAFT"} name="status"><option value="DRAFT">Draft</option><option value="PUBLISHED">Objavljeno</option></select></label>
          <div className="admin-news-form__buttons"><button className="button button--primary" disabled={saving} type="submit">{saving ? "Spremanje..." : editing ? "Sačuvaj izmjene" : "Sačuvaj novost"}</button>{editing && <button className="admin-news-form__cancel" onClick={() => setEditing(null)} type="button">Odustani</button>}</div>
        </form>
        <section className="admin-panel-card admin-news-list"><p className="eyebrow">Objave</p><h2>Pregled novosti</h2>
          {loading ? <p>Učitavanje...</p> : news.length === 0 ? <p>Još nema novosti.</p> : news.map((item) => <article className="admin-news-row" key={item.id}><div><strong>{item.title}</strong><span>{item.category.name} · {item.author?.name ?? "Bez autora"}</span><small className={item.status === "PUBLISHED" ? "is-published" : ""}>{item.status === "PUBLISHED" ? "Objavljeno" : "Draft"}</small></div><div className="admin-news-row__actions"><button onClick={() => setEditing(item)} type="button">Uredi</button><button className="danger" onClick={() => void deleteNews(item.id)} type="button">Obriši</button></div></article>)}
        </section>
      </div>
      {message && <p className="admin-login-form__notice" role="status">{message}</p>}
      {error && <p className="admin-login-form__notice admin-login-form__notice--error" role="alert">{error}</p>}
    </div>
  );
}
