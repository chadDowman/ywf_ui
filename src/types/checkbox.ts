import type { YAnimationPreset } from "./animation";

import type { ComponentSize } from "./common";

export type YCheckboxSize = ComponentSize;
export type YCheckboxVariant =
  | "default"
  | "filled"
  | "ghost"
  | "outlined"
  | "soft"
  | "brutal"
  | "neon"
  | "pill"
  | "card"
  | "toggle";
export type YCheckboxRadius = "none" | "sm" | "md" | "lg" | "full";

export interface YCheckboxProps {
  dark?: boolean;
  animation?: YAnimationPreset;
  modelValue?: boolean;
  label?: string;
  description?: string;
  size?: YCheckboxSize;
  variant?: YCheckboxVariant;
  radius?: YCheckboxRadius;
  color?: string;
  textColor?: string;
  disabled?: boolean;
  indeterminate?: boolean;
}
