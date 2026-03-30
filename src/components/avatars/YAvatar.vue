<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useDarkMode } from "@/composables/useDarkMode";

defineOptions({ name: "YAvatar" });
import type {
  YAvatarProps,
  YAvatarPreset,
  YAvatarSize,
  YAvatarShape,
  YAvatarStatus,
  YAvatarRing,
} from "@/types/avatar";

const props = withDefaults(defineProps<YAvatarProps>(), {
  preset: "default",
  sizeScale: "md",
  shape: "circle",
  ring: "none",
  initialsFallback: true,
});

const dk = useDarkMode(props.dark);

// --- Built-in default images (abstract/geometric/landscape) ---

const BUILTIN_DEFAULT_IMAGES: readonly string[] = [
  "https://images.unsplash.com/photo-1557683316-973673baf926?w=120&h=120&fit=crop", // gradient
  "https://images.unsplash.com/photo-1579546929518-9e588b926b7b?w=120&h=120&fit=crop", // abstract paint
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=120&h=120&fit=crop", // ocean wave
  "https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=120&h=120&fit=crop", // mountains
  "https://images.unsplash.com/photo-1462275646964-a0e3c11f18a6?w=120&h=120&fit=crop", // northern lights
  "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=120&h=120&fit=crop", // crystals
  "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=120&h=120&fit=crop", // neon light
  "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=120&h=120&fit=crop", // desert dunes
  "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=120&h=120&fit=crop", // starry sky
  "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=120&h=120&fit=crop", // colorful gradient
  "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=120&h=120&fit=crop", // abstract fluid
  "https://images.unsplash.com/photo-1614850715649-1d0106568571?w=120&h=120&fit=crop", // geometric pattern
];

function seedHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

const seededDefaultImage = computed(() => {
  const images = props.defaultImages ?? BUILTIN_DEFAULT_IMAGES;
  if (!images.length) return FALLBACK_SVG;
  const seed = props.name ?? "avatar";
  const idx = seedHash(seed) % images.length;
  return images[idx];
});

// --- Inline SVG fallback (no external dependency) ---

const FALLBACK_SVG = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" fill="#e5e7eb"/><circle cx="60" cy="45" r="20" fill="#9ca3af"/><ellipse cx="60" cy="100" rx="35" ry="25" fill="#9ca3af"/></svg>')}`;

// --- Image load error handling ---

const imgError = ref(false);
const defaultImgError = ref(false);

watch(
  () => props.src,
  () => {
    imgError.value = false;
    defaultImgError.value = false;
  },
);

function onImgError() {
  if (props.src && !imgError.value) {
    imgError.value = true;
  } else if (!defaultImgError.value) {
    defaultImgError.value = true;
  }
}

// Fallback chain: src → seeded default → inline SVG → initials
const showImage = computed(() => {
  if (props.src && !imgError.value) return true;
  if (!defaultImgError.value) return true;
  // Default also failed — use inline SVG unless initialsFallback wants initials
  return !props.initialsFallback;
});

const resolvedSrc = computed(() => {
  if (props.src && !imgError.value) return props.src;
  if (!defaultImgError.value) return seededDefaultImage.value;
  return FALLBACK_SVG;
});

const showInitials = computed(() => {
  return defaultImgError.value && props.initialsFallback;
});

const initials = computed(() => {
  if (!props.name) return "?";
  const parts = props.name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0][0].toUpperCase();
});

// --- Size resolution ---

const sizeScaleMap: Record<YAvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
  "2xl": 120,
};

const resolvedSize = computed(
  () => props.size ?? sizeScaleMap[props.sizeScale],
);

const fontSize = computed(() =>
  Math.max(10, Math.round(resolvedSize.value * 0.38)),
);

// --- Shape ---

const shapeClass: Record<YAvatarShape, string> = {
  circle: "rounded-full",
  rounded: "rounded-xl",
  square: "rounded-none",
};

// --- Preset styling ---

