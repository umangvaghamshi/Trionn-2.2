import { Banner, Vision, KeyFactsNew, Work } from "@/components/Sections/Home";
import TrionnServices from "@/components/Sections/Home/TrionnServices";
import TrionnSymbolAnimation from "@/components/TrionnSymbolAnimation";
import Testimonials from "@/components/Testimonials";
import { Orbit } from "@/components/Orbit";

const Page = () => {
  return (
    <>
      <div id="hero-section" className="bg-[#0C0C0C] overflow-hidden relative">
        <TrionnSymbolAnimation />
        <Banner />
        <Vision />
      </div>
      <KeyFactsNew />
      <Work />
      <TrionnServices />
      <Testimonials />
      <Orbit />
    </>
  );
};

export default Page;
