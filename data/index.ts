import { workDataItem, TestimonialsDataItem, HowWorkType, WeNotType } from "./dataType";

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
    url: "/about",
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

export const partnersLogo = [
  { logo: "/images/partner1.svg", widthClass: "w-[5.5rem]" },
  { logo: "/images/partner2.svg", widthClass: "w-[6.75rem]" },
  { logo: "/images/partner3.svg", widthClass: "w-[6.5rem]" },
  { logo: "/images/partner4.svg", widthClass: "w-[6.75rem]" },
  { logo: "/images/partner5.svg", widthClass: "w-[5.625rem]" },
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

export const TestimonialsData: TestimonialsDataItem[] = [
  {
    companyName: "Luxury presence",
    quoteMessage:
      "I've worked with Trionn on several projects and  he's one of the best UI/UX designers and front-end developers I know. He's meticulous in his attention to detail and has a true passion for  creating beautiful user interfaces.",
    clientImage: "/images/malte.jpg",
    clientName: "Malte Smith",
    clientDeg: "Founder and CEO",
    videoURL: "",
  },
  {
    companyName: "credible",
    quoteMessage:
      "The Trionn team is extremely reliable, professional & talented. It has been a great pleasure collaborating with them over many months.",
    clientImage: "/images/stephen.jpg",
    clientName: "Stephen Dash",
    clientDeg: "Founder and CEO",
    videoURL: "",
  },
  {
    companyName: "Indian Army",
    quoteMessage:
      "Our team is a small group of curious individuals dedicated to creating  work that we're proud of, collaborating with brands and people who share  our values. ",
    clientImage: "/images/malte.jpg",
    clientName: "Malte Smith",
    clientDeg: "Founder and CEO",
    videoURL: "",
  },
  {
    companyName: "Linkedin",
    quoteMessage:
      "The Trionn team is extremely reliable, professional & talented. It has been a great pleasure collaborating with them over many months.",
    clientImage: "/images/stephen.jpg",
    clientName: "Stephen Dash",
    clientDeg: "Founder and CEO",
    videoURL: "",
  },
  {
    companyName: "Bulklet Army",
    quoteMessage:
      "Our team is a small group of curious individuals dedicated to creating  work that we're proud of, collaborating with brands and people who share  our values. ",
    clientImage: "/images/malte.jpg",
    clientName: "Malte Smith",
    clientDeg: "Founder and CEO",
    videoURL: "",
  },
  {
    companyName: "Technis INC",
    quoteMessage:
      "The Trionn team is extremely reliable, professional & talented. It has been a great pleasure collaborating with them over many months.",
    clientImage: "/images/stephen.jpg",
    clientName: "Stephen Dash",
    clientDeg: "Founder and CEO",
    videoURL: "",
  },
];

export const HowWorkData: HowWorkType[] = [
  {
    id: 1,
    title: 'Understand',
    content: `We begin by listening. Understanding your vision, challenges, and context allows us to define the right problem before designing the solution.`,
  },
  {
    id: 2,
    title: 'Design & Build',
    content: `We translate insight into systems — shaping thoughtful design, refined interactions, and robust execution with care and precision.`,
  },
  {
    id: 3,
    title: 'Refine & Evolve',
    content: `Through iteration and detail-driven refinement, we deliver work that's purposeful, scalable, and built to stand the test of time.`,
  },
];

export const WeNotData: WeNotType[] = [
  {
    id: 0,
    content: `We don't do disposable design, endless <br/>revisions without direction, or work that <br/>exists only to “look good.”`,
  },
  {
    id: 1,
    content: `We're not for projects driven by urgency <br/>over understanding, or decisions made <br/>without purpose.`,
  },
  {
    id: 2,
    content: `We partner with teams who care about outcomes, trust the process, and are committed to building something meaningful — together.`,
  },
];