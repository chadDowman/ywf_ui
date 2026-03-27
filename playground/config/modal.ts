import type { PlaygroundQuickConfig } from "./types";

export const modalSizes = [
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "full",
] as const;
export const modalVariants = [
  "clean",
  "glass",
  "dark",
  "ink",
  "aurora",
  "warm",
  "brutalist",
  "minimal",
] as const;
export const modalPositions = [
  "center",
  "top",
  "bottom",
  "drawer-right",
  "drawer-left",
] as const;
export const modalBackdrops = ["blur", "dim", "none", "frosted"] as const;
export const modalPaddings = ["none", "sm", "md", "lg"] as const;

export const playgroundQuickConfig: PlaygroundQuickConfig = {
  componentId: "YModal",
  propKey: "variant",
  options: [...modalVariants],
  applyOption(next, option) {
    next.variant = option;
  },
};
