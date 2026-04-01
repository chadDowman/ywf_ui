import type { YAnimationPreset } from "./animation";

import type { ComponentSize } from "./common";

export type YSwitchSize = ComponentSize;
export type YSwitchVariant = "default" | "pill" | "slim" | "ios";

export interface YSwitchProps {
  dark?: boolean;
  animation?: YAnimationPreset;
  modelValue?: boolean;
  label?: string;
  description?: string;
  size?: YSwitchSize;
  variant?: YSwitchVariant;
  color?: string;
  textColor?: string;
  disabled?: boolean;
  loading?: boolean;
}
