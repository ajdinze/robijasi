"use client";

import { useState } from "react";

const filters = ["Sve", "Tribina", "Zajednica", "Historija", "Aktivnosti"];

const posts = [
  ["Tribina", "Zenički do kosti", "Najnovije priče i obavijesti sa tribine."],
  ["Zajednica", "Više od 90 minuta", "Naša priča živi na stadionu, u gradu i među ljudima."],
  ["Historija", "Od 1988. do danas", "Čuvamo sjećanja, ljude i trenutke koji traju."],
  ["Aktivnosti", "Glas koji se čuje", "Mjesto za najave i aktivnosti Robijaša."],
] as const;

export function NewsList() {
  const [activeFilter, setActiveFilter] = useState("Sve");
  const visiblePosts =
    activeFilter === "Sve"
      ? posts
      : posts.filter(([category]) => category === activeFilter);

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
        {visiblePosts.map(([category, title, text], index) => (
          <article className="news-card" key={title}>
            <div className={`news-card__image news-card__image--${(index % 3) + 1}`}>
              <span>0{index + 1}</span>
            </div>
            <div className="news-card__body">
              <p className="card-kicker">{category}</p>
              <h3>{title}</h3>
              <p>{text}</p>
              <a className="text-link" href="/novosti">
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
