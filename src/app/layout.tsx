import type { Metadata } from "next";
import { Inter, Oswald, Bebas_Neue, Sacramento } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

// Body text - clean, readable
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Headings, navigation, badges
const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// Taglines, condensed labels (uppercase)
const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

// Script accent for "magic" moments
const sacramento = Sacramento({
  variable: "--font-sacramento",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Pulltab Magic | Find the Win",
  description: "Find pull-tabs, e-tabs, bingo, and other charitable gambling locations near you in Minnesota.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${oswald.variable} ${bebasNeue.variable} ${sacramento.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
