import { AppHeader } from "@/components/layout/app-header";
import { PageContainer } from "@/components/layout/page-container";

export const metadata = { title: "Kebijakan Privasi" };

export default function PrivacyPage() {
  return <><AppHeader title="Privasi" compact /><PageContainer><article className="card space-y-5 p-5"><h1 className="font-serif text-3xl">Kebijakan Privasi</h1><p className="text-sm leading-7 text-secondary">Kami memproses data akun, jurnal, reaksi, dan interaksi yang diperlukan untuk menyediakan maunonton. Jurnal dapat ditandai publik atau privat; jurnal privat hanya tersedia untuk pemiliknya.</p><p className="text-sm leading-7 text-secondary">Foto jurnal disimpan di bucket Storage privat. Akses foto mengikuti visibilitas jurnal dan kebijakan keamanan database kami.</p><p className="text-sm leading-7 text-secondary">Kamu dapat memperbarui profil, menghapus jurnal sendiri, memblokir akun, atau memulai penghapusan akun dari Pengaturan. Untuk pertanyaan privasi, gunakan halaman Dukungan.</p><p className="text-xs leading-5 text-muted">Versi beta · terakhir diperbarui 24 September 2026.</p></article></PageContainer></>;
}
