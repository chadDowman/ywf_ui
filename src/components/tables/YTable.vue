<script setup lang="ts">
import { ref, computed } from "vue";
import { useDarkMode } from "@/composables/useDarkMode";
import { useAnimation } from '@/composables/useAnimation';
import { getAppearAnimationClasses } from '@/types/animation';

defineOptions({ name: "YTable" });
import type { YTableProps, YTableColumn } from "@/types/table";

const props = withDefaults(defineProps<YTableProps>(), {
  variant: "simple",
  size: "md",
  loading: false,
  hoverable: true,
  fullWidth: true,
  columns: () => [],
  rows: () => [],
  animation: undefined,
});

const dk = useDarkMode(props.dark);
const anim = useAnimation(() => props.animation);
const appearTx = computed(() => getAppearAnimationClasses(anim.value));

const emit = defineEmits<{
  sort: [column: string, direction: "asc" | "desc"];
}>();

const sortKey = ref<string | null>(null);
const sortDirection = ref<"asc" | "desc">("asc");

const sizeMap: Record<string, string> = {
  xs: "px-2 py-1 text-xs",
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-3 text-sm",
  lg: "px-5 py-4 text-base",
  xl: "px-6 py-5 text-lg",
};

const sortedRows = computed(() => {
  if (!sortKey.value) return props.rows ?? [];
  const key = sortKey.value;
  return [...(props.rows ?? [])].sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    if (av == null) return 1;
    if (bv == null) return -1;
    const cmp = String(av).localeCompare(String(bv), undefined, {
      numeric: true,
    });
    return sortDirection.value === "asc" ? cmp : -cmp;
  });
});

const rowClasses = computed(() => {
  switch (props.variant) {
    case "aurora":
      return props.hoverable ? "ytable-aurora-row transition-colors" : "";
    case "glass":
      return props.hoverable ? "ytable-glass-row transition-colors" : "";
    case "brutalist":
      return props.hoverable
        ? "ytable-brutalist-row transition-colors"
        : "ytable-brutalist-row";
    case "terminal":
      return props.hoverable ? "ytable-terminal-row transition-colors" : "";
    case "neon":
      return props.hoverable ? "ytable-neon-row transition-colors" : "";
  }
  const hover = props.hoverable
    ? dk.value
      ? "hover:bg-slate-800/50 transition-colors"
      : "hover:bg-gray-50 transition-colors"
    : "";
  if (props.variant === "striped")
    return dk.value
      ? `${hover} even:bg-slate-800/30`
      : `${hover} even:bg-gray-50/60`;
  return hover;
});

const bodyClass = computed(() => {
  const base =
    props.variant === "aurora"
      ? "ytable-aurora-body"
      : props.variant === "glass"
        ? "ytable-glass-body divide-y divide-white/10"
        : props.variant === "brutalist"
          ? ""
          : props.variant === "terminal"
            ? "ytable-terminal-body divide-y divide-green-500/20"
            : props.variant === "neon"
              ? "ytable-neon-body divide-y divide-violet-400/20"
              : dk.value
                ? "divide-y divide-slate-700"
                : "divide-y divide-gray-100";

  return props.dividerColor ? `${base} ytable-custom-divider` : base;
});

const wrapperClasses = computed(() => {
  switch (props.variant) {
    case "card":
      return dk.value
        ? "rounded-xl border border-slate-700 shadow-sm overflow-hidden"
        : "rounded-xl border border-gray-200 shadow-sm overflow-hidden";
    case "aurora":
      return "ytable-aurora rounded-xl overflow-hidden";
    case "glass":
      return "ytable-glass rounded-xl overflow-hidden border border-white/20";
    case "brutalist":
      return "ytable-brutalist border-[3px] border-black";
    case "terminal":
      return "ytable-terminal overflow-hidden border border-green-500/40";
    case "neon":
      return "ytable-neon rounded-xl overflow-hidden border border-violet-400/40";
  }
  return "";
});

