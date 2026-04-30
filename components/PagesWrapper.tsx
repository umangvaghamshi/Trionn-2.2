import { headerSection } from "@/data";
import { SiteSoundProvider } from "@/components/SiteSoundContext";
import { Header, Footer } from "./PageWrapper";
import {
  TransitionProvider,
  PageLoader,
  PageTransition,
  PageTransitionWrapper,
} from "@/components/Transition";

export default async function PagesWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body cz-shortcut-listen="true" suppressHydrationWarning>
        <SiteSoundProvider>
          <TransitionProvider>
            <PageLoader />
            <PageTransition />
            <Header data={headerSection}></Header>
            <PageTransitionWrapper>
              <main className="relative z-1 overflow-x-hidden">{children}</main>
            </PageTransitionWrapper>
            <Footer />
          </TransitionProvider>
        </SiteSoundProvider>
      </body>
    </html>
  );
}
