import { MockPage } from "@/components/mock-page";

export default function ClanstvoPage() {
  return (
    <MockPage eyebrow="Pripadnost" title="Članstvo." intro="Jedna tribina počinje od ljudi koji je nose.">
      <div className="membership-grid">
        <div className="content-intro"><p className="eyebrow">Budi dio priče</p><h2>Pripadnost nije riječ.</h2><p>Informacije o članstvu, vrijednostima i načinu prijave biće dostupne na ovom mjestu.</p><a className="button button--primary" href="mailto:press.robijasi1988@gmail.com">Kontaktiraj nas ↗</a></div>
        <div className="info-list"><div><span>01</span><h3>Identitet</h3><p>Čuvamo boje, ime i priču našeg grada.</p></div><div><span>02</span><h3>Zajednica</h3><p>Zajedno na tribini i van nje.</p></div><div><span>03</span><h3>Odgovornost</h3><p>Poštujemo klub, grad i ljude.</p></div></div>
      </div>
    </MockPage>
  );
}
