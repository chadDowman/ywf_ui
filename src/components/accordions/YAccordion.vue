<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useDarkMode } from "@/composables/useDarkMode";
import type { YAccordionProps, YAccordionItem } from "@/types/accordion";

defineOptions({ name: "YAccordion" });

const props = withDefaults(defineProps<YAccordionProps>(), {
  variant: "default",
  multiple: false,
  separated: false,
  bordered: true,
  radius: "md",
  items: () => [],
  defaultOpen: () => [],
});

const openItems = ref<string[]>([...(props.defaultOpen ?? [])]);
const accordionRef = ref<HTMLElement | null>(null);

const dk = useDarkMode(props.dark);

const normalizedItems = computed<YAccordionItem[]>(() => {
  const source = props.items ?? [];
  return source.map((item, index) => {
    if (item && typeof item.id === "string" && item.id.trim().length > 0) {
      return item;
    }

    const fallbackId = `item-${index + 1}`;
    const fallbackTitle =
      item && typeof item.title === "string" && item.title.trim().length > 0
        ? item.title
        : `Item ${index + 1}`;

    return {
      ...item,
      id: fallbackId,
      title: fallbackTitle,
    };
  });
});

watch(
  () => props.defaultOpen,
  (next) => {
    openItems.value = Array.isArray(next) ? [...next] : [];
  },
  { immediate: true },
);

const radiusMap: Record<string, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
};

function isOpen(id: string): boolean {
  return openItems.value.includes(id);
}

function toggle(item: YAccordionItem) {
  if (item.disabled) return;
  const id = item.id;
  if (isOpen(id)) {
    openItems.value = openItems.value.filter((i) => i !== id);
  } else if (props.multiple) {
    openItems.value = [...openItems.value, id];
  } else {
    openItems.value = [id];
  }
}

function onTriggerKeydown(e: KeyboardEvent) {
  if (!accordionRef.value) return;
  const triggers = Array.from(
    accordionRef.value.querySelectorAll<HTMLButtonElement>(
      "button[aria-expanded]",
    ),
  ).filter((btn) => !btn.disabled);
  const index = triggers.indexOf(e.currentTarget as HTMLButtonElement);
  if (index === -1) return;
  let target: number | null = null;
  switch (e.key) {
    case "ArrowDown":
      target = (index + 1) % triggers.length;
      break;
    case "ArrowUp":
      target = (index - 1 + triggers.length) % triggers.length;
      break;
    case "Home":
      target = 0;
      break;
    case "End":
      target = triggers.length - 1;
      break;
    default:
      return;
  }
  e.preventDefault();
  triggers[target]?.focus();
}

const r = () => radiusMap[props.radius ?? "md"];

function wrapperClass(): string {
  const d = dk.value;
  const border = d ? "border-slate-700" : "border-gray-200";
  const divider = d ? "divide-slate-700" : "divide-gray-100";
  switch (props.variant) {
    case "flush":
      return `divide-y ${d ? "divide-slate-700" : "divide-gray-200"}`;
    case "filled":
    case "bordered":
      return `${r()} border ${border} divide-y ${divider} overflow-hidden`;
    case "card":
      return props.separated
        ? "space-y-3"
        : `${r()} border ${border} divide-y ${divider} overflow-hidden`;
    case "ghost":
      return "space-y-1";
    case "brutal":
      return "border-[3px] border-black";
    case "neon":
      return "yacc-neon-wrapper space-y-2";
    case "soft":
      return "space-y-2";
    case "timeline":
      return "yacc-timeline-wrapper";
    default:
      return props.separated
        ? "space-y-2"
        : props.bordered
          ? `${r()} border ${border} divide-y ${divider} overflow-hidden`
          : "space-y-2";
  }
}

function itemClass(idx: number): string {
  const d = dk.value;
  const border = d ? "border-slate-700" : "border-gray-200";
  switch (props.variant) {
    case "ghost":
      return `${r()} overflow-hidden`;
    case "brutal":
      return "border-b-[3px] border-black last:border-b-0";
    case "neon":
      return `yacc-neon-item ${r()} overflow-hidden`;
    case "soft":
      return `${r()} overflow-hidden yacc-soft-item`;
    case "timeline":
      return "yacc-timeline-item";
    case "card":
      return props.separated
        ? `${r()} border ${border} overflow-hidden shadow-sm`
        : "";
    default:
      return props.separated
        ? `${r()} overflow-hidden border ${border}`
        : "";
  }
}

