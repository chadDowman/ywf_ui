import type { PlaygroundQuickConfig } from "./types";

export const buttonPresets = [
  "solid",
  "outline",
  "ghost",
  "gradient",
  "neon",
  "pill",
  "brutal",
  "glass",
  "magnetic",
  "underline",
  "retro",
  "cyber",
  "stitched",
  "liquid",
  "3d",
] as const;

export const buttonSizes = ["xs", "sm", "md", "lg", "xl"] as const;
export const buttonVariants = ["solid", "outline", "ghost"] as const;
export const buttonShadowOptions = ["false", "sm", "md", "lg", "xl"] as const;
export const buttonRoundedOptions = [
  "false",
  "sm",
  "md",
  "lg",
  "xl",
  "full",
] as const;
export const buttonAnimationOptions = [
  "false",
  "pulse",
  "bounce",
  "shake",
  "glow",
  "spin",
  "wobble",
  "typewriter",
  "breathe",
  "flicker",
  "slide-in",
] as const;
export const buttonEffectOptions = [
  "false",
  "ripple",
  "scale",
  "lift",
  "neon",
  "glassmorphism",
  "morph",
  "magnetic-pull",
  "spotlight",
  "emboss",
  "hologram",
] as const;
export const buttonIntensityOptions = ["subtle", "moderate", "strong"] as const;

export const buttonPresetDefaults: Record<
  string,
  { color: string; textColor: string }
> = {
  solid: { color: "#ff6b5a", textColor: "#ffffff" },
  outline: { color: "#4eeab0", textColor: "#4eeab0" },
  ghost: { color: "#a78bfa", textColor: "#a78bfa" },
  gradient: { color: "#ff6b5a", textColor: "#ffffff" },
  neon: { color: "#38bdf8", textColor: "#38bdf8" },
  pill: { color: "#fb7185", textColor: "#ffffff" },
  brutal: { color: "#a3e635", textColor: "#111111" },
  glass: { color: "#e879f9", textColor: "#e879f9" },
  magnetic: { color: "#22d3ee", textColor: "#22d3ee" },
  underline: { color: "#fb923c", textColor: "#fb923c" },
  retro: { color: "#f472b6", textColor: "#ffffff" },
  cyber: { color: "#06ffa5", textColor: "#0a0a0a" },
  stitched: { color: "#d97706", textColor: "#ffffff" },
  liquid: { color: "#8b5cf6", textColor: "#ffffff" },
  "3d": { color: "#ef4444", textColor: "#ffffff" },
};

export function normalizeMaybeFalse(value: string): string | false {
  return value === "false" ? false : value;
}

export const playgroundQuickConfig: PlaygroundQuickConfig = {
  componentId: "YButton",
  propKey: "preset",
  options: buttonPresets,
  init(next) {
    if (next.preset === undefined) next.preset = "solid";
    if (next.label === undefined) next.label = "Click Me";
  },
  applyOption(next, option) {
    const palette = buttonPresetDefaults[option];
    if (palette) {
      next.color = palette.color;
      next.textColor = palette.textColor;
    }
  },
};
