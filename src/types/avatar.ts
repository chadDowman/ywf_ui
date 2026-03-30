export type YAvatarPreset =
  | "default"
  | "glass"
  | "neon"
  | "retro"
  | "minimal"
  | "brutalist"
  | "gradient-ring"
  | "pixel"
  | "sticker"
  | "duotone"
  | "monochrome"
  | "soft-shadow"
  | "elevated"
  | "outline"
  | "frosted"
  | "ink";

export type YAvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export type YAvatarShape = "circle" | "rounded" | "square";

export type YAvatarStatus = "online" | "offline" | "busy" | "away";

export type YAvatarRing = "none" | "solid" | "dashed" | "double" | "gradient";

export interface YAvatarProps {
  dark?: boolean;
  src?: string;
  name?: string;
  /** Numeric pixel size — overrides the size scale if provided */
  size?: number;
  /** Named size scale */
  sizeScale?: YAvatarSize;
  /** Visual preset */
  preset?: YAvatarPreset;
  /** Geometry */
  shape?: YAvatarShape;
  /** Status indicator dot */
  status?: YAvatarStatus;
  /** Numeric badge (notifications, count) */
  badge?: number;
  /** Ring/border style */
  ring?: YAvatarRing;
  /** Ring color — CSS color string */
  ringColor?: string;
  /** Background color for initials fallback */
  bgColor?: string;
  /** Text color for initials */
  textColor?: string;
  /** If true, show initials even when src fails to load */
  initialsFallback?: boolean;
  /** Custom set of fallback image URLs used when no `src` is provided */
  defaultImages?: readonly string[];
  /** Accent color used by neon, gradient-ring, sticker presets */
  accentColor?: string;
}
