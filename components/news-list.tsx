"use client";

import { useState } from "react";

const filters = ["Sve", "Tribina", "Zajednica", "Historija", "Aktivnosti"];

type NewsPost = { id: string; slug: string; category: string; title: string; text: string; image: string | null };

const demoPosts: NewsPost[] = [
  { id: "demo-1", slug: "zeni-ka-tribina-spremna-za-novu-sezonu", category: "Tribina", title: "Zenički do kosti", text: "Najnovije priče i obavijesti sa tribine.", image: null },
  { id: "demo-2", slug: "vise-od-90-minuta", category: "Zajednica", title: "Više od 90 minuta", text: "Naša priča živi na stadionu, u gradu i među ljudima.", image: null },
  { id: "demo-3", slug: "od-1988-do-danas", category: "Historija", title: "Od 1988. do danas", text: "Čuvamo sjećanja, ljude i trenutke koji traju.", image: null },
  { id: "demo-4", slug: "glas-koji-se-cuje", category: "Aktivnosti", title: "Glas koji se čuje", text: "Mjesto za najave i aktivnosti Robijaša.", image: null },
];

export function NewsList({ databasePosts = [] }: { databasePosts?: NewsPost[] }) {
  const [activeFilter, setActiveFilter] = useState("Sve");
  const posts = databasePosts.length > 0 ? databasePosts : demoPosts;
  const visiblePosts =
    activeFilter === "Sve"
      ? posts
      : posts.filter((post) => post.category === activeFilter);

  return (
    <>
      <div className="filter-row" aria-label="Filter novosti" role="group">
        {filters.map((filter) => (
          <button
            className={filter === activeFilter ? "filter-row__active" : ""}
            key={filter}
            onClick={() => setActiveFilter(filter)}
            type="button"
            aria-pressed={filter === activeFilter}
          >
            {filter}
          </button>
        ))}
      </div>
      <div className="article-grid" aria-live="polite">
        {visiblePosts.map((post, index) => (
          <article className="news-card" key={post.id}>
            <div className={`news-card__image news-card__image--${(index % 3) + 1}`} style={post.image ? { backgroundImage: `url("${post.image}")` } : undefined}>
              <span>0{index + 1}</span>
            </div>
            <div className="news-card__body">
              <p className="card-kicker">{post.category}</p>
              <h3>{post.title}</h3>
              <p>{post.text}</p>
              <a className="text-link" href={`/novosti/${post.slug}`}>
                Pročitaj više <span>↗</span>
              </a>
            </div>
          </article>
        ))}
      </div>
      {visiblePosts.length === 0 && (
        <p className="empty-state">Trenutno nema novosti u ovoj kategoriji.</p>
      )}
    </>
  );
}
