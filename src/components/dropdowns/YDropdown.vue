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
};

const triggerClasses = computed(() => [
  "rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400/50",
  btnSize.value,
  variantBtnClasses[props.variant],
  props.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
]);

// --- Panel classes ---

const panelClasses = computed(() => {
  const base = "absolute z-10 rounded-lg border shadow-lg py-1 overflow-y-auto";
  const placementMap: Record<string, string> = {
    "bottom-start": "top-full mt-1 left-0",
    "bottom-end": "top-full mt-1 right-0",
    "top-start": "bottom-full mb-1 left-0",
    "top-end": "bottom-full mb-1 right-0",
  };

  const variantPanel: Record<YDropdownVariant, string> = {
    basic: "bg-white border-gray-200",
    outline: "bg-white border-indigo-200",
    ghost: "bg-white border-gray-100",
    glass: "bg-white/70 backdrop-blur-xl border-white/40",
    split: "bg-white border-gray-200",
    searchable: "bg-white border-gray-200",
    "multi-select": "bg-white border-gray-200",
    nested: "bg-white border-gray-200",
    "command-palette":
      "bg-gray-50 border-gray-300 rounded-xl shadow-2xl min-w-64",
    compact: "bg-white border-gray-200 text-xs",
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

      <button
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

        <!-- Command-palette groups -->
        <template v-if="variant === 'command-palette'">
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

        <!-- Nested variant -->
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
            <!-- Sub-menu -->
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

        <!-- Standard items list (used by most variants) -->
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
            <!-- Multi-select checkbox -->
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

        <!-- Default slot fallback: backwards compatible with original usage -->
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
