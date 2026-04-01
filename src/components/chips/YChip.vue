<script setup lang="ts">
import { computed } from "vue";
import { useDarkMode } from "@/composables/useDarkMode";
import type { YChipProps, YChipVariant, YChipColor } from "@/types/chip";
import { useAnimation } from '@/composables/useAnimation';
import { getAppearAnimationClasses } from '@/types/animation';

defineOptions({ name: "YChip" });

const props = withDefaults(defineProps<YChipProps>(), {
  variant: "soft",
  size: "md",
  color: "neutral",
  dismissible: false,
  disabled: false,
  animation: undefined,
});

const emit = defineEmits<{
  dismiss: [];
}>();

const dk = useDarkMode(props.dark);
const anim = useAnimation(() => props.animation);
const appearTx = computed(() => getAppearAnimationClasses(anim.value));

/* ── Size ── */
const sizeMap = {
  sm: { wrap: "h-5 text-xs px-2 gap-1", close: "w-3 h-3" },
  md: { wrap: "h-6 text-xs px-2.5 gap-1.5", close: "w-3.5 h-3.5" },
  lg: { wrap: "h-7 text-sm px-3 gap-1.5", close: "w-4 h-4" },
};
const sc = computed(() => sizeMap[props.size ?? "md"]);

/* ── Color × Variant tokens ── */
type ColorTokens = Record<YChipColor, string>;

const lightTokens: Record<YChipVariant, ColorTokens> = {
  solid: {
    neutral: "bg-gray-700 text-white",
    primary: "bg-blue-600 text-white",
    success: "bg-green-600 text-white",
    warning: "bg-amber-500 text-white",
    error: "bg-red-600 text-white",
    info: "bg-sky-500 text-white",
  },
  outlined: {
    neutral: "border border-gray-300 text-gray-700 bg-transparent",
    primary: "border border-blue-400 text-blue-700 bg-transparent",
    success: "border border-green-400 text-green-700 bg-transparent",
    warning: "border border-amber-400 text-amber-700 bg-transparent",
    error: "border border-red-400 text-red-700 bg-transparent",
    info: "border border-sky-400 text-sky-700 bg-transparent",
  },
  soft: {
    neutral: "bg-gray-100 text-gray-700",
    primary: "bg-blue-50 text-blue-700",
    success: "bg-green-50 text-green-700",
    warning: "bg-amber-50 text-amber-700",
    error: "bg-red-50 text-red-700",
    info: "bg-sky-50 text-sky-700",
  },
  ghost: {
    neutral: "text-gray-600 hover:bg-gray-100",
    primary: "text-blue-600 hover:bg-blue-50",
    success: "text-green-600 hover:bg-green-50",
    warning: "text-amber-600 hover:bg-amber-50",
    error: "text-red-600 hover:bg-red-50",
    info: "text-sky-600 hover:bg-sky-50",
  },
};

const darkTokens: Record<YChipVariant, ColorTokens> = {
  solid: {
    neutral: "bg-slate-500 text-white",
    primary: "bg-indigo-500 text-white",
    success: "bg-emerald-600 text-white",
    warning: "bg-amber-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-sky-500 text-white",
  },
  outlined: {
    neutral: "border border-slate-600 text-slate-300 bg-transparent",
    primary: "border border-indigo-500 text-indigo-400 bg-transparent",
    success: "border border-emerald-500 text-emerald-400 bg-transparent",
    warning: "border border-amber-500 text-amber-400 bg-transparent",
    error: "border border-red-500 text-red-400 bg-transparent",
    info: "border border-sky-500 text-sky-400 bg-transparent",
  },
  soft: {
    neutral: "bg-slate-700 text-slate-300",
    primary: "bg-indigo-500/20 text-indigo-400",
    success: "bg-emerald-500/20 text-emerald-400",
    warning: "bg-amber-500/20 text-amber-400",
    error: "bg-red-500/20 text-red-400",
    info: "bg-sky-500/20 text-sky-400",
  },
  ghost: {
    neutral: "text-slate-400 hover:bg-slate-700",
    primary: "text-indigo-400 hover:bg-indigo-500/20",
    success: "text-emerald-400 hover:bg-emerald-500/20",
    warning: "text-amber-400 hover:bg-amber-500/20",
    error: "text-red-400 hover:bg-red-500/20",
    info: "text-sky-400 hover:bg-sky-500/20",
  },
};

const chipClass = computed(() => {
  const map = dk.value ? darkTokens : lightTokens;
  return map[props.variant ?? "soft"][props.color ?? "neutral"];
});
</script>

<template>
  <Transition
    appear
    :enter-active-class="appearTx.enterActive"
    :enter-from-class="appearTx.enterFrom"
    :enter-to-class="appearTx.enterTo"
    :leave-active-class="appearTx.leaveActive"
    :leave-from-class="appearTx.leaveFrom"
    :leave-to-class="appearTx.leaveTo"
  >
  <span
    :class="[
      'inline-flex items-center font-medium rounded-full select-none transition-all duration-150',
      sc.wrap,
      chipClass,
      disabled ? 'opacity-50 pointer-events-none' : '',
    ]"
  >
    <slot name="icon" />
    <span>{{ label }}</span>
    <button
      v-if="dismissible"
      type="button"
      class="inline-flex items-center justify-center rounded-full opacity-60 hover:opacity-100 focus:outline-none transition-opacity duration-150 -mr-0.5"
      :aria-label="`Remove ${label}`"
      @click.stop="emit('dismiss')"
    >
      <svg
        :class="sc.close"
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        aria-hidden="true"
      >
        <path d="M2 2l10 10M12 2L2 12" />
      </svg>
    </button>
  </span>
  </Transition>
</template>
