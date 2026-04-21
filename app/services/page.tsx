import HowWork from "@/components/HowWork";
import Services from "@/components/Services";
import ServicesOrbitExperience from "@/components/ServicesOrbit/ServicesOrbitExperience";
import Technology from "@/components/Technology";

export default function ServicesOrbitPage() {
  return (
    <>
    <ServicesOrbitExperience />
    <Services />
    <Technology />
    <HowWork />
    <div className="h-screen" />
    </>
  ); 
}
