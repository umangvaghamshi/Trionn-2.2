import {
  workDataItem,
  TestimonialsDataItem,
  HowWorkType,
  WeNotType,
  TechFaqItemType,
  ProjectsType,
} from "./dataType";

export const headerSection = {
  logo: "/images/logo.svg",
};

export const menu = [
  {
    title: "work",
    url: "/work",
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

export const projects: ProjectsType[] = [
  {
    visibleInHome: true,
    pos: "left",
    size: "large",
    title: "Loftloom",
    subTitle:
      "A focused digital project designed to bring clarity, motion, and structure to a growing product ecosystem.",
    year: "2025",
    image: "/images/projects/loftloom/loftloom.webp",
    category: ["Brand", "Website", "Digital System"],
    slug: "loftloom",
    tabs: [
      {
        id: "challenge",
        label: "THE CHALLENGE",
        content:
          "The goal was to translate a complex idea into a clear, scalable digital experience — without losing personality or intent.",
      },
      {
        id: "approach",
        label: "APPROACH",
        content:
          "We focused on iterative design sprints and deep user research to ensure every touchpoint felt intentional.",
      },
      {
        id: "outcome",
        label: "OUTCOME",
        content:
          "A 40% increase in user engagement and a design system that scales across multiple product lines.",
      },
    ],
    liveURL: "#",
    content: [
      {
        image: "/images/projects/loftloom/loftloom-1.webp",
        layout: "single",
      },
      {
        image: "/images/projects/loftloom/loftloom-2_1.webp",
        layout: "grid",
      },
      {
        image: "/images/projects/loftloom/loftloom-2_2.webp",
        layout: "grid",
      },
      {
        image: "/images/projects/loftloom/loftloom-3.webp",
        layout: "single",
      },
      {
        image: "/images/projects/loftloom/loftloom-4.webp",
        layout: "single",
      },
      {
        image: "/images/projects/loftloom/loftloom-5.webp",
        layout: "single",
      },
      {
        image: "/images/projects/loftloom/loftloom-6.webp",
        layout: "single",
      },
    ],
  },
  {
    visibleInHome: true,
    pos: "right",
    size: "medium",
    title: "Pulse Studio",
    subTitle:
      "A focused digital project designed to bring clarity, motion, and structure to a growing product ecosystem.",
    year: "2025",
    image: "/images/projects/pulse-studio/pulse-studio.webp",
    category: ["Brand", "Website", "Digital System"],
    slug: "pulse-studio",
    tabs: [
      {
        id: "challenge",
        label: "THE CHALLENGE",
        content:
          "The goal was to translate a complex idea into a clear, scalable digital experience — without losing personality or intent.",
      },
      {
        id: "approach",
        label: "APPROACH",
        content:
          "We focused on iterative design sprints and deep user research to ensure every touchpoint felt intentional.",
      },
      {
        id: "outcome",
        label: "OUTCOME",
        content:
          "A 40% increase in user engagement and a design system that scales across multiple product lines.",
      },
    ],
    liveURL: "#",
    content: [
      {
        image: "/images/projects/pulse-studio/pulse-studio-1.webp",
        layout: "single",
      },
      {
        image: "/images/projects/pulse-studio/pulse-studio-2.webp",
        layout: "single",
      },
      {
        image: "/images/projects/pulse-studio/pulse-studio-3_1.webp",
        layout: "grid",
      },
      {
        image: "/images/projects/pulse-studio/pulse-studio-3_2.webp",
        layout: "grid",
      },
      {
        image: "/images/projects/pulse-studio/pulse-studio-4.webp",
        layout: "single",
      },
      {
        image: "/images/projects/pulse-studio/pulse-studio-5.webp",
        layout: "single",
      },
      {
        image: "/images/projects/pulse-studio/pulse-studio-6.webp",
        layout: "single",
      },
      {
        image: "/images/projects/pulse-studio/pulse-studio-7.webp",
        layout: "single",
      },
      {
        image: "/images/projects/pulse-studio/pulse-studio-8.webp",
        layout: "single",
      },
      {
        image: "/images/projects/pulse-studio/pulse-studio-9.webp",
        layout: "single",
      },
    ],
  },
  {
    visibleInHome: true,
    pos: "center",
    size: "xlarge",
    title: "Onedot design agency",
    subTitle:
      "A focused digital project designed to bring clarity, motion, and structure to a growing product ecosystem.",
    year: "2025",
    image: "/images/projects/onedot/onedot.webp",
    category: ["Brand", "Website", "Digital System"],
    slug: "onedot",
    tabs: [
      {
        id: "challenge",
        label: "THE CHALLENGE",
        content:
          "The goal was to translate a complex idea into a clear, scalable digital experience — without losing personality or intent.",
      },
      {
        id: "approach",
        label: "APPROACH",
        content:
          "We focused on iterative design sprints and deep user research to ensure every touchpoint felt intentional.",
      },
      {
        id: "outcome",
        label: "OUTCOME",
        content:
          "A 40% increase in user engagement and a design system that scales across multiple product lines.",
      },
    ],
    liveURL: "#",
    content: [
      {
        image: "/images/projects/onedot/onedot-1.webp",
        layout: "single",
      },
      {
        image: "/images/projects/onedot/onedot-2.webp",
        layout: "single",
      },
      {
        image: "/images/projects/onedot/onedot-3.webp",
        layout: "single",
      },
      {
        image: "/images/projects/onedot/onedot-4.webp",
        layout: "single",
      },
      {
        image: "/images/projects/onedot/onedot-5_1.webp",
        layout: "grid",
      },
      {
        image: "/images/projects/onedot/onedot-5_2.webp",
        layout: "grid",
      },
      {
        image: "/images/projects/onedot/onedot-6.webp",
        layout: "single",
      },
    ],
  },
  {
    visibleInHome: false,
    pos: "left",
    size: "small",
    title: "GridFree.AI",
    subTitle:
      "A focused digital project designed to bring clarity, motion, and structure to a growing product ecosystem.",
    year: "2025",
    image: "/images/projects/gridfree-ai/gridfree-ai.webp",
    category: ["Brand", "Website", "Digital System"],
    slug: "gridfree-ai",
    tabs: [
      {
        id: "challenge",
        label: "THE CHALLENGE",
        content:
          "The goal was to translate a complex idea into a clear, scalable digital experience — without losing personality or intent.",
      },
      {
        id: "approach",
        label: "APPROACH",
        content:
          "We focused on iterative design sprints and deep user research to ensure every touchpoint felt intentional.",
      },
      {
        id: "outcome",
        label: "OUTCOME",
        content:
          "A 40% increase in user engagement and a design system that scales across multiple product lines.",
      },
    ],
    liveURL: "#",
    content: [
      {
        image: "/images/projects/gridfree-ai/gridfree-ai-1.webp",
        layout: "single",
      },
      {
        image: "/images/projects/gridfree-ai/gridfree-ai-2.webp",
        layout: "single",
      },
      {
        image: "/images/projects/gridfree-ai/gridfree-ai-3.webp",
        layout: "single",
      },
      {
        image: "/images/projects/gridfree-ai/gridfree-ai-4.webp",
        layout: "single",
      },
      {
        image: "/images/projects/gridfree-ai/gridfree-ai-5.webp",
        layout: "single",
      },
      {
        image: "/images/projects/gridfree-ai/gridfree-ai-6.webp",
        layout: "single",
      },
    ],
  },
  {
    visibleInHome: false,
    pos: "right",
    size: "large",
    title: "Novaglam",
    subTitle:
      "A focused digital project designed to bring clarity, motion, and structure to a growing product ecosystem.",
    year: "2025",
    image: "/images/projects/novaglam/novaglam.webp",
    category: ["Brand", "Website", "Digital System"],
    slug: "novaglam",
    tabs: [
      {
        id: "challenge",
        label: "THE CHALLENGE",
        content:
          "The goal was to translate a complex idea into a clear, scalable digital experience — without losing personality or intent.",
      },
      {
        id: "approach",
        label: "APPROACH",
        content:
          "We focused on iterative design sprints and deep user research to ensure every touchpoint felt intentional.",
      },
      {
        id: "outcome",
        label: "OUTCOME",
        content:
          "A 40% increase in user engagement and a design system that scales across multiple product lines.",
      },
    ],
    liveURL: "#",
    content: [
      {
        image: "/images/projects/novaglam/novaglam-1.webp",
        layout: "single",
      },
      {
        image: "/images/projects/novaglam/novaglam-2.webp",
        layout: "single",
      },
      {
        image: "/images/projects/novaglam/novaglam-3.webp",
        layout: "single",
      },
      {
        image: "/images/projects/novaglam/novaglam-4_1.webp",
        layout: "grid",
      },
      {
        image: "/images/projects/novaglam/novaglam-4_2.webp",
        layout: "grid",
      },
      {
        image: "/images/projects/novaglam/novaglam-5.webp",
        layout: "single",
      },
      {
        image: "/images/projects/novaglam/novaglam-6.webp",
        layout: "single",
      },
      {
        image: "/images/projects/novaglam/novaglam-7.webp",
        layout: "single",
      },
    ],
  },
  {
    visibleInHome: false,
    pos: "left",
    size: "medium",
    title: "FirstGround Coffee",
    subTitle:
      "A focused digital project designed to bring clarity, motion, and structure to a growing product ecosystem.",
    year: "2025",
    image: "/images/projects/first-ground/first-ground.webp",
    category: ["Brand", "Website", "Digital System"],
    slug: "first-ground",
    tabs: [
      {
        id: "challenge",
        label: "THE CHALLENGE",
        content:
          "The goal was to translate a complex idea into a clear, scalable digital experience — without losing personality or intent.",
      },
      {
        id: "approach",
        label: "APPROACH",
        content:
          "We focused on iterative design sprints and deep user research to ensure every touchpoint felt intentional.",
      },
      {
        id: "outcome",
        label: "OUTCOME",
        content:
          "A 40% increase in user engagement and a design system that scales across multiple product lines.",
      },
    ],
    liveURL: "#",
    content: [
      {
        image: "/images/projects/first-ground/first-ground-1.webp",
        layout: "single",
      },
      {
        image: "/images/projects/first-ground/first-ground-2.webp",
        layout: "single",
      },
      {
        image: "/images/projects/first-ground/first-ground-3_1.webp",
        layout: "grid",
      },
      {
        image: "/images/projects/first-ground/first-ground-3_2.webp",
        layout: "grid",
      },
      {
        image: "/images/projects/first-ground/first-ground-4.webp",
        layout: "single",
      },
      {
        image: "/images/projects/first-ground/first-ground-5.webp",
        layout: "single",
      },
      {
        image: "/images/projects/first-ground/first-ground-6.webp",
        layout: "single",
      },
    ],
  },
  {
    visibleInHome: false,
    pos: "center",
    size: "xlarge",
    title: "Techno",
    subTitle:
      "A focused digital project designed to bring clarity, motion, and structure to a growing product ecosystem.",
    year: "2025",
    image: "/images/projects/techno/techno.webp",
    category: ["Brand", "Website", "Digital System"],
    slug: "techno",
    tabs: [
      {
        id: "challenge",
        label: "THE CHALLENGE",
        content:
          "The goal was to translate a complex idea into a clear, scalable digital experience — without losing personality or intent.",
      },
      {
        id: "approach",
        label: "APPROACH",
        content:
          "We focused on iterative design sprints and deep user research to ensure every touchpoint felt intentional.",
      },
      {
        id: "outcome",
        label: "OUTCOME",
        content:
          "A 40% increase in user engagement and a design system that scales across multiple product lines.",
      },
    ],
    liveURL: "#",
    content: [
      {
        image: "/images/projects/techno/techno-1.webp",
        layout: "single",
      },
      {
        image: "/images/projects/techno/techno-2.webp",
        layout: "single",
      },
      {
        image: "/images/projects/techno/techno-3.webp",
        layout: "single",
      },
      {
        image: "/images/projects/techno/techno-4.webp",
        layout: "single",
      },
    ],
  },
  {
    visibleInHome: false,
    pos: "right",
    size: "small",
    title: "Reelix",
    subTitle:
      "A focused digital project designed to bring clarity, motion, and structure to a growing product ecosystem.",
    year: "2025",
    image: "/images/projects/reelix/reelix.webp",
    category: ["Brand", "Website", "Digital System"],
    slug: "reelix",
    tabs: [
      {
        id: "challenge",
        label: "THE CHALLENGE",
        content:
          "The goal was to translate a complex idea into a clear, scalable digital experience — without losing personality or intent.",
      },
      {
        id: "approach",
        label: "APPROACH",
        content:
          "We focused on iterative design sprints and deep user research to ensure every touchpoint felt intentional.",
      },
      {
        id: "outcome",
        label: "OUTCOME",
        content:
          "A 40% increase in user engagement and a design system that scales across multiple product lines.",
      },
    ],
    liveURL: "#",
    content: [
      {
        image: "/images/projects/reelix/reelix-1.webp",
        layout: "single",
      },
      {
        image: "/images/projects/reelix/reelix-2.webp",
        layout: "single",
      },
      {
        image: "/images/projects/reelix/reelix-3.webp",
        layout: "single",
      },
      {
        image: "/images/projects/reelix/reelix-4.webp",
        layout: "single",
      },
      {
        image: "/images/projects/reelix/reelix-5.webp",
        layout: "single",
      },
      {
        image: "/images/projects/reelix/reelix-6.webp",
        layout: "single",
      },
      {
        image: "/images/projects/reelix/reelix-7.webp",
        layout: "single",
      },
    ],
  },
  {
    visibleInHome: false,
    pos: "left",
    size: "large",
    title: "Clara Helthcare",
    subTitle:
      "A focused digital project designed to bring clarity, motion, and structure to a growing product ecosystem.",
    year: "2025",
    image: "/images/projects/clara-helthcare/clara-helthcare.webp",
    category: ["Brand", "Website", "Digital System"],
    slug: "clara-helthcare",
    tabs: [
      {
        id: "challenge",
        label: "THE CHALLENGE",
        content:
          "The goal was to translate a complex idea into a clear, scalable digital experience — without losing personality or intent.",
      },
      {
        id: "approach",
        label: "APPROACH",
        content:
          "We focused on iterative design sprints and deep user research to ensure every touchpoint felt intentional.",
      },
      {
        id: "outcome",
        label: "OUTCOME",
        content:
          "A 40% increase in user engagement and a design system that scales across multiple product lines.",
      },
    ],
    liveURL: "#",
    content: [
      {
        image: "/images/projects/clara-helthcare/clara-helthcare-1.webp",
        layout: "single",
      },
      {
        image: "/images/projects/clara-helthcare/clara-helthcare-2.webp",
        layout: "single",
      },
      {
        image: "/images/projects/clara-helthcare/clara-helthcare-3.webp",
        layout: "single",
      },
      {
        image: "/images/projects/clara-helthcare/clara-helthcare-4.webp",
        layout: "single",
      },
      {
        image: "/images/projects/clara-helthcare/clara-helthcare-5.webp",
        layout: "single",
      },
      {
        image: "/images/projects/clara-helthcare/clara-helthcare-6.webp",
        layout: "single",
      },
      {
        image: "/images/projects/clara-helthcare/clara-helthcare-7.webp",
        layout: "single",
      },
      {
        image: "/images/projects/clara-helthcare/clara-helthcare-8.webp",
        layout: "single",
      },
    ],
  },
  {
    visibleInHome: false,
    pos: "right",
    size: "medium",
    title: "Z1FLUX Solar",
    subTitle:
      "A focused digital project designed to bring clarity, motion, and structure to a growing product ecosystem.",
    year: "2025",
    image: "/images/projects/z1-flux-solar/z1-flux-solar.webp",
    category: ["Brand", "Website", "Digital System"],
    slug: "z1-flux-solar",
    tabs: [
      {
        id: "challenge",
        label: "THE CHALLENGE",
        content:
          "The goal was to translate a complex idea into a clear, scalable digital experience — without losing personality or intent.",
      },
      {
        id: "approach",
        label: "APPROACH",
        content:
          "We focused on iterative design sprints and deep user research to ensure every touchpoint felt intentional.",
      },
      {
        id: "outcome",
        label: "OUTCOME",
        content:
          "A 40% increase in user engagement and a design system that scales across multiple product lines.",
      },
    ],
    liveURL: "#",
    content: [
      {
        image: "/images/projects/z1-flux-solar/z1-flux-solar-1.webp",
        layout: "single",
      },
      {
        image: "/images/projects/z1-flux-solar/z1-flux-solar-2.webp",
        layout: "single",
      },
      {
        image: "/images/projects/z1-flux-solar/z1-flux-solar-3.webp",
        layout: "single",
      },
      {
        image: "/images/projects/z1-flux-solar/z1-flux-solar-4.webp",
        layout: "single",
      },
      {
        image: "/images/projects/z1-flux-solar/z1-flux-solar-5.webp",
        layout: "single",
      },
      {
        image: "/images/projects/z1-flux-solar/z1-flux-solar-6_1.webp",
        layout: "grid",
      },
      {
        image: "/images/projects/z1-flux-solar/z1-flux-solar-6_2.webp",
        layout: "grid",
      },
      {
        image: "/images/projects/z1-flux-solar/z1-flux-solar-7.webp",
        layout: "single",
      },
      {
        image: "/images/projects/z1-flux-solar/z1-flux-solar-8.webp",
        layout: "single",
      },
      {
        image: "/images/projects/z1-flux-solar/z1-flux-solar-9.webp",
        layout: "single",
      },
    ],
  },
  {
    visibleInHome: false,
    pos: "center",
    size: "xlarge",
    title: "Improvi.AI",
    subTitle:
      "A focused digital project designed to bring clarity, motion, and structure to a growing product ecosystem.",
    year: "2025",
    image: "/images/projects/improvi/improvi.webp",
    category: ["Brand", "Website", "Digital System"],
    slug: "improvi-ai",
    tabs: [
      {
        id: "challenge",
        label: "THE CHALLENGE",
        content:
          "The goal was to translate a complex idea into a clear, scalable digital experience — without losing personality or intent.",
      },
      {
        id: "approach",
        label: "APPROACH",
        content:
          "We focused on iterative design sprints and deep user research to ensure every touchpoint felt intentional.",
      },
      {
        id: "outcome",
        label: "OUTCOME",
        content:
          "A 40% increase in user engagement and a design system that scales across multiple product lines.",
      },
    ],
    liveURL: "#",
    content: [
      {
        image: "/images/projects/improvi/improvi-1.webp",
        layout: "single",
      },
      {
        image: "/images/projects/improvi/improvi-2.webp",
        layout: "single",
      },
      {
        image: "/images/projects/improvi/improvi-3.webp",
        layout: "single",
      },
      {
        image: "/images/projects/improvi/improvi-4.webp",
        layout: "single",
      },
      {
        image: "/images/projects/improvi/improvi-5_1.webp",
        layout: "grid",
      },
      {
        image: "/images/projects/improvi/improvi-5_2.webp",
        layout: "grid",
      },
      {
        image: "/images/projects/improvi/improvi-6.webp",
        layout: "single",
      },
      {
        image: "/images/projects/improvi/improvi-7.webp",
        layout: "single",
      },
      {
        image: "/images/projects/improvi/improvi-8.webp",
        layout: "single",
      },
      {
        image: "/images/projects/improvi/improvi-9.webp",
        layout: "single",
      },
      {
        image: "/images/projects/improvi/improvi-10.webp",
        layout: "single",
      },
    ],
  },
  {
    visibleInHome: false,
    pos: "left",
    size: "small",
    title: "Myworker Ai",
    subTitle:
      "A focused digital project designed to bring clarity, motion, and structure to a growing product ecosystem.",
    year: "2025",
    image: "/images/projects/myworker/myworker.webp",
    category: ["Brand", "Website", "Digital System"],
    slug: "myworker-ai",
    tabs: [
      {
        id: "challenge",
        label: "THE CHALLENGE",
        content:
          "The goal was to translate a complex idea into a clear, scalable digital experience — without losing personality or intent.",
      },
      {
        id: "approach",
        label: "APPROACH",
        content:
          "We focused on iterative design sprints and deep user research to ensure every touchpoint felt intentional.",
      },
      {
        id: "outcome",
        label: "OUTCOME",
        content:
          "A 40% increase in user engagement and a design system that scales across multiple product lines.",
      },
    ],
    liveURL: "#",
    content: [
      {
        image: "/images/projects/myworker/myworker-1.webp",
        layout: "single",
      },
      {
        image: "/images/projects/myworker/myworker-2.webp",
        layout: "single",
      },
      {
        image: "/images/projects/myworker/myworker-3.webp",
        layout: "single",
      },
      {
        image: "/images/projects/myworker/myworker-4_1.webp",
        layout: "grid",
      },
      {
        image: "/images/projects/myworker/myworker-4_2.webp",
        layout: "grid",
      },
      {
        image: "/images/projects/myworker/myworker-5.webp",
        layout: "single",
      },
      {
        image: "/images/projects/myworker/myworker-6.webp",
        layout: "single",
      },
      {
        image: "/images/projects/myworker/myworker-7.webp",
        layout: "single",
      },
      {
        image: "/images/projects/myworker/myworker-8.webp",
        layout: "single",
      },
      {
        image: "/images/projects/myworker/myworker-9.webp",
        layout: "single",
      },
      {
        image: "/images/projects/myworker/myworker-10.webp",
        layout: "single",
      },
      {
        image: "/images/projects/myworker/myworker-11.webp",
        layout: "single",
      },
    ],
  },
  {
    visibleInHome: false,
    pos: "right",
    size: "large",
    title: "Reyden",
    subTitle:
      "A focused digital project designed to bring clarity, motion, and structure to a growing product ecosystem.",
    year: "2025",
    image: "/images/projects/reyden/reyden.webp",
    category: ["Brand", "Website", "Digital System"],
    slug: "reyden",
    tabs: [
      {
        id: "challenge",
        label: "THE CHALLENGE",
        content:
          "The goal was to translate a complex idea into a clear, scalable digital experience — without losing personality or intent.",
      },
      {
        id: "approach",
        label: "APPROACH",
        content:
          "We focused on iterative design sprints and deep user research to ensure every touchpoint felt intentional.",
      },
      {
        id: "outcome",
        label: "OUTCOME",
        content:
          "A 40% increase in user engagement and a design system that scales across multiple product lines.",
      },
    ],
    liveURL: "#",
    content: [
      {
        image: "/images/projects/reyden/reyden-1.webp",
        layout: "single",
      },
      {
        image: "/images/projects/reyden/reyden-2.webp",
        layout: "single",
      },
      {
        image: "/images/projects/reyden/reyden-3_1.webp",
        layout: "grid",
      },
      {
        image: "/images/projects/reyden/reyden-3_2.webp",
        layout: "grid",
      },
      {
        image: "/images/projects/reyden/reyden-4.webp",
        layout: "single",
      },
      {
        image: "/images/projects/reyden/reyden-5.webp",
        layout: "single",
      },
      {
        image: "/images/projects/reyden/reyden-6.webp",
        layout: "single",
      },
    ],
  },
  {
    visibleInHome: false,
    pos: "left",
    size: "medium",
    title: "DFZ",
    subTitle:
      "A focused digital project designed to bring clarity, motion, and structure to a growing product ecosystem.",
    year: "2025",
    image: "/images/projects/dfz/dfz.webp",
    category: ["Brand", "Website", "Digital System"],
    slug: "dfz",
    tabs: [
      {
        id: "challenge",
        label: "THE CHALLENGE",
        content:
          "The goal was to translate a complex idea into a clear, scalable digital experience — without losing personality or intent.",
      },
      {
        id: "approach",
        label: "APPROACH",
        content:
          "We focused on iterative design sprints and deep user research to ensure every touchpoint felt intentional.",
      },
      {
        id: "outcome",
        label: "OUTCOME",
        content:
          "A 40% increase in user engagement and a design system that scales across multiple product lines.",
      },
    ],
    liveURL: "#",
    content: [
      {
        image: "/images/projects/dfz/dfz-1.webp",
        layout: "single",
      },
      {
        image: "/images/projects/dfz/dfz-2.webp",
        layout: "single",
      },
      {
        image: "/images/projects/dfz/dfz-3.webp",
        layout: "single",
      },
      {
        image: "/images/projects/dfz/dfz-4.webp",
        layout: "single",
      },
      {
        image: "/images/projects/dfz/dfz-5.webp",
        layout: "single",
      },
      {
        image: "/images/projects/dfz/dfz-6.webp",
        layout: "single",
      },
      {
        image: "/images/projects/dfz/dfz-7.webp",
        layout: "single",
      },
      {
        image: "/images/projects/dfz/dfz-8.webp",
        layout: "single",
      },
    ],
  },
];
