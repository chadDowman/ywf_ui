import type { ComponentSize } from "./common";

export type YButtonPreset =
  | "solid"
  | "outline"
  | "ghost"
  | "gradient"
  | "neon"
  | "pill"
  | "brutal"
  | "glass"
  | "magnetic"
  | "underline"
  | "retro"
  | "cyber"
  | "stitched"
  | "liquid"
  | "3d";

export type YButtonAnimation =
  | "pulse"
  | "bounce"
  | "shake"
  | "glow"
  | "spin"
  | "wobble"
  | "typewriter"
  | "breathe"
  | "flicker"
  | "slide-in";

export type YButtonEffect =
  | "ripple"
  | "scale"
  | "lift"
  | "neon"
  | "glassmorphism"
  | "morph"
  | "magnetic-pull"
  | "spotlight"
  | "emboss"
  | "hologram";

export type YButtonIntensity = "subtle" | "moderate" | "strong";

export interface YButtonProps {
  dark?: boolean;
  label?: string;
  size?: ComponentSize;
  color?: string;
  textColor?: string;
  variant?: "solid" | "outline" | "ghost";
  disabled?: boolean;
  shadow?: false | "sm" | "md" | "lg" | "xl";
  rounded?: false | "sm" | "md" | "lg" | "xl" | "full";
  padding?: ComponentSize;
  animation?: false | YButtonAnimation;
  effect?: false | YButtonEffect;
  animationIntensity?: YButtonIntensity;
  effectIntensity?: YButtonIntensity;
  preset?: false | YButtonPreset;
}
