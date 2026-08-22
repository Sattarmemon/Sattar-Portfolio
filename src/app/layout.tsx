import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, DM_Mono, Cormorant_Garamond, Archivo_Black } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import MotionDirector from "@/components/MotionDirector";

const playfair = Playfair_Display({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  subsets: ["latin"],
  weight: ["400"],
});

const dmMono = DM_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Sattar Memon — UI/UX Designer",
  description:
    "Sattar Memon, a UI/UX & Graphic Designer with 3.6+ years of experience crafting digital products across Healthcare, SaaS, FinTech, E-commerce and Logistics.",
  openGraph: {
    title: "Sattar Memon — UI/UX Designer",
    description:
      "3.6+ years designing intuitive digital products across Healthcare, SaaS, FinTech, E-commerce and Logistics.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${playfair.variable} ${cormorant.variable} ${dmSans.variable} ${archivoBlack.variable} ${dmMono.variable} antialiased`}
      >
        <Header />
        <PageLoader />
        <MotionDirector />
        {children}
        <Footer />
      </body>
    </html>
  );
}
