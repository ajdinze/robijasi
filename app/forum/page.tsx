import { MockPage } from "@/components/mock-page";

export default function ForumPage() {
  return (
    <MockPage eyebrow="Zajednica" title="Forum." intro="Mjesto za razgovor, razmjenu mišljenja i čuvanje zajednice.">
      <div className="forum-cta"><div><p className="eyebrow">forum.robijasi.org</p><h2>Razgovor se nastavlja.</h2><p>Posjeti postojeći forum Robijaša Zenica 1988 i pridruži se zajednici.</p></div><a className="button button--primary" href="https://forum.robijasi.org">Otvori forum ↗</a></div>
    </MockPage>
  );
}
