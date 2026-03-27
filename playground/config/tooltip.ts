import type { PlaygroundQuickConfig } from "./types";

export const tooltipPlacements = ["top", "bottom", "left", "right"] as const;
export const tooltipVariants = [
  "dark",
  "light",
  "primary",
  "success",
  "warning",
  "danger",
  "gradient",
] as const;

export const playgroundQuickConfig: PlaygroundQuickConfig = {
  componentId: "YTooltip",
  propKey: "variant",
  options: [...tooltipVariants],
  applyOption(next, option) {
    next.variant = option;
  },
};
