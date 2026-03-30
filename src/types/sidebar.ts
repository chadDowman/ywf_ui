export type YSidebarVariant =
  | "clean"
  | "dark"
  | "glass"
  | "ink"
  | "aurora"
  | "warm"
  | "bordered"
  | "ghost"
  | "neon"
  | "frosted"
  | "forest"
  | "midnight"
  | "chalk"
  | "retro"
  | "candy"
  | "carbon"
  | "ocean"
  | "rose";

export type YSidebarSize = "sm" | "md" | "lg";
export type YSidebarCollapsedMode = "hidden" | "icons" | "mini";
export type YSidebarBehavior = "push" | "overlay" | "drawer" | "static";

export interface YSidebarItem {
  id: string;
  label: string;
  icon?: string;
  badge?: string | number;
  href?: string;
  disabled?: boolean;
  children?: YSidebarItem[];
}

export interface YSidebarGroup {
  id: string;
  label?: string;
  collapsible?: boolean;
  items: YSidebarItem[];
}

export interface YSidebarProps {
  dark?: boolean;
  open?: boolean;
  variant?: YSidebarVariant;
  size?: YSidebarSize;
  position?: "left" | "right";
  behavior?: YSidebarBehavior;
  collapsedMode?: YSidebarCollapsedMode;
  width?: string;
  collapsedWidth?: string;
  items?: YSidebarItem[];
  groups?: YSidebarGroup[];
  activeItemId?: string;
  logoText?: string;
  logoIcon?: string;
  showToggleButton?: boolean;
  collapsible?: boolean;
  elevation?: 0 | 1 | 2 | 3;
  rounded?: boolean;
  sticky?: boolean;
  zIndex?: number;
}

export type {
  YSidebarVariant as SidebarVariant,
  YSidebarSize as SidebarSize,
  YSidebarCollapsedMode as SidebarCollapsedMode,
  YSidebarBehavior as SidebarBehavior,
  YSidebarItem as SidebarItem,
  YSidebarGroup as SidebarGroup,
  YSidebarProps as SidebarProps,
  YSidebarSizeScale as SidebarSizeScale,
  YSidebarVariantTokens as SidebarVariantTokens,
};

export interface YSidebarSizeScale {
  itemH: string;
  itemPx: string;
  itemText: string;
  iconSize: string;
  logoText: string;
  groupLabel: string;
  badgeText: string;
  childText: string;
  childPl: string;
}

export interface YSidebarVariantTokens {
  shell: string;
  border: string;
  item: string;
  itemHover: string;
  itemActive: string;
  itemActiveBorder: string;
  groupLabel: string;
  badge: string;
  logo: string;
  separator: string;
  toggle: string;
  tooltip: string;
  iconDot: string;
  /** Extra class applied to the active item for special effects */
  itemActiveExtra?: string;
}
