<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from "vue";
import type {
  YDropdownProps,
  YDropdownItem,
  YDropdownVariant,
  YDropdownSize,
} from "../../types/dropdown";

const props = withDefaults(defineProps<YDropdownProps>(), {
  variant: "basic",
  size: "md",
  disabled: false,
  placeholder: "Search…",
  maxHeight: "16rem",
  closeOnSelect: true,
  keyboardNavigation: true,
  placement: "bottom-start",
  searchable: false,
  multiSelect: false,
  splitLabel: "Action",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string | string[]): void;
  (e: "select", item: YDropdownItem): void;
  (e: "splitClick"): void;
}>();

const open = defineModel<boolean>("open", { default: false });

const search = ref("");
const focusedIndex = ref(-1);
const containerRef = ref<HTMLElement | null>(null);
const searchInputRef = ref<HTMLInputElement | null>(null);
const itemRefs = ref<HTMLElement[]>([]);
const expandedNested = ref<string | null>(null);

// --- Derived flags ---

const isSearchable = computed(
  () =>
    props.searchable ||
    props.variant === "searchable" ||
    props.variant === "command-palette",
);

const isMultiSelect = computed(
  () => props.multiSelect || props.variant === "multi-select",
);

// --- Filtered items ---

const filteredItems = computed(() => {
  if (!props.items) return [];
  if (!isSearchable.value || !search.value) return props.items;
  const q = search.value.toLowerCase();
  return props.items.filter((i) => i.label.toLowerCase().includes(q));
});

// Grouped items for command-palette variant
const groupedItems = computed(() => {
  const groups = new Map<string, YDropdownItem[]>();
  for (const item of filteredItems.value) {
    const key = item.group ?? "";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(item);
  }
  return groups;
});

// Flat list for keyboard nav across groups
const flatNavigableItems = computed(() =>
  filteredItems.value.filter((i) => !i.disabled),
);

// --- Selection helpers ---

const selectedSet = computed(() => {
  const v = props.modelValue;
  if (!v) return new Set<string>();
  return new Set(Array.isArray(v) ? v : [v]);
});

function isSelected(id: string) {
  return selectedSet.value.has(id);
}

function selectItem(item: YDropdownItem) {
  if (item.disabled) return;

  if (isMultiSelect.value) {
    const current = new Set(selectedSet.value);
    if (current.has(item.id)) current.delete(item.id);
    else current.add(item.id);
    emit("update:modelValue", [...current]);
  } else {
    emit("update:modelValue", item.id);
  }
  emit("select", item);

  if (props.closeOnSelect && !isMultiSelect.value) {
    open.value = false;
  }
}

function removeChip(id: string) {
  const current = [...selectedSet.value];
  emit(
    "update:modelValue",
    current.filter((v) => v !== id),
  );
}

function chipLabel(id: string) {
  return props.items?.find((i) => i.id === id)?.label ?? id;
}

// --- Open / close ---

function toggle() {
  if (props.disabled) return;
  open.value = !open.value;
}

function close() {
  open.value = false;
  expandedNested.value = null;
}

watch(open, async (val) => {
  if (val) {
    search.value = "";
    focusedIndex.value = -1;
    await nextTick();
    if (isSearchable.value) searchInputRef.value?.focus();
  }
});

// Close on outside click
function onClickOutside(e: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    close();
  }
}
onMounted(() => document.addEventListener("mousedown", onClickOutside));
onUnmounted(() => document.removeEventListener("mousedown", onClickOutside));

// --- Keyboard navigation ---

function onKeydown(e: KeyboardEvent) {
  if (!props.keyboardNavigation || !open.value) return;

  const items = flatNavigableItems.value;
  const len = items.length;
  if (!len) return;

  switch (e.key) {
    case "ArrowDown":
      e.preventDefault();
      focusedIndex.value = (focusedIndex.value + 1) % len;
      scrollToFocused();
      break;
    case "ArrowUp":
      e.preventDefault();
      focusedIndex.value = (focusedIndex.value - 1 + len) % len;
      scrollToFocused();
      break;
    case "Enter":
      e.preventDefault();
      if (focusedIndex.value >= 0 && focusedIndex.value < len) {
        selectItem(items[focusedIndex.value]);
      }
      break;
    case "Escape":
      e.preventDefault();
      close();
      break;
  }
}

