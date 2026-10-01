export type ShowcaseGraphicCategory = "Branding" | "Social Media" | "Slide Carousel" | "Posters" | "Print";

export type ShowcaseGraphic = {
  id: string;
  block: 1 | 2 | 3;
  title: string;
  category: ShowcaseGraphicCategory;
  image: string;
  imageWidth: number;
  imageHeight: number;
  layout: { colSpan: 1 | 2; rowSpan: 1 | 2 };
  tabletLayout: { colSpan: 1 | 2; rowSpan: 1 | 2 };
  objectPosition?: "top" | "center";
  galleryImages?: string[];
};

export const showcaseGraphics: ShowcaseGraphic[] = [
  {
    id: "Logo Design",
    block: 1,
    title: "Catalyst Branding",
    category: "Branding",
    image: "/Catalyst%20Logo%20Presentation.png",
    imageWidth: 1402,
    imageHeight: 1122,
    layout: { colSpan: 2, rowSpan: 2 },
    tabletLayout: { colSpan: 2, rowSpan: 2 },
    galleryImages: [
      "/Catalyst%20Logo%20Presentation.png",
      "/Catalyst%20Logo%20Presentation-2.png",
      "/BAAZ%20Logo%20Presentation.png",
      "/Noltven%20Logo%20Presentation.png",
    ],
  },
  {
    id: "poster-design",
    block: 1,
    title: "Reinventing Hiring for Modern Businesses",
    category: "Slide Carousel",
    image: "/1.png",
    imageWidth: 2160,
    imageHeight: 2700,
    layout: { colSpan: 1, rowSpan: 2 },
    tabletLayout: { colSpan: 1, rowSpan: 2 },
    objectPosition: "top",
    galleryImages: ["/1.png", "/2.png", "/3.png", "/4.png"],
  },
  {
    id: "instagram-posts",
    block: 1,
    title: "Building Smarter",
    category: "Slide Carousel",
    image: "/Instagram%20post%20-%201.png",
    imageWidth: 2160,
    imageHeight: 2160,
    layout: { colSpan: 1, rowSpan: 1 },
    tabletLayout: { colSpan: 1, rowSpan: 1 },
    galleryImages: [
      "/Instagram%20post%20-%201.png",
      "/Instagram%20post%20-%202.png",
      "/Instagram%20post%20-%203.png",
      "/Instagram%20post%20-%204.png",
      "/Instagram%20post%20-%205.png",
      "/Instagram%20post%20-%206.png",
    ],
  },
  {
    id: "studio-journal",
    block: 1,
    title: "Top 10 Companies Listing",
    category: "Slide Carousel",
    image: "/5.png",
    imageWidth: 1080,
    imageHeight: 1080,
    layout: { colSpan: 1, rowSpan: 1 },
    tabletLayout: { colSpan: 1, rowSpan: 1 },
    galleryImages: ["/5.png", "/6.png"],
  },
  {
    id: "poster-design-slides",
    block: 2,
    title: "Subscription Based Graphic Design",
    category: "Posters",
    image: "/Slide/Slide%201%20%E2%80%93%20Cover.png",
    imageWidth: 1080,
    imageHeight: 1350,
    layout: { colSpan: 1, rowSpan: 2 },
    tabletLayout: { colSpan: 1, rowSpan: 2 },
    objectPosition: "top",
    galleryImages: [
      "/Slide/Slide%201%20%E2%80%93%20Cover.png",
      "/Slide/%F0%9F%A7%A0%20Slide%202%20%E2%80%93%20The%20Problem.png",
      "/Slide/%F0%9F%92%A1%20Slide%203%20%E2%80%93%20The%20Solution.png",
      "/Slide/%F0%9F%8E%A8%20Slide%204%20%E2%80%93%20What%20You%20Can%20Get.png",
      "/Slide/%E2%9A%A1%20Slide%205%20%E2%80%93%20Why%20Brands%20Love%20Us.png",
      "/Slide/%F0%9F%93%A2%20Slide%206%20%E2%80%93%20Final%20CTA.png",
    ],
  },
  {
    id: "weekend-market",
    block: 2,
    title: "9 Ways AI is Transforming OTT",
    category: "Slide Carousel",
    image: "/Social%20Media%202/01.png",
    imageWidth: 1080,
    imageHeight: 1350,
    layout: { colSpan: 1, rowSpan: 2 },
    tabletLayout: { colSpan: 1, rowSpan: 2 },
    objectPosition: "top",
    galleryImages: Array.from(
      { length: 12 },
      (_, index) => `/Social%20Media%202/${String(index + 1).padStart(2, "0")}.png`,
    ),
  },
  {
    id: "field-notes",
    block: 2,
    title: "Fantasy Sport",
    category: "Slide Carousel",
    image: "/Social%20Media%201/S1.png",
    imageWidth: 1080,
    imageHeight: 1080,
    layout: { colSpan: 2, rowSpan: 2 },
    tabletLayout: { colSpan: 1, rowSpan: 1 },
    galleryImages: Array.from(
      { length: 12 },
      (_, index) => `/Social%20Media%201/S${index + 1}.png`,
    ),
  },
  {
    id: "block3-a",
    block: 3,
    title: "Project A",
    category: "Slide Carousel",
    image: "/graphics/block3-a.webp",
    imageWidth: 1402,
    imageHeight: 1122,
    layout: { colSpan: 2, rowSpan: 2 },
    tabletLayout: { colSpan: 2, rowSpan: 2 },
  },
  {
    id: "block3-b",
    block: 3,
    title: "Project B",
    category: "Slide Carousel",
    image: "/graphics/block3-b.webp",
    imageWidth: 1080,
    imageHeight: 1350,
    layout: { colSpan: 1, rowSpan: 2 },
    tabletLayout: { colSpan: 1, rowSpan: 2 },
    objectPosition: "top",
  },
  {
    id: "block3-c",
    block: 3,
    title: "Project C",
    category: "Slide Carousel",
    image: "/graphics/block3-c.webp",
    imageWidth: 1080,
    imageHeight: 1080,
    layout: { colSpan: 1, rowSpan: 1 },
    tabletLayout: { colSpan: 1, rowSpan: 1 },
  },
  {
    id: "block3-d",
    block: 3,
    title: "Project D",
    category: "Slide Carousel",
    image: "/graphics/block3-d.webp",
    imageWidth: 1080,
    imageHeight: 1080,
    layout: { colSpan: 1, rowSpan: 1 },
    tabletLayout: { colSpan: 1, rowSpan: 1 },
  },
];

