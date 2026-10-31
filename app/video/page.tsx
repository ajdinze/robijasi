import { MockPage } from "@/components/mock-page";

export default function VideoPage() {
  return (
    <MockPage eyebrow="Glas tribine" title="Video." intro="Snimci, atmosfera i priče sa tribine na jednom mjestu.">
      <div className="video-grid">
        {["Atmosfera sa Bilinog Polja", "Robijaši Zenica 1988", "Zenički do kosti"].map((title, index) => (
          <article className="video-card" key={title}>
            <div className="video-card__thumb"><span>▶</span><small>YOUTUBE · 04:28</small></div>
            <p className="card-kicker">Video {String(index + 1).padStart(2, "0")}</p><h3>{title}</h3>
          </article>
        ))}
      </div>
    </MockPage>
  );
}
