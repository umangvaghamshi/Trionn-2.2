import { headerSection } from "@/data";
import { SiteSoundProvider } from "@/components/SiteSoundContext";
import { Header, Footer } from "./PageWrapper";
export default async function PagesWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body cz-shortcut-listen="true">
        <SiteSoundProvider>
          <Header data={headerSection}></Header>
          <main className="relative z-1 overflow-x-hidden">{children}</main>
          <Footer />
        </SiteSoundProvider>
      </body>
    </html>
  );
}
