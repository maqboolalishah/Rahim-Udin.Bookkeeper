import { ImageResponse } from "next/og";
import { person } from "@/content/site";

// Placeholder OG image: replace with a designed asset (app/opengraph-image.png) when ready.
export const alt = `${person.name}, Bookkeeper`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#F4F1E8",
        color: "#101A16",
        padding: 72,
        fontFamily: "serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 22,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: "#4A544F",
        }}
      >
        <span>DR · Debit</span>
        <span>Credit · CR</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 112, lineHeight: 1, letterSpacing: -4 }}>Your numbers,</div>
        <div style={{ fontSize: 112, lineHeight: 1, letterSpacing: -4, color: "#1F4D3A", fontStyle: "italic" }}>
          in perfect balance.
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          borderTop: "2px solid #101A16",
          paddingTop: 24,
          fontSize: 30,
        }}
      >
        <span>{`${person.name}, Bookkeeper`}</span>
        <span style={{ color: "#1F4D3A" }}>Difference 0.00 · Balanced</span>
      </div>
    </div>,
    size,
  );
}
