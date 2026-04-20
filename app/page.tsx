import { Banner, KeyFactsNew, Vision, WorkServicesSequence } from "@/components/Sections/Home";
import TrionnSymbolAnimation from "@/components/TrionnSymbolAnimation";
import Testimonials from "@/components/Testimonials";
import ScheduleButton from "@/components/ScheduleButton";
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
            "s2-text",
            "s3-text",
          ]}
        />
        <Banner />
        <Vision />
      </div>
      <KeyFactsNew />
      <WorkServicesSequence />
      <Testimonials />
      <DribbleSection/>
      <ScheduleButton />
    </>
  );
};

export default Page;
