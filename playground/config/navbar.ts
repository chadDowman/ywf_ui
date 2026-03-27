import type { YNavbarLink, YNavbarAction } from "../../src/types/navbar";
import type { PlaygroundQuickConfig } from "./types";

export const navbarVariants = [
  "solid",
  "outline",
  "ghost",
  "glass",
  "gradient",
  "minimal",
  "bordered",
  "floating",
  "editorial",
  "startup",
  "brutalist",
  "luxury",
  "retro",
  "enterprise",
  "terminal",
  "pill",
  "split",
  "stacked",
  "sidebar-header",
  "topbar",
] as const;

const sampleLinks: YNavbarLink[] = [
  { id: "home", label: "Home", active: true },
  { id: "features", label: "Features" },
  { id: "pricing", label: "Pricing" },
  { id: "contact", label: "Contact" },
];

const editorialLinks: YNavbarLink[] = [
  { id: "world", label: "World", active: true },
  { id: "business", label: "Business" },
  { id: "tech", label: "Technology" },
  { id: "culture", label: "Culture" },
  { id: "opinion", label: "Opinion" },
];

const startupLinks: YNavbarLink[] = [
  { id: "product", label: "Product", active: true },
  { id: "solutions", label: "Solutions" },
  { id: "pricing", label: "Pricing" },
  { id: "docs", label: "Docs" },
];

const enterpriseLinks: YNavbarLink[] = [
  { id: "dashboard", label: "Dashboard", active: true },
  { id: "analytics", label: "Analytics" },
  { id: "reports", label: "Reports" },
  { id: "settings", label: "Settings" },
];

const terminalLinks: YNavbarLink[] = [
  { id: "home", label: "~", active: true },
  { id: "proc", label: "/proc" },
  { id: "logs", label: "/logs" },
  { id: "config", label: "/config" },
];

const luxuryLinks: YNavbarLink[] = [
  { id: "collection", label: "Collection", active: true },
  { id: "atelier", label: "Atelier" },
  { id: "heritage", label: "Heritage" },
  { id: "boutique", label: "Boutique" },
];

const retroLinks: YNavbarLink[] = [
  { id: "home", label: "Home", active: true },
  { id: "gallery", label: "Gallery" },
  { id: "about", label: "About Us" },
  { id: "guestbook", label: "Guestbook" },
];

const brutalistLinks: YNavbarLink[] = [
  { id: "work", label: "WORK", active: true },
  { id: "info", label: "INFO" },
  { id: "manifesto", label: "MANIFESTO" },
  { id: "contact", label: "CONTACT" },
];

const sampleSecondaryLinks: YNavbarLink[] = [
  { id: "all", label: "All", active: true },
  { id: "trending", label: "Trending" },
  { id: "new", label: "New" },
  { id: "popular", label: "Popular" },
  { id: "following", label: "Following" },
];

const sampleActions: YNavbarAction[] = [
  { id: "notif", icon: "🔔", label: "Notifications" },
  { id: "user", icon: "👤", label: "Account" },
];

/** Per-variant overrides applied when switching variant in the playground */
type VariantSeedMap = Record<string, Partial<Record<string, unknown>>>;

const variantSeeds: VariantSeedMap = {
  editorial: {
    brand: "The Chronicle",
    subtitle: "Independent Journalism",
    links: editorialLinks,
    secondaryLinks: sampleSecondaryLinks,
    showSearch: true,
    searchPlaceholder: "Search articles…",
    showCta: true,
    ctaLabel: "Subscribe",
  },
  startup: {
    brand: "Launchpad",
    links: startupLinks,
    showCta: true,
    ctaLabel: "Start Free",
    actions: sampleActions,
  },
  brutalist: {
    brand: "STUDIO",
    links: brutalistLinks,
    showCta: true,
    ctaLabel: "HIRE US",
  },
  luxury: {
    brand: "Maison",
    subtitle: "Paris · Milano · Tokyo",
    links: luxuryLinks,
    showCta: true,
    ctaLabel: "Reserve",
  },
  retro: {
    brand: "Retro Web",
    links: retroLinks,
  },
  enterprise: {
    brand: "DataPlatform",
    links: enterpriseLinks,
    showSearch: true,
    searchPlaceholder: "Search…",
    actions: sampleActions,
    showCta: false,
  },
  terminal: {
    brand: "sys://admin",
    links: terminalLinks,
    showSearch: true,
    searchPlaceholder: "grep…",
  },
  pill: {
    brand: "Capsule",
    links: sampleLinks,
    showCta: true,
    ctaLabel: "Try Free",
  },
  split: {
    brand: "Divider",
    links: sampleLinks,
    showCta: true,
    ctaLabel: "Sign Up",
  },
  stacked: {
    brand: "Portal",
    links: sampleLinks,
    secondaryLinks: sampleSecondaryLinks,
    showSearch: true,
    actions: sampleActions,
    showCta: true,
    ctaLabel: "Upgrade",
  },
  "sidebar-header": {
    brand: "Workspace",
    links: enterpriseLinks,
    actions: sampleActions,
  },
  topbar: {
    brand: "ADMIN",
    links: enterpriseLinks,
    showCta: true,
    ctaLabel: "Upgrade",
    actions: sampleActions,
  },
};

export const playgroundQuickConfig: PlaygroundQuickConfig = {
  componentId: "YNavbar",
  propKey: "variant",
  options: navbarVariants,
  init(next) {
    if (next.variant === undefined) next.variant = "solid";
    if (next.brand === undefined) next.brand = "Brand";
    if (next.align === undefined) next.align = "right";
    if (next.mobileMenu === undefined) next.mobileMenu = true;
    if (next.links === undefined) next.links = sampleLinks;
    if (next.showSearch === undefined) next.showSearch = false;
    if (next.showCta === undefined) next.showCta = false;
  },
  applyOption(next, option) {
    const variant = String(option);
    const seed = variantSeeds[variant];
    if (seed) {
      Object.assign(next, seed);
    } else {
      // Reset extended props to defaults for original 8 variants
      next.brand = "Brand";
      next.links = sampleLinks;
      next.subtitle = undefined;
      next.secondaryLinks = undefined;
      next.actions = undefined;
      next.showSearch = false;
      next.showCta = false;
    }
  },
};
