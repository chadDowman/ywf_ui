import type { YAnimationPreset } from "./animation";

export type YTextareaVariant =
  | "outlined"
  | "filled"
  | "ghost"
  | "underline"
  | "glass"
  | "brutalist"
  | "aurora"
  | "neon"
  | "terminal";

export type YTextareaSize = "sm" | "md" | "lg";
export type YTextareaRadius = "none" | "sm" | "md" | "lg" | "full";
export type YTextareaState = "default" | "error" | "success" | "warning";
export type YTextareaResize = "none" | "vertical" | "horizontal" | "both";

export interface YTextareaProps {
  dark?: boolean;
  animation?: YAnimationPreset;
  modelValue?: string;
  placeholder?: string;
  variant?: YTextareaVariant;
  size?: YTextareaSize;
  radius?: YTextareaRadius;
  state?: YTextareaState;
  fullWidth?: boolean;
  label?: string;
  hint?: string;
  error?: string;
  success?: string;
  warning?: string;
  rows?: number;
  resize?: YTextareaResize;
  autoResize?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  maxLength?: number;
  showCount?: boolean;
  textColor?: string;
}
