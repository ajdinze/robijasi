import Image from "next/image";
import { MockPage } from "@/components/mock-page";

const milestones = [
  ["1988", "Početak priče", "Godina koja je upisana u identitet Zenice i početak generacije koja traje."],
  ["90-e", "Glas koji raste", "Tribina postaje mjesto pripadnosti, putovanja i zajedničkog sjećanja."],
  ["2000-e", "Crno-crvena energija", "Koreografije, gostovanja i trenuci koji ostaju dio kolektivne memorije."],
  ["Danas", "Isti osjećaj", "Nova generacija čuva ono što je izgrađeno i nosi priču dalje."],
];

export default function HistorijaPage() {
  return (
    <MockPage eyebrow="Od 1988. do danas" title="Naša historija." intro="Priča o ljudima, gradu i tribini koja se prenosi generacijama.">
      <div className="history-lead">
        <div className="content-intro">
          <p className="eyebrow">Korijeni</p>
          <h2>Više od datuma.</h2>
          <p>Historija Robijaša je zbir trenutaka koji su oblikovali identitet Zenice. Ovo je prostor za arhiv, sjećanja i priče ljudi koji su bili dio puta.</p>
        </div>
        <div className="history-lead__visual">
          <Image src="/image/hero/hero.webp" alt="Atmosfera na stadionu u Zenici" fill sizes="(max-width: 680px) 100vw, 45vw" />
          <span>ZENICA<br /><strong>1988—</strong></span>
        </div>
      </div>
      <div className="history-stats">
        <div><strong>38</strong><span>godina priče</span></div>
        <div><strong>01</strong><span>grad</span></div>
        <div><strong>∞</strong><span>pripadnost</span></div>
      </div>
      <div className="timeline">
        {milestones.map(([year, title, text]) => (
          <article className="timeline__item" key={year}>
            <span className="timeline__year">{year}</span>
            <div><h3>{title}</h3><p>{text}</p></div>
          </article>
        ))}
      </div>
    </MockPage>
  );
}
