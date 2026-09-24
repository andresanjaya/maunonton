import type { NextConfig } from "next";

const configuredSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseHostname = configuredSupabaseUrl ? new URL(configuredSupabaseUrl).hostname : null;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "image.tmdb.org", pathname: "/t/p/**" },
      ...(supabaseHostname ? [{ protocol: "https" as const, hostname: supabaseHostname, pathname: "/storage/v1/object/sign/**" }] : []),
    ],
  },
};

export default nextConfig;
