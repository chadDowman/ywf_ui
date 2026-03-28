import type { PlaygroundQuickConfig } from "./types";

export type CardTextField = {
  key: string;
  label: string;
  multiline?: boolean;
};

export type CardColorField = {
  key: string;
  label: string;
  fallback: string;
};

export const cardPresets = [
  "basic",
  "profile",
  "stats",
  "pricing",
  "notification",
  "product",
  "article",
  "testimonial",
  "glassmorphism",
  "gradient",
  "neumorphism",
  "brutalist",
  "timeline",
  "kanban",
  "weather",
] as const;

export const cardTextFieldsByPreset: Record<string, CardTextField[]> = {
  basic: [
    { key: "title", label: "Title" },
    { key: "body", label: "Body", multiline: true },
    { key: "footerLabel", label: "Footer Label" },
  ],
  profile: [
    { key: "profileName", label: "Name" },
    { key: "profileRole", label: "Role" },
    { key: "profileBio", label: "Bio", multiline: true },
  ],
  pricing: [
    { key: "pricingPlan", label: "Plan" },
    { key: "pricingPrice", label: "Price" },
    { key: "pricingPeriod", label: "Period" },
    { key: "pricingCta", label: "CTA Label" },
  ],
  notification: [
    { key: "notifTitle", label: "Title" },
    { key: "notifBody", label: "Body", multiline: true },
    { key: "notifTime", label: "Time" },
  ],
  product: [
    { key: "productName", label: "Product Name" },
    { key: "productPrice", label: "Price" },
    { key: "productBadge", label: "Badge" },
  ],
  article: [
    { key: "articleTitle", label: "Title" },
    { key: "articleExcerpt", label: "Excerpt", multiline: true },
    { key: "articleAuthor", label: "Author" },
    { key: "articleDate", label: "Date" },
    { key: "articleCategory", label: "Category" },
  ],
  testimonial: [
    { key: "testQuote", label: "Quote", multiline: true },
    { key: "testName", label: "Name" },
    { key: "testRole", label: "Role" },
  ],
  glassmorphism: [
    { key: "glassTitle", label: "Title" },
    { key: "glassBody", label: "Body", multiline: true },
  ],
  gradient: [
    { key: "gradTitle", label: "Title" },
    { key: "gradBody", label: "Body", multiline: true },
  ],
  neumorphism: [
    { key: "neuTitle", label: "Title" },
    { key: "neuBody", label: "Body", multiline: true },
  ],
  brutalist: [
    { key: "brutTitle", label: "Title" },
    { key: "brutBody", label: "Body", multiline: true },
  ],
  timeline: [{ key: "timelineTitle", label: "Title" }],
  kanban: [
    { key: "kanTitle", label: "Task Title" },
    { key: "kanTag", label: "Tag" },
    { key: "kanAssignee", label: "Assignee" },
    { key: "kanDue", label: "Due Date" },
  ],
  weather: [
    { key: "wxCity", label: "City" },
    { key: "wxTemp", label: "Temperature" },
    { key: "wxDesc", label: "Description" },
    { key: "wxHigh", label: "High" },
    { key: "wxLow", label: "Low" },
    { key: "wxIcon", label: "Icon" },
  ],
};

export const cardColorFieldsByPreset: Record<string, CardColorField[]> = {
  basic: [{ key: "textColor", label: "Text Color", fallback: "#1f2937" }],
  profile: [
    { key: "textColor", label: "Text Color", fallback: "#1f2937" },
    { key: "profileAvatarColor", label: "Avatar Color", fallback: "#6366f1" },
  ],
  stats: [{ key: "textColor", label: "Text Color", fallback: "#1f2937" }],
  pricing: [
    { key: "textColor", label: "Text Color", fallback: "#1f2937" },
    { key: "accentColor", label: "Accent Color", fallback: "#6366f1" },
  ],
  notification: [
    { key: "textColor", label: "Text Color", fallback: "#1f2937" },
  ],
  product: [
    { key: "textColor", label: "Text Color", fallback: "#1f2937" },
    { key: "productImageColor", label: "Image Color", fallback: "#818cf8" },
  ],
  article: [
    { key: "textColor", label: "Text Color", fallback: "#1f2937" },
    {
      key: "articleCategoryColor",
      label: "Category Color",
      fallback: "#10b981",
    },
  ],
  testimonial: [
    { key: "textColor", label: "Text Color", fallback: "#1f2937" },
    { key: "accentColor", label: "Accent Color", fallback: "#f59e0b" },
  ],
  glassmorphism: [
    { key: "textColor", label: "Text Color", fallback: "#111111" },
  ],
  gradient: [
    { key: "textColor", label: "Text Color", fallback: "#111111" },
    { key: "gradTextColor", label: "Gradient Text", fallback: "#111111" },
  ],
  neumorphism: [
    { key: "textColor", label: "Text Color", fallback: "#1f2937" },
    { key: "neuAccent", label: "Accent Color", fallback: "#6366f1" },
  ],
  brutalist: [
    { key: "brutTextColor", label: "Text Color", fallback: "#111111" },
  ],
  timeline: [
    { key: "textColor", label: "Text Color", fallback: "#1f2937" },
    { key: "timelineAccent", label: "Accent Color", fallback: "#6366f1" },
  ],
  kanban: [
    { key: "textColor", label: "Text Color", fallback: "#1f2937" },
    { key: "kanTagColor", label: "Tag Color", fallback: "#6366f1" },
  ],
  weather: [
    { key: "textColor", label: "Text Color", fallback: "#111111" },
    { key: "wxBg1", label: "Gradient Start", fallback: "#0ea5e9" },
    { key: "wxBg2", label: "Gradient End", fallback: "#38bdf8" },
  ],
};

export const commonCardColorFields: CardColorField[] = [
  { key: "bgColor", label: "Background Color", fallback: "#ffffff" },
  { key: "borderColor", label: "Border Color", fallback: "#e5e7eb" },
  { key: "textColor", label: "Text Color", fallback: "#111111" },
];

export const playgroundQuickConfig: PlaygroundQuickConfig = {
  componentId: "YCard",
  propKey: "preset",
  options: cardPresets,
  init(next) {
    if (next.preset === undefined) next.preset = "basic";
    if (next.textColor === undefined) next.textColor = "#111111";
    if (next.gradTextColor === undefined) next.gradTextColor = "#111111";
    if (next.brutTextColor === undefined) next.brutTextColor = "#111111";
  },
};
