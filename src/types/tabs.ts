export type YTabsVariant = "underline" | "pills" | "boxed" | "highlight";
export type YTabsAlign = "left" | "center" | "right" | "stretch";

export interface YTabsProps {
  tabs?: string[];
  variant?: YTabsVariant;
  align?: YTabsAlign;
}
