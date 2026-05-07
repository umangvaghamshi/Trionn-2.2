import { Banner, Forms, FAQ } from "@/components/Sections/Contact";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact TRIONN | Start an AI-Powered Design & Development Project",
  description: "Contact TRIONN, an independent AI-powered digital studio based in Rajkot, Gujarat, India, to start a premium website, branding, UI/UX, WebGL, motion, or immersive digital experience project crafted through strategy, design, and technology.",
  keywords: "Contact TRIONN, hire TRIONN, start a project, AI-powered digital studio, design and development studio, web design inquiry, UI UX design agency, premium web design, creative technology studio, WebGL development studio, branding and development agency, digital product design, motion design studio, immersive digital experiences, custom website development, creative agency India, digital studio Rajkot, creative studio Gujarat, AI web development agency, strategy-led design",
  alternates: {
    canonical: "https://trionn.com/contact",
  },
  openGraph: {
    title: "Contact TRIONN | Start an AI-Powered Design & Development Project",
    description: "Start a premium website, branding, UI/UX, WebGL, motion, or immersive digital experience project with TRIONN, an independent AI-powered digital studio.",
    url: "https://trionn.com/contact",
  },
  twitter: {
    title: "Contact TRIONN | Start an AI-Powered Design & Development Project",
    description: "Start a premium website, branding, UI/UX, WebGL, motion, or immersive digital experience project with TRIONN.",
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
            "@type": "ContactPage",
            "name": "Contact TRIONN",
            "url": "https://trionn.com/contact",
            "description": "Contact TRIONN to start an AI-powered design, development, branding, UI/UX, WebGL, motion, or immersive digital experience project.",
            "mainEntity": {
              "@type": "Organization",
              "name": "TRIONN",
              "url": "https://trionn.com/",
              "logo": "https://trionn.com/logo.png",
              "email": "hello@trionn.com",
              "telephone": "+91 98241 82099",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "216-4Plus Complex, Astron Chowk",
                "addressLocality": "Rajkot",
                "addressRegion": "Gujarat",
                "addressCountry": "India"
              },
              "sameAs": [
                "https://www.linkedin.com/company/trionndesign",
                "https://www.instagram.com/trionndesign"
              ]
            }
          })
        }}
      />
      <Banner />
      <Forms />
      <FAQ />
      <div className="min-h-screen bg-[#0C0C0C]"></div>
    </>
  );
};

export default Page;
