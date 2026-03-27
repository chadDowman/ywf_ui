<script setup lang="ts">
import { ref, computed } from "vue";
import type {
  YAlertProps,
  AlertType,
  AlertVariant,
  AlertSize,
  AlertIntensity,
  AlertRadius,
} from "../../types/alert";

const props = withDefaults(defineProps<YAlertProps>(), {
  type: "info",
  variant: "soft",
  size: "md",
  intensity: "medium",
  showIcon: true,
  dismissible: false,
  fullWidth: false,
  loading: false,
  disabled: false,
  radius: "md",
});

const emit = defineEmits<{
  dismiss: [];
  action: [];
  secondaryAction: [];
}>();

const visible = ref(true);

function dismiss() {
  if (props.disabled || props.loading) return;
  visible.value = false;
  emit("dismiss");
}

function onAction() {
  if (props.disabled || props.loading) return;
  emit("action");
}

function onSecondaryAction() {
  if (props.disabled || props.loading) return;
  emit("secondaryAction");
}

/* ───── Icons ───── */
const defaultIcons: Record<AlertType, string> = {
  info: "ℹ",
  success: "✓",
  warning: "⚠",
  error: "✕",
  neutral: "●",
};

const resolvedIcon = computed(() => props.icon ?? defaultIcons[props.type]);

/* ───── Radius mapping ───── */
const radiusMap: Record<AlertRadius, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

/* ───── Size classes ───── */
const sizeClasses: Record<AlertSize, string> = {
  sm: "px-3 py-2 text-xs gap-2",
  md: "px-4 py-3 text-sm gap-3",
  lg: "px-5 py-4 text-base gap-4",
};

const iconSizeClasses: Record<AlertSize, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

const closeSizeClasses: Record<AlertSize, string> = {
  sm: "text-base w-5 h-5",
  md: "text-lg w-6 h-6",
  lg: "text-xl w-7 h-7",
};

const titleSizeClasses: Record<AlertSize, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

const actionBtnSizeClasses: Record<AlertSize, string> = {
  sm: "text-xs px-2 py-0.5",
  md: "text-xs px-3 py-1",
  lg: "text-sm px-4 py-1.5",
};

/* ───── Intensity multiplier (opacity / saturation tweaks) ───── */
const intensitySoftBg: Record<AlertIntensity, Record<AlertType, string>> = {
  low: {
    info: "bg-blue-50/60",
    success: "bg-green-50/60",
    warning: "bg-amber-50/60",
    error: "bg-red-50/60",
    neutral: "bg-gray-50/60",
  },
  medium: {
    info: "bg-blue-50",
    success: "bg-green-50",
    warning: "bg-amber-50",
    error: "bg-red-50",
    neutral: "bg-gray-100",
  },
  high: {
    info: "bg-blue-100",
    success: "bg-green-100",
    warning: "bg-amber-100",
    error: "bg-red-100",
    neutral: "bg-gray-200",
  },
};

/* ───── Colour matrix ───── */
type ColorMatrix = Record<AlertType, Record<AlertVariant, string>>;

const buildColorMap = (intensity: AlertIntensity): ColorMatrix => {
  const softBg = intensitySoftBg[intensity];

  return {
    info: {
      solid: "bg-blue-600 text-white border border-blue-600",
      outline:
        "bg-transparent text-blue-700 dark:text-blue-300 border border-blue-400 dark:border-blue-500",
      soft: `${softBg.info} text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700`,
      "left-accent": `${softBg.info} text-blue-800 dark:text-blue-200 border-l-4 border-blue-500`,
      ghost: "bg-transparent text-blue-700 dark:text-blue-300",
    },
    success: {
      solid: "bg-green-600 text-white border border-green-600",
      outline:
        "bg-transparent text-green-700 dark:text-green-300 border border-green-400 dark:border-green-500",
      soft: `${softBg.success} text-green-800 dark:text-green-200 border border-green-200 dark:border-green-700`,
      "left-accent": `${softBg.success} text-green-800 dark:text-green-200 border-l-4 border-green-500`,
      ghost: "bg-transparent text-green-700 dark:text-green-300",
    },
    warning: {
      solid: "bg-amber-500 text-white border border-amber-500",
      outline:
        "bg-transparent text-amber-700 dark:text-amber-300 border border-amber-400 dark:border-amber-500",
      soft: `${softBg.warning} text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-700`,
      "left-accent": `${softBg.warning} text-amber-800 dark:text-amber-200 border-l-4 border-amber-500`,
      ghost: "bg-transparent text-amber-700 dark:text-amber-300",
    },
    error: {
      solid: "bg-red-600 text-white border border-red-600",
      outline:
        "bg-transparent text-red-700 dark:text-red-300 border border-red-400 dark:border-red-500",
      soft: `${softBg.error} text-red-800 dark:text-red-200 border border-red-200 dark:border-red-700`,
      "left-accent": `${softBg.error} text-red-800 dark:text-red-200 border-l-4 border-red-500`,
      ghost: "bg-transparent text-red-700 dark:text-red-300",
    },
    neutral: {
      solid: "bg-gray-700 text-white border border-gray-700",
      outline:
        "bg-transparent text-gray-700 dark:text-gray-300 border border-gray-400 dark:border-gray-500",
      soft: `${softBg.neutral} text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600`,
      "left-accent": `${softBg.neutral} text-gray-800 dark:text-gray-200 border-l-4 border-gray-500`,
      ghost: "bg-transparent text-gray-700 dark:text-gray-300",
    },
  };
};

