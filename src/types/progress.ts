import type { YAnimationPreset } from "./animation";

export type YProgressVariant =
  | "solid"
  | "soft"
  | "glass"
  | "brutalist"
  | "aurora"
  | "neon"
  | "terminal";

export type YProgressSize = "sm" | "md" | "lg";

export interface YProgressProps {
  dark?: boolean;
  animation?: YAnimationPreset;
  modelValue?: number;
  max?: number;
  variant?: YProgressVariant;
  size?: YProgressSize;
  rounded?: boolean;
  striped?: boolean;
  animated?: boolean;
  indeterminate?: boolean;
  showLabel?: boolean;
  label?: string;
  textColor?: string;
  labelColor?: string;
  trackColor?: string;
  fillColor?: string;
  borderColor?: string;
}
