<script setup lang="ts">
import { computed, ref } from "vue";
import type {
  YBadgeProps,
  BadgeVariant,
  BadgeSize,
  BadgeColor,
  BadgeRadius,
} from "../../types/badge";

const props = withDefaults(defineProps<YBadgeProps>(), {
  label: "Badge",
  variant: "solid",
  size: "md",
  color: "blue",
  dot: false,
  pulse: false,
  rounded: false,
  dismissible: false,
  uppercase: false,
  disabled: false,
  clickable: false,
  countMax: 99,
});

const emit = defineEmits<{
  dismiss: [];
  click: [event: MouseEvent];
}>();

const visible = ref(true);

function dismiss(e: MouseEvent) {
  e.stopPropagation();
  if (props.disabled) return;
  visible.value = false;
  emit("dismiss");
}

function onClick(e: MouseEvent) {
  if (props.disabled || !props.clickable) return;
  emit("click", e);
}

/* ───── Display text ───── */
const displayText = computed(() => {
  if (props.count !== undefined) {
    return props.count > props.countMax
      ? `${props.countMax}+`
      : `${props.count}`;
  }
  return undefined; // falls through to slot / label
});

/* ───── Radius ───── */
const radiusMap: Record<BadgeRadius, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

const resolvedRadius = computed(() => {
  if (props.radius) return radiusMap[props.radius];
  if (props.rounded) return radiusMap.full;
  return radiusMap.md;
});

/* ───── Size classes ───── */
const sizeClasses: Record<BadgeSize, string> = {
  xs: "text-[9px] px-1 py-px gap-0.5 leading-tight",
  sm: "text-[10px] px-1.5 py-0.5 gap-1 leading-none",
  md: "text-xs px-2.5 py-0.5 gap-1 leading-none",
  lg: "text-sm px-3 py-1 gap-1.5 leading-none",
};

const dotSizeClasses: Record<BadgeSize, string> = {
  xs: "w-1 h-1",
  sm: "w-1.5 h-1.5",
  md: "w-2 h-2",
  lg: "w-2.5 h-2.5",
};

const closeSizeClasses: Record<BadgeSize, string> = {
  xs: "w-3 h-3 text-[8px]",
  sm: "w-3.5 h-3.5 text-[9px]",
  md: "w-4 h-4 text-[10px]",
  lg: "w-5 h-5 text-xs",
};

/* ───── Colour matrix ───── */
// We define a palette entry per colour with tokens for each variant.
interface ColorTokens {
  solid: string;
  outline: string;
  soft: string;
  ghost: string;
  glass: string;
  surface: string;
  "dot-outline": string;
  dot: string;
}

function c(
  name: string,
  solidBg: string,
  solidText: string,
  ring: string,
  textMid: string,
  softBg: string,
  softText: string,
  dotBg: string,
): ColorTokens {
  return {
    solid: `${solidBg} ${solidText}`,
    outline: `border ${ring} ${textMid} bg-transparent`,
    soft: `${softBg} ${softText}`,
    ghost: `${textMid} bg-transparent`,
    glass: `${softBg} ${softText} backdrop-blur-sm bg-opacity-60`,
    surface: `${softBg} ${softText} border border-transparent shadow-sm`,
    "dot-outline": `border ${ring} ${textMid} bg-transparent`,
    dot: dotBg,
  };
}

