import { createAppIcon } from "@/src/lib/pwa/app-icon";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export const runtime = "edge";

export default function AppleIcon() { return createAppIcon(180); }
