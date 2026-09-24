import { ImageResponse } from "next/og";

export function createAppIcon(size: number) {
  const markSize = Math.round(size * 0.57);
  const letterSize = Math.round(size * 0.34);

  return new ImageResponse(
    (
      <div style={{ alignItems: "center", background: "#121211", display: "flex", height: "100%", justifyContent: "center", padding: Math.round(size * 0.1), width: "100%" }}>
        <div style={{ alignItems: "center", background: "linear-gradient(145deg, #f27f62 0%, #d95e48 100%)", border: `${Math.max(2, Math.round(size * 0.018))}px solid #ffb3a0`, borderRadius: Math.round(size * 0.22), boxShadow: `0 ${Math.round(size * 0.045)}px ${Math.round(size * 0.12)}px rgba(0, 0, 0, 0.3)`, color: "#181413", display: "flex", fontFamily: "Arial, sans-serif", fontSize: letterSize, fontWeight: 800, height: markSize, justifyContent: "center", letterSpacing: Math.round(-size * 0.035), width: markSize }}>M</div>
      </div>
    ),
    { height: size, width: size },
  );
}
