import { MockPage } from "@/components/mock-page";

export default function KontaktPage() {
  return (
    <MockPage eyebrow="Javi nam se" title="Kontakt." intro="Za pitanja, saradnju i informacije — tu smo.">
      <div className="contact-grid"><div className="content-intro"><p className="eyebrow">UG Robijaši Zenica 1988</p><h2>Ostani povezan.</h2><p>Prati nas i budi u toku sa najnovijim aktivnostima.</p><div className="social-links"><a href="https://www.facebook.com/Robijasi1988">Facebook ↗</a><a href="https://www.instagram.com/ugrobijasi1988/">Instagram ↗</a><a href="mailto:press.robijasi1988@gmail.com">Email ↗</a></div></div><div className="contact-card"><span className="card-kicker">Email</span><a href="mailto:press.robijasi1988@gmail.com">press.robijasi1988@gmail.com</a><span className="card-kicker">Lokacija</span><p>Zenica, Bosna i Hercegovina</p></div></div>
    </MockPage>
  );
}
