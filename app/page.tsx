import { MatchdayCard } from "@/components/matchday-card";
import { SiteHeader } from "@/components/site-header";
import Image from "next/image";

const news = [
  {
    category: "Tribina",
    title: "Zenički do kosti",
    text: "Mjesto za najnovije priče, obavijesti i aktivnosti Robijaša.",
  },
  {
    category: "Historija",
    title: "Od 1988. do danas",
    text: "Čuvamo sjećanja, ljude i trenutke koji su izgradili našu tribinu.",
  },
  {
    category: "Zajednica",
    title: "Više od 90 minuta",
    text: "Naša priča živi na stadionu, u gradu i među ljudima.",
  },
];

export default function Home() {
  return (
    <div className="site-shell">
      <SiteHeader />

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <Image
            className="hero__image"
            src="/image/hero/hero.webp"
            alt="Atmosfera sa tribine Robijaša na stadionu u Zenici"
            fill
            priority
            sizes="100vw"
          />
          <div className="hero__content container">
            <p className="eyebrow">Robijaši Zenica · since 1988</p>
            <h1 id="hero-title">
              <span>Jedan grad.</span>
              <strong>Jedna tribina.</strong>
            </h1>
            <div className="hero__actions">
              <a className="button button--primary" href="#matchday">
                Sljedeća utakmica <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
          <div className="hero__scroll" aria-hidden="true">
            <span />
            scroll to explore
          </div>
        </section>

        <section className="matchday-section container" id="matchday">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Matchday</p>
              <h2>Sljedeći okršaj</h2>
            </div>
            <a className="text-link" href="/utakmice">
              Sve utakmice <span aria-hidden="true">→</span>
            </a>
          </div>
          <MatchdayCard />
        </section>

        <section className="story-section" id="story">
          <div className="container story-grid">
            <div>
              <p className="eyebrow">Naša priča</p>
              <h2>Grad koji se čuje.</h2>
            </div>
            <div className="story-copy">
              <p>
                Robijaši nisu samo ime na tribini. To je generacija za
                generacijom, glas koji putuje i crno-crvena pripadnost koja
                traje od 1988.
              </p>
              <a className="text-link" href="/historija">
                Istraži historiju <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>

        <section className="news-section container" id="novosti">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Iz tribine</p>
              <h2>Najnovije</h2>
            </div>
            <a className="text-link" href="/novosti">
              Sve novosti <span aria-hidden="true">→</span>
            </a>
          </div>
          <div className="news-grid">
            {news.map((item, index) => (
              <article className="news-card" key={item.title}>
                <div className={`news-card__image news-card__image--${index + 1}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className="news-card__body">
                  <p className="card-kicker">{item.category}</p>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <a className="text-link" href="/novosti">
                    Pročitaj više <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="media-section container">
          <div className="media-banner">
            <div>
              <p className="eyebrow">Mediji</p>
              <h2>Glas tribine.<br />Slika trenutka.</h2>
            </div>
            <div className="media-banner__links">
              <a className="button button--primary" href="/galerija">
                Galerija <span aria-hidden="true">↗</span>
              </a>
              <a className="button button--ghost" href="/video">
                Video
              </a>
            </div>
            <span className="media-banner__mark" aria-hidden="true">RZ</span>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container site-footer__top">
          <div>
            <Image
              className="site-footer__logo"
              src="/image/logo/rz.webp"
              alt="Robijaši Zenica logo"
              width={52}
              height={60}
            />
            <p className="brand-mark">ROBIJAŠI<span>1988</span></p>
            <p className="site-footer__tagline">Zenički do kosti.</p>
          </div>
          <a className="button button--ghost" href="mailto:press.robijasi1988@gmail.com">
            Kontakt <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="container site-footer__bottom">
          <span>© 2026 UG Robijaši Zenica 1988</span>
          <span>Crno. Crveno. Zauvijek.</span>
        </div>
      </footer>
    </div>
  );
}
