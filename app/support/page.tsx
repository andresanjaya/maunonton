import { AppHeader } from "@/components/layout/app-header";
import { PageContainer } from "@/components/layout/page-container";

export default function SupportPage() {
  const supportUrl = process.env.SUPPORT_URL;
  const email = process.env.SUPPORT_EMAIL;
  const href = supportUrl || (email ? `mailto:${email}` : null);
  const label = supportUrl ? "Buka pusat bantuan" : email ? `Hubungi ${email}` : null;

  return <><AppHeader title="Dukungan" compact /><PageContainer><article className="card p-5"><h1 className="font-serif text-3xl">Butuh bantuan?</h1><p className="mt-4 text-sm leading-7 text-secondary">Kirimkan konteks singkat, perangkat, dan langkah yang kamu lakukan agar kami bisa membantu lebih cepat.</p>{href && label ? <a className="focus-ring mt-5 inline-flex min-h-11 items-center rounded-xl bg-[var(--color-accent)] px-4 text-sm font-semibold text-[#1b1513]" href={href} target={supportUrl ? "_blank" : undefined} rel={supportUrl ? "noreferrer" : undefined}>{label}</a> : <p className="mt-5 text-sm text-[var(--color-warning)]">Kontak dukungan belum dikonfigurasi.</p>}</article></PageContainer></>;
}
