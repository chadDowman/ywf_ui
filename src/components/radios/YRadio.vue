<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useDarkMode } from "@/composables/useDarkMode";

defineOptions({ name: "YRadio" });
import type { YRadioProps } from "@/types/radio";
import { warnInvalidColor } from "@/utils/validateColor";

const props = withDefaults(defineProps<YRadioProps>(), {
  size: "md",
  variant: "default",
  disabled: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: unknown];
}>();

const sizeMap: Record<string, string> = {
  xs: "h-3.5 w-3.5",
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-7 w-7",
};

const dotSizeMap: Record<string, string> = {
  xs: "h-1.5 w-1.5",
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5",
  lg: "h-3 w-3",
  xl: "h-3.5 w-3.5",
};

const labelSizeMap: Record<string, string> = {
  xs: "text-xs",
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg",
};

const isSelected = computed(() => props.modelValue === props.value);

const dk = useDarkMode(props.dark);
const resolvedColor = computed(() => props.color ?? "var(--ywf-interactive)");

onMounted(() => {
  warnInvalidColor("YRadio", "color", props.color);
});

function select() {
  if (!props.disabled) {
    emit("update:modelValue", props.value);
  }
}
</script>

<template>
  <div :style="props.textColor ? { color: props.textColor } : undefined">
    <!-- ═══════════════════════════════════════════════════
       CARD — full clickable card, circle lives inside
       ═══════════════════════════════════════════════════ -->
    <label
      v-if="variant === 'card'"
      :class="[
        'inline-flex cursor-pointer select-none items-center gap-3 rounded-xl border-2 px-4 py-3 transition-all duration-150',
        disabled ? 'cursor-not-allowed opacity-50' : '',
        isSelected
          ? 'yradio-card--selected'
          : dk
            ? 'border-slate-600 bg-slate-800 hover:border-slate-500 hover:bg-slate-700'
            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50',
      ]"
      :style="
        isSelected
          ? {
              borderColor: resolvedColor,
              backgroundColor: `color-mix(in srgb, ${resolvedColor} 6%, transparent)`,
            }
          : {}
      "
    >
      <!-- Radio circle -->
      <span
        :class="[
          sizeMap[size ?? 'md'],
          'relative shrink-0 rounded-full border-2 transition-all duration-150',
          isSelected ? 'border-transparent' : 'border-gray-300 bg-white',
        ]"
        :style="
          isSelected
            ? { backgroundColor: resolvedColor, borderColor: resolvedColor }
            : {}
        "
        role="radio"
        :aria-checked="isSelected"
        :aria-disabled="disabled"
        tabindex="0"
        @click.stop
        @keydown.space.prevent="select"
      >
        <span
          v-if="isSelected"
          class="absolute inset-0 m-auto rounded-full bg-white"
          :class="dotSizeMap[size ?? 'md']"
        />
      </span>
      <span v-if="label || description" class="flex flex-col">
        <span
          v-if="label"
          class="font-semibold leading-tight"
          :class="[
            labelSizeMap[size ?? 'md'],
            isSelected ? 'text-gray-900' : 'text-gray-700',
          ]"
          :style="isSelected ? { color: resolvedColor } : {}"
          >{{ label }}</span
        >
        <span
          v-if="description"
          class="mt-0.5 text-xs leading-snug text-gray-500"
          >{{ description }}</span
        >
      </span>
    </label>

    <!-- ═══════════════════════════════════════════════════
       PILL — badge-style, no visible radio circle
       ═══════════════════════════════════════════════════ -->
    <label
      v-else-if="variant === 'pill'"
      :class="[
        'inline-flex cursor-pointer select-none items-center gap-1.5 rounded-full border px-3 py-1.5 font-medium transition-all duration-150',
        disabled ? 'cursor-not-allowed opacity-50' : '',
        labelSizeMap[size ?? 'md'],
        isSelected
          ? 'border-transparent text-white'
          : dk
            ? 'border-slate-600 bg-slate-800 text-slate-300 hover:border-slate-500'
            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300',
      ]"
      :style="isSelected ? { backgroundColor: resolvedColor } : {}"
      role="radio"
      :aria-checked="isSelected"
      :aria-disabled="disabled"
      tabindex="0"
      @click="select"
      @keydown.space.prevent="select"
    >
      <!-- Filled dot when selected -->
      <span
        class="inline-block rounded-full transition-all"
        :class="isSelected ? 'h-1.5 w-1.5 bg-white' : 'h-1.5 w-1.5 bg-gray-300'"
      />
      <span v-if="label">{{ label }}</span>
    </label>

    <!-- ═══════════════════════════════════════════════════
       BRUTAL — thick black border, square feel
       ═══════════════════════════════════════════════════ -->
    <label
      v-else-if="variant === 'brutal'"
      class="inline-flex cursor-pointer select-none items-start gap-3"
      :class="disabled ? 'cursor-not-allowed opacity-50' : ''"
    >
      <span
        :class="[
          sizeMap[size ?? 'md'],
          'relative mt-0.5 shrink-0 rounded-full border-[3px] border-black transition-all duration-100',
          isSelected ? 'bg-black' : 'bg-white hover:bg-gray-100',
        ]"
        role="radio"
        :aria-checked="isSelected"
        :aria-disabled="disabled"
        tabindex="0"
        @click="select"
        @keydown.space.prevent="select"
      >
        <span
          v-if="isSelected"
          class="absolute inset-0 m-auto rounded-full bg-white"
          :class="dotSizeMap[size ?? 'md']"
        />
      </span>
      <span v-if="label || description" class="flex flex-col">
        <span
          v-if="label"
          class="font-black uppercase tracking-wide leading-tight text-gray-900"
          :class="labelSizeMap[size ?? 'md']"
          >{{ label }}</span
        >
        <span
          v-if="description"
          class="mt-0.5 text-xs leading-snug text-gray-500"
          >{{ description }}</span
        >
      </span>
    </label>

    <!-- ═══════════════════════════════════════════════════
       SOFT — tinted ring + tinted dot, no solid fill
       ═══════════════════════════════════════════════════ -->
    <label
      v-else-if="variant === 'soft'"
      class="inline-flex cursor-pointer select-none items-start gap-2.5"
      :class="disabled ? 'cursor-not-allowed opacity-50' : ''"
    >
      <span
        :class="[
          sizeMap[size ?? 'md'],
          'relative mt-0.5 shrink-0 rounded-full border-2 transition-all duration-150',
        ]"
        :style="
          isSelected
            ? {
                borderColor: resolvedColor,
                backgroundColor: `color-mix(in srgb, ${resolvedColor} 8%, transparent)`,
              }
            : {
                borderColor: 'var(--ywf-border-disabled)',
                backgroundColor: 'white',
              }
        "
        role="radio"
        :aria-checked="isSelected"
        :aria-disabled="disabled"
        tabindex="0"
        @click="select"
        @keydown.space.prevent="select"
      >
        <span
          v-if="isSelected"
          class="absolute inset-0 m-auto rounded-full"
          :class="dotSizeMap[size ?? 'md']"
          :style="{ backgroundColor: resolvedColor }"
        />
      </span>
      <span v-if="label || description" class="flex flex-col">
        <span
          v-if="label"
          class="font-medium leading-tight text-gray-800"
          :class="labelSizeMap[size ?? 'md']"
          >{{ label }}</span
        >
        <span
          v-if="description"
          class="mt-0.5 text-xs leading-snug text-gray-500"
          >{{ description }}</span
        >
      </span>
    </label>

    <!-- ═══════════════════════════════════════════════════
       NEON — dark bg, glowing green ring
       ═══════════════════════════════════════════════════ -->
    <label
      v-else-if="variant === 'neon'"
      class="inline-flex cursor-pointer select-none items-start gap-3"
      :class="disabled ? 'cursor-not-allowed opacity-50' : ''"
    >
      <span
        :class="[
          sizeMap[size ?? 'md'],
          'relative mt-0.5 shrink-0 rounded-full border-2 transition-all duration-150',
          isSelected ? 'yradio-neon--selected' : 'yradio-neon--idle',
        ]"
        role="radio"
        :aria-checked="isSelected"
        :aria-disabled="disabled"
        tabindex="0"
        @click="select"
        @keydown.space.prevent="select"
      >
        <span
          v-if="isSelected"
          class="absolute inset-0 m-auto rounded-full yradio-neon-dot"
          :class="dotSizeMap[size ?? 'md']"
        />
      </span>
      <span v-if="label || description" class="flex flex-col">
        <span
          v-if="label"
          class="font-mono leading-tight transition-all"
          :class="[
            labelSizeMap[size ?? 'md'],
            isSelected ? 'yradio-neon-label--on' : 'yradio-neon-label--off',
          ]"
          >{{ label }}</span
        >
        <span
          v-if="description"
          class="mt-0.5 text-xs leading-snug"
          :class="isSelected ? 'text-green-600' : 'text-gray-600'"
          >{{ description }}</span
        >
      </span>
    </label>

    <!-- ═══════════════════════════════════════════════════
       SEGMENTED — button-group feel, no circle at all
       ═══════════════════════════════════════════════════ -->
    <label
      v-else-if="variant === 'segmented'"
      :class="[
        'inline-flex cursor-pointer select-none items-center justify-center border-r border-gray-200 px-4 py-2 font-medium transition-all duration-150 first:rounded-l-lg last:rounded-r-lg last:border-r-0',
        disabled ? 'cursor-not-allowed opacity-50' : '',
        labelSizeMap[size ?? 'md'],
        isSelected
          ? 'yradio-segmented--selected'
          : dk
            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-100'
            : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-800',
      ]"
      :style="
        isSelected
          ? {
              backgroundColor: resolvedColor,
              color: 'white',
              borderColor: resolvedColor,
            }
          : {}
      "
      role="radio"
      :aria-checked="isSelected"
      :aria-disabled="disabled"
      tabindex="0"
      @click="select"
      @keydown.space.prevent="select"
    >
      <span v-if="label">{{ label }}</span>
    </label>

    <!-- ═══════════════════════════════════════════════════
       ORIGINAL variants: default, filled, ghost
       ═══════════════════════════════════════════════════ -->
    <label
      v-else
      class="inline-flex cursor-pointer select-none items-start gap-2.5"
      :class="disabled ? 'cursor-not-allowed opacity-50' : ''"
    >
      <span
        :class="[
          sizeMap[size ?? 'md'],
          'relative mt-0.5 shrink-0 rounded-full border-2 transition-all duration-150 focus-within:ring-2 ring-blue-300/50',
          isSelected
            ? 'border-transparent'
            : dk
              ? 'border-slate-600 bg-slate-800'
              : 'border-gray-300 bg-white',
        ]"
        :style="
          isSelected
            ? { backgroundColor: resolvedColor, borderColor: resolvedColor }
            : {}
        "
        role="radio"
        :aria-checked="isSelected"
        :aria-disabled="disabled"
        tabindex="0"
        @click="select"
        @keydown.space.prevent="select"
      >
        <span
          v-if="isSelected"
          class="absolute inset-0 m-auto rounded-full bg-white"
          :class="dotSizeMap[size ?? 'md']"
        />
      </span>
      <span v-if="label || description" class="flex flex-col">
        <span
          v-if="label"
          :class="[
            dk
              ? 'font-medium leading-tight text-slate-200'
              : 'font-medium leading-tight text-gray-800',
            labelSizeMap[size ?? 'md'],
          ]"
          >{{ label }}</span
        >
        <span
          v-if="description"
          :class="
            dk
              ? 'mt-0.5 text-xs leading-snug text-slate-400'
              : 'mt-0.5 text-xs leading-snug text-gray-500'
          "
          >{{ description }}</span
        >
      </span>
    </label>
  </div>
</template>

<style scoped>
/* ── NEON ───────────────────────────────────────────── */
.yradio-neon--idle {
  background: #070a0f;
  border-color: rgba(74, 222, 128, 0.3);
}
.yradio-neon--idle:hover {
  border-color: rgba(74, 222, 128, 0.6);
  box-shadow: 0 0 8px rgba(74, 222, 128, 0.15);
}
.yradio-neon--selected {
  background: rgba(74, 222, 128, 0.08);
  border-color: #4ade80;
  box-shadow:
    0 0 12px rgba(74, 222, 128, 0.35),
    inset 0 0 6px rgba(74, 222, 128, 0.08);
}
.yradio-neon-dot {
  background: #4ade80;
  box-shadow: 0 0 6px rgba(74, 222, 128, 0.8);
}
.yradio-neon-label--on {
  color: #4ade80;
  text-shadow: 0 0 8px rgba(74, 222, 128, 0.5);
}
.yradio-neon-label--off {
  color: rgba(74, 222, 128, 0.4);
}

/* ── SEGMENTED ──────────────────────────────────────── */
.yradio-segmented--selected {
  /* dynamic bg/color set via :style */
  z-index: 1;
  position: relative;
}
</style>
