import type { PlaygroundQuickConfig } from "./types";

export const sidebarVariants = [
  "clean",
  "dark",
  "glass",
  "ink",
  "aurora",
  "warm",
  "bordered",
  "ghost",
] as const;
export const sidebarPositions = ["left", "right"] as const;
export const sidebarSizes = ["sm", "md", "lg"] as const;
export const sidebarBehaviors = [
  "push",
  "overlay",
  "drawer",
  "static",
] as const;
export const sidebarCollapsedModes = ["hidden", "icons", "mini"] as const;

export const playgroundQuickConfig: PlaygroundQuickConfig = {
  componentId: "YSidebar",
  propKey: "variant",
  options: [...sidebarVariants],
  applyOption(next, option) {
    next.variant = option;
  },
};
