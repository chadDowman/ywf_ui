import type { YAnimationPreset } from "./animation";
export type { YAnimationPreset };

export type YDrawerSide = "left" | "right" | "top" | "bottom";
export type YDrawerSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
export type YDrawerVariant =
  | "clean"
  | "glass"
  | "dark"
  | "ink"
  | "aurora"
  | "warm"
  | "brutalist"
  | "minimal";
export type YDrawerBackdrop = "blur" | "dim" | "none" | "frosted";
export type YDrawerPadding = "none" | "sm" | "md" | "lg";

export interface YDrawerProps {
  dark?: boolean;
  animation?: YAnimationPreset;
  open?: boolean;
  side?: YDrawerSide;
  size?: YDrawerSize;
  variant?: YDrawerVariant;
  backdrop?: YDrawerBackdrop;
  padding?: YDrawerPadding;
  title?: string;
  description?: string;
  showClose?: boolean;
  persistent?: boolean;
  scrollable?: boolean;
  loading?: boolean;
  teleportTo?: string | false;
}

export interface YDrawerVariantTokens {
  shell: string;
  separator: string;
  footer: string;
  title: string;
  description: string;
  closeBtn: string;
  spinner: string;
  loadingOverlay: string;
}

export type {
  YDrawerSide as DrawerSide,
  YDrawerSize as DrawerSize,
  YDrawerVariant as DrawerVariant,
  YDrawerBackdrop as DrawerBackdrop,
  YDrawerPadding as DrawerPadding,
  YDrawerProps as DrawerProps,
};
