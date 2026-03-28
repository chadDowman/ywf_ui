import type { PlaygroundQuickConfig } from "./types";

export const playgroundModalSizes = [
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "full",
] as const;
export const playgroundModalVariants = [
  "clean",
  "glass",
  "dark",
  "ink",
  "aurora",
  "warm",
  "brutalist",
  "minimal",
] as const;
export const playgroundModalPositions = [
  "center",
  "top",
  "bottom",
  "drawer-right",
  "drawer-left",
] as const;
export const playgroundModalBackdrops = [
  "blur",
  "dim",
  "none",
  "frosted",
] as const;
export const playgroundModalPaddings = ["none", "sm", "md", "lg"] as const;

export const playgroundQuickConfig: PlaygroundQuickConfig = {
  componentId: "YModal",
  propKey: "variant",
  options: [...playgroundModalVariants],
  init(next) {
    if (next.open === undefined) next.open = true;
    next.teleportTo = false;
    if (next.title === undefined) next.title = "Dialog Title";
    if (next.description === undefined)
      next.description = "This is a modal dialog.";
    if (next.size === undefined) next.size = "md";
    if (next.position === undefined) next.position = "center";
    if (next.backdrop === undefined) next.backdrop = "blur";
    if (next.padding === undefined) next.padding = "md";
    if (next.rounded === undefined) next.rounded = true;
    if (next.scrollable === undefined) next.scrollable = true;
    if (next.showClose === undefined) next.showClose = true;
  },
  applyOption(next, option) {
    next.variant = option;
    next.open = true;
    next.teleportTo = false;
  },
};
