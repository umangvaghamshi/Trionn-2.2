import {
  TestimonialsDataItem,
  HowWorkType,
  WeNotType,
  TechFaqItemType,
  ProjectsType,
  FaqItemType,
} from "./dataType";

export const headerSection = {
  logo: "/images/logo.svg",
};

export const menu = [
  {
    title: "Work",
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
    url: "/contact",
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

export const TestimonialsData: TestimonialsDataItem[] = [
  {
    companyName: "Luxury presence",
    quoteMessage:
      "I've worked with Sunny and his team on several projects and he's one of the best UI/UX designers and front-end developers I know. He's meticulous in his attention to detail and has a true passion for creating beautiful user interfaces.",
    clientImage: "/images/malte.webp",
    clientName: "Malte Smith",
    clientDeg: "Founder & CEO · USA",
    videoURL: "https://www.youtube.com/embed/rOAsYNtPAmQ?autoplay=1",
  },
  {
    companyName: "credible",
    quoteMessage:
      "The Trionn team is extremely reliable, professional and talented. It has been a great pleasure collaborating with them over many",
    clientImage: "/images/stephen.webp",
    clientName: "Stephen Dash",
    clientDeg: "Founder & CEO · USA",
  },
  {
    companyName: "Fast resume",
    quoteMessage:
      "Sunny and his award winning team are second to none when it comes to responsive web design. Their ability to take an idea and make it a work of art has always been a great experience. When you find companies like his you make sure to keep them close.",
    clientImage: "/images/doug.webp",
    clientName: "Doug Petrie",
    clientDeg: "Founder & CEO · USA",
    videoURL: "https://www.youtube.com/embed/eKB_kigzDwA?autoplay=1",
  },
  {
    companyName: "Technis",
    quoteMessage:
      "Sunny and his team is a very professional, with whom I am used to working on different projects. listening, versatile, very smart, I recommend without hesitation.",
    clientImage: "/images/jean.webp",
    clientName: "Jean-Baptiste Biolay",
    clientDeg: "General Manager · UAE",
  },
  {
    companyName: "Ventigence",
    quoteMessage:
      "Trionn team did an amazing development work for my company. They were fast, flexible and very professional. If your organization needs website design, I guess you know who I would recommend to be the 1st on your list.",
    clientImage: "/images/zoltan.webp",
    clientName: "Zoltan Csonka",
    clientDeg: "Founder & CEO · UAE",
    videoURL: "https://www.youtube.com/embed/9F4WsbJ1mrc?autoplay=1",
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
    title: "AI & Intelligent Automation",
    description:
      "We implement intelligent automation to simplify digital workflows. Systems are designed to enhance efficiency without adding complexity.",
    subText: "Integrated seamlessly into <br/>existing platforms.",
    imgUrl: "/images/service-AI.webp",
    capabilities: [
      { capabilitiesItem: "AI-powered digital experiences" },
      { capabilitiesItem: "AI workflow automation with n8n" },
      { capabilitiesItem: "AI agents & virtual assistants" },
      { capabilitiesItem: "Semantic search & recommendations" },
      { capabilitiesItem: "AI tools for websites & web apps" },
      { capabilitiesItem: "AI-powered business automation" },
    ],
  },
  {
    title: "Website & Mobile Design",
    description:
      "We craft responsive digital experiences that feel natural across screens. Design systems are built to remain flexible as products evolve.",
    subText: "Designed to perform <br/>consistently on every device.",
    imgUrl: "/images/service-website-mobile-design.webp",
    capabilities: [
      { capabilitiesItem: "High-fidelity web design" },
      { capabilitiesItem: "Mobile app design" },
      { capabilitiesItem: "Responsive experiences" },
      { capabilitiesItem: "UX/UI systems" },
      { capabilitiesItem: "Motion-first interfaces" },
      { capabilitiesItem: "Interactive storytelling" },
    ],
  },
  {
    title: "Product Design",
    description:
      "We design digital products by aligning user needs, business goals, and system logic. Every decision is guided by clarity, usability, and long-term value.",
    subText: "Closely shaped alongside <br/>strategy and development.",
    imgUrl: "/images/service-product-design.webp",
    capabilities: [
      { capabilitiesItem: "Product strategy" },
      { capabilitiesItem: "Interface design" },
      { capabilitiesItem: "UX architecture" },
      { capabilitiesItem: "Design system" },
      { capabilitiesItem: "Prototyping & validation" },
      { capabilitiesItem: "Motion & interaction design" },
    ],
  },
  {
    title: "Web Development",
    description:
      "We build robust web applications with performance at the core. Our focus remains on reliability, security, and scalability.",
    subText: "Engineered to support <br/>complex digital products.",
    imgUrl: "/images/service-web-development.webp",
    capabilities: [
      { capabilitiesItem: "Frontend & Backend development" },
      { capabilitiesItem: "Headless CMS integration" },
      { capabilitiesItem: "WebGL & Canvas experiences" },
      { capabilitiesItem: "Shader-based interactions" },
      { capabilitiesItem: "GSAP motion systems" },
      { capabilitiesItem: "Creative development" },
    ],
  },
  {
    title: "WordPress Development",
    description:
      "We develop custom WordPress solutions focused on performance and control. Clean architecture ensures ease of management and scalability.",
    subText: "Built to adapt as content <br/>and products grow.",
    imgUrl: "/images/service-wordpress-development.webp",
    capabilities: [
      { capabilitiesItem: "WordPress websites" },
      { capabilitiesItem: "Custom themes" },
      { capabilitiesItem: "WooCommerce integrations" },
      { capabilitiesItem: "Performance optimization" },
      { capabilitiesItem: "API integrations" },
      { capabilitiesItem: "Ongoing support" },
    ],
  },
  {
    title: "Branding",
    description:
      "We create visual identities rooted in clarity and consistency. Every element is designed to work across digital environments.",
    subText: "Built to extend across <br/>products and experiences.",
    imgUrl: "/images/service-branding.webp",
    capabilities: [
      { capabilitiesItem: "Brand strategy" },
      { capabilitiesItem: "Visual identity systems" },
      { capabilitiesItem: "Brand guidelines" },
      { capabilitiesItem: "Creative direction" },
      { capabilitiesItem: "Logo design" },
      { capabilitiesItem: "Digital brand experiences" },
    ],
  },
];

export const faqData: TechFaqItemType[] = [
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
    title: "Front-end",
    content: [
      {
        heading: "Frameworks & Libraries",
        items: ["React.js", "Next.js", "JavaScript (ES6+)", "jQuery"],
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
      {
        heading: "Animation & Interactive Experiences",
        items: [
          "GSAP",
          "Framer Motion",
          "Three.js",
          "WebGL",
          "HTML5 Canvas",
          "Shaders",
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
        items: [
          "WordPress CMS",
          "HubSpot CMS",
          "Contentful",
          "Sanity",
          "Strapi",
        ],
      },
      {
        heading: "Ecommerce CMS",
        items: ["WooCommerce", "Shopify"],
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
      "Seamless real estate platform for effortless property discovery.",
    year: "2025",
    image: "/images/projects/loftloom/loftloom.webp",
    category: [
      "UI/UX Design",
      "Web Design",
      "Web Development",
      "Interaction Design",
    ],
    slug: "loftloom",
    tabs: [
      {
        id: "challenge",
        label: "The challenge",
        content:
          "LoftLoom required simplifying a complex real estate journey while maintaining a calm and premium experience. The platform had to manage listings, filters, maps, and multiple user actions without overwhelming users. The key challenge was creating clarity within a data-heavy system while keeping the interface intuitive and refined.",
      },
      {
        id: "approach",
        label: "Approach",
        content:
          "Trionn focused on clarity, hierarchy, and seamless navigation across the platform. Clean layouts, balanced spacing, and minimal visual noise were used to reduce cognitive load. Interactions were refined to feel smooth and natural, guiding users effortlessly from discovery to decision.",
      },
      {
        id: "outcome",
        label: "Outcome",
        content:
          "The final product delivers a seamless and visually balanced real estate experience. Users can explore and manage properties with ease through an intuitive interface. Trionn shaped LoftLoom into a refined platform that elevates everyday property interactions.",
      },
      {
        id: "wedid",
        label: "What we did",
        content:
          "<ul><li>Defined UX strategy and structured user journeys.</li><li>Designed a refined and scalable interface system.</li><li>Developed responsive frontend with smooth interactions.</li><li>Optimized property discovery, maps, and dashboard flows.</li></ul>",
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
      {
        image: "/images/projects/loftloom/loftloom-7.webp",
        layout: "single",
      },
      {
        image: "/images/projects/loftloom/loftloom-8.webp",
        layout: "single",
      },
      {
        image: "/images/projects/loftloom/loftloom-9.webp",
        layout: "single",
      },
    ],
  },
  {
    visibleInHome: true,
    pos: "right",
    size: "medium",
    title: "MyWorker AI",
    subTitle:
      "AI platform simplifying hiring, management, and workforce scaling.",
    year: "2025",
    image: "/images/projects/myworker/myworker.webp",
    category: [
      "AI Product Design",
      "UI/UX Design",
      "Web Development",
      "Interaction Design",
    ],
    slug: "myworker-ai",
    tabs: [
      {
        id: "challenge",
        label: "The challenge",
        content:
          "MyWorker.ai needed to present a complex AI-driven workforce platform in a way that feels simple and approachable. The product included multiple features that could easily overwhelm users. The key challenge was balancing clarity with capability. At the same time, the brand had to feel modern, intelligent, and trustworthy.",
      },
      {
        id: "approach",
        label: "Approach",
        content:
          "Trionn focused on simplifying the experience through clear structure and intuitive flows. We reduced friction by guiding users step by step across the platform. The design language was kept clean and minimal to enhance understanding. Subtle interactions were added to bring depth without adding complexity.",
      },
      {
        id: "outcome",
        label: "Outcome",
        content:
          "The result is a streamlined platform that feels easy to use yet powerful in capability. Users can quickly understand and navigate the system with confidence. The refined design improves engagement and builds trust in the product. MyWorker.ai now stands as a scalable and polished digital experience.",
      },
      {
        id: "wedid",
        label: "What we did",
        content:
          "<ul><li>Designed intuitive user flows to simplify complex workforce processes.</li><li>Developed a clean and scalable front-end experience.</li><li>Created a modern and minimal visual design system.</li><li>Improved usability and engagement across key product journeys.</li></ul>",
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
    visibleInHome: true,
    pos: "center",
    size: "xlarge",
    title: "Pulse Studio",
    subTitle:
      "A motion-led studio website showcasing artists, projects, and culture.",
    year: "2025",
    image: "/images/projects/pulse-studio/pulse-studio.webp",
    category: [
      "UI/UX Design",
      "Web Design",
      "Web Development",
      "Creative Direction",
    ],
    slug: "pulse-studio",
    tabs: [
      {
        id: "challenge",
        label: "The challenge",
        content:
          "Pulse Studio needed a digital presence that could capture the energy of music without relying on sound. The experience had to feel immersive, expressive, and culturally relevant. At the same time, it needed to stay clear and structured across multiple content layers. Balancing emotion with usability was key.",
      },
      {
        id: "approach",
        label: "Approach",
        content:
          "We crafted a rhythm-driven experience where motion leads the storytelling. A minimal yet bold visual system with strong imagery and refined typography sets the tone. Smooth transitions and fluid interactions create a sense of flow across the journey. Every detail was designed to feel intentional and alive.",
      },
      {
        id: "outcome",
        label: "Outcome",
        content:
          "The result is an immersive digital experience that feels dynamic and engaging. Pulse Studio stands out as a platform that communicates culture through motion and design. It enhances storytelling while maintaining clarity and usability. The final product leaves a strong and memorable impression.",
      },
      {
        id: "wedid",
        label: "What we did",
        content:
          "<ul><li>Designed a rhythm-driven UI that translates sound into motion and interaction.</li><li>Crafted a cinematic visual system with bold imagery and refined typography.</li><li>Developed smooth, performance-focused animations for a seamless experience.</li><li>Built a cohesive storytelling framework reflecting Pulse Studio's culture and energy.</li></ul>",
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
    ],
  },
  {
    visibleInHome: false,
    pos: "left",
    size: "small",
    title: "One.Dot",
    subTitle:
      "A studio website showcasing work, services, and client journeys.",
    year: "2025",
    image: "/images/projects/onedot/onedot.webp",
    category: [
      "Brand Design",
      "UI/UX Design",
      "Web Design",
      "Web Development",
      "Creative Direction",
    ],
    slug: "One.Dot",
    tabs: [
      {
        id: "challenge",
        label: "The challenge",
        content:
          "ONE.DOT required a digital presence that felt minimal yet expressive. The key challenge was balancing visual refinement with usability across multiple sections like work, services, and contact. It needed to communicate credibility without adding clutter. Every interaction had to feel intentional while maintaining smooth performance.",
      },
      {
        id: "approach",
        label: "Approach",
        content:
          "We built a structured design system focused on typography, spacing, and clarity. The layout was kept clean and modular to guide users naturally through the experience. Subtle animations and transitions were introduced to enhance flow without distraction. Every element was carefully refined to maintain consistency and precision.",
      },
      {
        id: "outcome",
        label: "Outcome",
        content:
          "The final experience feels seamless, modern, and confident. Users can explore content effortlessly while engaging with a strong visual identity. The platform elevates the brand with clarity and purpose. It delivers both aesthetic impact and smooth performance across the entire journey.",
      },
      {
        id: "wedid",
        label: "What we did",
        content:
          "<ul><li>Designed a clean and scalable UI system for consistency across all pages.</li><li>Developed a high-performance website with smooth interactions and transitions.</li><li>Structured content to improve clarity, navigation, and user flow.</li><li>Crafted a refined visual language aligned with the brand identity.</li></ul>",
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
    pos: "right",
    size: "large",
    title: "DFZ Watch",
    subTitle:
      "A clean platform to discover, customize, and buy luxury watches.",
    year: "2025",
    image: "/images/projects/dfz/dfz.webp",
    category: [
      "AI Product Design",
      "UI/UX Design",
      "Web Development",
      "Interaction Design",
    ],
    slug: "dfz",
    tabs: [
      {
        id: "challenge",
        label: "The challenge",
        content:
          "DFZ Watch required a digital platform that could present luxury timepieces with both clarity and sophistication. The challenge was to organize a wide product range without overwhelming the user. It also needed to balance strong visual appeal with smooth usability. Performance and responsiveness had to remain consistent across devices.",
      },
      {
        id: "approach",
        label: "Approach",
        content:
          "We designed a clean and structured interface that highlights each product with precision. The layout uses strong hierarchy, refined typography, and ample spacing for a premium feel. Subtle interactions were added to enhance browsing without distraction. The overall experience was crafted to feel smooth, intuitive, and visually refined.",
      },
      {
        id: "outcome",
        label: "Outcome",
        content:
          "The final result is a seamless eCommerce experience that reflects the brand's luxury positioning. Users can explore and navigate products effortlessly across all devices. The design creates a strong visual identity while maintaining usability. It delivers both performance and a polished, high-end digital presence.",
      },
      {
        id: "wedid",
        label: "What we did",
        content:
          "<ul><li>Designed a premium user interface focused on clarity and elegance.</li><li>Developed a responsive website with smooth and refined interactions.</li><li>Created a structured product browsing experience for easy navigation.</li><li>Aligned visual direction with the brand's luxury positioning.</li></ul>",
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
  {
    visibleInHome: false,
    pos: "left",
    size: "medium",
    title: "Enterra AI",
    subTitle: "AI powered platform for intelligent enterprise support.",
    year: "2025",
    image: "/images/projects/enterra/enterra.webp",
    category: [
      "UI/UX Design",
      "Web Design",
      "Frontend Development",
      "Creative Direction",
    ],
    slug: "enterra-ai",
    tabs: [
      {
        id: "challenge",
        label: "The challenge",
        content:
          "Enterra AI needed a website that could present advanced AI technology in a way that felt clear, premium, and easy to understand. The platform included complex enterprise focused features, product flows, and large scale content. The challenge was creating a refined experience that balanced technical depth with human centered storytelling.",
      },
      {
        id: "approach",
        label: "Approach",
        content:
          "TRIONN designed a cinematic and editorial inspired experience that combined immersive visuals with structured layouts and clean interactions. We focused on simplifying complex information through thoughtful hierarchy, elegant typography, and modern UI systems. Every section was crafted to feel intelligent, scalable, and visually engaging.",
      },
      {
        id: "outcome",
        label: "Outcome",
        content:
          "The final website elevated Enterra AI into a polished and future ready digital brand experience. The platform now communicates its AI capabilities with clarity while maintaining a premium visual identity. The result is a seamless enterprise experience designed to build trust, engagement, and product confidence.",
      },
      {
        id: "wedid",
        label: "What we did",
        content:
          "<ul><li>Designed a modern enterprise AI website experience.</li><li>Created immersive and cinematic UI layouts.</li><li>Developed responsive and scalable frontend interactions.</li><li>Built a consistent multi page design system.</li></ul>",
      },
    ],
    liveURL: "#",
    content: [
      {
        image: "/images/projects/enterra/enterra-1.webp",
        layout: "single",
      },
      {
        image: "/images/projects/enterra/enterra-2.webp",
        layout: "single",
      },
      {
        image: "/images/projects/enterra/enterra-3.webp",
        layout: "single",
      },
      {
        image: "/images/projects/enterra/enterra-4.webp",
        layout: "single",
      },
      {
        image: "/images/projects/enterra/enterra-5.webp",
        layout: "single",
      },
      {
        image: "/images/projects/enterra/enterra-6.webp",
        layout: "single",
      },
      {
        image: "/images/projects/enterra/enterra-7.webp",
        layout: "single",
      },
    ],
  },
  {
    visibleInHome: false,
    pos: "center",
    size: "xlarge",
    title: "Technis",
    subTitle: "AI-powered spatial intelligence platform for smarter spaces.",
    year: "2025",
    image: "/images/projects/technis/technis.webp",
    category: [
      "UI/UX Design",
      "Web Development",
      "Interaction Design",
      "Frontend Development",
    ],
    slug: "technis",
    tabs: [
      {
        id: "challenge",
        label: "The challenge",
        content:
          "Technis needed a website that could present advanced spatial intelligence technology in a clear and engaging way. The platform included multiple products, industries, and technical solutions that had to feel easy to explore. The challenge was creating a modern experience that balanced innovation, usability, and strong visual storytelling.",
      },
      {
        id: "approach",
        label: "Approach",
        content:
          "TRIONN crafted a clean and structured digital experience focused on simplicity and interaction. We refined the content flow, improved visual hierarchy, and added smooth transitions to guide users naturally through the platform. Every section was designed to make complex information feel more accessible and visually polished.",
      },
      {
        id: "outcome",
        label: "Outcome",
        content:
          "The final website delivers a refined and future-ready digital presence for Technis. The experience now communicates the brand's technology and solutions with greater clarity and confidence. The result is a seamless platform that feels intelligent, modern, and built for scale.",
      },
      {
        id: "wedid",
        label: "What we did",
        content:
          "<ul><li>Designed a modern and intuitive UI/UX experience.</li><li>Developed responsive frontend interactions and animations.</li><li>Structured content for better clarity and navigation.</li><li>Built a scalable and polished digital platform.</li></ul>",
      },
    ],
    liveURL: "#",
    content: [
      {
        image: "/images/projects/technis/technis-1.webp",
        layout: "single",
      },
      {
        image: "/images/projects/technis/technis-2.webp",
        layout: "single",
      },
      {
        image: "/images/projects/technis/technis-3.webp",
        layout: "single",
      },
      {
        image: "/images/projects/technis/technis-4.webp",
        layout: "single",
      },
      {
        image: "/images/projects/technis/technis-5.webp",
        layout: "single",
      },
      {
        image: "/images/projects/technis/technis-6.webp",
        layout: "single",
      },
      {
        image: "/images/projects/technis/technis-7.webp",
        layout: "single",
      },
      {
        image: "/images/projects/technis/technis-8.webp",
        layout: "single",
      },
    ],
  },
  {
    visibleInHome: false,
    pos: "right",
    size: "small",
    title: "Crowd Mouth",
    subTitle: "A creator driven platform built for fan engagement and rewards.",
    year: "2025",
    image: "/images/projects/crowd-mouth/crowd-mouth.webp",
    category: [
      "UI/UX Design",
      "Mobile App Design",
      "Dashboard Design",
      "Product Strategy",
    ],
    slug: "crowd-mouth",
    tabs: [
      {
        id: "challenge",
        label: "The challenge",
        content:
          "Crowd Mouth needed to simplify a feature rich platform that included creator discovery, rewards, campaigns, analytics, and fan engagement. The experience had to feel intuitive across multiple user journeys without overwhelming users. The challenge was balancing social interaction with clear navigation and scalable usability.",
      },
      {
        id: "approach",
        label: "Approach",
        content:
          "TRIONN crafted a visually bold mobile experience focused on simplicity and engagement. Clean layouts, vibrant gradients, and interactive dashboards were combined to create a smooth and connected user flow. Every screen was designed to feel immersive while keeping the platform easy to explore and use.",
      },
      {
        id: "outcome",
        label: "Outcome",
        content:
          "The final product delivered a modern and engaging creator platform with a strong visual identity. Fans could easily discover creators, track rewards, and interact through campaigns in a seamless experience. The platform now feels scalable, interactive, and built for long term community growth.",
      },
      {
        id: "wedid",
        label: "What we did",
        content:
          "<ul><li>Designed a mobile app for creator and fan engagement.</li><li>Crafted intuitive dashboards and rewards experiences.</li><li>Created a bold dark themed visual identity.</li><li>Designed seamless flows for sharing and interaction.</li></ul>",
      },
    ],
    liveURL: "#",
    content: [
      {
        image: "/images/projects/crowd-mouth/crowd-mouth-1.webp",
        layout: "single",
      },
      {
        image: "/images/projects/crowd-mouth/crowd-mouth-2.webp",
        layout: "single",
      },
      {
        image: "/images/projects/crowd-mouth/crowd-mouth-3.webp",
        layout: "single",
      },
      {
        image: "/images/projects/crowd-mouth/crowd-mouth-4.webp",
        layout: "single",
      },
      {
        image: "/images/projects/crowd-mouth/crowd-mouth-5.webp",
        layout: "single",
      },
      {
        image: "/images/projects/crowd-mouth/crowd-mouth-6.webp",
        layout: "single",
      },
      {
        image: "/images/projects/crowd-mouth/crowd-mouth-7.webp",
        layout: "single",
      },
    ],
  },
  {
    visibleInHome: false,
    pos: "left",
    size: "large",
    title: "Domus Immobilien Kultur",
    subTitle: "Premium real estate and architectural showcase platform.",
    year: "2025",
    image: "/images/projects/domus/domus.webp",
    category: [
      "UI/UX Design",
      "Creative Direction",
      "Website Development",
      "Interaction Design",
    ],
    slug: "domus",
    tabs: [
      {
        id: "challenge",
        label: "The challenge",
        content:
          "Domus Immobilien Kultur required a digital experience that could showcase premium real estate projects with clarity and sophistication. The challenge was balancing detailed property information with a clean and minimal presentation. The platform also needed to feel modern, trustworthy, and visually aligned with the architectural quality of the brand.",
      },
      {
        id: "approach",
        label: "Approach",
        content:
          "TRIONN designed a refined and structured interface focused on elegant layouts, strong typography, and immersive visuals. Every section was crafted to guide users naturally through the developments and brand story. Smooth responsiveness and subtle interactions helped create a premium browsing experience across all devices.",
      },
      {
        id: "outcome",
        label: "Outcome",
        content:
          "The final website presents Domus Immobilien Kultur with a polished and contemporary digital identity. The experience feels clean, professional, and visually engaging while improving how projects and properties are explored online. The platform now reflects the brand's premium positioning with greater clarity and impact.",
      },
      {
        id: "wedid",
        label: "What we did",
        content:
          "<ul><li>Designed a modern UI/UX experience tailored for premium real estate presentation.</li><li>Developed a fully responsive website with smooth interactions and clean layouts.</li><li>Structured project and property content for better storytelling and user navigation.</li><li>Created a refined visual direction aligned with architecture and luxury living.</li></ul>",
      },
    ],
    liveURL: "#",
    content: [
      {
        image: "/images/projects/domus/domus-1.webp",
        layout: "single",
      },
      {
        image: "/images/projects/domus/domus-2.webp",
        layout: "single",
      },
      {
        image: "/images/projects/domus/domus-3.webp",
        layout: "single",
      },
      {
        image: "/images/projects/domus/domus-4.webp",
        layout: "single",
      },
      {
        image: "/images/projects/domus/domus-5.webp",
        layout: "single",
      },
      {
        image: "/images/projects/domus/domus-6.webp",
        layout: "single",
      },
      {
        image: "/images/projects/domus/domus-7.webp",
        layout: "single",
      },
      {
        image: "/images/projects/domus/domus-8_1.webp",
        layout: "grid",
      },
      {
        image: "/images/projects/domus/domus-8_2.webp",
        layout: "grid",
      },
    ],
  },
  {
    visibleInHome: false,
    pos: "right",
    size: "medium",
    title: "Reyden",
    subTitle:
      "Engineering industrial solutions focused on precision and performance.",
    year: "2025",
    image: "/images/projects/reyden/reyden.webp",
    category: [
      "AI Product Design",
      "UI/UX Design",
      "Web Development",
      "Interaction Design",
    ],
    slug: "reyden",
    tabs: [
      {
        id: "challenge",
        label: "The challenge",
        content:
          "Reyden operates in a technically complex space where information can easily feel heavy and difficult to navigate. The goal was to transform this into a clear and engaging digital experience without losing depth. It required simplifying structure while maintaining credibility. The challenge was to make industrial feel modern, refined, and accessible.",
      },
      {
        id: "approach",
        label: "Approach",
        content:
          "We created a structured design system that balances clarity with a premium visual language. Content was reorganized to improve flow and readability across all sections. Subtle motion and interactions were introduced to guide users naturally through the experience. Every detail was aligned to reflect precision and innovation.",
      },
      {
        id: "outcome",
        label: "Outcome",
        content:
          "The final experience presents Reyden as a confident and forward-thinking industrial brand. Complex information is now easier to understand and navigate. The website feels clean, structured, and engaging across devices. It strengthens both usability and brand perception at every touchpoint.",
      },
      {
        id: "wedid",
        label: "What we did",
        content:
          "<ul><li>Designed a clean and structured UI focused on clarity and usability.</li><li>Developed a responsive website with smooth and optimized performance.</li><li>Simplified complex content into intuitive and easy to navigate layouts.</li><li>Crafted refined interactions to enhance engagement without distraction.</li></ul>",
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
        image: "/images/projects/reyden/reyden-3.webp",
        layout: "single",
      },
      {
        image: "/images/projects/reyden/reyden-4_1.webp",
        layout: "grid",
      },
      {
        image: "/images/projects/reyden/reyden-4_2.webp",
        layout: "grid",
      },
      {
        image: "/images/projects/reyden/reyden-5.webp",
        layout: "single",
      },
      {
        image: "/images/projects/reyden/reyden-6.webp",
        layout: "single",
      },
      {
        image: "/images/projects/reyden/reyden-7.webp",
        layout: "single",
      },
    ],
  },
  {
    visibleInHome: false,
    pos: "center",
    size: "xlarge",
    title: "Revnet",
    subTitle: "Scalable hybrid cloud solutions for enterprises.",
    year: "2025",
    image: "/images/projects/revnet/revnet.webp",
    category: [
      "UI/UX Design",
      "Web Development",
      "Responsive Design",
      "Interaction Design",
    ],
    slug: "revnet",
    tabs: [
      {
        id: "challenge",
        label: "The challenge",
        content:
          "RevNet needed a website that could communicate complex hybrid cloud and infrastructure services in a clear and approachable way. The challenge was to balance enterprise-level credibility with a modern user experience that felt simple, structured, and easy to navigate. The platform also needed to reflect trust, scalability, and technical expertise without overwhelming visitors with heavy technical language.",
      },
      {
        id: "approach",
        label: "Approach",
        content:
          "TRIONN designed a clean and modern digital experience focused on clarity and usability. We structured the content flow to simplify technical information while maintaining a strong enterprise presence. Responsive layouts, refined UI elements, and balanced visual hierarchy helped create a seamless browsing experience across all devices.",
      },
      {
        id: "outcome",
        label: "Outcome",
        content:
          "The final platform gives RevNet a stronger and more professional digital identity. The redesigned experience improves how users explore services, understand infrastructure solutions, and connect with the brand. The website now feels scalable, trustworthy, and aligned with RevNet's forward-thinking technology vision.",
      },
      {
        id: "wedid",
        label: "What we did",
        content:
          "<ul><li>Designed a modern UI/UX experience tailored for enterprise technology audiences.</li><li>Developed a responsive and performance-focused website across all devices.</li><li>Simplified complex cloud infrastructure content into clear user journeys.</li><li>Built a scalable digital platform focused on trust, clarity, and usability.</li></ul>",
      },
    ],
    liveURL: "#",
    content: [
      {
        image: "/images/projects/revnet/revnet-1.webp",
        layout: "single",
      },
      {
        image: "/images/projects/revnet/revnet-2.webp",
        layout: "single",
      },
      {
        image: "/images/projects/revnet/revnet-3.webp",
        layout: "single",
      },
      {
        image: "/images/projects/revnet/revnet-4.webp",
        layout: "single",
      },
      {
        image: "/images/projects/revnet/revnet-5.webp",
        layout: "single",
      },
      {
        image: "/images/projects/revnet/revnet-6.webp",
        layout: "single",
      },
      {
        image: "/images/projects/revnet/revnet-7.webp",
        layout: "single",
      },
    ],
  },
  {
    visibleInHome: false,
    pos: "left",
    size: "small",
    title: "Finora",
    subTitle: "Modern fintech platform for smart digital finance.",
    year: "2025",
    image: "/images/projects/finora/finora.webp",
    category: [
      "UI/UX Design",
      "Dashboard System",
      "Web Development",
      "Fintech Experience",
    ],
    slug: "finora",
    tabs: [
      {
        id: "challenge",
        label: "The challenge",
        content:
          "Finora needed a digital experience that could simplify complex financial interactions while still feeling modern, premium, and approachable. The platform had to balance usability with strong visual identity across dashboards, cards, invoices, and analytics. Creating clarity without making the interface feel cold or overly technical was a key challenge throughout the product experience.",
      },
      {
        id: "approach",
        label: "Approach",
        content:
          "TRIONN designed Finora with a clean visual system focused on clarity, spacing, and intuitive interaction. Soft gradients, bold typography, and modular dashboard components were combined to create a lightweight yet premium fintech experience. Every screen was carefully structured to improve readability, simplify navigation, and maintain consistency across the entire platform.",
      },
      {
        id: "outcome",
        label: "Outcome",
        content:
          "The final product delivered a polished fintech experience that feels both functional and visually distinctive. Finora presents financial data in a way that is easy to understand while maintaining a strong modern identity. The platform now communicates trust, efficiency, and usability through a refined interface designed for everyday financial management.",
      },
      {
        id: "wedid",
        label: "What we did",
        content:
          "<ul><li>Designed a modern fintech dashboard system with a clean visual hierarchy.</li><li>Created responsive card management, invoice, and analytics interfaces.</li><li>Developed a scalable UI system focused on usability and consistency.</li><li>Crafted a premium digital experience with modern fintech aesthetics.</li></ul>",
      },
    ],
    liveURL: "#",
    content: [
      {
        image: "/images/projects/finora/finora-1.webp",
        layout: "single",
      },
      {
        image: "/images/projects/finora/finora-2.webp",
        layout: "single",
      },
      {
        image: "/images/projects/finora/finora-3.webp",
        layout: "single",
      },
      {
        image: "/images/projects/finora/finora-4.webp",
        layout: "single",
      },
      {
        image: "/images/projects/finora/finora-5.webp",
        layout: "single",
      },
    ],
  },
  {
    visibleInHome: false,
    pos: "right",
    size: "large",
    title: "Monotex",
    subTitle: "A modern finance app designed for smarter everyday banking.",
    year: "2025",
    image: "/images/projects/monotex/monotex.webp",
    category: [
      "UI/UX Design",
      "Mobile App Design",
      "Product Design",
      "Product Strategy",
    ],
    slug: "monotex",
    tabs: [
      {
        id: "challenge",
        label: "The challenge",
        content:
          "Monotex required a mobile banking experience that could present complex financial information in a simple and intuitive way. The app needed to feel modern, trustworthy, and easy to navigate across multiple user journeys. Maintaining clarity while designing feature rich screens was a key part of the challenge.",
      },
      {
        id: "approach",
        label: "Approach",
        content:
          "TRIONN designed a clean and user focused mobile UI system with a strong emphasis on usability and visual balance. Bold gradients, soft layouts, and structured information hierarchy helped create a seamless fintech experience. Every screen was crafted to feel smooth, accessible, and visually engaging.",
      },
      {
        id: "outcome",
        label: "Outcome",
        content:
          "The final design delivered a polished fintech experience that feels modern, intuitive, and highly functional. Users can easily navigate payments, analytics, onboarding, and credit related features through a consistent interface. The result is a refined mobile product with a strong and memorable digital identity.",
      },
      {
        id: "wedid",
        label: "What we did",
        content:
          "<ul><li>Designed a modern mobile banking and fintech app experience.</li><li>Created intuitive UI flows for payments, analytics, and credit management.</li><li>Crafted a clean visual identity with vibrant gradients and minimal layouts.</li><li>Designed seamless onboarding, profile, and account interaction screens.</li></ul>",
      },
    ],
    liveURL: "#",
    content: [
      {
        image: "/images/projects/monotex/monotex-1.webp",
        layout: "single",
      },
      {
        image: "/images/projects/monotex/monotex-2.webp",
        layout: "single",
      },
      {
        image: "/images/projects/monotex/monotex-3.webp",
        layout: "single",
      },
      {
        image: "/images/projects/monotex/monotex-4.webp",
        layout: "single",
      },
      {
        image: "/images/projects/monotex/monotex-5.webp",
        layout: "single",
      },
      {
        image: "/images/projects/monotex/monotex-6.webp",
        layout: "single",
      },
      {
        image: "/images/projects/monotex/monotex-7.webp",
        layout: "single",
      },
    ],
  },
  {
    visibleInHome: false,
    pos: "left",
    size: "medium",
    title: "8octa",
    subTitle: "Bold branding for modern data analytics.",
    year: "2025",
    image: "/images/projects/8octa/8octa.webp",
    category: [
      "Brand Identity",
      "Logo Design",
      "Identity Design",
      "Packaging Design",
    ],
    slug: "8octa",
    tabs: [
      {
        id: "challenge",
        label: "The challenge",
        content:
          "8Octa needed a brand identity that felt modern, intelligent, and instantly recognizable. The challenge was creating a visual system that balanced minimal aesthetics with strong geometric structure. It also had to work seamlessly across digital platforms, merchandise, and brand communication.",
      },
      {
        id: "approach",
        label: "Approach",
        content:
          "TRIONN crafted a futuristic identity using modular shapes, clean typography, and a bold blue visual palette. Every element was designed with precision to create consistency across all touchpoints. The system was built to feel sleek, scalable, and highly adaptable.",
      },
      {
        id: "outcome",
        label: "Outcome",
        content:
          "The final branding gave 8Octa a confident and memorable visual presence. The identity feels modern, premium, and highly flexible across digital and physical applications. It successfully positioned the brand with a strong technology focused aesthetic.",
      },
      {
        id: "wedid",
        label: "What we did",
        content:
          "<ul><li>Developed a modern visual identity system for the brand.</li><li>Designed a custom geometric logo and scalable brand assets.</li><li>Created typography, color palette, and brand application guidelines.</li><li>Designed cohesive branding across digital, print, and merchandise touchpoints.</li></ul>",
      },
    ],
    liveURL: "#",
    content: [
      {
        image: "/images/projects/8octa/8octa-1.webp",
        layout: "single",
      },
      {
        image: "/images/projects/8octa/8octa-2.webp",
        layout: "single",
      },
      {
        image: "/images/projects/8octa/8octa-3_1.webp",
        layout: "grid",
      },
      {
        image: "/images/projects/8octa/8octa-3_2.webp",
        layout: "grid",
      },
      {
        image: "/images/projects/8octa/8octa-4.webp",
        layout: "single",
      },
      {
        image: "/images/projects/8octa/8octa-5.webp",
        layout: "single",
      },
      {
        image: "/images/projects/8octa/8octa-6_1.webp",
        layout: "grid",
      },
      {
        image: "/images/projects/8octa/8octa-6_2.webp",
        layout: "grid",
      },
      {
        image: "/images/projects/8octa/8octa-7.webp",
        layout: "single",
      },
      {
        image: "/images/projects/8octa/8octa-8.webp",
        layout: "single",
      },
      {
        image: "/images/projects/8octa/8octa-9.webp",
        layout: "single",
      },
    ],
  },
  {
    visibleInHome: false,
    pos: "center",
    size: "xlarge",
    title: "Stuffosome",
    subTitle: "Luxury eyewear branding crafted with bold minimal elegance.",
    year: "2025",
    image: "/images/projects/stuffosome/stuffosome.webp",
    category: [
      "Brand Identity",
      "Logo Design",
      "Identity Design",
      "Packaging Design",
    ],
    slug: "stuffosome",
    tabs: [
      {
        id: "challenge",
        label: "The challenge",
        content:
          "Stuffosome needed a brand identity that felt premium, modern, and fashion focused across every touchpoint. The challenge was creating a visual language that stood out in the eyewear space while keeping the overall aesthetic clean and timeless. The brand needed strong recognition without feeling overly complex.",
      },
      {
        id: "approach",
        label: "Approach",
        content:
          "TRIONN created a refined identity system inspired by the form and symmetry of eyewear frames. We combined elegant typography, minimal layouts, and warm luxury tones to build a sophisticated visual direction. Every brand element was designed to feel stylish, balanced, and highly adaptable.",
      },
      {
        id: "outcome",
        label: "Outcome",
        content:
          "The final identity gave Stuffosome a bold and memorable presence with a premium editorial feel. The branding works seamlessly across packaging, print, social media, and campaign visuals. The result is a cohesive and visually striking brand experience built for modern luxury audiences.",
      },
      {
        id: "wedid",
        label: "What we did",
        content:
          "<ul><li>Designed a complete luxury eyewear brand identity system.</li><li>Created custom logo, typography, and visual language.</li><li>Created custom logo, typography, and visual language.</li><li>Crafted editorial style layouts for digital and print branding.</li></ul>",
      },
    ],
    liveURL: "#",
    content: [
      {
        image: "/images/projects/stuffosome/stuffosome-1.webp",
        layout: "single",
      },
      {
        image: "/images/projects/stuffosome/stuffosome-2.webp",
        layout: "single",
      },
      {
        image: "/images/projects/stuffosome/stuffosome-3.webp",
        layout: "single",
      },
      {
        image: "/images/projects/stuffosome/stuffosome-4.webp",
        layout: "single",
      },
      {
        image: "/images/projects/stuffosome/stuffosome-5.webp",
        layout: "single",
      },
      {
        image: "/images/projects/stuffosome/stuffosome-6_1.webp",
        layout: "grid",
      },
      {
        image: "/images/projects/stuffosome/stuffosome-6_2.webp",
        layout: "grid",
      },
      {
        image: "/images/projects/stuffosome/stuffosome-7.webp",
        layout: "single",
      },
      {
        image: "/images/projects/stuffosome/stuffosome-8.webp",
        layout: "single",
      },
      {
        image: "/images/projects/stuffosome/stuffosome-9_1.webp",
        layout: "grid",
      },
      {
        image: "/images/projects/stuffosome/stuffosome-9_2.webp",
        layout: "grid",
      },
    ],
  },
  {
    visibleInHome: false,
    pos: "right",
    size: "small",
    title: "Novaglam",
    subTitle:
      "The fashion e-commerce platform for browsing curated collections.",
    year: "2025",
    image: "/images/projects/novaglam/novaglam.webp",
    category: [
      "UI/UX Design",
      "Web Design",
      "Web Development",
      "E-commerce Experience",
    ],
    slug: "novaglam",
    tabs: [
      {
        id: "challenge",
        label: "The challenge",
        content:
          "Novaglam needed to translate a strong fashion identity into a digital experience that felt editorial and premium. The key challenge was balancing visual storytelling with usability, ensuring smooth product discovery. Maintaining consistency across multiple pages while keeping performance fast and clean was equally important.",
      },
      {
        id: "approach",
        label: "Approach",
        content:
          "We crafted a minimal, editorial-inspired design using bold typography and vibrant imagery. The layout was structured to guide users naturally from browsing to product exploration. Development focused on smooth interactions, responsive behavior, and optimized performance across devices.",
      },
      {
        id: "outcome",
        label: "Outcome",
        content:
          "The result is a refined e-commerce experience that feels both modern and expressive. Novaglam delivers a seamless journey with strong visual impact and intuitive navigation. The platform elevates the brand while supporting effortless product discovery and engagement.",
      },
      {
        id: "wedid",
        label: "What we did",
        content:
          "<ul><li>Designed a clean, editorial UI with strong typography and visual hierarchy.</li><li>Developed a responsive and high-performance e-commerce experience.</li><li>Created intuitive navigation for smooth product discovery.</li><li>Optimized interactions and layouts for a seamless user journey.</li></ul>",
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
    size: "large",
    title: "First Ground Coffee",
    subTitle:
      "An ecommerce platform for discovering and buying premium coffee.",
    year: "2025",
    image: "/images/projects/first-ground/first-ground.webp",
    category: [
      "UI/UX Design",
      "Web Design",
      "E-commerce Experience",
      "Brand Experience",
    ],
    slug: "first-ground-coffee",
    tabs: [
      {
        id: "challenge",
        label: "The challenge",
        content:
          "FirstGround Coffee needed a digital presence that goes beyond a typical ecommerce store. The challenge was to balance storytelling with seamless product discovery without overwhelming the user. It required building a strong brand identity while maintaining clarity, usability, and performance across the entire experience.",
      },
      {
        id: "approach",
        label: "Approach",
        content:
          "We created a clean, editorial-style interface that blends brand storytelling with structured ecommerce. Bold typography, minimal layouts, and curated imagery establish a calm yet premium feel. The experience was designed to guide users naturally from exploration to purchase with intuitive interactions and smooth navigation.",
      },
      {
        id: "outcome",
        label: "Outcome",
        content:
          "The final result is a cohesive and modern digital platform that elevates the brand experience. It delivers a seamless journey from discovery to checkout while maintaining a strong visual identity. FirstGround now stands as a premium coffee brand with a clear, confident, and engaging online presence.",
      },
      {
        id: "wedid",
        label: "What we did",
        content:
          "<ul><li>Designed a clean and modern UIUX system focused on clarity and flow.</li><li>Developed a fast and responsive ecommerce experience across devices.</li><li>Crafted a strong visual identity through typography and imagery.</li><li>Optimized user journeys for seamless discovery and conversion.</li></ul>",
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
    pos: "right",
    size: "medium",
    title: "Reelix",
    subTitle:
      "Filmmaking studio showcasing projects, services and storytelling.",
    year: "2025",
    image: "/images/projects/reelix/reelix.webp",
    category: [
      "UI/UX Design",
      "Web Design",
      "Web Development",
      "Creative Direction",
      "Motion Design",
    ],
    slug: "reelix",
    tabs: [
      {
        id: "challenge",
        label: "The challenge",
        content:
          "Reelix needed to express cinematic depth without becoming visually overwhelming. The challenge was to translate filmmaking craft into a structured digital experience that still felt emotional and immersive. It had to balance storytelling, clarity, and performance across every section. At the same time, the platform needed to feel editorial, refined, and easy to navigate.",
      },
      {
        id: "approach",
        label: "Approach",
        content:
          "We designed the experience like a film sequence, guided by rhythm and pacing. Bold typography and cinematic visuals were used to create hierarchy and flow. Each section was carefully structured to move the user naturally from story to story. Subtle motion and transitions were added to enhance the narrative without distraction.",
      },
      {
        id: "outcome",
        label: "Outcome",
        content:
          "The final experience feels cinematic, clear, and intentional. Reelix now showcases its work with stronger impact and better storytelling flow. The platform elevates the brand while keeping the focus on the craft behind each project. It leaves a lasting impression through simplicity, emotion, and precision.",
      },
      {
        id: "wedid",
        label: "What we did",
        content:
          "<ul><li>Crafted a cinematic UIUX system focused on storytelling and clarity.</li><li>Designed and developed a fully responsive, high-performance website.</li><li>Built structured project showcases with strong visual hierarchy.</li><li>Implemented subtle motion and transitions to enhance user flow.</li></ul>",
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
    pos: "center",
    size: "xlarge",
    title: "Z1Flux Solar",
    subTitle: "Solar technology and manufacturing showcase website.",
    year: "2025",
    image: "/images/projects/z1-flux-solar/z1-flux-solar.webp",
    category: [
      "UI/UX Design",
      "Web Design",
      "Web Development",
      "Interaction Design",
      "Creative Direction",
    ],
    slug: "z1-flux-solar",
    tabs: [
      {
        id: "challenge",
        label: "The challenge",
        content:
          "Z1Flux Solar needed a digital experience that reflects both industrial scale and technological precision. The challenge was to present complex capabilities and high-capacity production in a clear and engaging way. It required balancing strong visual storytelling with structured content. All while maintaining performance and clarity across devices.",
      },
      {
        id: "approach",
        label: "Approach",
        content:
          "We crafted a minimal, high-contrast visual system driven by typography and composition. Modular layouts simplified dense information into digestible sections. Subtle motion and interactions were used to guide users naturally through the experience. Every detail was refined to feel precise, responsive, and premium.",
      },
      {
        id: "outcome",
        label: "Outcome",
        content:
          "The result is a high-impact digital experience crafted by Trionn that positions Z1Flux Solar as a forward-thinking brand. It communicates scale and credibility while remaining intuitive and visually striking. The platform creates a seamless journey and strengthens overall brand perception. A refined blend of engineering precision and modern digital craft.",
      },
      {
        id: "wedid",
        label: "What we did",
        content:
          "<ul><li>Strategic UX planning and content structuring for complex industrial storytelling.</li><li>Minimal UI design system with strong typography and premium visual balance.</li> <li>High-performance front-end development with smooth interactions and responsiveness.</li><li>Motion and interaction design to enhance flow, clarity, and user engagement.</li></ul>",
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
    pos: "left",
    size: "medium",
    title: "Techno",
    subTitle: "Smart technology for seamless event experiences.",
    year: "2025",
    image: "/images/projects/techno/techno.webp",
    category: [
      "UI/UX Design",
      "Web Design",
      "Web Development",
      "Interaction Design",
    ],
    slug: "techno",
    tabs: [
      {
        id: "challenge",
        label: "The challenge",
        content:
          "Techno needed a digital experience that could reflect the scale and innovation of its event technology solutions. The challenge was creating a platform that felt modern and high impact while still communicating trust, clarity, and operational expertise. The website also needed to balance strong visuals with structured content for different audiences.",
      },
      {
        id: "approach",
        label: "Approach",
        content:
          "TRIONN created a cinematic and minimal interface built around bold typography, immersive imagery, and clean layouts. Every section was designed to guide users through the brand story with clarity and visual impact. Smooth interactions and carefully balanced spacing helped create a premium browsing experience across devices.",
      },
      {
        id: "outcome",
        label: "Outcome",
        content:
          "The final platform gives Techno a confident and future focused digital presence. The experience feels modern, engaging, and aligned with the brand's innovation driven identity. The result is a scalable website that strengthens brand perception while delivering a seamless user experience.",
      },
      {
        id: "wedid",
        label: "What we did",
        content:
          "<ul><li>Designed a bold and immersive event technology website experience.</li><li>Crafted modern UI/UX with strong typography and cinematic visuals.</li> <li>Developed responsive layouts focused on clarity and engagement.</li><li>Built smooth interactions and scalable frontend components.</li></ul>",
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
      {
        image: "/images/projects/techno/techno-5.webp",
        layout: "single",
      },
      {
        image: "/images/projects/techno/techno-6_1.webp",
        layout: "grid",
      },
      {
        image: "/images/projects/techno/techno-6_2.webp",
        layout: "grid",
      },
      {
        image: "/images/projects/techno/techno-7.webp",
        layout: "single",
      },
    ],
  },
  {
    visibleInHome: false,
    pos: "right",
    size: "large",
    title: "iMusic",
    subTitle: "Smart technology for seamless event experiences.",
    year: "2025",
    image: "/images/projects/imusic/imusic.webp",
    category: [
      "UI/UX Design",
      "Mobile App Design",
      "Interaction Design",
      "Visual Design",
    ],
    slug: "imusic",
    tabs: [
      {
        id: "challenge",
        label: "The challenge",
        content:
          "The challenge was to design a music app that felt immersive while staying simple and easy to use. The experience needed to handle playlists, albums, artists, and playback without creating visual clutter. The interface also had to feel modern, emotional, and highly engaging for everyday listeners.",
      },
      {
        id: "approach",
        label: "Approach",
        content:
          "TRIONN designed a bold dark themed mobile experience inspired by modern music culture. Vibrant gradients, clean layouts, and smooth interactions were combined to create a seamless listening journey. Every screen was crafted to feel visually rich while maintaining clarity and usability.",
      },
      {
        id: "outcome",
        label: "Outcome",
        content:
          "The final app experience feels immersive, premium, and easy to navigate across every touchpoint. The design system creates consistency between discovery, playback, and personalization screens. The result is a modern music interface built to keep users engaged and connected with content.",
      },
      {
        id: "wedid",
        label: "What we did",
        content:
          "<ul><li>Designed a modern mobile music app experience.</li><li>Created immersive playback and discovery interfaces.</li> <li>Built a vibrant dark themed visual system.</li><li>Crafted smooth and engaging mobile interactions.</li></ul>",
      },
    ],
    liveURL: "#",
    content: [
      {
        image: "/images/projects/imusic/imusic-1.webp",
        layout: "single",
      },
      {
        image: "/images/projects/imusic/imusic-2.webp",
        layout: "single",
      },
      {
        image: "/images/projects/imusic/imusic-3.webp",
        layout: "single",
      },
      {
        image: "/images/projects/imusic/imusic-4.webp",
        layout: "single",
      },
      {
        image: "/images/projects/imusic/imusic-5.webp",
        layout: "single",
      },
      {
        image: "/images/projects/imusic/imusic-6.webp",
        layout: "single",
      },
      {
        image: "/images/projects/imusic/imusic-7_1.webp",
        layout: "grid",
      },
      {
        image: "/images/projects/imusic/imusic-7_2.webp",
        layout: "grid",
      },
      {
        image: "/images/projects/imusic/imusic-8.webp",
        layout: "single",
      },
    ],
  },
];

export const contactFAQ: FaqItemType[] = [
  {
    title: "What kind of work do you take on?",
    content:
      "We partner on branding, websites, and digital systems where clarity, craft, and execution matter.",
  },
  {
    title: "Who do you usually work with?",
    content:
      "We work with startups and established brands that value thoughtful design and long-term impact.",
  },
  {
    title: "How do projects typically begin?",
    content:
      "With a conversation. We start by understanding goals, context, and constraints before defining the path forward.",
  },
  {
    title: "Do you collaborate with agencies on long-term engagements?",
    content:
      "Yes. We partner with agencies on ongoing engagements, supporting design, development, or execution where needed. OR USE THIS: Yes. We support agencies on long-term, white-label engagements as an extended team.",
  },
  {
    title: "Can we sign an NDA before starting?",
    content:
      "Yes. We're comfortable signing NDAs and treat all discussions and materials as confidential.",
  },
  {
    title: "How are projects priced and paid for?",
    content:
      "Projects are scoped based on complexity and delivered through milestone-based payments, starting with a deposit.",
  },
  {
    title: "Are you currently taking on new work?",
    content:
      "Selectively. We take on a limited number of projects to maintain focus and quality.",
  },
];
