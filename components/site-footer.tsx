import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__top">
        <div>
          <Image className="site-footer__logo" src="/image/logo/rz.webp" alt="Robijaši Zenica logo" width={52} height={60} />
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
  );
}
