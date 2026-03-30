import type { ComponentSize } from "./common";

export type YTableSize = ComponentSize;
export type YTableVariant =
  | "simple"
  | "striped"
  | "bordered"
  | "minimal"
  | "card";

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
  loading?: boolean;
  caption?: string;
  hoverable?: boolean;
  fullWidth?: boolean;
}
