import type { PlaygroundQuickConfig } from "./types";

export const chipVariants = ["solid", "outlined", "soft", "ghost"] as const;
export const chipColors = [
  "neutral",
  "primary",
  "success",
  "warning",
  "error",
  "info",
] as const;
export const chipSizes = ["sm", "md", "lg"] as const;

export const playgroundQuickConfig: PlaygroundQuickConfig = {
  componentId: "YChip",
  propKey: "color",
  options: [...chipColors],
  init(next) {
    if (next.label === undefined) next.label = "Chip Label";
    if (next.variant === undefined) next.variant = "soft";
    if (next.size === undefined) next.size = "md";
    if (next.dismissible === undefined) next.dismissible = true;
  },
  applyOption(next, option) {
    next.color = option;
  },
};
