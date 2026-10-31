import Image from "next/image";
import { MockPage } from "@/components/mock-page";

const photos = ["Tribina", "Gostovanje", "Koreografija", "Bilino Polje", "Crno-crvena noć", "Zajedno"];

export default function GalerijaPage() {
  return (
    <MockPage eyebrow="Slika trenutka" title="Galerija." intro="Arhiv atmosfere, koreografija i trenutaka koji ostaju.">
      <div className="filter-row"><span className="filter-row__active">Sve galerije</span><span>Utakmice</span><span>Gostovanja</span><span>Historija</span></div>
      <div className="gallery-grid">
        {photos.map((title, index) => (
          <article className={`gallery-card gallery-card--${(index % 3) + 1}`} key={title}>
            <Image src="/image/hero/hero.webp" alt="" fill sizes="(max-width: 680px) 100vw, 33vw" />
            <div><span>2026</span><h3>{title}</h3><small>12 fotografija ↗</small></div>
          </article>
        ))}
      </div>
    </MockPage>
  );
}
