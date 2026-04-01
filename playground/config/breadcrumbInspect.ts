import type { PlaygroundQuickConfig } from "./types";

export const breadcrumbVariants = [
  "simple",
  "outlined",
  "pills",
  "ghost",
  "underline",
  "brutalist",
  "minimal",
] as const;

export const breadcrumbSizes = ["sm", "md", "lg"] as const;

export const playgroundQuickConfig: PlaygroundQuickConfig = {
  componentId: "YBreadcrumb",
  propKey: "variant",
  options: [...breadcrumbVariants],
  init(next) {
    if (next.items === undefined)
      next.items = [
        { label: "Home", href: "#" },
        { label: "Products", href: "#" },
        { label: "Category", href: "#" },
        { label: "Current Page" },
      ];
    if (next.separator === undefined) next.separator = "/";
    if (next.size === undefined) next.size = "md";
  },
  applyOption(next, option) {
    next.variant = option;
  },
};
