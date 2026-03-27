<script setup lang="ts">
import { computed, ref, nextTick } from "vue";
import type { YTabsProps } from "../../types/tabs";

const props = withDefaults(defineProps<YTabsProps>(), {
  tabs: () => ["Overview", "Billing", "Usage"],
  variant: "underline",
  align: "left",
});

const active = defineModel<string>({ default: "" });
const tabRefs = ref<HTMLButtonElement[]>([]);

const effectiveActive = computed(() => active.value || props.tabs?.[0] || "");

const wrapperClass = computed(() => {
  const variantMap: Record<string, string> = {
    underline: "border-b border-gray-200",
    pills: "bg-gray-100 p-1 rounded-xl gap-1",
    boxed:
      "border border-gray-200 divide-x divide-gray-200 rounded-lg overflow-hidden",
    highlight: "gap-1",
  };
  const alignMap: Record<string, string> = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
    stretch: "",
  };
  return `flex ${variantMap[props.variant]} ${alignMap[props.align]}`;
});

function tabClass(tab: string): string {
  const isActive = effectiveActive.value === tab;
  const stretch = props.align === "stretch" ? "flex-1 text-center" : "";
  const variants: Record<
    string,
    { base: string; active: string; inactive: string }
  > = {
    underline: {
      base: `px-4 py-2 text-sm font-medium transition-colors rounded-t-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 ${stretch}`,
      active: "border-b-2 border-blue-500 text-blue-600 -mb-px",
      inactive:
        "border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
    },
    pills: {
      base: `px-4 py-1.5 text-sm font-medium transition-all rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 ${stretch}`,
      active: "bg-white text-gray-900 shadow-sm",
      inactive: "text-gray-500 hover:text-gray-700",
    },
    boxed: {
      base: `px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400/50 ${stretch}`,
      active: "bg-gray-50 text-gray-900",
      inactive: "text-gray-500 hover:bg-gray-50",
    },
    highlight: {
      base: `px-4 py-2 text-sm font-medium transition-all rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 ${stretch}`,
      active: "bg-blue-500 text-white",
      inactive: "text-gray-500 hover:bg-gray-100",
    },
  };
  const v = variants[props.variant];
  return `${v.base} ${isActive ? v.active : v.inactive}`;
}

function setTabRef(el: Element | { $el?: Element } | null, idx: number) {
  if (el) tabRefs.value[idx] = el as HTMLButtonElement;
}

function activateByIndex(index: number) {
  const tabs = props.tabs ?? [];
  if (!tabs.length) return;
  const normalized = (index + tabs.length) % tabs.length;
  active.value = tabs[normalized];
  nextTick(() => tabRefs.value[normalized]?.focus());
}

function onKeydown(event: KeyboardEvent, index: number) {
  if (!props.tabs?.length) return;
  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
    event.preventDefault();
    activateByIndex(index + 1);
  } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
    event.preventDefault();
    activateByIndex(index - 1);
  } else if (event.key === "Home") {
    event.preventDefault();
    activateByIndex(0);
  } else if (event.key === "End") {
    event.preventDefault();
    activateByIndex((props.tabs?.length ?? 1) - 1);
  }
}
</script>

<template>
  <div>
    <div :class="wrapperClass" role="tablist" aria-label="Tabs">
      <button
        v-for="(tab, index) in tabs"
        :key="tab"
        :ref="(el) => setTabRef(el, index)"
        :class="tabClass(tab)"
        role="tab"
        :aria-selected="effectiveActive === tab"
        :tabindex="effectiveActive === tab ? 0 : -1"
        :aria-controls="`panel-${index}`"
        @click="active = tab"
        @keydown="onKeydown($event, index)"
      >
        {{ tab }}
      </button>
    </div>
    <slot />
  </div>
</template>
