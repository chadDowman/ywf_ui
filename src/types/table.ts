import type { ComponentSize } from "./common";

export type YTableSize = ComponentSize;
export type YTableVariant =
  | "simple"
  | "striped"
  | "bordered"
  | "minimal"
  | "card"
  | "aurora"
  | "glass"
  | "brutalist"
  | "terminal"
  | "neon";

export interface YTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  width?: string;
}

export interface YTableProps {
  dark?: boolean;
  columns?: YTableColumn[];
  rows?: Record<string, unknown>[];
  variant?: YTableVariant;
  size?: YTableSize;
  textColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  headerBackgroundColor?: string;
  headerTextColor?: string;
  cellTextColor?: string;
  captionColor?: string;
  rowHoverColor?: string;
  rowHoverTextColor?: string;
  dividerColor?: string;
  loading?: boolean;
  caption?: string;
  hoverable?: boolean;
  fullWidth?: boolean;
}
