import {
  TrionnCanvas,
  Banner,
  Vision,
  KeyFacts,
  Work,
} from "@/components/Sections/Home";
import { Orbit } from "@/components/Orbit";
import TrionnServices from "@/components/Sections/Home/TrionnServices";

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
      <TrionnServices />
      <Orbit />
    </>
  );
};

export default Page;
