import type { YAnimationPreset } from "./animation";

import type { ComponentSize } from "./common";

export type YSelectSize = ComponentSize;
export type YSelectVariant =
  | "outlined"
  | "filled"
  | "ghost"
  | "underline"
  | "aurora"
  | "glass"
  | "brutalist"
  | "terminal"
  | "neon";
export type YSelectRadius = "none" | "sm" | "md" | "lg" | "full";

export interface YSelectOption {
  label: string;
  value: unknown;
  disabled?: boolean;
}

export interface YSelectProps {
  dark?: boolean;
  animation?: YAnimationPreset;
  modelValue?: unknown;
  options?: YSelectOption[];
  placeholder?: string;
  label?: string;
  hint?: string;
  error?: string;
  size?: YSelectSize;
  variant?: YSelectVariant;
  radius?: YSelectRadius;
  textColor?: string;
  disabled?: boolean;
  clearable?: boolean;
  searchable?: boolean;
  multiple?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
}
