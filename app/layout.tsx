import type { Metadata } from "next";
import PagesWrapper from "@/components/PagesWrapper";
import SmoothScrolling from "@/components/SmoothScrolling";
import "./globals.css";

export const metadata: Metadata = {
  title: "TRIONN | Crafting Award-Winning Digital Journeys.",
  description:
    "Trionn® - Redefining Digital Creativity: Your Partner for UI/UX, Mobile App, Web App, Branding, Creative Website Design, and Custom Development in Rajkot, Gujarat, India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PagesWrapper>
      <SmoothScrolling>{children}</SmoothScrolling>
    </PagesWrapper>
  );
}
