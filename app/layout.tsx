import PagesWrapper from "@/components/PagesWrapper";
import SmoothScrolling from "@/components/SmoothScrolling";
import "./globals.css";

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
