import { projects as baseProjects } from "./projects";

export const projects = [
  ...baseProjects,
  {
    slug: "baaz",
    index: "07",
    title: "BAAZ — B2B Professional Services Ecosystem",
    tag: "B2B Ecosystem",
    tags: ["B2B Platform", "Web", "Mobile"],
    summary:
      "Designing a connected B2B ecosystem across 350+ web and mobile screens — bringing services, professionals, learning, communities, projects and business opportunities into one experience.",
    role:
      "UI/UX Designer — Product experience, cross-platform system design, information architecture",
    category: "B2B Platform / Digital Ecosystem",
    tools: "Figma",
    liveLink: "",
    figmaLink: "",
    coverImage: "/projects/baaz.png",
    sections: [
      {
        eyebrow: "Problem & Context",
        heading: "The challenge",
        body:
          "BAAZ is a large-scale B2B ecosystem designed to connect businesses, professionals and service providers through services, networking, learning and business opportunities. With 350+ screens and multiple user journeys, the challenge was to make a complex ecosystem feel simple, connected and easy to navigate across web and mobile.",
      },
      {
        eyebrow: "Role & Responsibilities",
        heading: "What I owned",
        body:
          "I worked across the product experience, translating a complex B2B ecosystem into a consistent and scalable digital experience across web and mobile platforms.",
      },
      {
        eyebrow: "Research & Insights",
        heading: "What I found",
        body:
          "With multiple audiences and business journeys, users weren't simply looking for features — they were looking for outcomes. They wanted to quickly find the right professional, discover relevant opportunities, learn new skills, connect with communities and move from discovery to action.",
        bullets: [
          "Users needed guided discovery across a large ecosystem.",
          "Information hierarchy was critical to prevent feature overload.",
          "Different user journeys needed to feel like one connected product.",
        ],
      },
      {
        eyebrow: "Solution",
        heading: "The solution",
        body:
          "Designed a scalable B2B ecosystem that brings services, professionals, learning, communities, projects and opportunities into one connected experience.",
      },
      {
        eyebrow: "Outcome & Impact",
        heading: "Result",
        body:
          "The final product established a consistent design language across 350+ screens, while adapting the experience for both web and mobile.",
      },
    ],
    outcomes: [
      "Scalable cross-platform design system",
      "350+ screens — unified experience",
      "Intent-driven discovery and modular journeys",
    ],
  },
  {
    slug: "agentflow",
    index: "08",
    title: "AI Agent Builder Platform",
    tag: "AI Agent Builder",
    tags: ["AI", "SaaS", "Agent Builder"],
    summary:
      "A no-code AI agent builder that helps users create, customize, test and deploy intelligent AI agents through one streamlined workflow.",
    role:
      "Product UX & Interaction — Agent creation workflow, testing, deployment, design system",
    category: "AI Agent Builder / SaaS Product",
    tools: "Figma, Prototyping",
    liveLink: "",
    figmaLink: "",
    coverImage: "/projects/agentflow.png",
    sections: [
      {
        eyebrow: "Problem & Context",
        heading: "Making AI Agent Creation Simple",
          body:
            "Creating an AI agent involves many fragmented steps — model selection, instructions, tool integrations, knowledge connections, testing and deployment. AgentFlow unifies this workflow into a single, visual platform so users can go from idea to working agent with less friction.",
      },
      {
        eyebrow: "Role & Responsibilities",
        heading: "Designing the End-to-End Agent Building Experience",
          body:
            "Led the product UX and interaction design — defining the agent creation flow, model selection, configuration UI, testing sandbox and deployment experience across responsive screens.",
      },
      {
        eyebrow: "Research & Insights",
        heading: "From Technical Complexity to Guided Creation",
          body:
            "Research showed users think in terms of outcomes, not technical settings. We focused on a guided, progressive workflow so users can start simple and reveal advanced controls as needed.",
          bullets: [
            "Guide users through explicit steps",
            "Start simple, surface advanced options",
            "Provide instant testing feedback",
          ],
      },
      {
        eyebrow: "Outcome & Impact",
        heading: "One Workflow. From Idea to Deployed Agent.",
          body:
            "Delivered a unified agent builder that streamlines model selection, configuration, testing and deployment — enabling faster iteration and more confident launches.",
      },
    ],
    outcomes: [
      "AI model comparison and selection",
      "Visual agent configuration",
      "System prompt management and personality controls",
      "Live preview, real-time testing and deployment",
    ],
  },
  {
    slug: "astrologer-mobile-app",
    index: "09",
    title: "Astrologer Mobile App",
    tag: "Astrology App",
    tags: ["Mobile", "Lifestyle", "Consultation"],
    summary:
      "A spiritual and lifestyle mobile experience that helps users discover astrologers, book consultations, explore horoscopes, and stay engaged through personalized guidance.",
    role:
      "Product UX Designer — Mobile flows, onboarding, discovery, consultation journey, app experience",
    category: "Mobile App / Astrology & Wellness",
    tools: "Figma, User Flows, Mobile UX",
    liveLink: "",
    figmaLink: "",
    coverImage: "/projects/Astrologer%20Mobile%20App.png",
    sections: [
      {
        eyebrow: "Problem & Context",
        heading: "A fragmented astrology experience",
        body:
          "Astrology apps often combine spiritual guidance, bookable consultations, horoscope content, and user trust in a single experience — but many interfaces feel cluttered, unclear, and difficult to navigate. The opportunity was to design an app that felt premium, credible, and easy for users to trust at first glance.",
      },
      {
        eyebrow: "Role & Responsibilities",
        heading: "Designing the mobile-first journey",
        body:
          "I led the mobile product experience, crafting the end-to-end user journey from onboarding and profile discovery to astrology consultations, horoscope engagement, and repeat app usage.",
      },
      {
        eyebrow: "Research & Insights",
        heading: "Users wanted clarity and confidence",
        body:
          "Users were not just looking for astrology content; they wanted a trusted experience that made it easy to discover the right astrologer, understand pricing, and feel comfortable booking a consultation.",
        bullets: [
          "Trust and credibility are key in spiritual services",
          "Discovery needed to feel personalized and guided",
          "The consultation flow had to reduce friction and uncertainty",
        ],
      },
      {
        eyebrow: "Solution",
        heading: "A calm, premium astrology experience",
        body:
          "Designed a polished mobile app focused on intuitive discovery, clear onboarding, personalized recommendations, and a frictionless consultation flow that balances emotional trust with ease of use.",
      },
      {
        eyebrow: "Outcome & Impact",
        heading: "A product that feels personal and reliable",
        body:
          "The result is a mobile experience that helps users move from interest to action with confidence — whether they are exploring daily guidance, finding a suitable astrologer, or booking a consultation.",
      },
    ],
    outcomes: [
      "Mobile-first astrology discovery flow",
      "Trust-building onboarding and profile experience",
      "Clear consultation booking journey",
      "Personalized horoscope and expert engagement",
    ],
  },
];

export const getProjectBySlug = (slug: string) =>
  projects.find((p) => p.slug === slug);

export default projects;