function scrollToFocused() {
  nextTick(() => {
    itemRefs.value[focusedIndex.value]?.scrollIntoView({ block: "nearest" });
  });
}

// --- Sizing classes ---

const sizeClasses: Record<YDropdownSize, string> = {
  xs: "px-2 py-1 text-xs",
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
};

const btnSize = computed(() => sizeClasses[props.size]);

// --- Variant-specific button classes ---

const variantBtnClasses: Record<YDropdownVariant, string> = {
  basic: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
  outline:
    "border-2 border-indigo-500 text-indigo-600 bg-transparent hover:bg-indigo-50",
  ghost: "border-none bg-transparent text-gray-600 hover:bg-gray-100",
  glass:
    "border border-white/30 bg-white/20 backdrop-blur-md text-gray-800 hover:bg-white/30 shadow-sm",
  split: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
  searchable: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
  "multi-select":
    "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
  nested: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
  "command-palette":
    "border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 font-mono",
  compact:
    "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 !px-2 !py-1 text-xs",
  // New variants
  aurora: "ydropdown-aurora-btn border-0 text-white font-medium tracking-wide",
  brutalist:
    "ydropdown-brutalist-btn border-[3px] border-black bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-black hover:text-white",
  pill: "ydropdown-pill-btn border-0 text-gray-700 font-medium",
  terminal:
    "ydropdown-terminal-btn border border-green-500/40 bg-black text-green-400 font-mono text-xs tracking-wide hover:border-green-400/70 hover:bg-gray-950",
  floating:
    "ydropdown-floating-btn border border-gray-200/80 bg-white text-gray-800 font-medium shadow-md hover:shadow-lg hover:-translate-y-px",
};

const triggerClasses = computed(() => [
  "rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400/50",
  btnSize.value,
  variantBtnClasses[props.variant],
  props.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
]);

// --- Panel classes ---

const panelClasses = computed(() => {
  const base = "absolute z-10 py-1 overflow-y-auto";
  const placementMap: Record<string, string> = {
    "bottom-start": "top-full mt-1 left-0",
    "bottom-end": "top-full mt-1 right-0",
    "top-start": "bottom-full mb-1 left-0",
    "top-end": "bottom-full mb-1 right-0",
  };

  const variantPanel: Record<YDropdownVariant, string> = {
    basic: "rounded-lg border border-gray-200 bg-white shadow-lg",
    outline: "rounded-lg border border-indigo-200 bg-white shadow-lg",
    ghost: "rounded-lg border border-gray-100 bg-white shadow-lg",
    glass:
      "rounded-lg border border-white/40 bg-white/70 backdrop-blur-xl shadow-lg",
    split: "rounded-lg border border-gray-200 bg-white shadow-lg",
    searchable: "rounded-lg border border-gray-200 bg-white shadow-lg",
    "multi-select": "rounded-lg border border-gray-200 bg-white shadow-lg",
    nested: "rounded-lg border border-gray-200 bg-white shadow-lg",
    "command-palette":
      "rounded-xl border border-gray-300 bg-gray-50 shadow-2xl min-w-64",
    compact: "rounded-lg border border-gray-200 bg-white shadow-lg text-xs",
    // New variants
    aurora: "ydropdown-aurora-panel rounded-2xl border-0 shadow-2xl min-w-48",
    brutalist:
      "ydropdown-brutalist-panel border-[3px] border-black bg-white shadow-[4px_4px_0px_0px_#000] rounded-none min-w-44",
    pill: "ydropdown-pill-panel rounded-2xl border border-gray-100 bg-white shadow-xl min-w-44",
    terminal:
      "ydropdown-terminal-panel rounded-lg border border-green-500/30 bg-black shadow-[0_0_24px_rgba(74,222,128,0.12)] min-w-44",
    floating:
      "ydropdown-floating-panel rounded-2xl border border-gray-100 bg-white shadow-[0_24px_48px_-8px_rgba(0,0,0,0.18)] min-w-44",
  };

  return [base, placementMap[props.placement], variantPanel[props.variant]];
});

