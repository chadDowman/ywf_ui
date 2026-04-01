import type { YAnimationPreset } from "./animation";

import type { ComponentSize } from "./common";

export type YRadioSize = ComponentSize;
export type YRadioVariant =
  | "default"
  | "filled"
  | "ghost"
  | "card"
  | "pill"
  | "brutal"
  | "soft"
  | "neon"
  | "segmented";

export interface YRadioProps {
  dark?: boolean;
  animation?: YAnimationPreset;
  modelValue?: unknown;
  value?: unknown;
  label?: string;
  description?: string;
  size?: YRadioSize;
  variant?: YRadioVariant;
  color?: string;
  textColor?: string;
  disabled?: boolean;
}
