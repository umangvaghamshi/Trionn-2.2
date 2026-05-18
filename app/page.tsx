import DribbleSection from "@/components/DribbleSection";
import {
  Banner,
  KeyFacts,
  Vision,
  WorkServicesSequence,
} from "@/components/Sections/Home";
import Testimonials from "@/components/Testimonials";
import TrionnSymbolAnimation from "@/components/TrionnSymbolAnimation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TRIONN | AI-Powered Creative Design & Development Studio in India",
  description:
    "TRIONN is an independent AI-powered digital studio crafting meaningful brand experiences through strategy, design, and technology. Based in Rajkot, Gujarat, India, we create premium websites, immersive digital products, and interactive experiences for ambitious brands worldwide.",
  keywords:
    "TRIONN, AI-powered digital studio, AI design studio, AI web development, AI website design, design and development studio, creative technology studio, digital experience studio, interactive web design, premium web design, award-winning web design, UI UX design studio, branding and development agency, creative development studio, motion design studio, immersive digital experiences, strategy-led design, custom website development, WebGL development studio, frontend development studio, digital product design, modern brand experiences, creative agency India, web design company India, digital studio Rajkot, creative studio Gujarat, AI agency India, premium digital agency, interactive experiences, technology-driven design",
  alternates: {
    canonical: "https://trionn.com/",
  },
  openGraph: {
    title: "TRIONN | AI-Powered Creative Design & Development Studio",
    description:
      "Independent AI-powered digital studio crafting premium brand experiences through strategy, design, and technology.",
    url: "https://trionn.com/",
  },
  twitter: {
    title: "TRIONN | AI-Powered Creative Design & Development Studio",
    description:
      "Independent AI-powered digital studio crafting premium brand experiences through strategy, design, and technology.",
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
            "@type": "Organization",
            name: "TRIONN",
            url: "https://trionn.com/",
            logo: "https://trionn.com/logo.png",
            description:
              "TRIONN is an independent AI-powered digital studio crafting meaningful brand experiences through strategy, design, and technology.",
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
          }),
        }}
      />
      <div
        id="hero-section"
        className="bg-[#0C0C0C] overflow-hidden relative hero-section"
      >
        <TrionnSymbolAnimation
          vibrateElementIds={[
            "nav",
            "s1-headline",
            "s1-sub",
            "s1-scroll",
            "s1-stats",
            "s1-box",
            "s1-cta",
          ]}
        />
        <Banner />
        <Vision />
        {/* Scroll gap to hold the vision section before key facts and stripes appear */}
        <div className="w-full h-[20dvh] md:h-dvh pointer-events-none bg-transparent" />
      </div>
      <KeyFacts />
      <WorkServicesSequence />
      <Testimonials showBottomLine />
      <DribbleSection />
    </>
  );
};

export default Page;
