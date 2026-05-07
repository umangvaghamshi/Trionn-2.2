import OurWorkListing from "@/components/OurWorkListing/OurWorkListing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work | Award-Winning AI-Powered Digital Experiences & Websites | TRIONN",
  description: "TRIONN is an independent AI-powered digital studio showcasing award-winning websites, immersive digital experiences, branding, WebGL interactions, and creative technology projects crafted through strategy, design, and innovation for ambitious brands worldwide.",
  keywords: "TRIONN work, TRIONN portfolio, award-winning websites, AI-powered digital experiences, immersive websites, creative technology projects, WebGL experiences, interactive website design, premium web design, UI UX portfolio, branding projects, digital product design, motion design studio, frontend development studio, creative development projects, strategy-led design, AI website design, digital innovation studio, modern brand experiences, interactive digital experiences, premium digital agency, web design company India, creative agency India, digital studio Rajkot, creative studio Gujarat",
  alternates: {
    canonical: "https://trionn.com/work",
  },
  openGraph: {
    title: "Work | Award-Winning AI-Powered Digital Experiences & Websites | TRIONN",
    description: "Discover TRIONN’s portfolio of immersive AI-powered websites, creative technology projects, branding, WebGL experiences, and premium digital products.",
    url: "https://trionn.com/work",
  },
  twitter: {
    title: "Work | Award-Winning AI-Powered Digital Experiences & Websites | TRIONN",
    description: "Discover TRIONN’s portfolio of immersive AI-powered websites, creative technology projects, branding, WebGL experiences, and premium digital products.",
  },
};

export default function Page() {
  return(
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "TRIONN Work",
            "url": "https://trionn.com/work",
            "description": "Portfolio of award-winning AI-powered websites, immersive digital experiences, branding, WebGL interactions, and creative technology projects by TRIONN.",
            "publisher": {
              "@type": "Organization",
              "name": "TRIONN",
              "url": "https://trionn.com/",
              "logo": "https://trionn.com/logo.png",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "216-4Plus Complex, Astron Chowk",
                "addressLocality": "Rajkot",
                "addressRegion": "Gujarat",
                "addressCountry": "India"
              }
            }
          })
        }}
      />
    <OurWorkListing />
    <div className="min-h-screen bg-[#0C0C0C]"></div>
    </>
  );
}
