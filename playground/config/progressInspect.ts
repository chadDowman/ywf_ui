import type { PlaygroundQuickConfig } from "./types";

export const progressVariants = [
  "solid",
  "soft",
  "glass",
  "brutalist",
  "aurora",
  "neon",
  "terminal",
] as const;

export const progressSizes = ["sm", "md", "lg"] as const;

export const playgroundQuickConfig: PlaygroundQuickConfig = {
  componentId: "YProgress",
  propKey: "variant",
  options: [...progressVariants],
  applyOption(next, option) {
    next.variant = option;
  },
};