const colorClasses = computed(
  () => buildColorMap(props.intensity)[props.type][props.variant],
);

/* ───── Action button colours (adapt to variant) ───── */
const actionColorMap: Record<
  AlertType,
  { link: string; outline: string; solid: string }
> = {
  info: {
    link: "text-blue-700 dark:text-blue-300 hover:underline",
    outline:
      "border border-blue-500 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900",
    solid: "bg-blue-600 text-white hover:bg-blue-700",
  },
  success: {
    link: "text-green-700 dark:text-green-300 hover:underline",
    outline:
      "border border-green-500 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900",
    solid: "bg-green-600 text-white hover:bg-green-700",
  },
  warning: {
    link: "text-amber-700 dark:text-amber-300 hover:underline",
    outline:
      "border border-amber-500 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900",
    solid: "bg-amber-600 text-white hover:bg-amber-700",
  },
  error: {
    link: "text-red-700 dark:text-red-300 hover:underline",
    outline:
      "border border-red-500 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900",
    solid: "bg-red-600 text-white hover:bg-red-700",
  },
  neutral: {
    link: "text-gray-700 dark:text-gray-300 hover:underline",
    outline:
      "border border-gray-500 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
    solid: "bg-gray-700 text-white hover:bg-gray-800",
  },
};

/* For solid alert variant, invert the action button styles */
const solidActionOverride: Record<string, string> = {
  link: "text-white/90 hover:text-white hover:underline",
  outline: "border border-white/50 text-white hover:bg-white/20",
  solid: "bg-white/20 text-white hover:bg-white/30",
};

function actionBtnClasses(actionCfg: {
  variant?: "link" | "outline" | "solid";
}): string {
  const v = actionCfg.variant ?? "link";
  if (props.variant === "solid") return solidActionOverride[v];
  return actionColorMap[props.type][v];
}

/* ───── Wrapper classes ───── */
const wrapperClasses = computed(() => [
  "flex items-start transition-all duration-200",
  sizeClasses[props.size],
  props.radius !== undefined ? radiusMap[props.radius] : radiusMap.md,
  colorClasses.value,
  props.fullWidth ? "w-full" : "inline-flex max-w-full",
  props.loading ? "opacity-70 pointer-events-none" : "",
  props.disabled ? "opacity-50 cursor-not-allowed select-none" : "",
]);

/* ───── ARIA ───── */
const ariaLive = computed(() =>
  props.type === "error" || props.type === "warning" ? "assertive" : "polite",
);
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 -translate-y-1"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-1"
  >
    <div
      v-if="visible"
      :class="wrapperClasses"
      role="alert"
      :aria-live="ariaLive"
      :aria-disabled="disabled || undefined"
      :aria-busy="loading || undefined"
    >
      <!-- Loading spinner -->
      <span
        v-if="loading"
        class="shrink-0 mt-0.5 animate-spin"
        :class="iconSizeClasses[size]"
        aria-hidden="true"
      >
        <svg
          class="w-[1em] h-[1em]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round" />
        </svg>
      </span>

      <!-- Icon -->
      <span
        v-else-if="showIcon"
        class="shrink-0 font-bold leading-none mt-0.5"
        :class="iconSizeClasses[size]"
        aria-hidden="true"
      >
        {{ resolvedIcon }}
      </span>

      <!-- Body -->
      <div class="flex-1 min-w-0">
        <p
          v-if="title"
          class="font-semibold leading-snug"
          :class="[
            titleSizeClasses[size],
            message || $slots.default ? 'mb-0.5' : '',
          ]"
        >
          {{ title }}
        </p>
        <p v-if="message || $slots.default" class="leading-snug">
          <slot>{{ message }}</slot>
        </p>

        <!-- Actions row -->
        <div
          v-if="action || secondaryAction"
          class="flex items-center gap-2 mt-2"
        >
          <button
            v-if="action"
            type="button"
            :disabled="disabled || loading"
            :class="[
              'inline-flex items-center font-medium rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-current',
              actionBtnSizeClasses[size],
              actionBtnClasses(action),
              disabled || loading
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer',
            ]"
            @click="onAction"
          >
            {{ action.label }}
          </button>
          <button
            v-if="secondaryAction"
            type="button"
            :disabled="disabled || loading"
            :class="[
              'inline-flex items-center font-medium rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-current',
              actionBtnSizeClasses[size],
              actionBtnClasses(secondaryAction),
              disabled || loading
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer',
            ]"
            @click="onSecondaryAction"
          >
            {{ secondaryAction.label }}
          </button>
        </div>
      </div>

      <!-- Dismiss button -->
      <button
        v-if="dismissible && !disabled"
        type="button"
        :disabled="loading"
        :class="[
          'shrink-0 ml-1 inline-flex items-center justify-center rounded-md transition-all',
          'opacity-60 hover:opacity-100 focus:opacity-100',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-1',
          closeSizeClasses[size],
          loading ? 'cursor-not-allowed' : 'cursor-pointer',
        ]"
        aria-label="Dismiss alert"
        @click="dismiss"
      >
        <svg
          class="w-[0.75em] h-[0.75em]"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          aria-hidden="true"
        >
          <path d="M2 2l8 8M10 2l-8 8" />
        </svg>
      </button>
    </div>
  </Transition>
</template>
