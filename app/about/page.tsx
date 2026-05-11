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
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About TRIONN | Independent AI-Powered Creative Technology Studio",
  description:
    "Learn about TRIONN, an independent AI-powered digital studio based in Rajkot, Gujarat, India. We craft meaningful brand experiences through strategy, design, technology, and immersive digital innovation for ambitious brands worldwide.",
  keywords:
    "About TRIONN, AI-powered digital studio, creative technology studio, digital design studio India, strategy-led design studio, premium web design agency, interactive development studio, branding and development agency, award-winning digital studio, AI web development, creative development company, digital innovation studio, motion design studio, immersive digital experiences, UI UX design India, digital product studio, Rajkot digital studio, creative studio Gujarat, AI agency India, modern brand experiences",
  alternates: {
    canonical: "https://trionn.com/about",
  },
  openGraph: {
    title: "About TRIONN | Independent AI-Powered Creative Technology Studio",
    description:
      "Discover the philosophy, people, and creative process behind TRIONN’s immersive digital experiences.",
    url: "https://trionn.com/about",
  },
  twitter: {
    title: "About TRIONN | Independent AI-Powered Creative Technology Studio",
    description:
      "Discover the philosophy, people, and creative process behind TRIONN’s immersive digital experiences.",
  },
};

const Page = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "About TRIONN",
            url: "https://trionn.com/about",
            description:
              "Learn about TRIONN, an independent AI-powered creative technology studio focused on strategy-led design, immersive experiences, digital craftsmanship, and future-focused innovation.",
            publisher: {
              "@type": "Organization",
              name: "TRIONN",
              url: "https://trionn.com/",
              logo: "https://trionn.com/logo.png",
              founder: {
                "@type": "Person",
                name: "Sunny Rathod",
              },
              address: {
                "@type": "PostalAddress",
                streetAddress: "216-4Plus Complex, Astron Chowk",
                addressLocality: "Rajkot",
                addressRegion: "Gujarat",
                addressCountry: "India",
              },
              sameAs: [
                "https://www.linkedin.com/company/trionndesign",
                "https://www.instagram.com/trionndesign",
              ],
            },
          }),
        }}
      />
      <AboutHero />
      <AboutIntro />
      <PaperFold />
      <HowWork stripeCount={0} />
      <Founder />
      <AboutTeam />
      <WeNot />
      <Awards />
      <BrandShowcase />
      <Testimonials disableScrollEffect />
      <div className="min-h-dvh bg-[#0C0C0C]"></div>
    </>
  );
};

export default Page;
