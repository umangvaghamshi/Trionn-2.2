import Awards from "@/components/Awards";
import { BrandShowcase } from "@/components/BrandShowcase";
import HowWork from "@/components/HowWork";
import { PaperFold } from "@/components/PaperFold";
import {
  AboutHero,
  AboutIntro,
  Founder,
  AboutTeam,
} from "@/components/Sections/About";
import Testimonials from "@/components/Testimonials";
import WeNot from "@/components/WeNot";

const Page = () => {
  return (
    <div>
      <AboutHero />
      <AboutIntro />
      <PaperFold />
      <HowWork stripeImage="/images/founder.webp" />
      <Founder />
      <AboutTeam />
      <WeNot />
      <Awards />
      <BrandShowcase />
      <Testimonials disableScrollEffect />
      <div className="min-h-screen bg-[#0C0C0C]"></div>
    </div>
  );
};

export default Page;
