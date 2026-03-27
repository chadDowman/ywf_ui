/* ─────────────────────────────────────────────────────────
 * badge.ts – Design-system types for YBadge
 * ───────────────────────────────────────────────────────── */

import type { PlaygroundQuickConfig } from "./types";

export const badgeVariants = [
  "solid",
  "outline",
  "soft",
  "ghost",
  "glass",
  "surface",
  "dot-outline",
] as const;
export type BadgeVariant = (typeof badgeVariants)[number];

export const badgeSizes = ["xs", "sm", "md", "lg"] as const;
export type BadgeSize = (typeof badgeSizes)[number];

export const badgeColors = [
  "gray",
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
] as const;
export type BadgeColor = (typeof badgeColors)[number];

export const badgeRadii = ["none", "sm", "md", "lg", "full"] as const;
export type BadgeRadius = (typeof badgeRadii)[number];

export interface YBadgeProps {
  /** Display text */
  label?: string;
  /** Visual variant style */
  variant?: BadgeVariant;
  /** Component size */
  size?: BadgeSize;
  /** Colour lane */
  color?: BadgeColor;
  /** Show a leading status dot */
  dot?: boolean;
  /** Animate the dot with a pulse */
  pulse?: boolean;
  /** Use pill shape (rounded-full) — deprecated alias for radius="full" */
  rounded?: boolean;
  /** Border-radius override */
  radius?: BadgeRadius;
  /** Show a dismiss × button */
  dismissible?: boolean;
  /** Leading icon character / emoji */
  icon?: string;
  /** Trailing icon character / emoji */
  trailingIcon?: string;
  /** Render as uppercase label */
  uppercase?: boolean;
  /** Truncate long text with ellipsis at this max-width (px) */
  maxWidth?: number;
  /** Disable interactions */
  disabled?: boolean;
  /** Make the badge interactive (clickable with hover/focus states) */
  clickable?: boolean;
  /** Render a counter number instead of label */
  count?: number;
  /** Cap the displayed count (shows "99+" etc.) */
  countMax?: number;
}

/* ───── Playground presets ───── */

export const badgePresets = [
  "solid-blue",
  "solid-green",
  "solid-red",
  "outline-indigo",
  "outline-rose",
  "soft-teal",
  "soft-amber",
  "soft-purple",
  "ghost-gray",
  "ghost-pink",
  "glass-cyan",
  "glass-violet",
  "surface-emerald",
  "surface-sky",
  "dot-outline-orange",
] as const;

export type BadgePreset = (typeof badgePresets)[number];

export const playgroundQuickConfig: PlaygroundQuickConfig = {
  componentId: "YBadge",
  propKey: "preset",
  options: badgePresets,
  init(next) {
    if (next.variant === undefined) next.variant = "solid";
    if (next.color === undefined) next.color = "blue";
    if (next.size === undefined) next.size = "md";
    if (next.label === undefined) next.label = "Badge";
    if (next.rounded === undefined) next.rounded = false;
  },
  applyOption(next, option) {
    const raw = option as string;
    // handle "dot-outline-<color>" compound key
    if (raw.startsWith("dot-outline-")) {
      next.variant = "dot-outline";
      next.color = raw.replace("dot-outline-", "") as BadgeColor;
      next.dot = true;
    } else {
      const idx = raw.indexOf("-");
      next.variant = raw.slice(0, idx) as BadgeVariant;
      next.color = raw.slice(idx + 1) as BadgeColor;
      next.dot = false;
    }
    next.label = "Badge";
  },
};
