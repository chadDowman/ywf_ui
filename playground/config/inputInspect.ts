import type { PlaygroundQuickConfig } from "./types";

export const inputVariants = [
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
export const inputSizes = ["sm", "md", "lg"] as const;
export const inputRadii = ["none", "sm", "md", "lg", "full"] as const;
export const inputStates = ["default", "error", "success", "warning"] as const;
export const inputTypes = [
  "text",
  "email",
  "password",
  "number",
  "search",
  "tel",
  "url",
] as const;

export const playgroundQuickConfig: PlaygroundQuickConfig = {
  componentId: "YInput",
  propKey: "type",
  options: [...inputTypes],
  applyOption(next, option) {
    next.type = option;
  },
};