const palette: Record<BadgeColor, ColorTokens> = {
  gray: c(
    "gray",
    "bg-gray-600",
    "text-white",
    "border-gray-400",
    "text-gray-600",
    "bg-gray-100",
    "text-gray-700",
    "bg-gray-500",
  ),
  red: c(
    "red",
    "bg-red-500",
    "text-white",
    "border-red-400",
    "text-red-600",
    "bg-red-50",
    "text-red-700",
    "bg-red-500",
  ),
  orange: c(
    "orange",
    "bg-orange-500",
    "text-white",
    "border-orange-400",
    "text-orange-600",
    "bg-orange-50",
    "text-orange-700",
    "bg-orange-500",
  ),
  amber: c(
    "amber",
    "bg-amber-500",
    "text-white",
    "border-amber-400",
    "text-amber-700",
    "bg-amber-50",
    "text-amber-800",
    "bg-amber-500",
  ),
  yellow: c(
    "yellow",
    "bg-yellow-400",
    "text-yellow-900",
    "border-yellow-400",
    "text-yellow-700",
    "bg-yellow-50",
    "text-yellow-800",
    "bg-yellow-400",
  ),
  lime: c(
    "lime",
    "bg-lime-500",
    "text-white",
    "border-lime-400",
    "text-lime-700",
    "bg-lime-50",
    "text-lime-700",
    "bg-lime-500",
  ),
  green: c(
    "green",
    "bg-green-500",
    "text-white",
    "border-green-400",
    "text-green-600",
    "bg-green-50",
    "text-green-700",
    "bg-green-500",
  ),
  emerald: c(
    "emerald",
    "bg-emerald-500",
    "text-white",
    "border-emerald-400",
    "text-emerald-600",
    "bg-emerald-50",
    "text-emerald-700",
    "bg-emerald-500",
  ),
  teal: c(
    "teal",
    "bg-teal-500",
    "text-white",
    "border-teal-400",
    "text-teal-600",
    "bg-teal-50",
    "text-teal-700",
    "bg-teal-500",
  ),
  cyan: c(
    "cyan",
    "bg-cyan-500",
    "text-white",
    "border-cyan-400",
    "text-cyan-600",
    "bg-cyan-50",
    "text-cyan-700",
    "bg-cyan-500",
  ),
  sky: c(
    "sky",
    "bg-sky-500",
    "text-white",
    "border-sky-400",
    "text-sky-600",
    "bg-sky-50",
    "text-sky-700",
    "bg-sky-500",
  ),
  blue: c(
    "blue",
    "bg-blue-500",
    "text-white",
    "border-blue-400",
    "text-blue-600",
    "bg-blue-50",
    "text-blue-700",
    "bg-blue-500",
  ),
  indigo: c(
    "indigo",
    "bg-indigo-500",
    "text-white",
    "border-indigo-400",
    "text-indigo-600",
    "bg-indigo-50",
    "text-indigo-700",
    "bg-indigo-500",
  ),
  violet: c(
    "violet",
    "bg-violet-500",
    "text-white",
    "border-violet-400",
    "text-violet-600",
    "bg-violet-50",
    "text-violet-700",
    "bg-violet-500",
  ),
  purple: c(
    "purple",
    "bg-purple-500",
    "text-white",
    "border-purple-400",
    "text-purple-600",
    "bg-purple-50",
    "text-purple-700",
    "bg-purple-500",
  ),
  fuchsia: c(
    "fuchsia",
    "bg-fuchsia-500",
    "text-white",
    "border-fuchsia-400",
    "text-fuchsia-600",
    "bg-fuchsia-50",
    "text-fuchsia-700",
    "bg-fuchsia-500",
  ),
  pink: c(
    "pink",
    "bg-pink-500",
    "text-white",
    "border-pink-400",
    "text-pink-600",
    "bg-pink-50",
    "text-pink-700",
    "bg-pink-500",
  ),
  rose: c(
    "rose",
    "bg-rose-500",
    "text-white",
    "border-rose-400",
    "text-rose-600",
    "bg-rose-50",
    "text-rose-700",
    "bg-rose-500",
  ),
};

const colorClass = computed(() => {
  const tokens = palette[props.color] ?? palette.blue;
  return tokens[props.variant] ?? tokens.solid;
});

const dotColorClass = computed(() => {
  const tokens = palette[props.color] ?? palette.blue;
  return tokens.dot;
});

/* ───── Show dot? ───── */
const showDot = computed(() => props.dot || props.variant === "dot-outline");

/* ───── Max-width truncation ───── */
const truncateStyle = computed(() =>
  props.maxWidth ? { maxWidth: `${props.maxWidth}px` } : undefined,
);

/* ───── Wrapper classes ───── */
const wrapperClasses = computed(() => [
  "inline-flex items-center font-medium whitespace-nowrap align-middle select-none transition-colors duration-150",
  sizeClasses[props.size],
  resolvedRadius.value,
  colorClass.value,
  props.uppercase ? "uppercase tracking-wider" : "",
  props.disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "",
  props.clickable && !props.disabled
    ? "cursor-pointer hover:brightness-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-1"
    : "",
]);

/* ───── Tag: render as <button> when clickable ───── */
const tag = computed(() => (props.clickable ? "button" : "span"));
</script>

<template>
  <Transition
    enter-active-class="transition duration-150 ease-out"
    enter-from-class="opacity-0 scale-90"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-100 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-90"
  >
    <component
      :is="tag"
      v-if="visible"
      :class="wrapperClasses"
      :disabled="(clickable && disabled) || undefined"
      :type="clickable ? 'button' : undefined"
      :role="clickable ? undefined : 'status'"
      @click="onClick"
    >
      <!-- Status dot -->
      <span
        v-if="showDot"
        class="shrink-0 rounded-full"
        :class="[
          dotSizeClasses[size],
          dotColorClass,
          pulse ? 'animate-pulse' : '',
        ]"
        aria-hidden="true"
      />

      <!-- Leading icon -->
      <span v-if="icon && !showDot" class="shrink-0" aria-hidden="true">{{
        icon
      }}</span>

      <!-- Label / count / slot -->
      <span
        v-if="displayText || label || $slots.default"
        class="truncate"
        :class="maxWidth ? 'block' : ''"
        :style="truncateStyle"
      >
        <slot>{{ displayText ?? label }}</slot>
      </span>

      <!-- Trailing icon -->
      <span v-if="trailingIcon" class="shrink-0" aria-hidden="true">{{
        trailingIcon
      }}</span>

      <!-- Dismiss button -->
      <button
        v-if="dismissible && !disabled"
        type="button"
        :class="[
          'shrink-0 inline-flex items-center justify-center rounded-full transition-opacity',
          'opacity-50 hover:opacity-100 focus:opacity-100',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-current',
          closeSizeClasses[size],
        ]"
        aria-label="Remove badge"
        @click="dismiss"
      >
        <svg
          class="w-[0.65em] h-[0.65em]"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          aria-hidden="true"
        >
          <path d="M2 2l8 8M10 2l-8 8" />
        </svg>
      </button>
    </component>
  </Transition>
</template>
