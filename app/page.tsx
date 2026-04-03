import {
  TrionnCanvas,
  Banner,
  Vision,
  KeyFacts,
  Work,
} from "@/components/Sections/Home";
import { Orbit } from "@/components/Orbit";

const Page = () => {
  return (
    <>
      <div id="hero-section" className="bg-[#0C0C0C] overflow-hidden relative">
        <TrionnCanvas />
        <Banner />
        <Vision />
      </div>
      <KeyFacts />
      <Work />
      <Orbit />
    </>
  );
};

export default Page;
