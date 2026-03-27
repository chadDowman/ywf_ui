import type {
  YDropdownItem,
  YDropdownPlacement,
  YDropdownSize,
  YDropdownVariant,
} from "../../src/types/dropdown";
import type { PlaygroundQuickConfig } from "./types";

export const dropdownVariants: YDropdownVariant[] = [
  "basic",
  "outline",
  "ghost",
  "glass",
  "split",
  "searchable",
  "multi-select",
  "nested",
  "command-palette",
  "compact",
];

export const dropdownSizes: YDropdownSize[] = ["xs", "sm", "md", "lg"];
export const dropdownPlacements: YDropdownPlacement[] = [
  "bottom-start",
  "bottom-end",
  "top-start",
  "top-end",
];

export const defaultDropdownItems: YDropdownItem[] = [
  { id: "new", label: "New File" },
  { id: "open", label: "Open" },
  { id: "save", label: "Save" },
  { id: "export", label: "Export", disabled: true },
];

export const nestedDropdownItems: YDropdownItem[] = [
  { id: "profile", label: "Profile" },
  {
    id: "settings",
    label: "Settings",
    children: [
      { id: "theme", label: "Theme" },
      { id: "notifications", label: "Notifications" },
      { id: "privacy", label: "Privacy" },
    ],
  },
  { id: "signout", label: "Sign out" },
];

export const commandPaletteItems: YDropdownItem[] = [
  { id: "goto", label: "Go to File", shortcut: "Ctrl+P", group: "Navigation" },
  {
    id: "symbol",
    label: "Go to Symbol",
    shortcut: "Ctrl+Shift+O",
    group: "Navigation",
  },
  { id: "toggle", label: "Toggle Sidebar", shortcut: "Ctrl+B", group: "View" },
  { id: "terminal", label: "Open Terminal", shortcut: "Ctrl+`", group: "View" },
];

export const playgroundQuickConfig: PlaygroundQuickConfig = {
  componentId: "YDropdown",
  propKey: "variant",
  options: dropdownVariants,
  init(next) {
    if (next.variant === undefined) next.variant = "basic";
    if (next.label === undefined) next.label = "Dropdown";
    if (next.size === undefined) next.size = "md";
    if (next.placeholder === undefined) next.placeholder = "Search...";
    if (next.maxHeight === undefined) next.maxHeight = "16rem";
    if (next.placement === undefined) next.placement = "bottom-start";
    if (next.splitLabel === undefined) next.splitLabel = "Action";
    if (next.items === undefined) next.items = defaultDropdownItems;
    if (next.closeOnSelect === undefined) next.closeOnSelect = true;
    if (next.keyboardNavigation === undefined) next.keyboardNavigation = true;
    if (next.searchable === undefined) next.searchable = false;
    if (next.multiSelect === undefined) next.multiSelect = false;
  },
  applyOption(next, option) {
    if (option === "nested") {
      next.items = nestedDropdownItems;
    } else if (option === "command-palette") {
      next.items = commandPaletteItems;
      next.searchable = true;
    } else {
      next.items = defaultDropdownItems;
    }

    if (option === "multi-select") {
      next.multiSelect = true;
      if (!Array.isArray(next.modelValue)) next.modelValue = [];
    } else {
      next.multiSelect = false;
      if (Array.isArray(next.modelValue)) next.modelValue = "";
    }
  },
};
