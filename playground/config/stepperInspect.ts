import type { PlaygroundQuickConfig } from "./types";

export const stepperVariants = [
  "simple",
  "outlined",
  "filled",
  "pills",
  "brutalist",
  "minimal",
] as const;

export const stepperSizes = ["sm", "md", "lg"] as const;
export const stepperOrientations = ["horizontal", "vertical"] as const;

export const playgroundQuickConfig: PlaygroundQuickConfig = {
  componentId: "YStepper",
  propKey: "variant",
  options: [...stepperVariants],
  init(next) {
    if (next.steps === undefined)
      next.steps = [
        { label: "Account", description: "Your credentials" },
        { label: "Profile", description: "Tell us about you" },
        { label: "Review", description: "Confirm details" },
        { label: "Done" },
      ];
    if (next.modelValue === undefined) next.modelValue = 1;
    if (next.size === undefined) next.size = "md";
    if (next.orientation === undefined) next.orientation = "horizontal";
    if (next.clickable === undefined) next.clickable = true;
  },
  applyOption(next, option) {
    next.variant = option;
  },
};
