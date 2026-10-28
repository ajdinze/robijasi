import Link from "next/link";
import Image from "next/image";

const links = [
  ["Historija", "/historija"],
  ["Novosti", "/novosti"],
  ["Galerija", "/galerija"],
  ["Video", "/video"],
  ["Forum", "https://forum.robijasi.org"],
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link className="brand" href="/" aria-label="Robijaši Zenica, početna stranica">
          <Image
            className="brand__logo"
            src="/image/logo/rz.webp"
            alt="Robijaši Zenica logo"
            width={48}
            height={55}
            priority
          />
          <span className="brand__wordmark">
            <strong>ROBIJAŠI</strong>
            <small>ZENICA · 1988</small>
          </span>
        </Link>
        <nav className="site-nav" aria-label="Glavna navigacija">
          {links.map(([label, href]) => (
            <a href={href} key={label}>{label}</a>
          ))}
        </nav>
        <details className="mobile-nav">
          <summary>Meni</summary>
          <nav aria-label="Mobilna navigacija">
            {links.map(([label, href]) => (
              <a href={href} key={label}>{label}</a>
            ))}
          </nav>
        </details>
        <a className="header-cta" href="/clanstvo">
          Članstvo <span aria-hidden="true">↗</span>
        </a>
      </div>
    </header>
  );
}
