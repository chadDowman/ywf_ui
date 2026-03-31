export type YSkeletonVariant =
  | "rect"
  | "line"
  | "circle"
  | "text"
  | "avatar"
  | "block"
  | "button"
  | "badge"
  | "image"
  | "card"
  | "list-item";
export type YSkeletonRadius = "none" | "sm" | "md" | "lg" | "full";

export interface YSkeletonProps {
  dark?: boolean;
  variant?: YSkeletonVariant;
  width?: string | number;
  height?: string | number;
  radius?: YSkeletonRadius;
  textColor?: string;
  animated?: boolean;
  count?: number;
}
