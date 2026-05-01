import { StaticImageData } from "next/image";

export type workDataItem = {
  id: number | string;
  title: string;
  subtitle: string;
  image: string;
  category: string[];
  year: string;
  link: {
    text: string;
    href: string;
  };
};

export type TestimonialsDataItem = {
  companyName: string;
  quoteMessage: string;
  clientImage: StaticImageData | string;
  clientName: string;
  clientDeg: string;
  videoURL?: string;
};

export type HowWorkType = {
  id: number | string;
  title: string;
  content: string;
};

export type WeNotType = {
  id: number | string;
  content: string;
};

export type FaqItemType = {
  title: string;
  content: string[] | string;
};

export type TechCategory = {
  heading: string;
  items: string[];
};
export type TechFaqItemType = {
  title: string;
  content: TechCategory[];
};

export type TabData = {
  id: string;
  label: string;
  content: string;
};
export type ProjectContent = {
  image: string;
  layout: "single" | "grid";
};

export type ProjectsType = {
  visibleInHome?: boolean;
  pos: "left" | "right" | "center";
  size: "small" | "medium" | "large" | "xlarge";
  title: string;
  subTitle: string;
  year: string;
  image: string;
  category: string[];
  slug: string;
  tabs: TabData[];
  liveURL?: string;
  content: ProjectContent[];
};
