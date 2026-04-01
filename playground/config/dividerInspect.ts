import type { PlaygroundQuickConfig } from "./types";

export const dividerVariants = ["solid", "dashed", "dotted"] as const;
export const dividerThicknesses = ["thin", "base", "thick"] as const;
export const dividerOrientations = ["horizontal", "vertical"] as const;
export const dividerAligns = ["left", "center", "right"] as const;

export const playgroundQuickConfig: PlaygroundQuickConfig = {
  componentId: "YDivider",
  propKey: "variant",
  options: [...dividerVariants],
  init(next) {
    if (next.label === undefined) next.label = "OR";
    if (next.orientation === undefined) next.orientation = "horizontal";
    if (next.thickness === undefined) next.thickness = "base";
    if (next.align === undefined) next.align = "center";
  },
  applyOption(next, option) {
    next.variant = option;
  },
};
