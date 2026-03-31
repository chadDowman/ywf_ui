import type { PlaygroundQuickConfig } from "./types";

export const toastTypes = ["success", "error", "warning", "info"] as const;
export const toastVariants = [
  "solid",
  "soft",
  "outlined",
  "glass",
  "aurora",
  "neon",
  "brutalist",
  "terminal",
  "minimal",
] as const;
export const toastPositions = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
] as const;
export const toastRadii = ["none", "sm", "md", "lg", "full"] as const;

export const playgroundQuickConfig: PlaygroundQuickConfig = {
  componentId: "YToast",
  propKey: "variant",
  options: [...toastVariants],
  applyOption(next, option) {
    next.variant = option;
  },
};
