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
    <html lang="en" suppressHydrationWarning style={{ backgroundColor: '#040508' }}>
      <body cz-shortcut-listen="true" suppressHydrationWarning style={{ backgroundColor: '#040508' }}>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.style.backgroundColor = "#040508"; document.body.style.backgroundColor = "#040508";`,
          }}
        />
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
