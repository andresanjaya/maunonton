import { ImageResponse } from "next/og";

export function createAppIcon(size: number) {
  const markSize = Math.round(size * 0.57);
  const letterSize = Math.round(size * 0.34);

  return new ImageResponse(
    (
      <div style={{ alignItems: "center", background: "#f4f4f1", display: "flex", height: "100%", justifyContent: "center", padding: Math.round(size * 0.1), width: "100%" }}>
        <div style={{ alignItems: "center", background: "#191a19", borderRadius: Math.round(size * 0.2), color: "#ff7158", display: "flex", fontFamily: "Arial, sans-serif", fontSize: letterSize, fontWeight: 800, height: markSize, justifyContent: "center", letterSpacing: Math.round(-size * 0.035), width: markSize }}>M</div>
      </div>
    ),
    { height: size, width: size },
  );
}
