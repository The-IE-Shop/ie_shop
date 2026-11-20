import type { Metadata } from "next";
import type { RootLayoutProps } from "@/types/localTypes";
import { Suspense } from "react";
import "./globals.css";
import "./error.css";
import { Birthstone } from "next/font/google";
import CartContextProvider from "@/components/CartContext";
import MetaPixel from "@/components/MetaPixel";

const birthstone = Birthstone ({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-birthstone",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "http://localhost:3000" || "http://localhost:3001"),
  title: "The IE Shop",
  description: "IE Shop official website",
  icons: {
    icon: "/images/green-ie-logo.png",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  openGraph: {
    title: "The IE Shop",
    description: "Official site for the IE Shop",
    url: process.env.NEXT_PUBLIC_URL || "http://localhost:3000" || "http://localhost:3001",
    siteName: "IE Shop",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "IE Shops Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${birthstone.variable}`}
    >
      <body>
        <Suspense fallback={null}>
          <MetaPixel />
        </Suspense>
        <CartContextProvider>
          {children}
        </CartContextProvider>
      </body>
    </html>
  );
}