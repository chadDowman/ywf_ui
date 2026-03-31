export type YToastType = "success" | "error" | "warning" | "info";
export type YToastVariant =
  | "solid"
  | "soft"
  | "outlined"
  | "glass"
  | "aurora"
  | "neon"
  | "brutalist"
  | "terminal"
  | "minimal";
export type YToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";
export type YToastRadius = "none" | "sm" | "md" | "lg" | "full";

export interface YToastProps {
  dark?: boolean;
  message?: string;
  title?: string;
  type?: YToastType;
  variant?: YToastVariant;
  textColor?: string;
  position?: YToastPosition;
  duration?: number;
  dismissible?: boolean;
  visible?: boolean;
  icon?: string;
  radius?: YToastRadius;
  showIcon?: boolean;
}
