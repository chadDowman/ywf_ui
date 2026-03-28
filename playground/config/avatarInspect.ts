import type { YAvatarPreset } from "../../src/types/avatar";
import type { PlaygroundQuickConfig } from "./types";

export const avatarPresets = [
  "default",
  "glass",
  "neon",
  "retro",
  "minimal",
  "brutalist",
  "gradient-ring",
  "pixel",
  "sticker",
  "duotone",
  "monochrome",
  "soft-shadow",
  "elevated",
  "outline",
  "frosted",
  "ink",
] as const;

export const avatarSizes = ["xs", "sm", "md", "lg", "xl", "2xl"] as const;
export const avatarShapes = ["circle", "rounded", "square"] as const;
export const avatarStatuses = ["online", "offline", "busy", "away"] as const;
export const avatarRings = [
  "none",
  "solid",
  "dashed",
  "double",
  "gradient",
] as const;

/** Per-preset overrides for playground seeding */
type PresetSeedMap = Partial<Record<YAvatarPreset, Record<string, unknown>>>;

const presetSeeds: PresetSeedMap = {
  neon: {
    accentColor: "#22c55e",
    name: "Neo",
  },
  retro: {
    name: "Retro",
  },
  brutalist: {
    name: "BRUT",
  },
  "gradient-ring": {
    accentColor: "#8b5cf6",
    name: "Grace",
  },
  sticker: {
    name: "Star",
  },
  duotone: {
    name: "Duo",
  },
  ink: {
    name: "Ink",
  },
  pixel: {
    name: "8bit",
  },
  glass: {
    name: "Glass",
  },
  frosted: {
    name: "Frost",
  },
};

export const playgroundQuickConfig: PlaygroundQuickConfig = {
  componentId: "YAvatar",
  propKey: "preset",
  options: avatarPresets,
  init(next) {
    if (next.preset === undefined) next.preset = "default";
    if (next.name === undefined) next.name = "Ada Lovelace";
    if (next.sizeScale === undefined) next.sizeScale = "lg";
    if (next.shape === undefined) next.shape = "circle";
    if (next.ring === undefined) next.ring = "none";
    // No src by default — shows the seeded non-human image
  },
  applyOption(next, option) {
    next.preset = option;
    next.accentColor = undefined;
    next.bgColor = undefined;
    next.textColor = undefined;
    next.src = undefined;
    const seed = presetSeeds[option as YAvatarPreset];
    if (seed) {
      Object.assign(next, seed);
    } else {
      next.name = "Ada Lovelace";
    }
  },
};
