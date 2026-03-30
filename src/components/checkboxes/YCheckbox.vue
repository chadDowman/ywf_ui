<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useDarkMode } from "@/composables/useDarkMode";

defineOptions({ name: "YCheckbox" });
import type { YCheckboxProps } from "@/types/checkbox";
import { warnInvalidColor } from "@/utils/validateColor";

const props = withDefaults(defineProps<YCheckboxProps>(), {
  size: "md",
  variant: "default",
  radius: "md",
  disabled: false,
  indeterminate: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const sizeMap: Record<string, string> = {
  xs: "h-3.5 w-3.5",
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-7 w-7",
};

const labelSizeMap: Record<string, string> = {
  xs: "text-xs",
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg",
};

const radiusMap: Record<string, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded",
  lg: "rounded-lg",
  full: "rounded-full",
};

// Toggle track sizes
const toggleTrackSize: Record<string, string> = {
  xs: "w-7 h-4",
  sm: "w-8 h-4",
  md: "w-10 h-5",
  lg: "w-12 h-6",
  xl: "w-14 h-7",
};
const toggleThumbSize: Record<string, string> = {
  xs: "h-2.5 w-2.5",
  sm: "h-2.5 w-2.5",
  md: "h-3.5 w-3.5",
  lg: "h-4 w-4",
  xl: "h-5 w-5",
};
const toggleThumbTranslate: Record<string, string> = {
  xs: "translate-x-3.5",
  sm: "translate-x-4",
  md: "translate-x-5",
  lg: "translate-x-6",
  xl: "translate-x-7",
};

const isChecked = computed(() => !!props.modelValue);

const dk = useDarkMode(props.dark);
const resolvedColor = computed(() => props.color ?? "var(--ywf-interactive)");

onMounted(() => {
  warnInvalidColor("YCheckbox", "color", props.color);
});

function toggle() {
  if (!props.disabled) {
    emit("update:modelValue", !props.modelValue);
  }
}
</script>

<template>
  <div :style="props.textColor ? { color: props.textColor } : undefined">
    <!-- ═══════════════════════════════════════════════════════
       TOGGLE variant — rendered as a switch track + thumb
       ═══════════════════════════════════════════════════════ -->
    <label
      v-if="variant === 'toggle'"
      class="inline-flex cursor-pointer select-none items-center gap-3"
      :class="disabled ? 'cursor-not-allowed opacity-50' : ''"
    >
      <span
        :class="[
          'relative inline-flex shrink-0 items-center rounded-full border-2 border-transparent transition-all duration-200 focus-within:ring-2 focus-within:ring-offset-1',
          toggleTrackSize[size ?? 'md'],
        ]"
        :style="{
          backgroundColor: isChecked
            ? resolvedColor
            : 'var(--ywf-border-disabled)',
          boxShadow: isChecked
            ? `0 0 0 3px color-mix(in srgb, ${resolvedColor} 18%, transparent)`
            : 'none',
        }"
        role="checkbox"
        :aria-checked="isChecked"
        :aria-disabled="disabled"
        tabindex="0"
        @click="toggle"
        @keydown.space.prevent="toggle"
      >
        <span
          :class="[
            'inline-block rounded-full bg-white shadow transition-transform duration-200',
            toggleThumbSize[size ?? 'md'],
            isChecked ? toggleThumbTranslate[size ?? 'md'] : 'translate-x-0.5',
          ]"
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

    <!-- ═══════════════════════════════════════════════════════
       CARD variant — full clickable card that highlights
       ═══════════════════════════════════════════════════════ -->
    <label
      v-else-if="variant === 'card'"
      :class="[
        'inline-flex cursor-pointer select-none items-center gap-3 rounded-xl border-2 px-4 py-3 transition-all duration-150',
        disabled ? 'cursor-not-allowed opacity-50' : '',
        isChecked
          ? 'ycheckbox-card--checked'
          : dk
            ? 'border-slate-600 bg-slate-800 hover:border-slate-500 hover:bg-slate-700'
            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50',
      ]"
      :style="
        isChecked
          ? {
              borderColor: resolvedColor,
              backgroundColor: `color-mix(in srgb, ${resolvedColor} 6%, transparent)`,
            }
          : {}
      "
    >
      <!-- Custom box -->
      <span
        :class="[
          sizeMap[size ?? 'md'],
          radiusMap[radius ?? 'md'],
          'relative shrink-0 border-2 transition-all duration-150',
          isChecked ? 'border-transparent' : 'border-gray-300 bg-white',
        ]"
        :style="
          isChecked
            ? { backgroundColor: resolvedColor, borderColor: resolvedColor }
            : {}
        "
        role="checkbox"
        :aria-checked="isChecked"
        :aria-disabled="disabled"
        tabindex="0"
        @click.stop
        @keydown.space.prevent="toggle"
      >
        <svg
          v-if="isChecked && !indeterminate"
          class="absolute inset-0 h-full w-full p-0.5 text-white"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M3 8l3.5 3.5L13 5"
            stroke="currentColor"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <svg
          v-else-if="indeterminate"
          class="absolute inset-0 h-full w-full p-0.5 text-white"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M3 8h10"
            stroke="currentColor"
            stroke-width="2.2"
            stroke-linecap="round"
          />
        </svg>
      </span>
      <span v-if="label || description" class="flex flex-col">
        <span
          v-if="label"
          class="font-semibold leading-tight"
          :class="[
            labelSizeMap[size ?? 'md'],
            isChecked ? 'text-gray-900' : 'text-gray-700',
          ]"
          :style="isChecked ? { color: resolvedColor } : {}"
          >{{ label }}</span
        >
        <span
          v-if="description"
          class="mt-0.5 text-xs leading-snug text-gray-500"
          >{{ description }}</span
        >
      </span>
    </label>

    <!-- ═══════════════════════════════════════════════════════
       PILL variant — label wraps in a pill chip
       ═══════════════════════════════════════════════════════ -->
    <label
      v-else-if="variant === 'pill'"
      :class="[
        'inline-flex cursor-pointer select-none items-center gap-1.5 rounded-full border px-3 py-1.5 transition-all duration-150 font-medium',
        disabled ? 'cursor-not-allowed opacity-50' : '',
        labelSizeMap[size ?? 'md'],
        isChecked
          ? 'border-transparent text-white'
          : dk
            ? 'border-slate-600 bg-slate-800 text-slate-300 hover:border-slate-500'
            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300',
      ]"
      :style="isChecked ? { backgroundColor: resolvedColor } : {}"
      role="checkbox"
      :aria-checked="isChecked"
      :aria-disabled="disabled"
      tabindex="0"
      @click="toggle"
      @keydown.space.prevent="toggle"
    >
      <!-- Tiny checkmark when active -->
      <svg
        v-if="isChecked"
        class="shrink-0 text-white"
        :class="size === 'xs' || size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M3 8l3.5 3.5L13 5"
          stroke="currentColor"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span v-if="label">{{ label }}</span>
    </label>

    <!-- ═══════════════════════════════════════════════════════
       BRUTAL variant — thick black border, raw inversion
       ═══════════════════════════════════════════════════════ -->
    <label
      v-else-if="variant === 'brutal'"
      class="inline-flex cursor-pointer select-none items-start gap-3"
      :class="disabled ? 'cursor-not-allowed opacity-50' : ''"
    >
      <span
        :class="[
          sizeMap[size ?? 'md'],
          'relative mt-0.5 shrink-0 border-[3px] border-black transition-all duration-100 rounded-none',
          isChecked ? 'bg-black' : 'bg-white hover:bg-gray-100',
        ]"
        role="checkbox"
        :aria-checked="indeterminate ? 'mixed' : isChecked"
        :aria-disabled="disabled"
        tabindex="0"
        @click="toggle"
        @keydown.space.prevent="toggle"
      >
        <svg
          v-if="isChecked && !indeterminate"
          class="absolute inset-0 h-full w-full p-0.5 text-white"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M3 8l3.5 3.5L13 5"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <svg
          v-else-if="indeterminate"
          class="absolute inset-0 h-full w-full p-0.5 text-white"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M3 8h10"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
          />
        </svg>
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

    <!-- ═══════════════════════════════════════════════════════
       NEON variant — dark bg, glowing checkbox
       ═══════════════════════════════════════════════════════ -->
    <label
      v-else-if="variant === 'neon'"
      class="inline-flex cursor-pointer select-none items-start gap-3"
      :class="disabled ? 'cursor-not-allowed opacity-50' : ''"
    >
      <span
        :class="[
          sizeMap[size ?? 'md'],
          radiusMap[radius ?? 'md'],
          'relative mt-0.5 shrink-0 border-2 transition-all duration-150',
          isChecked ? 'ycheckbox-neon-checked' : 'ycheckbox-neon-unchecked',
        ]"
        role="checkbox"
        :aria-checked="indeterminate ? 'mixed' : isChecked"
        :aria-disabled="disabled"
        tabindex="0"
        @click="toggle"
        @keydown.space.prevent="toggle"
      >
        <svg
          v-if="isChecked && !indeterminate"
          class="absolute inset-0 h-full w-full p-0.5"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M3 8l3.5 3.5L13 5"
            stroke="#4ade80"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <svg
          v-else-if="indeterminate"
          class="absolute inset-0 h-full w-full p-0.5"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M3 8h10"
            stroke="#4ade80"
            stroke-width="2.2"
            stroke-linecap="round"
          />
        </svg>
      </span>
      <span v-if="label || description" class="flex flex-col">
        <span
          v-if="label"
          class="font-mono leading-tight transition-all"
          :class="[
            labelSizeMap[size ?? 'md'],
            isChecked
              ? 'ycheckbox-neon-label--on'
              : 'ycheckbox-neon-label--off',
          ]"
          >{{ label }}</span
        >
        <span
          v-if="description"
          class="mt-0.5 text-xs leading-snug"
          :class="isChecked ? 'text-green-600' : 'text-gray-600'"
          >{{ description }}</span
        >
      </span>
    </label>

    <!-- ═══════════════════════════════════════════════════════
       SOFT variant — gentle tinted fill
       ═══════════════════════════════════════════════════════ -->
    <label
      v-else-if="variant === 'soft'"
      class="inline-flex cursor-pointer select-none items-start gap-2.5"
      :class="disabled ? 'cursor-not-allowed opacity-50' : ''"
    >
      <span
        :class="[
          sizeMap[size ?? 'md'],
          radiusMap[radius ?? 'md'],
          'relative mt-0.5 shrink-0 border-2 transition-all duration-150',
        ]"
        :style="
          isChecked || indeterminate
            ? {
                backgroundColor: `color-mix(in srgb, ${resolvedColor} 12%, transparent)`,
                borderColor: resolvedColor,
              }
            : {
                borderColor: 'var(--ywf-border-disabled)',
                backgroundColor: dk ? '#1e293b' : 'white',
              }
        "
        role="checkbox"
        :aria-checked="indeterminate ? 'mixed' : isChecked"
        :aria-disabled="disabled"
        tabindex="0"
        @click="toggle"
        @keydown.space.prevent="toggle"
      >
        <svg
          v-if="isChecked && !indeterminate"
          class="absolute inset-0 h-full w-full p-0.5"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M3 8l3.5 3.5L13 5"
            :stroke="resolvedColor"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <svg
          v-else-if="indeterminate"
          class="absolute inset-0 h-full w-full p-0.5"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M3 8h10"
            :stroke="resolvedColor"
            stroke-width="2.2"
            stroke-linecap="round"
          />
        </svg>
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

    <!-- ═══════════════════════════════════════════════════════
       ORIGINAL variants: default, filled, ghost, outlined
       ═══════════════════════════════════════════════════════ -->
    <label
      v-else
      class="inline-flex cursor-pointer select-none items-start gap-2.5"
      :class="disabled ? 'cursor-not-allowed opacity-50' : ''"
    >
      <span
        :class="[
          sizeMap[size ?? 'md'],
          radiusMap[radius ?? 'md'],
          'relative mt-0.5 shrink-0 border-2 transition-all duration-150 focus-within:ring-2 ring-blue-300/50',
          isChecked || indeterminate
            ? 'border-transparent'
            : dk
              ? 'border-slate-600 bg-slate-800'
              : 'border-gray-300 bg-white',
        ]"
        :style="
          isChecked || indeterminate
            ? { backgroundColor: resolvedColor, borderColor: resolvedColor }
            : {}
        "
        role="checkbox"
        :aria-checked="indeterminate ? 'mixed' : isChecked"
        :aria-disabled="disabled"
        tabindex="0"
        @click="toggle"
        @keydown.space.prevent="toggle"
      >
        <svg
          v-if="isChecked && !indeterminate"
          class="absolute inset-0 h-full w-full p-0.5 text-white"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M3 8l3.5 3.5L13 5"
            stroke="currentColor"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <svg
          v-else-if="indeterminate"
          class="absolute inset-0 h-full w-full p-0.5 text-white"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M3 8h10"
            stroke="currentColor"
            stroke-width="2.2"
            stroke-linecap="round"
          />
        </svg>
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
/* ── NEON ─────────────────────────────────────────── */
.ycheckbox-neon-unchecked {
  background: #070a0f;
  border-color: rgba(74, 222, 128, 0.3);
}
.ycheckbox-neon-unchecked:hover {
  border-color: rgba(74, 222, 128, 0.6);
  box-shadow: 0 0 8px rgba(74, 222, 128, 0.15);
}
.ycheckbox-neon-checked {
  background: rgba(74, 222, 128, 0.1);
  border-color: #4ade80;
  box-shadow:
    0 0 10px rgba(74, 222, 128, 0.35),
    inset 0 0 6px rgba(74, 222, 128, 0.1);
}
.ycheckbox-neon-label--on {
  color: #4ade80;
  text-shadow: 0 0 8px rgba(74, 222, 128, 0.5);
}
.ycheckbox-neon-label--off {
  color: rgba(74, 222, 128, 0.45);
}

/* ── CARD ─────────────────────────────────────────── */
</style>
