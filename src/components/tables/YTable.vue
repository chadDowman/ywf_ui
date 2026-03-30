<script setup lang="ts">
import { ref, computed } from "vue";
import { useDarkMode } from "@/composables/useDarkMode";

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
});

const dk = useDarkMode(props.dark);

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

const wrapperClasses = computed(() => {
  if (props.variant === "card")
    return dk.value
      ? "rounded-xl border border-slate-700 shadow-sm overflow-hidden"
      : "rounded-xl border border-gray-200 shadow-sm overflow-hidden";
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

const cellClass = computed(() =>
  [sizeMap[props.size ?? "md"], dk.value ? "text-slate-300" : "text-gray-700"].join(" "),
);
const headCellClass = computed(() =>
  [
    sizeMap[props.size ?? "md"],
    dk.value
      ? "font-semibold text-slate-100 bg-slate-800/80"
      : "font-semibold text-gray-900 bg-gray-50",
  ].join(" "),
);
</script>

<template>
  <div
    :class="[wrapperClasses, 'overflow-auto', fullWidth ? 'w-full' : '']"
    :style="[props.textColor ? { color: props.textColor } : {}, dk ? { background: '#1e293b', color: '#f1f5f9' } : {}]"
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
        :class="['mb-2 text-left text-sm caption-top', dk ? 'text-slate-400' : 'text-gray-500']"
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
                ? dk ? 'border border-slate-700' : 'border border-gray-200'
                : '',
            ]"
            :style="col.width ? { width: col.width } : {}"
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
      <tbody :class="dk ? 'divide-y divide-slate-700' : 'divide-y divide-gray-100'">
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
                ? dk ? 'border border-slate-700' : 'border border-gray-200'
                : '',
            ]"
          >
            {{ row[col.key] }}
          </td>
        </tr>
        <tr v-if="sortedRows.length === 0">
          <td
            :colspan="(columns ?? []).length"
            class="py-10 text-center text-sm text-gray-400"
          >
            No data available
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
