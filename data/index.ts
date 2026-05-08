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
      "I've worked with Trionn on several projects and  he's one of the best UI/UX designers and front-end developers I know. He's meticulous in his attention to detail and has a true passion for  creating beautiful user interfaces.",
    clientImage: "/images/malte.jpg",
    clientName: "Malte Smith",
    clientDeg: "Founder and CEO",
    videoURL: "https://www.youtube.com/embed/rOAsYNtPAmQ",
  },
  {
    companyName: "credible",
    quoteMessage:
      "The Trionn team is extremely reliable, professional & talented. It has been a great pleasure collaborating with them over many months.",
    clientImage: "/images/stephen.jpg",
    clientName: "Stephen Dash",
    clientDeg: "Founder and CEO",
    videoURL: "https://www.youtube.com/embed/rOAsYNtPAmQ",
  },
  {
    companyName: "Indian Army",
    quoteMessage:
      "Our team is a small group of curious individuals dedicated to creating  work that we're proud of, collaborating with brands and people who share  our values. ",
    clientImage: "/images/malte.jpg",
    clientName: "Malte Smith",
    clientDeg: "Founder and CEO",
    videoURL: "https://www.youtube.com/embed/rOAsYNtPAmQ?autoplay=1",
  },
  {
    companyName: "Linkedin",
    quoteMessage:
      "The Trionn team is extremely reliable, professional & talented. It has been a great pleasure collaborating with them over many months.",
    clientImage: "/images/stephen.jpg",
    clientName: "Stephen Dash",
    clientDeg: "Founder and CEO",
    videoURL: "https://www.youtube.com/embed/rOAsYNtPAmQ",
  },
  {
    companyName: "Bulklet Army",
    quoteMessage:
      "Our team is a small group of curious individuals dedicated to creating  work that we're proud of, collaborating with brands and people who share  our values. ",
    clientImage: "/images/malte.jpg",
    clientName: "Malte Smith",
    clientDeg: "Founder and CEO",
    videoURL: "https://www.youtube.com/embed/rOAsYNtPAmQ",
  },
  {
    companyName: "Technis INC",
    quoteMessage:
      "The Trionn team is extremely reliable, professional & talented. It has been a great pleasure collaborating with them over many months.",
    clientImage: "/images/stephen.jpg",
    clientName: "Stephen Dash",
    clientDeg: "Founder and CEO",
    videoURL: "https://www.youtube.com/embed/rOAsYNtPAmQ",
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
    ],
  },
  {
    visibleInHome: true,
    pos: "right",
    size: "medium",
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
    pos: "left",
    size: "small",
    title: "GridFree AI",
    subTitle:
      "Building a bold visual system for a modern brand.",
    year: "2025",
    image: "/images/projects/gridfree-ai/gridfree-ai.webp",
    category: [
      "UI/UX Design",
      "Web Design",
      "Web Development",
      "Interaction Design",
    ],
    slug: "gridfree-ai",
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
    size: "medium",
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
    pos: "center",
    size: "xlarge",
    title: "Techno",
    subTitle:
      "Building a bold visual system for a modern brand.",
    year: "2025",
    image: "/images/projects/techno/techno.webp",
    category: [
      "UI/UX Design",
      "Web Design",
      "Web Development",
      "Interaction Design",
    ],
    slug: "techno",
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
    pos: "left",
    size: "large",
    title: "Clara Healthcare",
    subTitle:
      "Building a bold visual system for a modern brand.",
    year: "2025",
    image: "/images/projects/clara-healthcare/clara-healthcare.webp",
    category: [
      "UI/UX Design",
      "Web Design",
      "Web Development",
      "Interaction Design",
    ],
    slug: "clara-healthcare",
    liveURL: "#",
    content: [
      {
        image: "/images/projects/clara-healthcare/clara-healthcare-1.webp",
        layout: "single",
      },
      {
        image: "/images/projects/clara-healthcare/clara-healthcare-2.webp",
        layout: "single",
      },
      {
        image: "/images/projects/clara-healthcare/clara-healthcare-3.webp",
        layout: "single",
      },
      {
        image: "/images/projects/clara-healthcare/clara-healthcare-4.webp",
        layout: "single",
      },
      {
        image: "/images/projects/clara-healthcare/clara-healthcare-5.webp",
        layout: "single",
      },
      {
        image: "/images/projects/clara-healthcare/clara-healthcare-6.webp",
        layout: "single",
      },
      {
        image: "/images/projects/clara-healthcare/clara-healthcare-7.webp",
        layout: "single",
      },
      {
        image: "/images/projects/clara-healthcare/clara-healthcare-8.webp",
        layout: "single",
      },
    ],
  },
  {
    visibleInHome: false,
    pos: "right",
    size: "medium",
    title: "Z1Flux Solar",
    subTitle:
      "Solar technology and manufacturing showcase website.",
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
    pos: "center",
    size: "xlarge",
    title: "Improvi AI",
    subTitle:
      "AI-powered productivity platform for faster, smarter workflows",
    year: "2025",
    image: "/images/projects/improvi/improvi.webp",
    category: [
      "AI Product Design",
      "UI/UX Design",
      "Web Design",
      "Interaction Design",
    ],
    slug: "improvi-ai",
    tabs: [
      {
        id: "challenge",
        label: "The challenge",
        content:
          "Improvi.ai needed to simplify a complex AI-driven product into an experience that feels intuitive and clear. The core challenge was communicating advanced capabilities without overwhelming users. At the same time, the platform had to feel modern and trustworthy. Balancing clarity with innovation became the key focus.",
      },
      {
        id: "approach",
        label: "Approach",
        content:
          "We structured the experience around clarity, using strong hierarchy and simplified content flows. A minimal design system allowed the product's intelligence to stand out naturally. Thoughtful interactions and smooth transitions guided users through the journey. Every detail was refined to feel fast, clean, and confident.",
      },
      {
        id: "outcome",
        label: "Outcome",
        content:
          "The result is a seamless digital experience that makes AI feel accessible and easy to understand. Users can quickly grasp the product's value and navigate it effortlessly. The platform now reflects a strong, forward-thinking identity. Trionn helped transform complexity into a clear and engaging product story.",
      },
      {
        id: "wedid",
        label: "What we did",
        content:
          "<ul><li>Defined a clear product narrative and simplified user journey.</li><li>Designed a modern interface aligned with AI-driven experiences.</li><li>Built smooth interactions focused on usability and performance.</li><li>Developed a scalable front-end optimized for speed and clarity.</li></ul>",
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
    visibleInHome: false,
    pos: "right",
    size: "large",
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
    title: "DFZ Watch",
    subTitle:
      "A clean platform to discover, customize, and buy luxury watches.",
    year: "2025",
    image: "/images/projects/dfz/dfz.webp",
    category: [
      "UI/UX Design",
      "Web Design",
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
