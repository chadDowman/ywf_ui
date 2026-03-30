export type AlertType = "info" | "success" | "warning" | "error" | "neutral";
export type AlertVariant =
  | "solid"
  | "outline"
  | "soft"
  | "left-accent"
  | "ghost";
export type AlertSize = "sm" | "md" | "lg";
export type AlertIntensity = "low" | "medium" | "high";
export type AlertRadius = "none" | "sm" | "md" | "lg" | "xl" | "full";

export type YAlertType = AlertType;
export type YAlertVariant = AlertVariant;
export type YAlertSize = AlertSize;
export type YAlertIntensity = AlertIntensity;
export type YAlertRadius = AlertRadius;

export interface YAlertAction {
  label: string;
  variant?: "link" | "outline" | "solid";
}

export interface YAlertProps {
  dark?: boolean;
  type?: AlertType;
  variant?: AlertVariant;
  size?: AlertSize;
  intensity?: AlertIntensity;
  title?: string;
  message?: string;
  showIcon?: boolean;
  dismissible?: boolean;
  action?: YAlertAction;
  secondaryAction?: YAlertAction;
  radius?: AlertRadius;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
}
