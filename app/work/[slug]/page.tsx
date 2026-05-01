import ProjectDetailPage from "./ProjectDetailPage";
import { projects } from "@/data";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) return <h1>Project not found</h1>;

  return (
    <>
      <ProjectDetailPage project={project} />
      <div className="min-h-screen bg-[#0C0C0C]"></div>
    </>
  );
}
