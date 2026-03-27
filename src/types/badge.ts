export type BadgeVariant =
  | "solid"
  | "outline"
  | "soft"
  | "ghost"
  | "glass"
  | "surface"
  | "dot-outline";
export type BadgeSize = "xs" | "sm" | "md" | "lg";
export type BadgeColor =
  | "gray"
  | "red"
  | "orange"
  | "amber"
  | "yellow"
  | "lime"
  | "green"
  | "emerald"
  | "teal"
  | "cyan"
  | "sky"
  | "blue"
  | "indigo"
  | "violet"
  | "purple"
  | "fuchsia"
  | "pink"
  | "rose";
export type BadgeRadius = "none" | "sm" | "md" | "lg" | "full";

export type YBadgeVariant = BadgeVariant;
export type YBadgeSize = BadgeSize;
export type YBadgeColor = BadgeColor;
export type YBadgeRadius = BadgeRadius;

export interface YBadgeProps {
  label?: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  color?: BadgeColor;
  dot?: boolean;
  pulse?: boolean;
  rounded?: boolean;
  radius?: BadgeRadius;
  dismissible?: boolean;
  icon?: string;
  trailingIcon?: string;
  uppercase?: boolean;
  maxWidth?: number;
  disabled?: boolean;
  clickable?: boolean;
  count?: number;
  countMax?: number;
}