const presetWrapperClass = computed((): string => {
  const p = props.preset;
  const map: Record<YAvatarPreset, string> = {
    default: dk.value ? "bg-slate-700" : "bg-gray-200",
    glass: "bg-white/20 backdrop-blur-xl border border-white/30",
    neon: "bg-gray-950",
    retro: "bg-orange-100 border-2 border-orange-800",
    minimal: dk.value ? "bg-slate-800" : "bg-gray-50",
    brutalist: "bg-yellow-300 border-3 border-black",
    "gradient-ring": "bg-gray-100",
    pixel: "bg-gray-200 [image-rendering:pixelated]",
    sticker: dk.value
      ? "bg-slate-800 border-2 border-slate-600 shadow-md"
      : "bg-white border-2 border-gray-200 shadow-md",
    duotone: "bg-indigo-100",
    monochrome: "bg-gray-300 grayscale",
    "soft-shadow": dk.value
      ? "bg-slate-800 shadow-lg shadow-black/40"
      : "bg-white shadow-lg shadow-gray-300/50",
    elevated: dk.value
      ? "bg-slate-800 shadow-xl border border-slate-600"
      : "bg-white shadow-xl border border-gray-100",
    outline: dk.value
      ? "bg-transparent border-2 border-slate-500"
      : "bg-transparent border-2 border-gray-400",
    frosted: "bg-white/40 backdrop-blur-md border border-white/50",
    ink: "bg-gray-900",
  };
  return map[p];
});

const presetImageClass = computed((): string => {
  const p = props.preset;
  if (p === "monochrome") return "grayscale";
  if (p === "duotone") return "mix-blend-multiply opacity-80";
  if (p === "ink")
    return "grayscale contrast-150 mix-blend-luminosity opacity-70";
  return "";
});

const presetInitialsClass = computed((): string => {
  const p = props.preset;
  const map: Partial<Record<YAvatarPreset, string>> = {
    neon: "text-green-400 font-mono font-bold",
    retro: "text-orange-900 font-bold italic",
    brutalist: "text-black font-black uppercase",
    ink: "text-white font-serif italic",
    minimal: "text-gray-400 font-light",
    glass: "text-white/80 font-medium",
    default: dk.value
      ? "text-slate-300 font-medium"
      : "text-gray-600 font-medium",
  };
  return (
    map[p] ??
    (dk.value ? "text-slate-300 font-medium" : "text-gray-600 font-medium")
  );
});

// --- Neon glow effect ---

const presetWrapperStyle = computed(() => {
  const styles: Record<string, string> = {};
  const p = props.preset;
  const accent = props.accentColor ?? "#22c55e";

  if (p === "neon") {
    styles.boxShadow = `0 0 12px ${accent}66, 0 0 24px ${accent}33, inset 0 0 8px ${accent}22`;
    styles.border = `2px solid ${accent}`;
  }
  if (p === "gradient-ring") {
    styles.background = `conic-gradient(from 0deg, ${accent}, #8b5cf6, #ec4899, ${accent})`;
    styles.padding = "3px";
  }
  if (p === "sticker") {
    styles.transform = "rotate(-3deg)";
  }
  if (props.bgColor) {
    styles.backgroundColor = props.bgColor;
  }
  return styles;
});

// Gradient-ring uses an inner container for the actual image
const isGradientRing = computed(() => props.preset === "gradient-ring");

// --- Ring/border decoration ---

const ringStyle = computed(() => {
  if (props.ring === "none") return {};
  const color = props.ringColor ?? "var(--ywf-accent)";
  const width = resolvedSize.value > 60 ? "3px" : "2px";
  const styles: Record<string, string> = {};

  switch (props.ring) {
    case "solid":
      styles.outline = `${width} solid ${color}`;
      styles.outlineOffset = "2px";
      break;
    case "dashed":
      styles.outline = `${width} dashed ${color}`;
      styles.outlineOffset = "2px";
      break;
    case "double":
      styles.outline = `${width} double ${color}`;
      styles.outlineOffset = "3px";
      break;
    case "gradient":
      // Handled via a pseudo element in CSS; we set a CSS custom property
      styles["--ring-color"] = color;
      break;
  }
  return styles;
});

