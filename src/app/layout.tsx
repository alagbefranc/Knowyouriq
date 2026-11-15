import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KnowYourIQ",
  description: "A reasoning test you play, and a five-minute habit after it.",
  icons: { icon: "/brand/knowyouriq-mark.svg" },
};

// The status bar matches the top of the page in each colour scheme, not the brand colour.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdfdff" },
    { media: "(prefers-color-scheme: dark)", color: "#15141c" },
  ],
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
              <picture>
                <source srcSet="/brand/knowyouriq-wordmark-reversed.svg" media="(prefers-color-scheme: dark)" />
                <img src="/brand/knowyouriq-wordmark.svg" alt="KnowYourIQ" width={160} height={34} />
              </picture>
            </a>
            <span className="label">Form KYIQ-25</span>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
