import type { YAnimationPreset } from "./animation";

export type YPaginationVariant =
  | "simple"
  | "outlined"
  | "filled"
  | "pills"
  | "ghost"
  | "minimal"
  | "brutalist"
  | "aurora"
  | "neon";

export type YPaginationSize = "sm" | "md" | "lg";

export interface YPaginationProps {
  dark?: boolean;
  animation?: YAnimationPreset;
  modelValue?: number;
  totalPages?: number;
  sibling?: number;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  disabled?: boolean;
  variant?: YPaginationVariant;
  size?: YPaginationSize;
  textColor?: string;
}
