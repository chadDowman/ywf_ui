import type { YAnimationPreset } from "./animation";

export type YBreadcrumbVariant =
  | "simple"
  | "outlined"
  | "pills"
  | "ghost"
  | "underline"
  | "brutalist"
  | "minimal";

export type YBreadcrumbSize = "sm" | "md" | "lg";

export interface YBreadcrumbItem {
  label: string;
  href?: string;
}

export interface YBreadcrumbProps {
  dark?: boolean;
  animation?: YAnimationPreset;
  items: YBreadcrumbItem[];
  separator?: string;
  variant?: YBreadcrumbVariant;
  size?: YBreadcrumbSize;
  maxItems?: number;
}
