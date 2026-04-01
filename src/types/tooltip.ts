export type YTooltipPlacement = "top" | "bottom" | "left" | "right";
export type YTooltipVariant =
  | "dark"
  | "light"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "gradient";

import type { YAnimationPreset } from "./animation";

export interface YTooltipProps {
  dark?: boolean;
  animation?: YAnimationPreset;
  text?: string;
  placement?: YTooltipPlacement;
  variant?: YTooltipVariant;
  maxWidth?: string;
}
