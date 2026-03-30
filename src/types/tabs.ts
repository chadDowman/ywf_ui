export type YTabsVariant =
  | "underline"
  | "pills"
  | "boxed"
  | "highlight"
  | "brutal"
  | "glass"
  | "neon"
  | "soft"
  | "chip"
  | "retro"
  | "minimal"
  | "floating"
  | "aurora"
  | "terminal"
  | "dot"
  | "folder"
  | "gradient"
  | "outline"
  | "ticker";

export type YTabsAlign = "left" | "center" | "right" | "stretch";

export interface YTabsProps {
  dark?: boolean;
  tabs?: string[];
  variant?: YTabsVariant;
  align?: YTabsAlign;
}
