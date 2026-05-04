import HowWork from "@/components/HowWork";
import Services from "@/components/Services";
import ServicesOrbitExperienceV2 from "@/components/ServicesOrbit/ServicesOrbitExperienceV2";
import Technology from "@/components/Technology";

export default function ServicesOrbitPage() {
  return (
    <>
      <ServicesOrbitExperienceV2 />
      <Services />
      <Technology />
      <HowWork theme="light" />
      <div className="h-screen" />
    </>
  );
}