function triggerClass(item: YAccordionItem, open: boolean): string {
  const base =
    "flex w-full items-center justify-between text-left font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40";
  const disabled = item.disabled
    ? "cursor-not-allowed opacity-40"
    : "cursor-pointer";
  const d = dk.value;

  switch (props.variant) {
    case "ghost":
      return `${base} px-3 py-3 text-sm rounded-lg ${disabled} ${
        open
          ? d ? "text-slate-100" : "text-gray-900"
          : d ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
      }`;
    case "brutal":
      return `${base} px-4 py-3.5 text-sm uppercase tracking-wider font-black ${disabled} ${
        open ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"
      }`;
    case "neon":
      return `${base} px-4 py-3.5 text-sm font-mono ${disabled} ${
        open ? "yacc-neon-trigger--open" : "yacc-neon-trigger--closed"
      }`;
    case "soft":
      return `${base} px-4 py-3.5 text-sm ${disabled} ${
        open ? "yacc-soft-trigger--open" : d ? "text-slate-400 hover:text-slate-200" : "text-gray-600 hover:text-gray-900"
      }`;
    case "timeline":
      return `${base} py-3 text-sm ${disabled} ${
        open
          ? "text-indigo-600 font-semibold"
          : d ? "text-slate-400 hover:text-slate-200" : "text-gray-600 hover:text-gray-900"
      }`;
    case "filled":
      return `${base} px-4 py-3.5 text-sm ${disabled} ${
        open ? (d ? "bg-slate-800 text-blue-400" : "bg-gray-50 text-blue-600") : (d ? "text-slate-200 hover:bg-slate-800" : "text-gray-800 hover:bg-gray-50")
      }`;
    case "flush":
      return `${base} px-0 py-4 text-sm ${disabled} ${
        open ? "text-blue-600" : (d ? "text-slate-200 hover:text-slate-100" : "text-gray-800 hover:text-gray-900")
      }`;
    default:
      return `${base} px-4 py-3.5 text-sm ${disabled} ${
        open ? "text-blue-600" : (d ? "text-slate-200 hover:bg-slate-800" : "text-gray-800 hover:bg-gray-50")
      }`;
  }
}

function contentClass(): string {
  const d = dk.value;
  switch (props.variant) {
    case "brutal":
      return "px-4 pb-4 pt-1 text-sm leading-relaxed text-gray-700 border-t-[2px] border-black";
    case "neon":
      return "px-4 pb-4 pt-1 text-sm leading-relaxed yacc-neon-content font-mono";
    case "soft":
      return `px-4 pb-4 pt-1 text-sm leading-relaxed ${d ? "text-slate-400" : "text-gray-500"}`;
    case "timeline":
      return `pb-4 pt-1 text-sm leading-relaxed ${d ? "text-slate-400" : "text-gray-500"} yacc-timeline-content`;
    case "flush":
      return `pb-4 pt-1 text-sm leading-relaxed ${d ? "text-slate-400" : "text-gray-600"}`;
    default:
      return `px-4 pb-4 pt-1 text-sm leading-relaxed ${d ? "text-slate-400" : "text-gray-600"}`;
  }
}

// Chevron colour per variant
function chevronClass(open: boolean): string {
  switch (props.variant) {
    case "brutal":
      return open ? "text-white" : "text-black";
    case "neon":
      return open ? "yacc-neon-chevron--open" : "yacc-neon-chevron";
    case "soft":
      return open ? "text-indigo-400" : "text-gray-300";
    case "timeline":
      return "hidden"; // timeline uses + / – instead
    default:
      return "text-gray-400";
  }
}
</script>

