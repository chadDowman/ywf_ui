import type { PlaygroundQuickConfig } from "./types";

export const paginationVariants = [
  "simple",
  "outlined",
  "filled",
  "pills",
  "ghost",
  "minimal",
  "brutalist",
  "aurora",
  "neon",
] as const;

export const paginationSizes = ["sm", "md", "lg"] as const;

export const playgroundQuickConfig: PlaygroundQuickConfig = {
  componentId: "YPagination",
  propKey: "variant",
  options: [...paginationVariants],
  applyOption(next, option) {
    next.variant = option;
  },
};