export type GraphicCategory = "logo" | "social" | "campaign";

export type GraphicItem = {
  id: string;
  title: string;
  category: GraphicCategory;
  client: string;
  year: string;
  description: string;
  cover: string;
  images: string[];
  tags: string[];
  goal?: string;
  deliverables?: string[];
};

const logoFiles = Array.from({ length: 6 }, (_, index) => `/graphics/logo/logo-${String(index + 1).padStart(2, "0")}.svg`);
const socialFiles = Array.from({ length: 6 }, (_, index) => `/graphics/social/social-${String(index + 1).padStart(2, "0")}.svg`);
const campaignFiles = Array.from({ length: 6 }, (_, index) => `/graphics/campaign/campaign-${String(index + 1).padStart(2, "0")}.svg`);

export const graphics: GraphicItem[] = [
  ...[
    ["Aurelia Botanics", "Organic skincare identity", ["Identity", "Packaging", "Botanical"]],
    ["Forma Objects", "A considered mark for everyday objects", ["Wordmark", "Lifestyle", "Minimal"]],
    ["Northline Coffee", "A warm identity built for the daily ritual", ["Hospitality", "Packaging", "Type"]],
    ["Morrow Studio", "A confident monogram for a creative studio", ["Monogram", "Studio", "Editorial"]],
    ["Kinfolk Pantry", "A friendly mark for a neighborhood pantry", ["Food", "Retail", "Identity"]],
    ["Atelier Sol", "A sunlit identity for slow-made living", ["Lifestyle", "Symbol", "Premium"]],
  ].map(([client, description, tags], index) => ({
    id: `logo-${index + 1}`,
    title: `${client} identity`,
    category: "logo" as const,
    client: String(client),
    year: String(2026 - (index % 3)),
    description: String(description),
    cover: logoFiles[index],
    images: [logoFiles[index]],
    tags: tags as string[],
  })),
  ...[
    ["Sunday Rituals", "A bright, tactile launch series for a better morning", ["Carousel", "Lifestyle", "Launch"]],
    ["Common Ground", "Community-first stories for a local market", ["Social", "Community", "Food"]],
    ["Mellow Skin", "Product education with a soft editorial tone", ["Carousel", "Skincare", "Education"]],
    ["Studio Form", "A product-led series for a new collection", ["Social", "Product", "Editorial"]],
    ["Little Ritual", "Playful daily content for a family brand", ["Social", "Wellness", "Playful"]],
    ["Terra Table", "Seasonal food stories made to be shared", ["Carousel", "Food", "Seasonal"]],
  ].map(([client, description, tags], index) => ({
    id: `social-${index + 1}`,
    title: `${client} social series`,
    category: "social" as const,
    client: String(client),
    year: String(2026 - (index % 3)),
    description: String(description),
    cover: socialFiles[index],
    images: [socialFiles[index], socialFiles[(index + 1) % socialFiles.length], socialFiles[(index + 2) % socialFiles.length]],
    tags: tags as string[],
  })),
  ...[
    ["Made for More", "A launch campaign for a more considered everyday", ["Launch", "OOH", "Digital"]],
    ["Summer, Slowly", "A seasonal campaign celebrating unhurried days", ["Seasonal", "Editorial", "Social"]],
    ["City in Bloom", "A city-wide campaign bringing local makers together", ["Culture", "OOH", "Community"]],
    ["The Good Edit", "A campaign reframing conscious shopping", ["Retail", "Print", "Digital"]],
    ["Better by Nature", "A product story grounded in honest ingredients", ["Wellness", "Campaign", "Packaging"]],
    ["Open House", "A welcoming campaign for a new neighborhood space", ["Hospitality", "Launch", "Print"]],
  ].map(([client, description, tags], index) => ({
    id: `campaign-${index + 1}`,
    title: String(client),
    category: "campaign" as const,
    client: String(client),
    year: String(2026 - (index % 3)),
    description: String(description),
    cover: campaignFiles[index],
    images: [campaignFiles[index], campaignFiles[(index + 1) % campaignFiles.length], campaignFiles[(index + 2) % campaignFiles.length]],
    tags: tags as string[],
    goal: "Build awareness and give the brand a clear, recognizable campaign voice.",
    deliverables: ["Campaign concept", "Social assets", "Print and digital artwork"],
  })),
];

export const graphicCategoryCounts = {
  logo: graphics.filter((item) => item.category === "logo").length,
  social: graphics.filter((item) => item.category === "social").length,
  campaign: graphics.filter((item) => item.category === "campaign").length,
};