import { Banner, Vision, Work } from "@/components/Sections/Home";
import TrionnServices from "@/components/Sections/Home/TrionnServices";
import TrionnSymbolAnimation from "@/components/TrionnSymbolAnimation";

const Page = () => {
  return (
    <>
      <div id="hero-section" className="bg-[#0C0C0C] overflow-hidden relative">
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
      <Work />
      <TrionnServices />
      {/* <Orbit /> */}
    </>
  );
};

export default Page;
