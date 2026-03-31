import type { PlaygroundQuickConfig } from "./types";

export const selectSizes = ["xs", "sm", "md", "lg", "xl"] as const;
export const selectVariants = [
  "outlined",
  "filled",
  "ghost",
  "underline",
  "aurora",
  "glass",
  "brutalist",
  "terminal",
  "neon",
] as const;
export const selectRadii = ["none", "sm", "md", "lg", "full"] as const;

export const playgroundQuickConfig: PlaygroundQuickConfig = {
  componentId: "YSelect",
  propKey: "variant",
  options: [...selectVariants],
  applyOption(next, option) {
    next.variant = option;
  },
};
