import {
  TrionnCanvas,
  Banner,
  Vision,
  KeyFacts,
  Work,
} from "@/components/Sections/Home";

const Page = () => {
  return (
    <>
      <div className="bg-[#0C0C0C] overflow-hidden">
        <TrionnCanvas />
        <Banner />
        <Vision />
      </div>
      <KeyFacts />
      <Work />
    </>
  );
};

export default Page;
