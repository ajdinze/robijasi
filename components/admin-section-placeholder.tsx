export function AdminSectionPlaceholder({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <section className="admin-section-placeholder">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}.</h1>
      <p>{description}</p>
      <div className="admin-section-placeholder__next"><span>SLJEDEĆI MODUL</span><strong>CRUD forma i povezivanje sa bazom</strong></div>
    </section>
  );
}
