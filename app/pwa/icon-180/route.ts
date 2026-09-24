import { createAppIcon } from "@/src/lib/pwa/app-icon";

export const runtime = "edge";

export function GET() { return createAppIcon(180); }