// Display label for the trigger button
const displayLabel = computed(() => {
  if (isMultiSelect.value && selectedSet.value.size > 0) {
    return `${selectedSet.value.size} selected`;
  }
  if (
    !isMultiSelect.value &&
    props.modelValue &&
    typeof props.modelValue === "string"
  ) {
    const found = props.items?.find((i) => i.id === props.modelValue);
    if (found) return found.label;
  }
  return props.label ?? "Dropdown";
});

// Track item refs for scroll-into-view
function setItemRef(el: any, idx: number) {
  if (el) itemRefs.value[idx] = el as HTMLElement;
}
</script>

<template>
  <div ref="containerRef" class="relative inline-block" @keydown="onKeydown">
    <!-- Split variant has a two-part trigger -->
    <div
      v-if="variant === 'split'"
      class="inline-flex rounded-lg overflow-hidden"
    >
      <button
        :class="[
          'border border-r-0 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors',
          btnSize,
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        ]"
        :disabled="disabled"
        @click="emit('splitClick')"
      >
        {{ splitLabel }}
      </button>
      <button
        :class="[
          'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors px-2',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        ]"
        :disabled="disabled"
        aria-haspopup="listbox"
        :aria-expanded="open"
        @click="toggle"
      >
        <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>

    <!-- Standard trigger -->
    <template v-else>
      <!-- Multi-select chip bar -->
      <div
        v-if="variant === 'multi-select' && selectedSet.size > 0"
        class="flex flex-wrap gap-1 mb-1"
      >
        <span
          v-for="id in selectedSet"
          :key="id"
          class="inline-flex items-center gap-1 rounded-full bg-indigo-100 text-indigo-700 px-2 py-0.5 text-xs"
        >
          {{ chipLabel(id) }}
          <button
            class="hover:text-indigo-900 cursor-pointer"
            @click.stop="removeChip(id)"
            aria-label="Remove"
          >
            &times;
          </button>
        </span>
      </div>

      <!-- Aurora trigger -->
      <button
        v-if="variant === 'aurora'"
        :class="[triggerClasses, 'relative overflow-hidden']"
        :disabled="disabled"
        aria-haspopup="listbox"
        :aria-expanded="open"
        @click="toggle"
      >
        <span class="ydropdown-aurora-shimmer" />
        <span class="relative flex items-center gap-2 z-10">
          {{ displayLabel }}
          <svg
            class="w-4 h-4 transition-transform"
            :class="{ 'rotate-180': open }"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
      </button>

      <!-- Terminal trigger -->
      <button
        v-else-if="variant === 'terminal'"
        :class="triggerClasses"
        :disabled="disabled"
        aria-haspopup="listbox"
        :aria-expanded="open"
        @click="toggle"
      >
        <span class="flex items-center gap-2">
          <span class="text-green-500 opacity-80">▶</span>
          {{ displayLabel }}
          <span
            class="ydropdown-terminal-caret"
            :class="{ 'opacity-0': open }"
          />
        </span>
      </button>

      <!-- Default trigger for all other variants -->
      <button
        v-else
        :class="triggerClasses"
        :disabled="disabled"
        aria-haspopup="listbox"
        :aria-expanded="open"
        @click="toggle"
      >
        <span class="flex items-center gap-2">
          {{ displayLabel }}
          <svg
            class="w-4 h-4 transition-transform"
            :class="{ 'rotate-180': open }"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
      </button>
    </template>

    <!-- Dropdown panel -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 -translate-y-1 scale-[0.98]"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 -translate-y-1 scale-[0.98]"
    >
      <div
        v-if="open"
        :class="panelClasses"
        :style="{
          maxHeight,
          minWidth: variant === 'compact' ? '8rem' : '10rem',
        }"
        role="listbox"
        :aria-multiselectable="isMultiSelect || undefined"
      >
        <!-- Search input -->
        <div
          v-if="isSearchable"
          class="px-2 pb-1 pt-1 sticky top-0 bg-inherit z-10"
        >
          <input
            ref="searchInputRef"
            v-model="search"
            :placeholder="placeholder"
            class="w-full rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400/50"
            @click.stop
          />
        </div>

        <!-- ═══════════════════════════════════════════ -->
        <!-- AURORA PANEL                                -->
        <!-- ═══════════════════════════════════════════ -->
        <template v-if="variant === 'aurora' && items">
          <div class="px-2 pt-2 pb-2 space-y-0.5">
            <button
              v-for="(item, idx) in filteredItems"
              :key="item.id"
              :ref="(el) => setItemRef(el, idx)"
              :class="[
                'ydropdown-aurora-item flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all',
                item.disabled
                  ? 'opacity-30 cursor-not-allowed'
                  : focusedIndex === idx
                    ? 'ydropdown-aurora-item--focused'
                    : isSelected(item.id)
                      ? 'ydropdown-aurora-item--selected'
                      : '',
              ]"
              :disabled="item.disabled"
              role="option"
              :aria-selected="isSelected(item.id)"
              @click="selectItem(item)"
              @mouseenter="focusedIndex = idx"
            >
              <span v-if="item.icon" class="text-lg leading-none">{{
                item.icon
              }}</span>
              <span class="font-medium">{{ item.label }}</span>
              <span v-if="isSelected(item.id)" class="ml-auto text-white/80"
                >✓</span
              >
            </button>
          </div>
        </template>

        <!-- ═══════════════════════════════════════════ -->
        <!-- BRUTALIST PANEL                             -->
        <!-- ═══════════════════════════════════════════ -->
        <template v-else-if="variant === 'brutalist' && items">
          <div class="py-0">
            <button
              v-for="(item, idx) in filteredItems"
              :key="item.id"
              :ref="(el) => setItemRef(el, idx)"
              :class="[
                'flex w-full items-center px-4 py-3 text-xs font-black uppercase tracking-widest transition-all border-b border-black last:border-b-0',
                item.disabled
                  ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                  : focusedIndex === idx || isSelected(item.id)
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-black hover:text-white',
              ]"
              :disabled="item.disabled"
              role="option"
              :aria-selected="isSelected(item.id)"
              @click="selectItem(item)"
              @mouseenter="focusedIndex = idx"
            >
              <span class="mr-2 opacity-40">{{
                String(idx + 1).padStart(2, "0")
              }}</span>
              {{ item.label }}
              <span v-if="isSelected(item.id)" class="ml-auto">✕</span>
            </button>
          </div>
        </template>

        <!-- ═══════════════════════════════════════════ -->
        <!-- PILL PANEL                                  -->
        <!-- ═══════════════════════════════════════════ -->
        <template v-else-if="variant === 'pill' && items">
          <div class="px-2 pt-2 pb-2 space-y-1">
            <button
              v-for="(item, idx) in filteredItems"
              :key="item.id"
              :ref="(el) => setItemRef(el, idx)"
              :class="[
                'ydropdown-pill-item flex w-full items-center gap-3 px-4 py-2.5 rounded-full text-sm font-medium transition-all',
                item.disabled
                  ? 'opacity-40 cursor-not-allowed'
                  : focusedIndex === idx
                    ? 'ydropdown-pill-item--focused'
                    : isSelected(item.id)
                      ? 'ydropdown-pill-item--selected'
                      : 'text-gray-600 hover:bg-gray-50',
              ]"
              :disabled="item.disabled"
              role="option"
              :aria-selected="isSelected(item.id)"
              @click="selectItem(item)"
              @mouseenter="focusedIndex = idx"
            >
              <span
                :class="[
                  'ydropdown-pill-dot w-2 h-2 rounded-full shrink-0',
                  `ydropdown-pill-dot--${idx % 4}`,
                ]"
              />
              <span v-if="item.icon" class="text-base leading-none">{{
                item.icon
              }}</span>
              {{ item.label }}
              <svg
                v-if="isSelected(item.id)"
                class="ml-auto w-4 h-4 text-indigo-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </template>

        <!-- ═══════════════════════════════════════════ -->
        <!-- TERMINAL PANEL                              -->
        <!-- ═══════════════════════════════════════════ -->
        <template v-else-if="variant === 'terminal' && items">
          <div class="px-1 pt-2 pb-2">
            <div
              class="px-3 pb-2 text-[10px] text-green-600/60 font-mono border-b border-green-500/10 mb-1"
            >
              SELECT COMMAND_
            </div>
            <button
              v-for="(item, idx) in filteredItems"
              :key="item.id"
              :ref="(el) => setItemRef(el, idx)"
              :class="[
                'ydropdown-terminal-item flex w-full items-center gap-2 px-3 py-2 text-xs font-mono transition-all',
                item.disabled
                  ? 'text-green-900 cursor-not-allowed'
                  : focusedIndex === idx
                    ? 'ydropdown-terminal-item--focused'
                    : isSelected(item.id)
                      ? 'text-green-300 bg-green-500/10'
                      : 'text-green-400/80 hover:text-green-300 hover:bg-green-500/5',
              ]"
              :disabled="item.disabled"
              role="option"
              :aria-selected="isSelected(item.id)"
              @click="selectItem(item)"
              @mouseenter="focusedIndex = idx"
            >
              <span class="text-green-600 select-none">▸</span>
              {{ item.label }}
              <span
                v-if="isSelected(item.id)"
                class="ml-auto text-green-500 text-[10px]"
                >[active]</span
              >
            </button>
          </div>
        </template>

        <!-- ═══════════════════════════════════════════ -->
        <!-- FLOATING PANEL                              -->
        <!-- ═══════════════════════════════════════════ -->
        <template v-else-if="variant === 'floating' && items">
          <div class="px-2 pt-2.5 pb-2 space-y-px">
            <button
              v-for="(item, idx) in filteredItems"
              :key="item.id"
              :ref="(el) => setItemRef(el, idx)"
              :class="[
                'ydropdown-floating-item flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all',
                item.disabled
                  ? 'text-gray-300 cursor-not-allowed'
                  : focusedIndex === idx
                    ? 'ydropdown-floating-item--focused'
                    : isSelected(item.id)
                      ? 'ydropdown-floating-item--selected'
                      : 'text-gray-600 hover:bg-gray-50',
              ]"
              :disabled="item.disabled"
              role="option"
              :aria-selected="isSelected(item.id)"
              @click="selectItem(item)"
              @mouseenter="focusedIndex = idx"
            >
              <span
                v-if="item.icon"
                :class="[
                  'ydropdown-floating-icon w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0',
                  `ydropdown-floating-icon--${idx % 4}`,
                ]"
              >
                {{ item.icon }}
              </span>
              <span class="font-medium">{{ item.label }}</span>
              <svg
                v-if="isSelected(item.id)"
                class="ml-auto w-4 h-4 text-violet-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </template>

        <!-- ═══════════════════════════════════════════ -->
        <!-- COMMAND-PALETTE PANEL                       -->
        <!-- ═══════════════════════════════════════════ -->
        <template v-else-if="variant === 'command-palette'">
          <template v-for="[group, groupItems] in groupedItems" :key="group">
            <div
              v-if="group"
              class="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400"
            >
              {{ group }}
            </div>
            <button
              v-for="(item, idx) in groupItems"
              :key="item.id"
              :ref="(el) => setItemRef(el, filteredItems.indexOf(item))"
              :class="[
                'flex w-full items-center justify-between gap-3 px-3 py-2 text-sm text-left transition-colors',
                item.disabled
                  ? 'text-gray-300 cursor-not-allowed'
                  : focusedIndex === filteredItems.indexOf(item)
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-100',
              ]"
              :disabled="item.disabled"
              role="option"
              :aria-selected="isSelected(item.id)"
              @click="selectItem(item)"
              @mouseenter="focusedIndex = filteredItems.indexOf(item)"
            >
              <span class="flex items-center gap-2">
                <span v-if="item.icon" class="opacity-60">{{ item.icon }}</span>
                {{ item.label }}
              </span>
              <kbd
                v-if="item.shortcut"
                class="hidden sm:inline-block rounded bg-gray-200 px-1.5 py-0.5 text-[10px] font-mono text-gray-500"
                >{{ item.shortcut }}</kbd
              >
            </button>
          </template>
        </template>

        <!-- NESTED PANEL -->
        <template v-else-if="variant === 'nested' && items">
          <div
            v-for="(item, idx) in filteredItems"
            :key="item.id"
            class="relative"
          >
            <button
              :ref="(el) => setItemRef(el, idx)"
              :class="[
                'flex w-full items-center justify-between px-4 py-2 text-sm transition-colors',
                item.disabled
                  ? 'text-gray-300 cursor-not-allowed'
                  : focusedIndex === idx
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-50',
              ]"
              :disabled="item.disabled"
              role="option"
              @click="
                item.children
                  ? (expandedNested =
                      expandedNested === item.id ? null : item.id)
                  : selectItem(item)
              "
              @mouseenter="focusedIndex = idx"
            >
              <span class="flex items-center gap-2">
                <span v-if="item.icon" class="opacity-60">{{ item.icon }}</span>
                {{ item.label }}
              </span>
              <svg
                v-if="item.children?.length"
                class="w-3 h-3 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
            <div
              v-if="item.children?.length && expandedNested === item.id"
              class="absolute left-full top-0 ml-1 min-w-36 rounded-lg border border-gray-200 bg-white shadow-lg py-1 z-20"
            >
              <button
                v-for="child in item.children"
                :key="child.id"
                :class="[
                  'flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors',
                  child.disabled
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-50',
                ]"
                :disabled="child.disabled"
                role="option"
                @click="selectItem(child)"
              >
                <span v-if="child.icon" class="opacity-60">{{
                  child.icon
                }}</span>
                {{ child.label }}
              </button>
            </div>
          </div>
        </template>

        <!-- STANDARD ITEMS LIST -->
        <template v-else-if="items">
          <button
            v-for="(item, idx) in filteredItems"
            :key="item.id"
            :ref="(el) => setItemRef(el, idx)"
            :class="[
              'flex w-full items-center gap-2 text-left transition-colors',
              variant === 'compact' ? 'px-3 py-1 text-xs' : 'px-4 py-2 text-sm',
              item.disabled
                ? 'text-gray-300 cursor-not-allowed'
                : focusedIndex === idx
                  ? 'bg-indigo-50 text-indigo-700'
                  : isSelected(item.id)
                    ? 'bg-indigo-50/50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-50',
            ]"
            :disabled="item.disabled"
            role="option"
            :aria-selected="isSelected(item.id)"
            @click="selectItem(item)"
            @mouseenter="focusedIndex = idx"
          >
            <span
              v-if="isMultiSelect"
              :class="[
                'flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors',
                isSelected(item.id)
                  ? 'bg-indigo-500 border-indigo-500 text-white'
                  : 'border-gray-300',
              ]"
            >
              <svg
                v-if="isSelected(item.id)"
                class="h-3 w-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
            <span v-if="item.icon" class="opacity-60">{{ item.icon }}</span>
            {{ item.label }}
          </button>
        </template>

        <!-- Default slot fallback -->
        <slot v-if="!items" />

        <!-- Empty state -->
        <div
          v-if="items && filteredItems.length === 0"
          class="px-4 py-3 text-sm text-gray-400 text-center"
        >
          No results
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* ═══════════════════════════════════════════════════════
   AURORA VARIANT
   ═══════════════════════════════════════════════════════ */