function handleSort(col: YTableColumn) {
  if (!col.sortable) return;
  if (sortKey.value === col.key) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = col.key;
    sortDirection.value = "asc";
  }
  emit("sort", sortKey.value!, sortDirection.value);
}

const cellClass = computed(() => {
  const size = sizeMap[props.size ?? "md"];
  switch (props.variant) {
    case "aurora":
      return `${size} ytable-aurora-cell`;
    case "glass":
      return `${size} ytable-glass-cell`;
    case "brutalist":
      return `${size} ytable-brutalist-cell`;
    case "terminal":
      return `${size} ytable-terminal-cell`;
    case "neon":
      return `${size} ytable-neon-cell`;
  }
  return [size, dk.value ? "text-slate-300" : "text-gray-700"].join(" ");
});

const headCellClass = computed(() => {
  const size = sizeMap[props.size ?? "md"];
  switch (props.variant) {
    case "aurora":
      return `${size} ytable-aurora-head`;
    case "glass":
      return `${size} ytable-glass-head`;
    case "brutalist":
      return `${size} ytable-brutalist-head`;
    case "terminal":
      return `${size} ytable-terminal-head`;
    case "neon":
      return `${size} ytable-neon-head`;
  }
  return [
    size,
    dk.value
      ? "font-semibold text-slate-100 bg-slate-800/80"
      : "font-semibold text-gray-900 bg-gray-50",
  ].join(" ");
});

const wrapperStyle = computed(() => {
  const style: Record<string, string> = {};

  if (props.textColor) style.color = props.textColor;
  if (props.backgroundColor) {
    style.background = props.backgroundColor;
    style["--ytable-bg"] = props.backgroundColor;
  }
  if (props.borderColor) {
    style.borderColor = props.borderColor;
    style["--ytable-border"] = props.borderColor;
  }
  if (props.headerBackgroundColor) {
    style["--ytable-header-bg"] = props.headerBackgroundColor;
  }
  if (props.headerTextColor) {
    style["--ytable-header-text"] = props.headerTextColor;
    style["--ytable-row-hover-text"] =
      props.rowHoverTextColor ?? props.headerTextColor;
  }
  if (props.cellTextColor ?? props.textColor) {
    style["--ytable-cell-text"] = props.cellTextColor ?? props.textColor!;
  }
  if (props.captionColor) {
    style["--ytable-caption-text"] = props.captionColor;
  }
  if (props.rowHoverColor) {
    style["--ytable-row-hover"] = props.rowHoverColor;
  }
  if (props.rowHoverTextColor) {
    style["--ytable-row-hover-text"] = props.rowHoverTextColor;
  }
  if (props.dividerColor) {
    style["--ytable-divider"] = props.dividerColor;
  }

  if (
    dk.value &&
    !props.backgroundColor &&
    !["card", "aurora", "glass", "brutalist", "terminal", "neon"].includes(
      props.variant ?? "simple",
    )
  ) {
    style.background = "#1e293b";
  }

  return style;
});

const headCellStyle = computed(() => {
  const style: Record<string, string> = {};
  if (props.headerBackgroundColor) {
    style.background = props.headerBackgroundColor;
  }
  if (props.headerTextColor) {
    style.color = props.headerTextColor;
  }
  if (props.borderColor ?? props.dividerColor) {
    style.borderColor = props.borderColor ?? props.dividerColor!;
  }
  return Object.keys(style).length ? style : undefined;
});

const cellStyle = computed(() => {
  const style: Record<string, string> = {};
  if (props.cellTextColor ?? props.textColor) {
    style.color = props.cellTextColor ?? props.textColor!;
  }
  if (props.borderColor ?? props.dividerColor) {
    style.borderColor = props.borderColor ?? props.dividerColor!;
  }
  return Object.keys(style).length ? style : undefined;
});

const captionStyle = computed(() =>
  props.captionColor ? { color: props.captionColor } : undefined,
);

