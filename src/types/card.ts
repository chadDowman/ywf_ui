import type { ComponentSize } from "./common";

export type YCardPreset =
  | "basic"
  | "profile"
  | "stats"
  | "pricing"
  | "notification"
  | "product"
  | "article"
  | "testimonial"
  | "glassmorphism"
  | "gradient"
  | "neumorphism"
  | "brutalist"
  | "timeline"
  | "kanban"
  | "weather";

export interface YCardStat {
  label: string;
  value: string;
  change: string;
}

export interface YCardTimelineItem {
  label: string;
  done: boolean;
}

export type YCardNotificationType = "info" | "success" | "warning" | "error";
export type YCardPriority = "low" | "medium" | "high";

export interface YCardProps {
  // ── Shared ──────────────────────────────────────────────────────────
  dark?: boolean;
  preset?: YCardPreset;
  bgColor?: string;
  borderColor?: string;
  textColor?: string;
  shadow?: false | "sm" | "md" | "lg" | "xl";
  rounded?: false | "sm" | "md" | "lg" | "xl" | "full";
  padding?: ComponentSize;
  bordered?: boolean;

  // ── Basic ────────────────────────────────────────────────────────────
  title?: string;
  body?: string;
  footerLabel?: string;

  // ── Profile ──────────────────────────────────────────────────────────
  profileName?: string;
  profileRole?: string;
  profileBio?: string;
  profileAvatarColor?: string;

  // ── Stats ────────────────────────────────────────────────────────────
  stats?: YCardStat[];

  // ── Pricing ──────────────────────────────────────────────────────────
  pricingPlan?: string;
  pricingPrice?: string;
  pricingPeriod?: string;
  pricingFeatures?: string[];
  pricingCta?: string;
  pricingHighlight?: boolean;
  accentColor?: string;

  // ── Notification ─────────────────────────────────────────────────────
  notifTitle?: string;
  notifBody?: string;
  notifTime?: string;
  notifType?: YCardNotificationType;

  // ── Product ──────────────────────────────────────────────────────────
  productName?: string;
  productPrice?: string;
  productRating?: number;
  productBadge?: string;
  productImageColor?: string;

  // ── Article ──────────────────────────────────────────────────────────
  articleTitle?: string;
  articleExcerpt?: string;
  articleAuthor?: string;
  articleDate?: string;
  articleCategory?: string;
  articleCategoryColor?: string;

  // ── Testimonial ──────────────────────────────────────────────────────
  testQuote?: string;
  testName?: string;
  testRole?: string;
  testRating?: number;

  // ── Glassmorphism ─────────────────────────────────────────────────────
  glassTitle?: string;
  glassBody?: string;
  glassBg1?: string;
  glassBg2?: string;
  glassBlur?: number;
  glassOpacity?: number;

  // ── Gradient ─────────────────────────────────────────────────────────
  gradTitle?: string;
  gradBody?: string;
  gradStart?: string;
  gradEnd?: string;
  gradDir?: string;
  gradTextColor?: string;

  // ── Neumorphism ──────────────────────────────────────────────────────
  neuTitle?: string;
  neuBody?: string;
  neuBg?: string;
  neuAccent?: string;

  // ── Brutalist ────────────────────────────────────────────────────────
  brutTitle?: string;
  brutBody?: string;
  brutBg?: string;
  brutBorderColor?: string;
  brutTextColor?: string;
  brutThickness?: number;

  // ── Timeline ─────────────────────────────────────────────────────────
  timelineTitle?: string;
  timelineItems?: YCardTimelineItem[];
  timelineAccent?: string;

  // ── Kanban ───────────────────────────────────────────────────────────
  kanTitle?: string;
  kanTag?: string;
  kanTagColor?: string;
  kanAssignee?: string;
  kanDue?: string;
  kanPriority?: YCardPriority;

  // ── Weather ──────────────────────────────────────────────────────────
  wxCity?: string;
  wxTemp?: string;
  wxDesc?: string;
  wxHigh?: string;
  wxLow?: string;
  wxIcon?: string;
  wxBg1?: string;
  wxBg2?: string;
}
