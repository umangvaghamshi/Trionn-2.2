import type { Metadata, Viewport } from "next";
import PagesWrapper from "@/components/PagesWrapper";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import "./globals.css";
import SmoothScrolling from "@/components/SmoothScrolling";

export const viewport: Viewport = {
  themeColor: "#040508",
};

export const metadata: Metadata = {
  title: "TRIONN | AI-Powered Creative Design & Development Studio in India",
  description:
    "TRIONN is an independent AI-powered digital studio crafting meaningful brand experiences through strategy, design, and technology. Based in Rajkot, Gujarat, India, we create premium websites, immersive digital products, and interactive experiences for ambitious brands worldwide.",
  metadataBase: new URL("https://trionn.com"),
  // robots: {
  //   index: true,
  //   follow: true,
  //   "max-image-preview": "large",
  // },
  authors: [{ name: "TRIONN" }],
  openGraph: {
    type: "website",
    siteName: "TRIONN",
    locale: "en_US",
    images: [
      {
        url: "https://trionn.com/images/og-trionn.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://trionn.com/images/og-trionn.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PagesWrapper>
      <PerformanceMonitor />
      <SmoothScrolling>{children}</SmoothScrolling>
    </PagesWrapper>
  );
}