const emptyStateStyle = computed(() =>
  (props.cellTextColor ?? props.textColor)
    ? { color: props.cellTextColor ?? props.textColor }
    : undefined,
);
</script>

<template>
  <div
    :class="[wrapperClasses, 'overflow-auto', fullWidth ? 'w-full' : '']"
    :style="wrapperStyle"
  >
    <div
      v-if="loading"
      class="flex items-center justify-center py-12 text-sm text-gray-400"
    >
      <svg class="mr-2 h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4z"
        />
      </svg>
      Loading…
    </div>

    <table v-else class="border-collapse" :class="fullWidth ? 'w-full' : ''">
      <caption
        v-if="caption"
        :class="[
          'mb-2 text-left text-sm caption-top',
          dk ? 'text-slate-400' : 'text-gray-500',
        ]"
        :style="captionStyle"
      >
        {{
          caption
        }}
      </caption>
      <thead>
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            :class="[
              headCellClass,
              col.sortable ? 'cursor-pointer select-none' : '',
              col.align === 'center'
                ? 'text-center'
                : col.align === 'right'
                  ? 'text-right'
                  : 'text-left',
              variant === 'bordered'
                ? dk
                  ? 'border border-slate-700'
                  : 'border border-gray-200'
                : '',
            ]"
            :style="[col.width ? { width: col.width } : {}, headCellStyle]"
            @click="handleSort(col)"
          >
            <span class="inline-flex items-center gap-1">
              {{ col.label }}
              <span v-if="col.sortable" class="text-gray-400">
                <svg
                  v-if="sortKey === col.key && sortDirection === 'asc'"
                  class="h-3.5 w-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
                <svg
                  v-else-if="sortKey === col.key && sortDirection === 'desc'"
                  class="h-3.5 w-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
                <svg
                  v-else
                  class="h-3.5 w-3.5 opacity-30"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
            </span>
          </th>
        </tr>
      </thead>
      <tbody :class="bodyClass">
        <tr v-for="(row, ri) in sortedRows" :key="ri" :class="rowClasses">
          <td
            v-for="col in columns"
            :key="col.key"
            :class="[
              cellClass,
              col.align === 'center'
                ? 'text-center'
                : col.align === 'right'
                  ? 'text-right'
                  : 'text-left',
              variant === 'bordered'
                ? dk
                  ? 'border border-slate-700'
                  : 'border border-gray-200'
                : '',
            ]"
            :style="cellStyle"
          >
            {{ row[col.key] }}
          </td>
        </tr>
        <tr v-if="sortedRows.length === 0">
          <td
            :colspan="(columns ?? []).length"
            class="py-10 text-center text-sm text-gray-400"
            :style="emptyStateStyle"
          >
            No data available
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  </Transition>
</template>

