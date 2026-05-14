import HowWork from "@/components/HowWork";
import Services from "@/components/Services";
import ServicesOrbitExperienceV2 from "@/components/ServicesOrbit/ServicesOrbitExperienceV2";
import Technology from "@/components/Technology";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Services | AI-Powered Design, Development & Creative Technology | TRIONN",
  description:
    "TRIONN is an independent AI-powered digital studio delivering premium design, UI/UX, branding, web development, WebGL, motion, and immersive digital experiences through strategy, creativity, and technology for ambitious brands worldwide.",
  keywords:
    "TRIONN services, AI-powered digital studio, AI-powered design services, AI web development services, AI website design, UI UX design services, premium web design, design and development studio, creative technology studio, creative technology services, immersive digital experiences, interactive website development, WebGL development studio, frontend development studio, motion design studio, branding and development agency, digital product design, strategy-led design, custom website development, premium digital experiences, creative development studio, award-winning web design, digital innovation studio, web development company India, creative agency India, digital studio Rajkot, creative studio Gujarat, AI agency India, modern brand experiences",
  alternates: {
    canonical: "https://trionn.com/services",
  },
  openGraph: {
    title:
      "Services | AI-Powered Design, Development & Creative Technology | TRIONN",
    description:
      "AI-powered design, development, branding, WebGL, motion, and immersive digital experience services for modern brands.",
    url: "https://trionn.com/services",
  },
  twitter: {
    title:
      "Services | AI-Powered Design, Development & Creative Technology | TRIONN",
    description:
      "AI-powered design, development, branding, WebGL, motion, and immersive digital experience services for modern brands.",
  },
};

export default function ServicesOrbitPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "AI-Powered Design, Development and Creative Technology Services",
            url: "https://trionn.com/services",
            description:
              "TRIONN provides AI-powered design, UI/UX, web development, branding, creative technology, WebGL, motion, and immersive digital experience services.",
            provider: {
              "@type": "Organization",
              name: "TRIONN",
              url: "https://trionn.com/",
              logo: "https://trionn.com/logo.png",
              address: {
                "@type": "PostalAddress",
                streetAddress: "216-4Plus Complex, Astron Chowk",
                addressLocality: "Rajkot",
                addressRegion: "Gujarat",
                addressCountry: "India",
              },
            },
            areaServed: [
              {
                "@type": "Country",
                name: "India",
              },
              {
                "@type": "Place",
                name: "Worldwide",
              },
            ],
            serviceType: [
              "AI-Powered Design",
              "UI/UX Design",
              "Web Design",
              "Web Development",
              "Creative Technology",
              "WebGL Development",
              "Motion Design",
              "Branding",
              "Digital Product Design",
              "Immersive Digital Experiences",
            ],
          }),
        }}
      />
      <ServicesOrbitExperienceV2 />
      <Services />
      <Technology />
      <HowWork theme="light" />
      <div className="h-dvh" />
    </>
  );
}
