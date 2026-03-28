/* ─────────────────────────────────────────────────────────
 * alert.ts – Design-system types for YAlert
 * ───────────────────────────────────────────────────────── */

export const alertTypes = [
  "info",
  "success",
  "warning",
  "error",
  "neutral",
] as const;
export type AlertType = (typeof alertTypes)[number];

export const alertVariants = [
  "solid",
  "outline",
  "soft",
  "ghost",
  "left-accent",
] as const;
export type AlertVariant = (typeof alertVariants)[number];

export const alertSizes = ["sm", "md", "lg"] as const;
export type AlertSize = (typeof alertSizes)[number];

export const alertIntensities = ["low", "medium", "high"] as const;
export type AlertIntensity = (typeof alertIntensities)[number];

export const alertRadii = ["none", "sm", "md", "lg", "xl", "full"] as const;
export type AlertRadius = (typeof alertRadii)[number];

export interface YAlertAction {
  /** Button label */
  label: string;
  /** Optional variant style for the action button */
  variant?: "link" | "outline" | "solid";
}

export interface YAlertProps {
  /** Semantic type / colour lane */
  type?: AlertType;
  /** Visual variant */
  variant?: AlertVariant;
  /** Component size */
  size?: AlertSize;
  /** Colour intensity / tone strength */
  intensity?: AlertIntensity;
  /** Alert title (bold heading line) */
  title?: string;
  /** Alert body / description text */
  message?: string;
  /** Show the semantic icon */
  showIcon?: boolean;
  /** Allow the user to dismiss the alert */
  dismissible?: boolean;
  /** Primary action button config */
  action?: YAlertAction;
  /** Secondary action button config */
  secondaryAction?: YAlertAction;
  /** Override border-radius */
  radius?: AlertRadius;
  /** Stretch to full container width (display block) */
  fullWidth?: boolean;
  /** Show a loading spinner and reduce opacity */
  loading?: boolean;
  /** Visually and functionally disable interactions */
  disabled?: boolean;
  /** Custom icon character / emoji override */
  icon?: string;
}

/** Quick-config wiring for a playground (mirrors avatar pattern) */
import type { PlaygroundQuickConfig } from "./types";

export const alertPresets = [
  // Solid row
  "solid-info",
  "solid-success",
  "solid-warning",
  "solid-error",
  "solid-neutral",
  // Outline row
  "outline-info",
  "outline-success",
  "outline-warning",
  "outline-error",
  "outline-neutral",
  // Soft row
  "soft-info",
  "soft-success",
  "soft-warning",
  "soft-error",
  "soft-neutral",
  // Left-accent row
  "left-accent-info",
  "left-accent-success",
  "left-accent-warning",
  "left-accent-error",
  "left-accent-neutral",
] as const;

export type AlertPreset = (typeof alertPresets)[number];

export const playgroundQuickConfig: PlaygroundQuickConfig = {
  componentId: "YAlert",
  propKey: "preset",
  options: alertPresets,
  init(next) {
    if (next.type === undefined) next.type = "info";
    if (next.variant === undefined) next.variant = "soft";
    if (next.size === undefined) next.size = "md";
    if (next.title === undefined) next.title = "Heads up";
    if (next.message === undefined) next.message = "This is an alert message.";
    if (next.showIcon === undefined) next.showIcon = true;
    if (next.dismissible === undefined) next.dismissible = false;
  },
  applyOption(next, option) {
    const [variant, type] = (option as string).split("-") as [string, string];
    // handle "left-accent" compound key
    if (variant === "left") {
      next.variant = "left-accent";
      next.type = type.replace("accent-", "") as AlertType;
      // re-parse: option is "left-accent-<type>"
      const parts = (option as string).split("-");
      next.type = parts[2] as AlertType;
    } else {
      next.variant = variant as AlertVariant;
      next.type = type as AlertType;
    }
    next.title = "Heads up";
    next.message = "This is an alert message.";
  },
};
