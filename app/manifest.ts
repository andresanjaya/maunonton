import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "maunonton — social film journal",
    short_name: "maunonton",
    description: "Simpan apa yang kamu tonton dan bagaimana rasanya.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#121211",
    theme_color: "#121211",
    lang: "id",
    icons: [
      { src: "/pwa/icon-180", sizes: "180x180", type: "image/png", purpose: "any" },
      { src: "/pwa/icon-192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/pwa/icon-512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
