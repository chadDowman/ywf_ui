import type { YAnimationPreset } from "./animation";

export type YAccordionVariant =
  | "default"
  | "bordered"
  | "filled"
  | "flush"
  | "card"
  | "ghost"
  | "brutal"
  | "neon"
  | "soft"
  | "timeline";

export type YAccordionRadius = "none" | "sm" | "md" | "lg" | "xl";

export interface YAccordionItem {
  id: string;
  title: string;
  content?: string;
  icon?: string;
  disabled?: boolean;
}

export interface YAccordionProps {
  dark?: boolean;
  animation?: YAnimationPreset;
  items?: YAccordionItem[];
  variant?: YAccordionVariant;
  multiple?: boolean;
  defaultOpen?: string[];
  radius?: YAccordionRadius;
  textColor?: string;
  bordered?: boolean;
  separated?: boolean;
}
