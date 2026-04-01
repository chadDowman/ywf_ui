import type { PlaygroundQuickConfig } from "./types";

export const textareaVariants = [
  "outlined",
  "filled",
  "ghost",
  "underline",
  "glass",
  "brutalist",
  "aurora",
  "neon",
  "terminal",
] as const;

export const textareaSizes = ["sm", "md", "lg"] as const;
export const textareaRadii = ["none", "sm", "md", "lg", "full"] as const;
export const textareaStates = ["default", "error", "success", "warning"] as const;
export const textareaResizes = ["none", "vertical", "horizontal", "both"] as const;

export const playgroundQuickConfig: PlaygroundQuickConfig = {
  componentId: "YTextarea",
  propKey: "variant",
  options: [...textareaVariants],
  applyOption(next, option) {
    next.variant = option;
  },
};
