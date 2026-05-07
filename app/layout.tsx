import type { Metadata } from "next";
import { Cormorant_Garamond, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ReadingProgress from "@/components/ReadingProgress";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const noto = Noto_Sans_JP({
  variable: "--font-noto",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "meishiki OS | 命式は、あなたのOSだ。",
    template: "%s | meishiki OS",
  },
  description:
    "四柱推命・西洋占星術・算命学・数秘術。4体系統合で読む、経営者のための自己理解フレームワーク。",
  openGraph: {
    title: "meishiki OS | 命式は、あなたのOSだ。",
    description:
      "四柱推命・西洋占星術・算命学・数秘術。4体系統合で読む、経営者のための自己理解フレームワーク。",
    siteName: "meishiki OS",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "meishiki OS | 命式は、あなたのOSだ。",
    description:
      "四柱推命・西洋占星術・算命学・数秘術。4体系統合で読む、経営者のための自己理解フレームワーク。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${cormorant.variable} ${noto.variable}`}>
      <body className="min-h-screen flex flex-col">
        <ReadingProgress />
        <Navigation />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
