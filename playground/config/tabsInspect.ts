import type { PlaygroundQuickConfig } from "./types";

export const tabsVariants = [
  "underline",
  "pills",
  "boxed",
  "highlight",
  "brutal",
  "glass",
  "neon",
  "soft",
  "chip",
  "retro",
  "minimal",
  "floating",
  "aurora",
  "terminal",
  "dot",
  "folder",
  "gradient",
  "outline",
  "ticker",
] as const;
export const tabsAligns = ["left", "center", "right", "stretch"] as const;

export const playgroundQuickConfig: PlaygroundQuickConfig = {
  componentId: "YTabs",
  propKey: "variant",
  options: [...tabsVariants],
  applyOption(next, option) {
    next.variant = option;
  },
};
