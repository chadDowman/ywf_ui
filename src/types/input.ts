export type YInputVariant = "outlined" | "filled" | "ghost" | "underline";
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
