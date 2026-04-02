import { workDataItem } from "./dataType";

export const headerSection = {
  logo: "/images/logo.svg",
};

export const menu = [
  {
    title: "work",
    url: "#",
  },
  {
    title: "Services",
    url: "#",
  },
  {
    title: "About",
    url: "#",
  },
  {
    title: "Contact",
    url: "#",
  },
];

export const social = [
  {
    title: "Linkedin",
    url: "http://www.linkedin.com/company/2715714",
  },
  {
    title: "Facebook",
    url: "https://www.facebook.com/trionnagency/",
  },
  {
    title: "Dribbble",
    url: "https://dribbble.com/trionndesign",
  },
  {
    title: "Instagram",
    url: "https://www.instagram.com/trionndesign/",
  },
];

export const enquiry = [
  {
    label: "E.",
    title: "hello@trionn.com",
    url: "mailto:hello@trionn.com",
  },
  {
    label: "P",
    title: "+91 98241 82099",
    url: "tel:+91 98241 82099",
  },
];

export const workData: workDataItem[] = [
  {
    id: 1,
    title: "Luxury Presence",
    subtitle: "Redefining digital presence for high-end real estate.",
    image: "/images/work-luxury-presence.webp",
    category: ["Website Design", "Branding"],
    year: "2025",
    link: {
      text: "Explore Project",
      href: "#",
    },
  },
  {
    id: 2,
    title: "Kuros",
    subtitle: "Building a bold visual system for a modern brand.",
    image: "/images/work-kuros.webp",
    category: ["UI/UX", "Web Development"],
    year: "2025",
    link: {
      text: "Explore Project",
      href: "#",
    },
  },
  {
    id: 3,
    title: "William Jonshan",
    subtitle: "Product-focused branding for a design-led company.",
    image: "/images/work-willam-jonshan.webp",
    category: ["Product Design", "Motion"],
    year: "2025",
    link: {
      text: "Explore Project",
      href: "#",
    },
  },
];
