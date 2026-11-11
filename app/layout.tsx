import type { Metadata, Viewport } from "next";
import { Fraunces, Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { person, seo } from "@/content/site";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Cursor } from "@/components/ui/Cursor";
import { BalanceIndicator } from "@/components/ui/BalanceIndicator";
import { Header } from "@/components/sections/Header";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz"],
  style: ["normal", "italic"],
  display: "swap",
});
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(person.siteUrl),
  title: { default: seo.title, template: `%s · ${person.name}` },
  description: seo.description,
  keywords: seo.keywords,
  authors: [{ name: person.name }],
  openGraph: {
    type: "website",
    title: seo.title,
    description: seo.description,
    siteName: `${person.name}, Bookkeeper`,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: seo.title, description: seo.description },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4F1E8" },
    { media: "(prefers-color-scheme: dark)", color: "#0D1411" },
  ],
};

/**
 * Runs synchronously before first paint:
 *  - marks JS as available (enables reveal styles),
 *  - applies the saved / system theme (no flash),
 *  - hides the preloader if already seen this session or reduced motion,
 *  - enables the CSS-only hero intro when the preloader is skipped (no JS wait → fast LCP).
 * Storage access is wrapped in try/catch (private mode, blocked storage).
 */
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');var mq=function(q){return window.matchMedia(q).matches};var t=null;try{t=localStorage.getItem('ll-theme')}catch(e){}if(t!=='light'&&t!=='dark'){t=mq('(prefers-color-scheme: dark)')?'dark':'light'}d.setAttribute('data-theme',t);var seen=false;try{seen=!!sessionStorage.getItem('ll-opened')}catch(e){seen=true}var rm=mq('(prefers-reduced-motion: reduce)');if(seen||rm)d.setAttribute('data-preloaded','');if(seen&&!rm)d.setAttribute('data-intro-anim','')})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${fraunces.variable} ${geist.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <noscript>
          <style>{`#preloader{display:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-dvh antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-paper focus:px-4 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <Header />
        {children}
        <BalanceIndicator />
        <Cursor />
        <div aria-hidden className="grain" />
      </body>
    </html>
  );
}
