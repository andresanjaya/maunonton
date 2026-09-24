import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { PwaProvider } from "@/components/pwa/pwa-provider";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "maunonton — social film journal", template: "%s · maunonton" },
  description: "Simpan apa yang kamu tonton dan bagaimana rasanya.",
  manifest: "/manifest.webmanifest",
  applicationName: "maunonton",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "maunonton" },
  icons: { apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }] },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#121211",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <div className="app-frame">
          <main className="min-h-dvh pb-[calc(6.75rem+env(safe-area-inset-bottom))]">{children}</main>
          <BottomNavigation />
          <PwaProvider />
        </div>
      </body>
    </html>
  );
}
