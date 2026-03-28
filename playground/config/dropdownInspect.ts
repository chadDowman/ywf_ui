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
  "aurora",
  "brutalist",
  "pill",
  "terminal",
  "floating",
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

export const auroraDropdownItems: YDropdownItem[] = [
  { id: "explore", label: "Explore", icon: "✦" },
  { id: "create", label: "Create", icon: "◈" },
  { id: "library", label: "Library", icon: "⬡" },
  { id: "settings", label: "Settings", icon: "⊛" },
];

export const terminalDropdownItems: YDropdownItem[] = [
  { id: "ls", label: "ls -la", icon: "$" },
  { id: "cd", label: "cd ~/projects", icon: "$" },
  { id: "git", label: "git status", icon: "$" },
  { id: "npm", label: "npm run dev", icon: "$" },
];

export const pillDropdownItems: YDropdownItem[] = [
  { id: "design", label: "Design", icon: "🎨" },
  { id: "develop", label: "Develop", icon: "⚡" },
  { id: "deploy", label: "Deploy", icon: "🚀" },
  { id: "monitor", label: "Monitor", icon: "📊" },
];

export const brutalistDropdownItems: YDropdownItem[] = [
  { id: "upload", label: "UPLOAD FILE" },
  { id: "download", label: "DOWNLOAD" },
  { id: "delete", label: "DELETE", disabled: true },
  { id: "share", label: "SHARE" },
];

export const floatingDropdownItems: YDropdownItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "▦" },
  { id: "analytics", label: "Analytics", icon: "◎" },
  { id: "team", label: "Team", icon: "◉" },
  { id: "billing", label: "Billing", icon: "◈", disabled: true },
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
    // Reset multi-select state
    if (option === "multi-select") {
      next.multiSelect = true;
      if (!Array.isArray(next.modelValue)) next.modelValue = [];
    } else {
      next.multiSelect = false;
      if (Array.isArray(next.modelValue)) next.modelValue = "";
    }

    // Assign variant-appropriate items
    switch (option) {
      case "nested":
        next.items = nestedDropdownItems;
        break;
      case "command-palette":
        next.items = commandPaletteItems;
        next.searchable = true;
        break;
      case "aurora":
        next.items = auroraDropdownItems;
        break;
      case "terminal":
        next.items = terminalDropdownItems;
        break;
      case "pill":
        next.items = pillDropdownItems;
        break;
      case "brutalist":
        next.items = brutalistDropdownItems;
        break;
      case "floating":
        next.items = floatingDropdownItems;
        break;
      default:
        next.items = defaultDropdownItems;
        break;
    }
  },
};
