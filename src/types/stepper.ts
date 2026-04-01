import type { YAnimationPreset } from "./animation";

export type YStepperVariant =
  | "simple"
  | "outlined"
  | "filled"
  | "pills"
  | "brutalist"
  | "minimal";

export type YStepperSize = "sm" | "md" | "lg";
export type YStepperOrientation = "horizontal" | "vertical";

export interface YStepperStep {
  label: string;
  description?: string;
}

export interface YStepperProps {
  dark?: boolean;
  animation?: YAnimationPreset;
  steps: YStepperStep[];
  modelValue?: number;
  variant?: YStepperVariant;
  size?: YStepperSize;
  orientation?: YStepperOrientation;
  clickable?: boolean;
  disabled?: boolean;
}
