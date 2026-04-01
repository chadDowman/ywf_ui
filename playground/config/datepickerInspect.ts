import type { PlaygroundQuickConfig } from "./types";

export const datepickerVariants = [
  "clean",
  "glass",
  "dark",
  "brutalist",
  "minimal",
] as const;

export const datepickerSizes = ["sm", "md", "lg"] as const;

export const playgroundQuickConfig: PlaygroundQuickConfig = {
  componentId: "YDatePicker",
  propKey: "variant",
  options: [...datepickerVariants],
  init(next) {
    if (next.placeholder === undefined) next.placeholder = "Select date";
    if (next.size === undefined) next.size = "md";
    if (next.clearable === undefined) next.clearable = true;
    if (next.inline === undefined) next.inline = true;
  },
  applyOption(next, option) {
    next.variant = option;
  },
};