.ydropdown-aurora-btn {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 40%, #06b6d4 100%);
  background-size: 200% 200%;
  animation: aurora-shift 4s ease infinite;
  position: relative;
}

@keyframes aurora-shift {
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

.ydropdown-aurora-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 20%,
    rgba(255, 255, 255, 0.18) 50%,
    transparent 80%
  );
  background-size: 200% 100%;
  animation: shimmer-sweep 2.4s ease-in-out infinite;
  border-radius: inherit;
}

@keyframes shimmer-sweep {
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.ydropdown-aurora-panel {
  background: linear-gradient(145deg, #0f0f2e 0%, #1a0a3d 50%, #0a1a2e 100%);
  padding: 2px;
}

.ydropdown-aurora-panel::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.5px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4, #6366f1);
  background-size: 300% 300%;
  animation: aurora-border 3s ease infinite;
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

@keyframes aurora-border {
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

.ydropdown-aurora-item {
  color: rgba(255, 255, 255, 0.75);
}
.ydropdown-aurora-item:hover,
.ydropdown-aurora-item--focused {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}
.ydropdown-aurora-item--selected {
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.3),
    rgba(139, 92, 246, 0.3)
  );
  color: #fff;
}

/* ═══════════════════════════════════════════════════════
   BRUTALIST VARIANT
   ═══════════════════════════════════════════════════════ */
.ydropdown-brutalist-btn {
  letter-spacing: 0.15em;
  transition:
    background 80ms,
    color 80ms,
    transform 80ms,
    box-shadow 80ms;
}
.ydropdown-brutalist-btn:hover {
  transform: translate(-2px, -2px);
  box-shadow: 4px 4px 0 #000;
}
.ydropdown-brutalist-btn:active {
  transform: translate(0, 0);
  box-shadow: none;
}

.ydropdown-brutalist-panel {
  /* panel style set via class */
}

/* ═══════════════════════════════════════════════════════
   PILL VARIANT
   ═══════════════════════════════════════════════════════ */
.ydropdown-pill-btn {
  background: linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%);
  border: 1.5px solid #e0d7ff;
  border-radius: 9999px !important;
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.1);
}
.ydropdown-pill-btn:hover {
  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.18);
  border-color: #c4b5fd;
}

