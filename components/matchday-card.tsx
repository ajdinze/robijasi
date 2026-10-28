export function MatchdayCard() {
  return (
    <article className="matchday-card">
      <div className="matchday-card__meta">
        <span className="live-dot" /> Uskoro
      </div>
      <div className="matchday-card__teams">
        <div className="team">
          <span className="team__crest team__crest--home">Č</span>
          <strong>Čelik</strong>
          <small>Zenica</small>
        </div>
        <div className="matchday-card__versus">
          <small>SUB · 19:00</small>
          <strong>VS</strong>
          <span>Bilino Polje</span>
        </div>
        <div className="team">
          <span className="team__crest team__crest--away">?</span>
          <strong>Gost</strong>
          <small>Protivnik</small>
        </div>
      </div>
      <a className="matchday-card__footer" href="/utakmice">
        <span>Informacije o utakmici</span>
        <span aria-hidden="true">↗</span>
      </a>
    </article>
  );
}
