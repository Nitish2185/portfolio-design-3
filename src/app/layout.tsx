import type { Metadata, Viewport } from "next";
import { Anybody, Hanken_Grotesk } from "next/font/google";
import { site } from "@/content/site";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { TransitionProvider } from "@/components/providers/TransitionProvider";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { Crosshair } from "@/components/ui/Crosshair";
import { GridLines } from "@/components/ui/GridLines";
import { Loader } from "@/components/ui/Loader";
import "./globals.css";

// Anybody is a variable font with a width axis (50–150%) that we animate
const anybody = Anybody({
  variable: "--font-anybody",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} — Portfolio`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
};

export const viewport: Viewport = {
  themeColor: "#e63312",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${anybody.variable} ${hanken.variable} is-loading`}>
      <body>
        <noscript>
          <style>{`.loader{display:none!important}html.is-loading,html.is-loading body{overflow:auto!important}`}</style>
        </noscript>
        <SmoothScroll />
        <Loader />
        <GridLines />
        <Crosshair />
        <MotionProvider>
          <TransitionProvider>
            <Nav />
            {children}
            <Footer />
          </TransitionProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
