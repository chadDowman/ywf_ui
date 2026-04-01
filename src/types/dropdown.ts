export type YDropdownVariant =
  | "basic"
  | "outline"
  | "ghost"
  | "glass"
  | "split"
  | "searchable"
  | "multi-select"
  | "nested"
  | "command-palette"
  | "compact"
  | "aurora"
  | "brutalist"
  | "pill"
  | "terminal"
  | "floating";

export type YDropdownSize = "xs" | "sm" | "md" | "lg";

export type YDropdownPlacement =
  | "bottom-start"
  | "bottom-end"
  | "top-start"
  | "top-end";

export interface YDropdownItem {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  shortcut?: string;
  /** Nested children for the "nested" variant */
  children?: YDropdownItem[];
  /** Visual group/section label shown above this item */
  group?: string;
}

import type { YAnimationPreset } from "./animation";

export interface YDropdownProps {
  dark?: boolean;
  animation?: YAnimationPreset;
  label?: string;
  variant?: YDropdownVariant;
  size?: YDropdownSize;
  disabled?: boolean;
  placeholder?: string;
  maxHeight?: string;
  closeOnSelect?: boolean;
  keyboardNavigation?: boolean;
  placement?: YDropdownPlacement;
  /** Items to render when not using the default slot */
  items?: YDropdownItem[];
  /** Searchable filtering (auto-enabled for searchable & command-palette variants) */
  searchable?: boolean;
  /** Allow multiple selections (auto-enabled for multi-select variant) */
  multiSelect?: boolean;
  /** Currently selected item id(s) */
  modelValue?: string | string[];
  /** Split-button: label for the primary action side */
  splitLabel?: string;
}

export interface YDropdownEmits {
  (e: "update:modelValue", value: string | string[]): void;
  (e: "select", item: YDropdownItem): void;
  (e: "splitClick"): void;
}
