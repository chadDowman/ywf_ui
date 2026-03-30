<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useDarkMode } from "@/composables/useDarkMode";

defineOptions({ name: "YSelect" });
import type { YSelectProps, YSelectOption } from "@/types/select";

const props = withDefaults(defineProps<YSelectProps>(), {
  size: "md",
  variant: "outlined",
  radius: "md",
  disabled: false,
  clearable: false,
  searchable: false,
  multiple: false,
  fullWidth: true,
  loading: false,
  options: () => [],
});

const emit = defineEmits<{
  "update:modelValue": [value: unknown];
}>();

const open = ref(false);
const searchQuery = ref("");
const containerRef = ref<HTMLElement | null>(null);
const dk = useDarkMode(props.dark);

const sizeMap: Record<string, string> = {
  xs: "text-xs px-2 py-1",
  sm: "text-xs px-3 py-1.5",
  md: "text-sm px-3 py-2",
  lg: "text-base px-4 py-2.5",
  xl: "text-lg px-5 py-3",
};

const radiusMap: Record<string, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

const variantClasses = computed(() => {
  const base =
    "border transition-colors duration-150 focus-within:ring-2 focus-within:ring-blue-300/50";
  if (dk.value) {
    switch (props.variant) {
      case "filled":
        return `${base} border-transparent bg-slate-800`;
      case "ghost":
        return `${base} border-transparent bg-transparent hover:bg-slate-800`;
      case "underline":
        return "border-b border-slate-600 rounded-none focus-within:border-blue-400";
      default:
        return `${base} border-slate-600 bg-slate-900`;
    }
  }
  switch (props.variant) {
    case "filled":
      return `${base} border-transparent bg-gray-100`;
    case "ghost":
      return `${base} border-transparent bg-transparent hover:bg-gray-50`;
    case "underline":
      return "border-b border-gray-300 rounded-none focus-within:border-blue-500";
    default:
      return `${base} border-gray-300 bg-white`;
  }
});

const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value) return props.options ?? [];
  const q = searchQuery.value.toLowerCase();
  return (props.options ?? []).filter((o: YSelectOption) =>
    o.label.toLowerCase().includes(q),
  );
});

const displayLabel = computed(() => {
  if (props.multiple) {
    const vals = (props.modelValue as unknown[]) ?? [];
    if (!vals.length) return props.placeholder ?? "Select...";
    return vals
      .map(
        (v) =>
          (props.options ?? []).find((o: YSelectOption) => o.value === v)
            ?.label ?? String(v),
      )
      .join(", ");
  }
  const found = (props.options ?? []).find(
    (o: YSelectOption) => o.value === props.modelValue,
  );
  return found ? found.label : (props.placeholder ?? "Select...");
});

const hasValue = computed(() => {
  if (props.multiple) return ((props.modelValue as unknown[]) ?? []).length > 0;
  return (
    props.modelValue !== null &&
    props.modelValue !== undefined &&
    props.modelValue !== ""
  );
});

function isSelected(opt: YSelectOption): boolean {
  if (props.multiple) {
    return ((props.modelValue as unknown[]) ?? []).includes(opt.value);
  }
  return props.modelValue === opt.value;
}

function selectOption(opt: YSelectOption) {
  if (opt.disabled) return;
  if (props.multiple) {
    const current = [...((props.modelValue as unknown[]) ?? [])];
    const idx = current.indexOf(opt.value);
    if (idx >= 0) current.splice(idx, 1);
    else current.push(opt.value);
    emit("update:modelValue", current);
  } else {
    emit("update:modelValue", opt.value);
    open.value = false;
    searchQuery.value = "";
  }
}

function clearValue() {
  emit("update:modelValue", props.multiple ? [] : null);
}

function handleClickOutside(e: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    open.value = false;
    searchQuery.value = "";
  }
}

onMounted(() => document.addEventListener("mousedown", handleClickOutside));
onBeforeUnmount(() =>
  document.removeEventListener("mousedown", handleClickOutside),
);
</script>

<template>
  <div
    ref="containerRef"
    class="relative"
    :class="fullWidth ? 'w-full' : 'inline-block'"
    :style="props.textColor ? { color: props.textColor } : undefined"
  >
    <div
      v-if="label"
      :class="[
        'mb-1 text-xs font-medium',
        dk ? 'text-slate-300' : 'text-gray-700',
      ]"
    >
      {{ label }}
    </div>
    <button
      type="button"
      aria-haspopup="listbox"
      :aria-expanded="open"
      class="flex w-full items-center justify-between gap-2 text-left"
      :class="[
        sizeMap[size ?? 'md'],
        radiusMap[radius ?? 'md'],
        variantClasses,
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        hasValue
          ? dk
            ? 'text-slate-100'
            : 'text-gray-900'
          : dk
            ? 'text-slate-500'
            : 'text-gray-400',
      ]"
      :disabled="disabled || loading"
      @click="open = !open"
    >
      <span class="truncate">{{ displayLabel }}</span>
      <span class="flex shrink-0 items-center gap-1">
        <span
          v-if="clearable && hasValue"
          class="rounded p-0.5 text-gray-400 hover:text-gray-600"
          role="button"
          @click.stop="clearValue"
        >
          <svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
        <svg
          class="h-4 w-4 text-gray-400 transition-transform duration-150"
          :class="open ? 'rotate-180' : ''"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </span>
    </button>

    <div
      v-if="open"
      :class="[
        'absolute z-50 mt-1 w-full rounded-md border shadow-lg',
        dk ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white',
      ]"
    >
      <div
        v-if="searchable"
        :class="['border-b p-2', dk ? 'border-slate-700' : 'border-gray-100']"
      >
        <input
          v-model="searchQuery"
          type="text"
          :class="[
            'w-full rounded px-2 py-1 text-xs outline-none',
            dk ? 'bg-slate-800 text-slate-200' : 'bg-gray-50',
          ]"
          :placeholder="placeholder ?? 'Search...'"
          autofocus
        />
      </div>
      <ul role="listbox" class="max-h-56 overflow-y-auto py-1">
        <li
          v-for="opt in filteredOptions"
          :key="String(opt.value)"
          role="option"
          :aria-selected="isSelected(opt)"
          class="flex cursor-pointer items-center justify-between px-3 py-2 text-sm transition-colors"
          :class="[
            isSelected(opt)
              ? dk
                ? 'bg-blue-950 text-blue-300'
                : 'bg-blue-50 text-blue-700'
              : dk
                ? 'text-slate-300 hover:bg-slate-800'
                : 'text-gray-700 hover:bg-gray-50',
            opt.disabled ? 'cursor-not-allowed opacity-40' : '',
          ]"
          @click="selectOption(opt)"
        >
          <span>{{ opt.label }}</span>
          <svg
            v-if="isSelected(opt)"
            class="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </li>
        <li
          v-if="filteredOptions.length === 0"
          class="px-3 py-2 text-sm text-gray-400"
        >
          No options found
        </li>
      </ul>
    </div>

    <p v-if="error" class="mt-1 text-xs text-red-500">{{ error }}</p>
    <p
      v-else-if="hint"
      :class="['mt-1 text-xs', dk ? 'text-slate-400' : 'text-gray-500']"
    >
      {{ hint }}
    </p>
  </div>
</template>
