import type { YAnimationPreset } from "./animation";

import type { ComponentSize } from "./common";

export type YSpinnerSize = ComponentSize;
export type YSpinnerVariant =
  | "ring"
  | "dots"
  | "bars"
  | "pulse"
  | "bounce"
  | "ripple"
  | "orbit"
  | "clock"
  | "morph"
  | "wave"
  | "grid"
  | "spiral";
export type YSpinnerSpeed = "slow" | "normal" | "fast";

export interface YSpinnerProps {
  dark?: boolean;
  animation?: YAnimationPreset;
  size?: YSpinnerSize;
  variant?: YSpinnerVariant;
  color?: string;
  textColor?: string;
  label?: string;
  speed?: YSpinnerSpeed;
  visible?: boolean;
}
