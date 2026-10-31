import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

type MockPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
};

export function MockPage({ eyebrow, title, intro, children }: MockPageProps) {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="inner-page">
        <section className="inner-hero">
          <div className="inner-hero__image" />
          <div className="container inner-hero__content">
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p>{intro}</p>
          </div>
        </section>
        <div className="container inner-page__content">{children}</div>
      </main>
      <SiteFooter />
    </div>
  );
}
