import type { YAnimationPreset } from "./animation";

export type YChipVariant = "solid" | "outlined" | "soft" | "ghost";
export type YChipSize = "sm" | "md" | "lg";
export type YChipColor =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "error"
  | "info";

export interface YChipProps {
  dark?: boolean;
  animation?: YAnimationPreset;
  label: string;
  variant?: YChipVariant;
  size?: YChipSize;
  color?: YChipColor;
  dismissible?: boolean;
  disabled?: boolean;
}
