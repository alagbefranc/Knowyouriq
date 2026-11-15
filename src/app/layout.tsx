import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KnowYourIQ",
  description: "A reasoning test you play, and a five-minute habit after it.",
  icons: { icon: "/brand/knowyouriq-mark.svg" },
};

// One committed dark world, so the status bar matches the night background.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  colorScheme: "dark",
  themeColor: "#120b33",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;700&family=Barlow+Condensed:wght@600;700&family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&display=swap"
        />
      </head>
      <body>
        <div className="sheet">
          <header className="masthead">
            <a href="/" aria-label="KnowYourIQ home">
              <img src="/brand/knowyouriq-wordmark-reversed.svg" alt="KnowYourIQ" width={150} height={32} />
            </a>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
