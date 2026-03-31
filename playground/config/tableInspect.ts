import type { PlaygroundQuickConfig } from "./types";

export const tableVariants = [
  "simple",
  "striped",
  "bordered",
  "minimal",
  "card",
  "aurora",
  "glass",
  "brutalist",
  "terminal",
  "neon",
] as const;
export const tableSizes = ["xs", "sm", "md", "lg", "xl"] as const;

export const playgroundQuickConfig: PlaygroundQuickConfig = {
  componentId: "YTable",
  propKey: "variant",
  options: [...tableVariants],
  applyOption(next, option) {
    next.variant = option;
  },
};
