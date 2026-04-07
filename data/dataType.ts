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