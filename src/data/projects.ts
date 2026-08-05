export type ProjectSection = {
  heading: string;
  eyebrow: string;
  body: string;
  bullets?: string[];
};

export type Project = {
  slug: string;
  index: string;
  title: string;
  tag: string;
  tags: string[];
  summary: string;
  role: string;
  category: string;
  tools: string;
  liveLink: string;
  androidLink?: string;
  iosLink?: string;
  figmaLink: string;
  coverImage: string;
  sections: ProjectSection[];
  outcomes: string[];
};

export const projects: Project[] = [
  {
    slug: "multiservice-platform",
    index: "01",
    title: "Multiservice Platform",
    tag: "Marketplace",
    tags: ["Marketplace", "Mobile App", "On-demand"],
    summary:
      "A dual-sided service marketplace designed for seamless booking, provider coordination, and visible trust signals across customer and partner journeys.",
    role: "UI/UX Designer — Dual-sided IA, User Flows, UI Design, Design System",
    category: "On-demand Services / Marketplace",
    tools: "Figma, FigJam",
    liveLink: "",
    androidLink: "https://play.google.com/store/apps/details?id=com.flickez&pcampaignid=web_share",
    iosLink: "https://apps.apple.com/in/app/flickez-partner/id6744884537",
    figmaLink: "",
    coverImage: "/projects/project2.png",
    sections: [
      {
        eyebrow: "Problem & Context",
        heading: "The challenge",
        body: "Users struggled to book trusted local services because discovery, booking, and coordination were split across scattered touchpoints. Providers also lacked a clear way to manage availability, acceptance, and earnings.",
      },
      {
        eyebrow: "Role & Responsibilities",
        heading: "What I owned",
        body: "Led UX research, mapped dual-sided journeys, and designed customer and provider interfaces within a shared design system.",
      },
      {
        eyebrow: "Research & Insights",
        heading: "What I found",
        body: "Interviews showed customers cared most about trust, live updates, and a clear booking confirmation. Providers needed simpler schedule visibility and faster job acceptance without extra coordination.",
        bullets: [
          "Customers wanted real-time ETA and clearer trust signals",
          "Providers needed a fast, visible schedule view with job acceptance",
        ],
      },
      {
        eyebrow: "Outcome & Impact",
        heading: "The solution",
        body: "Delivered a dual-sided marketplace with a clean booking flow, live tracking, and provider-focused scheduling tools that reduced friction for both sides of the experience.",
      },
    ],
    outcomes: [
      "Dual-sided app design",
      "Live booking & tracking",
      "Provider schedule dashboard",
      "Scalable category system",
    ],
  },
  {
    slug: "invoice-maker-app",
    index: "02",
    title: "Invoice Maker App",
    tag: "FinTech",
    tags: ["FinTech", "Mobile App", "Productivity"],
    summary:
      "A mobile-first invoice tool for freelancers that simplifies billing, payments, and follow-ups with a polished, low-friction workflow.",
    role: "UI/UX Designer — User Research, Flow Design, UI Design, Prototype",
    category: "FinTech / Freelancer Productivity",
    tools: "Figma, ProtoPie",
    liveLink: "",
    androidLink: "https://play.google.com/store/apps/details?id=com.hyperlink.invoicemaker",
    iosLink: "https://apps.apple.com/in/app/invoice-maker-app/id6744884537",
    figmaLink: "",
    coverImage: "/projects/project4.png",
    sections: [
      {
        eyebrow: "Problem & Context",
        heading: "The challenge",
        body: "Freelancers were delaying invoicing because the process felt manual, slow, and awkward. Existing tools were either too complex for casual use or too basic to feel professional.",
      },
      {
        eyebrow: "Role & Responsibilities",
        heading: "What I owned",
        body: "Owned UX research, flow design, mobile UI, and prototype work for a faster, mobile-first invoice workflow.",
      },
      {
        eyebrow: "Research & Insights",
        heading: "What I found",
        body: "Freelancers wanted reusable client data, a cleaner invoice structure, and fewer steps to follow up on payments. The biggest drop-off came from blank-page anxiety when users opened a new invoice.",
        bullets: [
          "Users wanted templates instead of a blank screen",
          "Client profiles would remove repeated data entry",
          "Payment reminders needed to feel helpful, not pushy",
        ],
      },
      {
        eyebrow: "Outcome & Impact",
        heading: "The solution",
        body: "Designed a template-first invoice flow with reusable client profiles and automated reminders that made billing feel simple, quick, and polished on mobile.",
      },
    ],
    outcomes: [
      "Sub-2-min invoice creation",
      "Automated payment reminders",
      "Client profile system",
      "Professional PDF export",
    ],
  },
  {
    slug: "recruit-limitless",
    index: "03",
    title: "Recruit Limitless",
    tag: "HR SaaS",
    tags: ["HR SaaS", "Web App", "Dashboard"],
    summary:
      "A recruitment platform that simplifies hiring workflows with a clear pipeline view and faster collaboration for recruiters and hiring teams.",
    role: "UI/UX Designer — UX Research, Information Architecture, Dashboard Design, Prototyping",
    category: "HR SaaS / Recruitment Technology",
    tools: "Figma, FigJam",
    liveLink: "https://recruitlimitless.com/",
    figmaLink: "",
    coverImage: "/projects/project3.png",
    sections: [
      {
        eyebrow: "Problem & Context",
        heading: "The challenge",
        body: "Recruiters were working across spreadsheet, email, calendar, and ATS tools, which made hiring decisions slower and harder to track. The workflow lacked a single, reliable view of candidate progress.",
      },
      {
        eyebrow: "Role & Responsibilities",
        heading: "What I owned",
        body: "Led UX research, IA, dashboard design, and prototype creation for a recruiter-first hiring workspace.",
      },
      {
        eyebrow: "Research & Insights",
        heading: "What I found",
        body: "Recruiters needed fewer context switches and one place to evaluate progress, schedule interviews, and collect feedback. Pipeline visibility was the biggest missing piece.",
        bullets: [
          "Recruiters wanted a single dashboard instead of multiple tools",
          "Feedback sharing was delayed because it lived outside the candidate record",
          "Bulk actions would reduce repetitive recruiting admin work",
        ],
      },
      {
        eyebrow: "Outcome & Impact",
        heading: "The solution",
        body: "Designed a pipeline-first recruiting dashboard with side-panel candidate context and embedded feedback collection to streamline the full hiring loop.",
      },
    ],
    outcomes: [
      "Kanban pipeline dashboard",
      "Embedded feedback forms",
      "Bulk candidate actions",
      "Calendar-synced scheduling",
    ],
  },
  {
    slug: "30sec-nails-app",
    index: "04",
    title: "30Sec Nails App",
    tag: "Beauty & Lifestyle",
    tags: ["Beauty & Lifestyle", "Mobile App", "E-commerce"],
    summary:
      "A beauty shopping experience that helps users discover nail styles faster with visual try-on and a frictionless purchase flow.",
    role: "UI/UX Designer — User Research, Information Architecture, UI Design, Prototype",
    category: "Beauty & Lifestyle / E-commerce",
    tools: "Figma, FigJam, ProtoPie",
    liveLink: "",
    androidLink: "https://play.google.com/store/apps/details?id=com.thirtysecnailspen.app",
    iosLink: "https://apps.apple.com/app/30sec-nails-pen-app/id6756655939",
    figmaLink: "",
    coverImage: "/projects/project1.png",
    sections: [
      {
        eyebrow: "Problem & Context",
        heading: "The challenge",
        body: "Shoppers were dropping off because they couldn't confidently picture how a nail design would look on their own hands. The app also made discovery feel too slow and too disconnected from purchase.",
      },
      {
        eyebrow: "Role & Responsibilities",
        heading: "What I owned",
        body: "Handled UX research, IA, visual design, and prototype work for a fast visual shopping experience.",
      },
      {
        eyebrow: "Research & Insights",
        heading: "What I found",
        body: "Users browsed by mood and inspiration, not category. They wanted try-on during discovery and a quick, low-friction checkout experience.",
        bullets: [
          "Try-on needed to be visible at the moment of choice",
          "Mood-based browsing better matched visual decision-making",
          "Guest checkout was important for reducing purchase friction",
        ],
      },
      {
        eyebrow: "Outcome & Impact",
        heading: "The solution",
        body: "Created a swipe-first discovery flow with visible try-on and a guest-first checkout path that shortened the journey from inspiration to purchase.",
      },
    ],
    outcomes: [
      "3-tap checkout flow",
      "AR try-on at card level",
      "Mood-based discovery",
      "Guest-first purchase path",
    ],
  },
  {
    slug: "2fa-authenticator-app",
    index: "05",
    title: "2FA Authenticator App",
    tag: "Security",
    tags: ["Security", "Mobile App", "Utility"],
    summary:
      "A secure authentication experience designed to reduce stress at login with clearer codes, faster account recognition, and accessibility-first interactions.",
    role: "UI/UX Designer — Usability Research, Accessibility Design, UI Design",
    category: "Security / Mobile Utility",
    tools: "Figma",
    liveLink: "https://play.google.com/store/apps/details?id=private.auth.storage",
    figmaLink: "",
    coverImage: "/projects/project5.png",
    sections: [
      {
        eyebrow: "Problem & Context",
        heading: "The challenge",
        body: "Authenticator apps often add stress at the exact moment users need speed and clarity. Small codes, subtle timers, and dense account lists made quick logins harder than they should be.",
      },
      {
        eyebrow: "Role & Responsibilities",
        heading: "What I owned",
        body: "Focused on usability research, accessibility-first interaction design, and a calmer mobile authentication interface.",
      },
      {
        eyebrow: "Research & Insights",
        heading: "What I found",
        body: "Usability testing showed that users under time pressure made mistakes when accounts weren’t visually distinct and codes weren’t instantly readable. The core issue was cognitive load at a high-stakes moment.",
        bullets: [
          "Small codes and weak countdown states created hesitation",
          "Wrong-account selection was a common login failure",
          "Accessibility support needed to be built into the base layout",
        ],
      },
      {
        eyebrow: "Outcome & Impact",
        heading: "The solution",
        body: "Rebuilt the interface around a larger readable code, a stronger countdown indicator, and clearer account cards to reduce errors and improve login confidence.",
      },
    ],
    outcomes: [
      "Zero wrong-account errors in testing",
      "Colour-shift countdown bar",
      "Accessibility-first typography",
      "One-tap clipboard copy",
    ],
  },
  {
    slug: "black-white-photo-editor",
    index: "06",
    title: "Black & White Photo Editor",
    tag: "Photo Editor",
    tags: ["Photo Editor", "Mobile App", "Utility"],
    summary:
      "A clean mobile photo-editing flow focused on fast black-and-white enhancement, simple adjustments, and an easy before/after comparison experience.",
    role: "UI/UX Designer — UX Research, Mobile UI, Visual Design, Prototype",
    category: "Photo Editing / Mobile Utility",
    tools: "Figma, FigJam",
    liveLink: "",
    androidLink: "",
    iosLink: "",
    figmaLink: "",
    coverImage: "/projects/project6.png",
    sections: [
      {
        eyebrow: "Problem & Context",
        heading: "The challenge",
        body: "Photo editing tools often feel too dense for quick everyday fixes. Users wanted a faster way to improve black-and-white images without getting overwhelmed by advanced controls.",
      },
      {
        eyebrow: "Role & Responsibilities",
        heading: "What I owned",
        body: "Led mobile UX flow design, visual hierarchy, and prototype work for a simplified photo enhancement experience.",
      },
      {
        eyebrow: "Research & Insights",
        heading: "What I found",
        body: "Users wanted one clear path to improve contrast and restore detail quickly. A guided edit flow and visible preview were more valuable than offering too many settings at once.",
        bullets: [
          "Quick preview helped build confidence before saving",
          "Simple enhancement controls reduced cognitive load",
          "Fewer steps made the app feel more approachable for casual users",
        ],
      },
      {
        eyebrow: "Outcome & Impact",
        heading: "The solution",
        body: "Designed a focused editing app with a clean enhancement flow, visiblebefore/after preview, and a low-friction experience that made quick fixes feel easy and rewarding.",
      },
    ],
    outcomes: [
      "Guided enhancement flow",
      "Clear before/after comparison",
      "Fast monochrome correction",
      "Simple, approachable edit path",
    ],
  },
];
export const getProjectBySlug = (slug: string) =>
  projects.find((p) => p.slug === slug);
