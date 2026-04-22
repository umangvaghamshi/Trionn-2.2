import { workDataItem, TestimonialsDataItem, HowWorkType, WeNotType, FaqItemType } from "./dataType";

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
    url: "/services",
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

export const ServicesListData = [
  {
    title: 'Product Design',
    description:
      'We design digital products by aligning user needs, business goals, and system logic. Every decision is guided by clarity, usability, and long-term value.',
    subText: 'Closely shaped alongside <br/>strategy and development.',
    imgUrl: '/images/service.jpg',
    capabilities: [
      { capabilitiesItem: 'Product strategy' },
      { capabilitiesItem: 'Interface design' },
      { capabilitiesItem: 'UX architecture' },
      { capabilitiesItem: 'Design system' },
      { capabilitiesItem: 'Prototyping & validation' },
      { capabilitiesItem: 'AI integrations for websites & web apps' },
    ],
  },
  {
    title: 'Website & Mobile Design',
    description:
      'We craft responsive digital experiences that feel natural across screens. Design systems are built to remain flexible as products evolve.',
    subText: 'Designed to perform <br/>consistently on every device.',
    imgUrl: '/images/service.jpg',
    capabilities: [
      { capabilitiesItem: 'High-fidelity web designs' },
      { capabilitiesItem: 'mobile app designs' },
      { capabilitiesItem: 'Lo-fi mockups & wireframes' },
      { capabilitiesItem: 'Responsive designs' },
      { capabilitiesItem: 'UX/UI design' },
      { capabilitiesItem: 'Customized design solutions' },
    ],
  },
  {
    title: 'WordPress Development',
    description:
      'We develop custom WordPress solutions focused on performance and control. Clean architecture ensures ease of management and scalability.',
    subText: 'Built to adapt as content <br/>and products grow.',
    imgUrl: '/images/service.jpg',
    capabilities: [
      { capabilitiesItem: 'Websites' },
      { capabilitiesItem: 'Landing pages' },
      { capabilitiesItem: 'Web apps' },
      { capabilitiesItem: 'Custom development solutions' },
      { capabilitiesItem: 'Integrations' },
      { capabilitiesItem: 'Support' },
    ],
  },
  {
    title: 'Web Development',
    description:
      'We build robust web applications with performance at the core. Our focus remains on reliability, security, and scalability.',
    subText: 'Engineered to support <br/>complex digital products.',
    imgUrl: '/images/service.jpg',
    capabilities: [
      { capabilitiesItem: 'Frontend development' },
      { capabilitiesItem: 'Backend development' },
      { capabilitiesItem: 'Cloud Infrastructure & DevOps' },
      { capabilitiesItem: 'Software architecture consultancy' },
    ],
  },
  {
    title: 'AI & Intelligent Automation',
    description:
      'We implement intelligent automation to simplify digital workflows. Systems are designed to enhance efficiency without adding complexity.',
    subText: 'Integrated seamlessly into <br/>existing platforms.',
    imgUrl: '/images/service.jpg',
    capabilities: [
      { capabilitiesItem: 'AI-powered chatbots & assistants' },
      { capabilitiesItem: 'Content generation' },
      { capabilitiesItem: 'AI-driven search & recommendations' },
      { capabilitiesItem: 'AI workflow automation with n8n' },
      { capabilitiesItem: 'AI integrations for websites & web apps' },
      { capabilitiesItem: 'Custom development solutions' },
    ],
  },
  {
    title: 'Branding',
    description:
      'We create visual identities rooted in clarity and consistency. Every element is designed to work across digital environments.',
    subText: 'Built to extend across <br/>products and experiences.',
    imgUrl: '/images/service.jpg',
    capabilities: [
      { capabilitiesItem: 'Branding' },
      { capabilitiesItem: 'Brand guidelines & brandbook' },
      { capabilitiesItem: 'Creative direction' },
      { capabilitiesItem: 'Identity design' },
      { capabilitiesItem: 'logo design' },
    ],
  },
];

export const faqData: FaqItemType[] = [
  {
    title: 'Front-end',
    content:
      'Inspiring product design drives attention, increases interaction, and fosters loyalty, positioning you ahead of the competition.',
  },
  {
    title: 'Back-end',
    content:
      'Our website and mobile app designs deliver exceptional quality and creative mastery, built to attract and keep users coming back.',
  },
  {
    title: 'Databases & Content Management',
    content:
      'Impactful branding positions startups for success, signaling credibility and earning audience loyalty.',
  },
  {
    title: 'Cloud Services',
    content:
      'Successful marketing design captures attention, conveys your brand&apos;s essence, and inspires trust in its value.',
  },
  {
    title: 'DevOps & Infrastructure',
    content:
      'Our WordPress development delivers more than design—it crafts experiences that engage visitors and turn them into loyal users.',
  },
  {
    title: 'AI & Intelligent Automation',
    content:
      'Develop digital products faster and more cost-effectively with a product-focused, design-conscious partner dedicated to your success.',
  },
  {
    title: 'Marketing, Email & Integrations',
    content:
      'Exceptional product design sparks curiosity, drives meaningful interactions, and builds lasting loyalty-empowering your brand.',
  },
];