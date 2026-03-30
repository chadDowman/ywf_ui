<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useDarkMode } from "@/composables/useDarkMode";

defineOptions({ name: "YSwitch" });
import type { YSwitchProps } from "@/types/switch";
import { warnInvalidColor } from "@/utils/validateColor";

const props = withDefaults(defineProps<YSwitchProps>(), {
  size: "md",
  variant: "default",
  disabled: false,
  loading: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const trackSizeMap: Record<string, string> = {
  xs: "h-4 w-7",
  sm: "h-5 w-9",
  md: "h-6 w-11",
  lg: "h-7 w-[52px]",
  xl: "h-8 w-16",
};

const thumbSizeMap: Record<string, string> = {
  xs: "h-3 w-3",
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
  xl: "h-6 w-6",
};

const thumbTranslateMap: Record<string, string> = {
  xs: "translate-x-3.5",
  sm: "translate-x-4",
  md: "translate-x-5",
  lg: "translate-x-6",
  xl: "translate-x-8",
};

const labelSizeMap: Record<string, string> = {
  xs: "text-xs",
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg",
};

/* ── iOS variant sizes (wider track, larger thumb) ── */
const iosTrackSizeMap: Record<string, string> = {
  xs: "h-5 w-9",
  sm: "h-6 w-11",
  md: "h-7 w-[52px]",
  lg: "h-8 w-16",
  xl: "h-9 w-[72px]",
};
const iosThumbSizeMap: Record<string, string> = {
  xs: "h-4 w-4",
  sm: "h-5 w-5",
  md: "h-6 w-6",
  lg: "h-7 w-7",
  xl: "h-8 w-8",
};
const iosThumbTranslateMap: Record<string, string> = {
  xs: "translate-x-4",
  sm: "translate-x-5",
  md: "translate-x-6",
  lg: "translate-x-8",
  xl: "translate-x-8",
};

/* ── Slim variant sizes (shorter/thinner track, thumb overflows) ── */
const slimTrackSizeMap: Record<string, string> = {
  xs: "h-2.5 w-7",
  sm: "h-3 w-9",
  md: "h-3.5 w-11",
  lg: "h-4 w-[52px]",
  xl: "h-5 w-16",
};
const slimThumbSizeMap: Record<string, string> = {
  xs: "h-4 w-4 -mt-[3px]",
  sm: "h-5 w-5 -mt-[4px]",
  md: "h-5 w-5 -mt-[3px]",
  lg: "h-6 w-6 -mt-[4px]",
  xl: "h-7 w-7 -mt-[4px]",
};
const slimThumbTranslateMap: Record<string, string> = {
  xs: "translate-x-3.5",
  sm: "translate-x-4",
  md: "translate-x-6",
  lg: "translate-x-7",
  xl: "translate-x-9",
};

const isOn = computed(() => !!props.modelValue);

const dk = useDarkMode(props.dark);
const resolvedColor = computed(() => props.color ?? "var(--ywf-interactive)");

onMounted(() => {
  warnInvalidColor("YSwitch", "color", props.color);
});

function toggle() {
  if (!props.disabled && !props.loading) {
    emit("update:modelValue", !props.modelValue);
  }
}
</script>

<template>
  <label
    class="inline-flex cursor-pointer select-none items-center gap-2.5"
    :class="disabled || loading ? 'cursor-not-allowed opacity-50' : ''"
    :style="props.textColor ? { color: props.textColor } : undefined"
  >
    <!-- ═══ IOS variant ═══ -->
    <button
      v-if="variant === 'ios'"
      type="button"
      role="switch"
      :aria-checked="isOn"
      :aria-disabled="disabled || loading"
      class="relative inline-flex shrink-0 items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 ring-blue-300/50"
      :class="[
        iosTrackSizeMap[size ?? 'md'],
        isOn ? '' : dk ? 'bg-slate-600' : 'bg-gray-200',
      ]"
      :style="isOn ? { backgroundColor: resolvedColor } : {}"
      @click="toggle"
    >
      <span
        class="inline-block rounded-full bg-white shadow-md transition-all duration-300 ease-in-out"
        :class="[
          iosThumbSizeMap[size ?? 'md'],
          isOn ? iosThumbTranslateMap[size ?? 'md'] : 'translate-x-0.5',
        ]"
      >
        <svg
          v-if="loading"
          class="animate-spin h-full w-full p-0.5 text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4z" />
        </svg>
      </span>
    </button>

    <!-- ═══ SLIM variant ═══ -->
    <button
      v-else-if="variant === 'slim'"
      type="button"
      role="switch"
      :aria-checked="isOn"
      :aria-disabled="disabled || loading"
      class="relative inline-flex shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 ring-blue-300/50"
      :class="[
        slimTrackSizeMap[size ?? 'md'],
        isOn ? '' : dk ? 'bg-slate-600/50' : 'bg-gray-300/60',
      ]"
      :style="isOn ? { backgroundColor: `color-mix(in srgb, ${resolvedColor} 40%, transparent)` } : {}"
      @click="toggle"
    >
      <span
        class="inline-block rounded-full shadow transition-transform duration-200"
        :class="[
          slimThumbSizeMap[size ?? 'md'],
          isOn ? slimThumbTranslateMap[size ?? 'md'] : 'translate-x-0',
        ]"
        :style="{ backgroundColor: isOn ? resolvedColor : dk ? '#64748b' : '#9ca3af' }"
      >
        <svg
          v-if="loading"
          class="animate-spin h-full w-full p-0.5 text-white"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4z" />
        </svg>
      </span>
    </button>

    <!-- ═══ PILL variant ═══ -->
    <button
      v-else-if="variant === 'pill'"
      type="button"
      role="switch"
      :aria-checked="isOn"
      :aria-disabled="disabled || loading"
      class="relative inline-flex shrink-0 items-center rounded-full border-2 transition-all duration-200 focus:outline-none focus:ring-2 ring-blue-300/50"
      :class="[
        trackSizeMap[size ?? 'md'],
        isOn ? 'border-transparent' : dk ? 'border-slate-500 bg-slate-700' : 'border-gray-300 bg-gray-100',
      ]"
      :style="isOn ? { backgroundColor: resolvedColor, borderColor: resolvedColor } : {}"
      @click="toggle"
    >
      <span
        class="inline-block rounded-full shadow transition-transform duration-200"
        :class="[
          thumbSizeMap[size ?? 'md'],
          isOn ? thumbTranslateMap[size ?? 'md'] + ' bg-white' : 'translate-x-0.5 ' + (dk ? 'bg-slate-400' : 'bg-white'),
        ]"
      >
        <svg
          v-if="loading"
          class="animate-spin h-full w-full p-0.5 text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4z" />
        </svg>
      </span>
    </button>

    <!-- ═══ DEFAULT variant ═══ -->
    <button
      v-else
      type="button"
      role="switch"
      :aria-checked="isOn"
      :aria-disabled="disabled || loading"
      class="relative inline-flex shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 ring-blue-300/50"
      :class="[
        trackSizeMap[size ?? 'md'],
        isOn ? '' : dk ? 'bg-slate-600' : 'bg-gray-300',
      ]"
      :style="isOn ? { backgroundColor: resolvedColor } : {}"
      @click="toggle"
    >
      <span
        class="inline-block rounded-full bg-white shadow transition-transform duration-200"
        :class="[
          thumbSizeMap[size ?? 'md'],
          isOn ? thumbTranslateMap[size ?? 'md'] : 'translate-x-0.5',
        ]"
      >
        <svg
          v-if="loading"
          class="animate-spin h-full w-full p-0.5 text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4z" />
        </svg>
      </span>
    </button>

    <span v-if="label || description" class="flex flex-col">
      <span
        v-if="label"
        :class="[dk ? 'font-medium leading-tight text-slate-200' : 'font-medium leading-tight text-gray-800', labelSizeMap[size ?? 'md']]"
        >{{ label }}</span
      >
      <span
        v-if="description"
        :class="dk ? 'mt-0.5 text-xs leading-snug text-slate-400' : 'mt-0.5 text-xs leading-snug text-gray-500'"
        >{{ description }}</span
      >
    </span>
  </label>
</template>