// --- Status dot ---

const statusColorMap: Record<YAvatarStatus, string> = {
  online: "bg-green-500",
  offline: "bg-gray-400",
  busy: "bg-red-500",
  away: "bg-amber-400",
};

const statusDotSize = computed(() => {
  const s = resolvedSize.value;
  if (s <= 32) return "w-2 h-2";
  if (s <= 56) return "w-3 h-3";
  return "w-3.5 h-3.5";
});

const statusDotOffset = computed(() => {
  const s = resolvedSize.value;
  if (s <= 32) return "-right-0 -bottom-0";
  return "-right-0.5 -bottom-0.5";
});

// --- Badge ---

const badgeSize = computed(() => {
  const s = resolvedSize.value;
  if (s <= 32) return "text-[8px] min-w-[14px] h-[14px] px-1";
  if (s <= 56) return "text-[10px] min-w-[18px] h-[18px] px-1";
  return "text-xs min-w-[20px] h-[20px] px-1.5";
});

const displayBadge = computed(() => {
  if (props.badge === undefined || props.badge === null) return null;
  if (props.badge > 99) return "99+";
  return String(props.badge);
});
</script>

<template>
  <span
    class="avatar-root relative inline-flex items-center justify-center overflow-visible"
    :style="{ width: `${resolvedSize}px`, height: `${resolvedSize}px` }"
  >
    <!-- Gradient-ring preset: outer ring + inner image container -->
    <template v-if="isGradientRing">
      <span
        class="inline-flex items-center justify-center overflow-hidden"
        :class="[shapeClass[shape]]"
        :style="{
          width: `${resolvedSize}px`,
          height: `${resolvedSize}px`,
          ...presetWrapperStyle,
          ...ringStyle,
        }"
      >
        <span
          class="inline-flex items-center justify-center overflow-hidden bg-white"
          :class="[shapeClass[shape]]"
          :style="{
            width: `${resolvedSize - 6}px`,
            height: `${resolvedSize - 6}px`,
          }"
        >
          <img
            v-if="showImage && !showInitials"
            :src="resolvedSrc"
            :alt="name ?? 'Avatar'"
            class="w-full h-full object-cover"
            :class="presetImageClass"
            @error="onImgError"
          />
          <span
            v-else
            :class="presetInitialsClass"
            :style="{ fontSize: `${fontSize}px`, color: textColor }"
          >
            {{ initials }}
          </span>
        </span>
      </span>
    </template>

    <!-- All other presets -->
    <template v-else>
      <span
        class="inline-flex items-center justify-center overflow-hidden"
        :class="[shapeClass[shape], presetWrapperClass]"
        :style="{
          width: `${resolvedSize}px`,
          height: `${resolvedSize}px`,
          ...presetWrapperStyle,
          ...ringStyle,
        }"
      >
        <img
          v-if="showImage && !showInitials"
          :src="resolvedSrc"
          :alt="name ?? 'Avatar'"
          class="w-full h-full object-cover"
          :class="presetImageClass"
          @error="onImgError"
        />
        <span
          v-else
          :class="presetInitialsClass"
          :style="{ fontSize: `${fontSize}px`, color: textColor }"
        >
          {{ initials }}
        </span>
      </span>
    </template>

    <!-- Status dot -->
    <span
      v-if="status"
      :class="[
        'absolute rounded-full border-2',
        dk ? 'border-slate-800' : 'border-white',
        statusColorMap[status],
        statusDotSize,
        statusDotOffset,
      ]"
      :title="status"
    />

    <!-- Badge -->
    <span
      v-if="displayBadge !== null"
      :class="[
        'absolute -right-1 -top-1 inline-flex items-center justify-center rounded-full bg-red-500 text-white font-semibold leading-none',
        badgeSize,
      ]"
    >
      {{ displayBadge }}
    </span>
  </span>
</template>
