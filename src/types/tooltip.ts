export type YTooltipPlacement = "top" | "bottom" | "left" | "right";
export type YTooltipVariant =
  | "dark"
  | "light"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "gradient";

export interface YTooltipProps {
  text?: string;
  placement?: YTooltipPlacement;
  variant?: YTooltipVariant;
  maxWidth?: string;
}
