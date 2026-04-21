import { StaticImageData } from 'next/image';

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