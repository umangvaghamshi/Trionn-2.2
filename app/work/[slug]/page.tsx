import ProjectDetailPage from "./ProjectDetailPage";
import { projects } from "@/data";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: "Projects | AI-Powered Digital Experiences & Creative Technology | TRIONN",
    description: "TRIONN is an independent AI-powered digital studio showcasing premium websites, immersive digital experiences, branding, WebGL interactions, UI/UX systems, and creative technology projects crafted through strategy, design, and innovation for ambitious brands worldwide.",
    keywords: "TRIONN projects, TRIONN case studies, AI-powered digital experiences, immersive websites, premium web design, creative technology projects, WebGL interactions, UI UX case studies, branding projects, digital product design, frontend development studio, motion design studio, interactive experiences, strategy-led design, AI website design, creative development studio, award-winning websites, digital innovation studio, modern brand experiences, immersive digital products, web design company India, creative agency India, digital studio Rajkot, creative studio Gujarat",
    alternates: {
      canonical: `https://trionn.com/work/${slug}`,
    },
    openGraph: {
      title: "Projects | AI-Powered Digital Experiences & Creative Technology | TRIONN",
      description: "TRIONN is an independent AI-powered digital studio showcasing premium websites, immersive digital experiences, branding, WebGL interactions, UI/UX systems, and creative technology projects crafted through strategy, design, and innovation for ambitious brands worldwide.",
      url: `https://trionn.com/work/${slug}`,
    },
    twitter: {
      title: "Projects | AI-Powered Digital Experiences & Creative Technology | TRIONN",
      description: "TRIONN is an independent AI-powered digital studio showcasing premium websites, immersive digital experiences, branding, WebGL interactions, UI/UX systems, and creative technology projects crafted through strategy, design, and innovation for ambitious brands worldwide.",
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const projectIndex = projects.findIndex((p) => p.slug === slug);
  const project = projects[projectIndex];

  if (!project) return <h1>Project not found</h1>;

  const prevProject = projectIndex > 0 ? projects[projectIndex - 1] : null;
  const nextProject = projectIndex < projects.length - 1 ? projects[projectIndex + 1] : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            "name": "TRIONN Project",
            "url": `https://trionn.com/work/${slug}`,
            "description": "Premium AI-powered digital experience, branding, UI/UX, WebGL interaction, and creative technology project crafted by TRIONN.",
            "creator": {
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
            },
            "publisher": {
              "@type": "Organization",
              "name": "TRIONN"
            }
          })
        }}
      />
      <ProjectDetailPage project={project} prevProject={prevProject} nextProject={nextProject} />
      <div className="min-h-dvh bg-[#0C0C0C]"></div>
    </>
  );
}
