export type YModalSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
export type YModalVariant =
  | "clean"
  | "glass"
  | "dark"
  | "ink"
  | "aurora"
  | "warm"
  | "brutalist"
  | "minimal";
export type YModalPosition =
  | "center"
  | "top"
  | "bottom"
  | "drawer-right"
  | "drawer-left";
export type YModalBackdrop = "blur" | "dim" | "none" | "frosted";
export type YModalPadding = "none" | "sm" | "md" | "lg";

import type { YAnimationPreset } from "./animation";

export interface YModalProps {
  dark?: boolean;
  animation?: YAnimationPreset;
  open?: boolean;
  /** Teleport target selector; set to false to render inline in parent container */
  teleportTo?: string | false;
  variant?: YModalVariant;
  size?: YModalSize;
  position?: YModalPosition;
  backdrop?: YModalBackdrop;
  title?: string;
  description?: string;
  showClose?: boolean;
  persistent?: boolean;
  rounded?: boolean;
  padding?: YModalPadding;
  fullHeight?: boolean;
  scrollable?: boolean;
  loading?: boolean;
  danger?: boolean;
}

export type {
  YModalSize as ModalSize,
  YModalVariant as ModalVariant,
  YModalPosition as ModalPosition,
  YModalBackdrop as ModalBackdrop,
  YModalPadding as ModalPadding,
  YModalProps as ModalProps,
  YModalVariantTokens as ModalVariantTokens,
};

export interface YModalVariantTokens {
  shell: string;
  header: string;
  separator: string;
  footer: string;
  title: string;
  description: string;
  closeBtn: string;
  closeBtnHover: string;
  spinner: string;
  loadingOverlay: string;
}
