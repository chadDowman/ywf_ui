import type { YAnimationPreset } from "./animation";

export type YDividerVariant = "solid" | "dashed" | "dotted";
export type YDividerOrientation = "horizontal" | "vertical";
export type YDividerThickness = "thin" | "base" | "thick";
export type YDividerAlign = "left" | "center" | "right";

export interface YDividerProps {
  dark?: boolean;
  animation?: YAnimationPreset;
  label?: string;
  orientation?: YDividerOrientation;
  variant?: YDividerVariant;
  thickness?: YDividerThickness;
  align?: YDividerAlign;
  color?: string;
}
