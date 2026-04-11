import { headerSection } from "@/data";
import { Header, Footer } from "./PageWrapper";
export default async function PagesWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body cz-shortcut-listen="true">
        {/* <Header data={headerSection}></Header>
        <main className="overflow-hidden">{children}</main>
        <Footer /> */}
      </body>
    </html>
  );
}
