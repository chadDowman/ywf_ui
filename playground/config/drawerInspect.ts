import type { PlaygroundQuickConfig } from "./types";

export const drawerVariants = [
  "clean",
  "glass",
  "dark",
  "ink",
  "aurora",
  "warm",
  "brutalist",
  "minimal",
] as const;

export const drawerSizes = ["xs", "sm", "md", "lg", "xl", "2xl", "full"] as const;
export const drawerSides = ["left", "right", "top", "bottom"] as const;
export const drawerBackdrops = ["blur", "dim", "none", "frosted"] as const;
export const drawerPaddings = ["none", "sm", "md", "lg"] as const;

export const playgroundQuickConfig: PlaygroundQuickConfig = {
  componentId: "YDrawer",
  propKey: "variant",
  options: [...drawerVariants],
  init(next) {
    if (next.open === undefined) next.open = true;
    next.teleportTo = false;
    if (next.title === undefined) next.title = "Drawer Title";
    if (next.description === undefined)
      next.description = "This is a slide-in drawer panel.";
    if (next.side === undefined) next.side = "right";
    if (next.size === undefined) next.size = "md";
    if (next.backdrop === undefined) next.backdrop = "blur";
    if (next.padding === undefined) next.padding = "md";
    if (next.showClose === undefined) next.showClose = true;
    if (next.scrollable === undefined) next.scrollable = true;
  },
  applyOption(next, option) {
    next.variant = option;
    next.open = true;
    next.teleportTo = false;
  },
};
