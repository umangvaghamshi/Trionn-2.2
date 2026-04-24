import {
  workDataItem,
  TestimonialsDataItem,
  HowWorkType,
  WeNotType,
  TechFaqItemType,
} from "./dataType";

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
    title: "Understand",
    content: `We begin by listening. Understanding your vision, challenges, and context allows us to define the right problem before designing the solution.`,
  },
  {
    id: 2,
    title: "Design & Build",
    content: `We translate insight into systems — shaping thoughtful design, refined interactions, and robust execution with care and precision.`,
  },
  {
    id: 3,
    title: "Refine & Evolve",
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
    title: "Product Design",
    description:
      "We design digital products by aligning user needs, business goals, and system logic. Every decision is guided by clarity, usability, and long-term value.",
    subText: "Closely shaped alongside <br/>strategy and development.",
    imgUrl: "/images/service.jpg",
    capabilities: [
      { capabilitiesItem: "Product strategy" },
      { capabilitiesItem: "Interface design" },
      { capabilitiesItem: "UX architecture" },
      { capabilitiesItem: "Design system" },
      { capabilitiesItem: "Prototyping & validation" },
      { capabilitiesItem: "AI integrations for websites & web apps" },
    ],
  },
  {
    title: "Website & Mobile Design",
    description:
      "We craft responsive digital experiences that feel natural across screens. Design systems are built to remain flexible as products evolve.",
    subText: "Designed to perform <br/>consistently on every device.",
    imgUrl: "/images/service.jpg",
    capabilities: [
      { capabilitiesItem: "High-fidelity web designs" },
      { capabilitiesItem: "mobile app designs" },
      { capabilitiesItem: "Lo-fi mockups & wireframes" },
      { capabilitiesItem: "Responsive designs" },
      { capabilitiesItem: "UX/UI design" },
      { capabilitiesItem: "Customized design solutions" },
    ],
  },
  {
    title: "WordPress Development",
    description:
      "We develop custom WordPress solutions focused on performance and control. Clean architecture ensures ease of management and scalability.",
    subText: "Built to adapt as content <br/>and products grow.",
    imgUrl: "/images/service.jpg",
    capabilities: [
      { capabilitiesItem: "Websites" },
      { capabilitiesItem: "Landing pages" },
      { capabilitiesItem: "Web apps" },
      { capabilitiesItem: "Custom development solutions" },
      { capabilitiesItem: "Integrations" },
      { capabilitiesItem: "Support" },
    ],
  },
  {
    title: "Web Development",
    description:
      "We build robust web applications with performance at the core. Our focus remains on reliability, security, and scalability.",
    subText: "Engineered to support <br/>complex digital products.",
    imgUrl: "/images/service.jpg",
    capabilities: [
      { capabilitiesItem: "Frontend development" },
      { capabilitiesItem: "Backend development" },
      { capabilitiesItem: "Cloud Infrastructure & DevOps" },
      { capabilitiesItem: "Software architecture consultancy" },
    ],
  },
  {
    title: "AI & Intelligent Automation",
    description:
      "We implement intelligent automation to simplify digital workflows. Systems are designed to enhance efficiency without adding complexity.",
    subText: "Integrated seamlessly into <br/>existing platforms.",
    imgUrl: "/images/service.jpg",
    capabilities: [
      { capabilitiesItem: "AI-powered chatbots & assistants" },
      { capabilitiesItem: "Content generation" },
      { capabilitiesItem: "AI-driven search & recommendations" },
      { capabilitiesItem: "AI workflow automation with n8n" },
      { capabilitiesItem: "AI integrations for websites & web apps" },
      { capabilitiesItem: "Custom development solutions" },
    ],
  },
  {
    title: "Branding",
    description:
      "We create visual identities rooted in clarity and consistency. Every element is designed to work across digital environments.",
    subText: "Built to extend across <br/>products and experiences.",
    imgUrl: "/images/service.jpg",
    capabilities: [
      { capabilitiesItem: "Branding" },
      { capabilitiesItem: "Brand guidelines & brandbook" },
      { capabilitiesItem: "Creative direction" },
      { capabilitiesItem: "Identity design" },
      { capabilitiesItem: "logo design" },
    ],
  },
];

export const faqData: TechFaqItemType[] = [
  {
    title: "Front-end",
    content: [
      {
        heading: "Frameworks & Libraries",
        items: ["React.js", "JavaScript (ES6+)", "jQuery", "GSAP"],
      },
      {
        heading: "Styling & UI",
        items: ["Bootstrap", "Tailwind CSS", "Sass (SCSS)", "LESS"],
      },
      {
        heading: "Web & Animation",
        items: [
          "Animated Websites",
          "Interactive UI / Motion Design",
          "Responsive & Performance-Optimized Frontends",
        ],
      },
    ],
  },
  {
    title: "Back-end",
    content: [
      {
        heading: "Languages & Runtime",
        items: ["PHP", "Node.js"],
      },
      {
        heading: "Frameworks",
        items: ["Express.js"],
      },
      {
        heading: "Platforms & Systems",
        items: ["Magento", "WordPress"],
      },
      {
        heading: "APIs & Integrations",
        items: ["REST APIs", "Headless architecture support"],
      },
    ],
  },
  {
    title: "Databases & Content Management",
    content: [
      {
        heading: "Databases",
        items: ["MySQL", "MongoDB"],
      },
      {
        heading: "Headless / CMS",
        items: ["Contentful", "WordPress CMS", "HubSpot CMS"],
      },
    ],
  },
  {
    title: "Cloud Services",
    content: [
      {
        heading: "Cloud Platforms",
        items: [
          "Amazon Web Services (AWS)",
          "Google Cloud Platform (GCP)",
          "DigitalOcean",
        ],
      },
      {
        heading: "Cloud Capabilities",
        items: [
          "Scalable cloud hosting",
          "Managed databases",
          "Cloud-based deployments",
        ],
      },
    ],
  },
  {
    title: "DevOps & Infrastructure",
    content: [
      {
        heading: "Version Control",
        items: ["Git", "GitHub"],
      },
      {
        heading: "CI / CD",
        items: ["GitHub Actions"],
      },
      {
        heading: "Automation & Workflows",
        items: ["n8n (Workflow Automation)"],
      },
    ],
  },
  {
    title: "AI & Intelligent Automation",
    content: [
      {
        heading: "AI Platforms & APIs",
        items: [
          "OpenAI API (GPT models)",
          "OpenAI SDK (Node.js / PHP integrations)",
        ],
      },
      {
        heading: "AI Capabilities",
        items: [
          "AI-powered chatbots & assistants",
          "Content generation (text, email, CMS content)",
          "AI-driven search & recommendations",
          "AI workflow automation with n8n",
          "AI integrations for websites & web apps",
        ],
      },
    ],
  },
  {
    title: "Marketing, Email & Integrations",
    content: [
      {
        heading: "Email & Communication",
        items: [
          "HubSpot",
          "HubSpot Email Templates",
          "SendGrid Email Templates",
        ],
      },
      {
        heading: "Marketing Automation",
        items: ["CRM & Email Automation", "API-driven campaign workflows"],
      },
    ],
  },
];