<style scoped>
/* ── Aurora ──────────────────────────────────────────────── */
.ytable-aurora {
  background: var(
    --ytable-bg,
    linear-gradient(160deg, #0f0f2e 0%, #0a1a2e 100%)
  );
  position: relative;
}
.ytable-aurora::before {
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
  animation: ytable-aurora-spin 5s linear infinite;
  pointer-events: none;
}
@keyframes ytable-aurora-spin {
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
.ytable-aurora-head {
  background: var(--ytable-header-bg, rgba(124, 58, 237, 0.2));
  color: var(--ytable-header-text, #c4b5fd);
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  font-size: 0.7rem;
  border-bottom: 1px solid var(--ytable-divider, rgba(124, 58, 237, 0.4));
}
.ytable-aurora-cell {
  color: var(--ytable-cell-text, #cbd5e1);
}
.ytable-aurora-body {
  divide-color: transparent;
}
.ytable-aurora-row:hover {
  background: var(--ytable-row-hover, rgba(255, 255, 255, 0.05));
}

/* ── Glass ───────────────────────────────────────────────── */
.ytable-glass {
  background: var(--ytable-bg, rgba(255, 255, 255, 0.15));
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}
.ytable-glass-head {
  background: var(--ytable-header-bg, rgba(255, 255, 255, 0.25));
  color: var(--ytable-header-text, #1e293b);
  font-weight: 600;
  letter-spacing: 0.03em;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.ytable-glass-cell {
  color: var(--ytable-cell-text, #334155);
}
.ytable-glass-row:hover {
  background: var(--ytable-row-hover, rgba(255, 255, 255, 0.35));
}

/* ── Brutalist ───────────────────────────────────────────── */
.ytable-brutalist {
  background: var(--ytable-bg, #ffffff);
  box-shadow: 6px 6px 0 var(--ytable-border, #000);
}
.ytable-brutalist-head {
  background: var(--ytable-header-bg, #000000);
  color: var(--ytable-header-text, #ffffff);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.7rem;
  border-right: 2px solid var(--ytable-border, #333);
}
.ytable-brutalist-cell {
  color: var(--ytable-cell-text, #000000);
  font-weight: 500;
  border-right: 2px solid var(--ytable-border, #000);
}
.ytable-brutalist-row {
  border-bottom: 2px solid var(--ytable-divider, var(--ytable-border, #000));
}
.ytable-brutalist-row:hover {
  background: var(--ytable-row-hover, #fef9c3);
}

/* ── Terminal ────────────────────────────────────────────── */
.ytable-terminal {
  background: var(--ytable-bg, #0a0a0a);
  font-family: "Courier New", Courier, monospace;
  box-shadow: 0 0 20px
    color-mix(in srgb, var(--ytable-header-text, #4ade80) 18%, transparent);
}
.ytable-terminal-head {
  background: var(--ytable-header-bg, #111);
  color: var(--ytable-header-text, #4ade80);
  font-family: "Courier New", Courier, monospace;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.7rem;
  border-bottom: 1px solid var(--ytable-divider, rgba(74, 222, 128, 0.4));
}
.ytable-terminal-cell {
  color: var(--ytable-cell-text, #86efac);
  font-family: "Courier New", Courier, monospace;
}
.ytable-terminal-row:hover {
  background: var(--ytable-row-hover, rgba(74, 222, 128, 0.07));
}
.ytable-terminal-row:hover td {
  color: var(--ytable-row-hover-text, var(--ytable-header-text, #4ade80));
  text-shadow: 0 0 6px
    color-mix(
      in srgb,
      var(--ytable-row-hover-text, var(--ytable-header-text, #4ade80)) 50%,
      transparent
    );
}

/* ── Neon ────────────────────────────────────────────────── */
.ytable-neon {
  background: var(--ytable-bg, #0d0d1a);
  box-shadow:
    0 0 24px
      color-mix(in srgb, var(--ytable-header-text, #a78bfa) 20%, transparent),
    0 0 60px
      color-mix(in srgb, var(--ytable-header-text, #a78bfa) 5%, transparent);
}
.ytable-neon-head {
  background: var(--ytable-header-bg, rgba(109, 40, 217, 0.2));
  color: var(--ytable-header-text, #a78bfa);
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-size: 0.7rem;
  border-bottom: 1px solid var(--ytable-divider, rgba(167, 139, 250, 0.4));
  text-shadow: 0 0 8px
    color-mix(in srgb, var(--ytable-header-text, #a78bfa) 60%, transparent);
}
.ytable-neon-cell {
  color: var(--ytable-cell-text, #c4b5fd);
}
.ytable-neon-row:hover {
  background: var(--ytable-row-hover, rgba(167, 139, 250, 0.07));
}
.ytable-neon-row:hover td {
  color: var(--ytable-row-hover-text, #ddd6fe);
  text-shadow: 0 0 6px
    color-mix(in srgb, var(--ytable-row-hover-text, #ddd6fe) 50%, transparent);
}

.ytable-custom-divider tr + tr td {
  border-top: 1px solid var(--ytable-divider);
}
</style>
