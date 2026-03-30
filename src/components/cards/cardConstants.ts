import type { ComponentSize } from "@/types";

export const paddingMap: Record<ComponentSize, string> = {
  xs: "p-2",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
  xl: "p-8",
};

export const shadowMap: Record<string, string> = {
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
};

export const roundedMap: Record<string, string> = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

export const notifColors: Record<string, string> = {
  info: "var(--ywf-accent)",
  success: "var(--ywf-success-subtle)",
  warning: "var(--ywf-warning-subtle)",
  error: "var(--ywf-error-subtle)",
};

export const notifIcons: Record<string, string> = {
  info: "i",
  success: "✓",
  warning: "!",
  error: "✕",
};

export const priorityBg: Record<string, string> = {
  low: "#dcfce7",
  medium: "#fef9c3",
  high: "#fee2e2",
};

export const priorityText: Record<string, string> = {
  low: "var(--ywf-success)",
  medium: "#ca8a04",
  high: "var(--ywf-error-subtle)",
};