.ydropdown-pill-item {
  transition:
    background 120ms,
    transform 120ms;
}
.ydropdown-pill-item:hover,
.ydropdown-pill-item--focused {
  background: #f5f3ff;
  color: #6d28d9;
  transform: translateX(2px);
}
.ydropdown-pill-item--selected {
  background: #ede9fe;
  color: #5b21b6;
}

.ydropdown-pill-dot {
  flex-shrink: 0;
}
.ydropdown-pill-dot--0 {
  background: #818cf8;
}
.ydropdown-pill-dot--1 {
  background: #34d399;
}
.ydropdown-pill-dot--2 {
  background: #fb923c;
}
.ydropdown-pill-dot--3 {
  background: #f472b6;
}

/* ═══════════════════════════════════════════════════════
   TERMINAL VARIANT
   ═══════════════════════════════════════════════════════ */
.ydropdown-terminal-btn {
  font-family: "JetBrains Mono", "Cascadia Code", "Fira Code", monospace;
  border-radius: 6px !important;
}

.ydropdown-terminal-caret {
  display: inline-block;
  width: 7px;
  height: 13px;
  background: #4ade80;
  animation: blink 1s step-end infinite;
  vertical-align: middle;
  margin-left: 2px;
  border-radius: 1px;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.ydropdown-terminal-item {
  font-family: "JetBrains Mono", "Cascadia Code", "Fira Code", monospace;
  border-radius: 4px;
}
.ydropdown-terminal-item--focused {
  background: rgba(74, 222, 128, 0.12);
  color: #86efac;
  text-shadow: 0 0 8px rgba(74, 222, 128, 0.4);
}

/* ═══════════════════════════════════════════════════════
   FLOATING VARIANT
   ═══════════════════════════════════════════════════════ */
.ydropdown-floating-btn {
  border-radius: 12px !important;
  transition:
    box-shadow 180ms ease,
    transform 180ms ease;
}

.ydropdown-floating-panel {
  /* set via class */
}

.ydropdown-floating-item {
  transition:
    background 120ms,
    transform 120ms;
}
.ydropdown-floating-item:hover,
.ydropdown-floating-item--focused {
  background: #faf5ff;
  color: #5b21b6;
  transform: translateX(3px);
}
.ydropdown-floating-item--selected {
  background: #f5f3ff;
  color: #6d28d9;
}

.ydropdown-floating-icon {
  font-size: 14px;
}
.ydropdown-floating-icon--0 {
  background: #ede9fe;
  color: #7c3aed;
}
.ydropdown-floating-icon--1 {
  background: #dcfce7;
  color: #16a34a;
}
.ydropdown-floating-icon--2 {
  background: #fef3c7;
  color: #d97706;
}
.ydropdown-floating-icon--3 {
  background: #fee2e2;
  color: #dc2626;
}
</style>
