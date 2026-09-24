import { AppHeader } from "@/components/layout/app-header";
import { PageContainer } from "@/components/layout/page-container";

export const metadata = { title: "Tentang" };

export default function AboutPage() {
  return <><AppHeader title="Tentang" eyebrow="Kredit" compact /><PageContainer className="space-y-5"><section className="card p-5"><p className="eyebrow">maunonton</p><h1 className="mt-2 font-serif text-3xl tracking-tight">Jurnal untuk film dan momen di sekitarnya.</h1><p className="mt-4 text-sm leading-6 text-secondary">maunonton tidak memutar atau menyediakan film. Kami membantu kamu mencatat apa yang ditonton dan bagaimana rasanya.</p></section><section className="card p-5"><p className="eyebrow">Kredit data film</p><h2 className="mt-2 font-serif text-2xl tracking-tight">The Movie Database</h2><p className="mt-3 text-sm leading-6 text-secondary">This product uses the TMDB API but is not endorsed or certified by TMDB.</p><a href="https://www.themoviedb.org" target="_blank" rel="noreferrer" className="focus-ring mt-4 inline-flex text-sm font-semibold text-[var(--color-accent-strong)]">Kunjungi TMDB</a></section></PageContainer></>;
}
