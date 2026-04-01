import type { YAnimationPreset } from "./animation";

export type YInputVariant =
  | "outlined"
  | "filled"
  | "ghost"
  | "underline"
  | "glass"
  | "brutalist"
  | "aurora"
  | "neon"
  | "terminal";
export type YInputSize = "sm" | "md" | "lg";
export type YInputType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "search"
  | "tel"
  | "url";
export type YInputRadius = "none" | "sm" | "md" | "lg" | "full";
export type YInputState = "default" | "error" | "success" | "warning";

export interface YInputProps {
  dark?: boolean;
  animation?: YAnimationPreset;
  modelValue?: string | number;
  placeholder?: string;
  type?: YInputType;
  variant?: YInputVariant;
  size?: YInputSize;
  radius?: YInputRadius;
  state?: YInputState;
  fullWidth?: boolean;
  label?: string;
  hint?: string;
  error?: string;
  success?: string;
  warning?: string;
  prefix?: string;
  suffix?: string;
  leadingIcon?: string;
  trailingIcon?: string;
  disabled?: boolean;
  readonly?: boolean;
  loading?: boolean;
  clearable?: boolean;
  required?: boolean;
  maxLength?: number;
  showCount?: boolean;
}

export interface YInputSizeScale {
  height: string;
  text: string;
  px: string;
  labelText: string;
  labelGap: string;
  hintText: string;
  hintGap: string;
  affixText: string;
  affixPx: string;
  icon: string;
  iconLeft: string;
  iconRight: string;
  inputPl: string;
  inputPr: string;
  inputPlIcon: string;
  inputPrIcon: string;
  ring: string;
  closeBtn: string;
}

export interface YInputVariantTokens {
  idle: string;
  hover: string;
  focus: string;
  ring: string;
  error: string;
  errorRing: string;
  success: string;
  successRing: string;
  warning: string;
  warningRing: string;
  disabled: string;
  readonly: string;
  affix: string;
  affixBorderL: string;
  affixBorderR: string;
}
