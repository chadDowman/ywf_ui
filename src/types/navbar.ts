export type YNavbarVariant =
  // --- Original 8 ---
  | "solid"
  | "outline"
  | "ghost"
  | "glass"
  | "gradient"
  | "minimal"
  | "bordered"
  | "floating"
  // --- 12 new variants ---
  | "editorial"
  | "startup"
  | "brutalist"
  | "luxury"
  | "retro"
  | "enterprise"
  | "terminal"
  | "pill"
  | "split"
  | "stacked"
  | "sidebar-header"
  | "topbar";

export type YNavbarAlign = "left" | "center" | "right" | "spread";

export interface YNavbarLink {
  id: string;
  label: string;
  href?: string;
  active?: boolean;
  disabled?: boolean;
  icon?: string;
}

import type { YAnimationPreset } from "./animation";

export interface YNavbarProps {
  dark?: boolean;
  animation?: YAnimationPreset;
  brand?: string;
  links?: YNavbarLink[];
  variant?: YNavbarVariant;
  sticky?: boolean;
  elevated?: boolean;
  transparent?: boolean;
  showCta?: boolean;
  ctaLabel?: string;
  mobileMenu?: boolean;
  align?: YNavbarAlign;
  /** Subtitle or tagline below the brand name */
  subtitle?: string;
  /** Show a search input area in the navbar */
  showSearch?: boolean;
  /** Placeholder text for the search input */
  searchPlaceholder?: string;
  /** Secondary row items rendered below the main bar (categories/tabs) */
  secondaryLinks?: YNavbarLink[];
  /** Icon-only action buttons rendered in the right area */
  actions?: YNavbarAction[];
}

export interface YNavbarAction {
  id: string;
  /** Emoji or single character rendered as the icon */
  icon: string;
  label: string;
  disabled?: boolean;
}

export interface YNavbarEmits {
  (e: "navigate", link: YNavbarLink): void;
  (e: "ctaClick"): void;
  (e: "brandClick"): void;
  (e: "search", query: string): void;
  (e: "action", action: YNavbarAction): void;
}
