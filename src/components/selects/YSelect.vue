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

  switch (props.variant) {
    case "aurora":
      return "yselect-aurora border-0";
    case "glass":
      return "yselect-glass border border-white/30";
    case "brutalist":
      return "yselect-brutalist border-[3px] border-black rounded-none";
    case "terminal":
      return "yselect-terminal border border-green-500/40";
    case "neon":
      return "yselect-neon border border-violet-400/60";
  }

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
        variant === 'aurora'
          ? 'yselect-aurora-panel border-0'
          : variant === 'glass'
            ? 'yselect-glass-panel border border-white/20'
            : variant === 'brutalist'
              ? 'yselect-brutalist-panel border-[3px] border-black rounded-none'
              : variant === 'terminal'
                ? 'yselect-terminal-panel border border-green-500/40'
                : variant === 'neon'
                  ? 'yselect-neon-panel border border-violet-400/40'
                  : dk
                    ? 'border-slate-700 bg-slate-900'
                    : 'border-gray-200 bg-white',
      ]"
    >
      <div
        v-if="searchable"
        :class="['border-b p-2', dk ? 'border-slate-700' : 'border-gray-100']"
      >
        <input
          v-model="searchQuery"
          type="text"
          name="selectSearch"
          aria-label="Search select options"
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
            variant === 'aurora'
              ? isSelected(opt)
                ? 'yselect-aurora-item-selected'
                : 'yselect-aurora-item'
              : variant === 'glass'
                ? isSelected(opt)
                  ? 'yselect-glass-item-selected'
                  : 'yselect-glass-item'
                : variant === 'brutalist'
                  ? isSelected(opt)
                    ? 'bg-black text-white font-bold'
                    : 'text-black hover:bg-gray-100 font-medium'
                  : variant === 'terminal'
                    ? isSelected(opt)
                      ? 'yselect-terminal-item-selected'
                      : 'yselect-terminal-item'
                    : variant === 'neon'
                      ? isSelected(opt)
                        ? 'yselect-neon-item-selected'
                        : 'yselect-neon-item'
                      : isSelected(opt)
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

<style scoped>
/* ── Aurora ─────────────────────────────────────────────── */
.yselect-aurora {
  background: linear-gradient(135deg, #0f0f2e, #0a1a2e);
  color: #e2e8f0;
  position: relative;
}
.yselect-aurora::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.5px;
  background: linear-gradient(135deg, #7c3aed, #2563eb, #06b6d4, #7c3aed);
  background-size: 300% 300%;
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: yselect-aurora-spin 4s linear infinite;
  pointer-events: none;
}
@keyframes yselect-aurora-spin {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
.yselect-aurora-panel {
  background: linear-gradient(135deg, #0f0f2e, #0a1a2e);
  box-shadow: 0 8px 32px rgba(124, 58, 237, 0.25);
  position: relative;
  overflow: hidden;
}
.yselect-aurora-panel::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, #7c3aed, #2563eb, #06b6d4);
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
.yselect-aurora-item {
  color: #cbd5e1;
}
.yselect-aurora-item:hover {
  background: rgba(255, 255, 255, 0.07);
  color: #f1f5f9;
}
.yselect-aurora-item-selected {
  background: rgba(124, 58, 237, 0.25);
  color: #a78bfa;
}

/* ── Glass ───────────────────────────────────────────────── */
.yselect-glass {
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: #1e293b;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}
.yselect-glass-panel {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}
.yselect-glass-item {
  color: #334155;
}
.yselect-glass-item:hover {
  background: rgba(255, 255, 255, 0.6);
}
.yselect-glass-item-selected {
  background: rgba(99, 102, 241, 0.15);
  color: #4f46e5;
}

/* ── Brutalist ───────────────────────────────────────────── */
.yselect-brutalist {
  background: #ffffff;
  color: #000000;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-size: 0.75rem;
  box-shadow: 4px 4px 0 #000;
  transition:
    box-shadow 0.1s,
    transform 0.1s;
}
.yselect-brutalist:hover {
  box-shadow: 2px 2px 0 #000;
  transform: translate(2px, 2px);
}
.yselect-brutalist-panel {
  background: #ffffff;
  box-shadow: 4px 4px 0 #000;
  font-weight: 700;
  letter-spacing: 0.04em;
}

/* ── Terminal ────────────────────────────────────────────── */
.yselect-terminal {
  background: #0a0a0a;
  color: #4ade80;
  font-family: "Courier New", Courier, monospace;
  letter-spacing: 0.04em;
  font-size: 0.8rem;
}
.yselect-terminal-panel {
  background: #0a0a0a;
  font-family: "Courier New", Courier, monospace;
  box-shadow: 0 0 20px rgba(74, 222, 128, 0.15);
}
.yselect-terminal-item {
  color: #86efac;
  font-family: "Courier New", Courier, monospace;
  font-size: 0.8rem;
}
.yselect-terminal-item::before {
  content: "> ";
  opacity: 0;
  transition: opacity 0.15s;
}
.yselect-terminal-item:hover::before {
  opacity: 1;
}
.yselect-terminal-item:hover {
  background: rgba(74, 222, 128, 0.08);
  color: #4ade80;
  text-shadow: 0 0 6px rgba(74, 222, 128, 0.5);
}
.yselect-terminal-item-selected {
  color: #4ade80;
  background: rgba(74, 222, 128, 0.12);
  text-shadow: 0 0 8px rgba(74, 222, 128, 0.6);
  font-family: "Courier New", Courier, monospace;
  font-size: 0.8rem;
}

/* ── Neon ────────────────────────────────────────────────── */
.yselect-neon {
  background: #0d0d1a;
  color: #c4b5fd;
  box-shadow:
    0 0 8px rgba(167, 139, 250, 0.3),
    inset 0 0 8px rgba(167, 139, 250, 0.05);
  transition: box-shadow 0.2s;
}
.yselect-neon:focus-within {
  box-shadow:
    0 0 16px rgba(167, 139, 250, 0.6),
    inset 0 0 12px rgba(167, 139, 250, 0.1);
}
.yselect-neon-panel {
  background: #0d0d1a;
  box-shadow:
    0 0 24px rgba(167, 139, 250, 0.35),
    0 8px 32px rgba(0, 0, 0, 0.5);
}
.yselect-neon-item {
  color: #c4b5fd;
}
.yselect-neon-item:hover {
  background: rgba(167, 139, 250, 0.1);
  color: #ddd6fe;
  text-shadow: 0 0 6px rgba(167, 139, 250, 0.6);
}
.yselect-neon-item-selected {
  background: rgba(167, 139, 250, 0.2);
  color: #a78bfa;
  text-shadow: 0 0 10px rgba(167, 139, 250, 0.8);
}
</style>
