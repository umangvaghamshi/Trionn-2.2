import {
  Banner,
  KeyFactsNew,
  Vision,
  WorkServicesSequence,
} from "@/components/Sections/Home";
import TrionnSymbolAnimation from "@/components/TrionnSymbolAnimation";
import Testimonials from "@/components/Testimonials";
import DribbleSection from "@/components/DribbleSection";

const Page = () => {
  return (
    <>
      <div
        id="hero-section"
        className="bg-[#0C0C0C] overflow-hidden relative hero-section"
      >
        <TrionnSymbolAnimation
          vibrateElementIds={[
            "nav",
            "s1-headline",
            "s1-sub",
            "s1-stats",
            "s1-body",
            "s1-cta",
          ]}
        />
        <Banner />
        <Vision />
        {/* Scroll gap to hold the vision section before key facts and stripes appear */}
        <div className="w-full h-[40vh] md:h-screen pointer-events-none bg-transparent" />
      </div>
      <KeyFactsNew />
      <WorkServicesSequence />
      <Testimonials showBottomLine />
      <DribbleSection />
    </>
  );
};

export default Page;