<template>
  <div
    ref="accordionRef"
    :class="wrapperClass()"
    :style="props.textColor ? { color: props.textColor } : undefined"
  >
    <div
      v-for="(item, idx) in normalizedItems"
      :key="item.id"
      :class="itemClass(idx)"
    >
      <!-- TIMELINE variant: vertical line + dot layout -->
      <template v-if="variant === 'timeline'">
        <div class="flex gap-4">
          <!-- Spine -->
          <div class="yacc-timeline-spine">
            <span
              class="yacc-timeline-dot"
              :class="isOpen(item.id) ? 'yacc-timeline-dot--open' : ''"
            />
          </div>
          <!-- Content area -->
          <div class="flex-1 pb-6 last:pb-0">
            <button
              type="button"
              :class="triggerClass(item, isOpen(item.id))"
              :aria-expanded="isOpen(item.id)"
              :disabled="item.disabled"
              @click="toggle(item)"
              @keydown="onTriggerKeydown"
            >
              <span class="flex items-center gap-2">
                <span v-if="item.icon" class="text-base leading-none">{{
                  item.icon
                }}</span>
                {{ item.title }}
              </span>
              <span
                class="ml-2 text-base font-light transition-transform"
                :class="isOpen(item.id) ? 'text-indigo-500' : 'text-gray-300'"
              >
                {{ isOpen(item.id) ? "−" : "+" }}
              </span>
            </button>
            <div v-show="isOpen(item.id)" :class="contentClass()">
              <slot :name="item.id" :item="item">{{ item.content }}</slot>
            </div>
          </div>
        </div>
      </template>

      <!-- ALL OTHER VARIANTS -->
      <template v-else>
        <button
          type="button"
          :class="triggerClass(item, isOpen(item.id))"
          :aria-expanded="isOpen(item.id)"
          :disabled="item.disabled"
          @click="toggle(item)"
          @keydown="onTriggerKeydown"
        >
          <span class="flex items-center gap-2">
            <span v-if="item.icon" class="text-base leading-none">{{
              item.icon
            }}</span>
            {{ item.title }}
          </span>
          <svg
            :class="[
              'h-4 w-4 shrink-0 transition-transform duration-200',
              isOpen(item.id) ? 'rotate-180' : '',
              chevronClass(isOpen(item.id)),
            ]"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>

        <div v-show="isOpen(item.id)" :class="contentClass()">
          <slot :name="item.id" :item="item">{{ item.content }}</slot>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
/* ═══════════════════════════════════════
   GHOST — no background, just borders on open
   ═══════════════════════════════════════ */
/* handled via Tailwind utilities */

/* ═══════════════════════════════════════
   BRUTAL
   ═══════════════════════════════════════ */
/* trigger bg swap handled inline */

/* ═══════════════════════════════════════
   NEON
   ═══════════════════════════════════════ */
.yacc-neon-item {
  background: #070a0f;
  border: 1px solid rgba(74, 222, 128, 0.18);
  box-shadow: 0 0 12px rgba(74, 222, 128, 0.06);
  transition: box-shadow 200ms ease;
}
.yacc-neon-item:has([aria-expanded="true"]) {
  box-shadow: 0 0 20px rgba(74, 222, 128, 0.14);
  border-color: rgba(74, 222, 128, 0.35);
}
.yacc-neon-trigger--open {
  color: #4ade80;
  text-shadow: 0 0 8px rgba(74, 222, 128, 0.5);
  background: rgba(74, 222, 128, 0.06);
}
.yacc-neon-trigger--closed {
  color: rgba(74, 222, 128, 0.45);
}
.yacc-neon-trigger--closed:hover {
  color: rgba(74, 222, 128, 0.75);
  background: rgba(74, 222, 128, 0.04);
}
.yacc-neon-content {
  color: rgba(74, 222, 128, 0.6);
  border-top: 1px solid rgba(74, 222, 128, 0.1);
}
.yacc-neon-chevron {
  color: rgba(74, 222, 128, 0.3);
}
.yacc-neon-chevron--open {
  color: #4ade80;
  filter: drop-shadow(0 0 4px rgba(74, 222, 128, 0.5));
}

/* ═══════════════════════════════════════
   SOFT
   ═══════════════════════════════════════ */
.yacc-soft-item {
  background: #fafaf9;
  border: 1px solid #f0ede8;
}
.yacc-soft-trigger--open {
  color: #4338ca;
  background: linear-gradient(135deg, #eef2ff 0%, #ede9fe 100%);
}

/* ═══════════════════════════════════════
   TIMELINE
   ═══════════════════════════════════════ */
.yacc-timeline-wrapper {
  padding-left: 4px;
}
.yacc-timeline-spine {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 12px;
}
.yacc-timeline-spine::after {
  content: "";
  flex: 1;
  width: 1.5px;
  background: #e2e8f0;
  margin-top: 6px;
}
.yacc-timeline-item:last-child .yacc-timeline-spine::after {
  display: none;
}
.yacc-timeline-dot {
  width: 10px;
  height: 10px;
  border-radius: 9999px;
  border: 2px solid #cbd5e1;
  background: white;
  flex-shrink: 0;
  transition:
    background 200ms,
    border-color 200ms,
    box-shadow 200ms;
}
.yacc-timeline-dot--open {
  background: #6366f1;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}
.yacc-timeline-content {
  padding-left: 0;
}
</style>
