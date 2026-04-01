<script setup lang="ts">
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from "vue";
import { useDarkMode } from "@/composables/useDarkMode";
import type { YDatePickerProps, YDatePickerVariant } from "@/types/datepicker";

defineOptions({ name: "YDatePicker" });

const props = withDefaults(defineProps<YDatePickerProps>(), {
  variant: "clean",
  size: "md",
  placeholder: "Select date",
  disabled: false,
  readonly: false,
  clearable: false,
  inline: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: string | null];
}>();

const dk = useDarkMode(props.dark);

/* ── Calendar state ── */
const today = new Date();
const todayStr = toISO(today);

function toISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function parseISO(str: string): Date {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

const initDate = props.modelValue ? parseISO(props.modelValue) : today;
const viewYear = ref(initDate.getFullYear());
const viewMonth = ref(initDate.getMonth());

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      const d = parseISO(val);
      viewYear.value = d.getFullYear();
      viewMonth.value = d.getMonth();
    }
  },
);

/* ── Popup state ── */
const isOpen = ref(false);
const rootRef = ref<HTMLElement | null>(null);

function open() {
  if (props.disabled || props.readonly || props.inline) return;
  isOpen.value = true;
}

function close() {
  isOpen.value = false;
}

function onClickOutside(e: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) close();
}

onMounted(() => document.addEventListener("mousedown", onClickOutside));
onUnmounted(() => document.removeEventListener("mousedown", onClickOutside));

/* ── Month navigation ── */
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function prevMonth() {
  if (viewMonth.value === 0) {
    viewMonth.value = 11;
    viewYear.value--;
  } else {
    viewMonth.value--;
  }
}

function nextMonth() {
  if (viewMonth.value === 11) {
    viewMonth.value = 0;
    viewYear.value++;
  } else {
    viewMonth.value++;
  }
}

/* ── Calendar grid ── */
type CalendarCell = { day: number; dateStr: string; currentMonth: boolean };

const calendarCells = computed((): CalendarCell[] => {
  const year = viewYear.value;
  const month = viewMonth.value;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const cells: CalendarCell[] = [];

  // Leading cells from previous month
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrev - i;
    const m = month === 0 ? 12 : month;
    const y = month === 0 ? year - 1 : year;
    cells.push({
      day,
      dateStr: `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      currentMonth: false,
    });
  }

  // Current month
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({
      day,
      dateStr: `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      currentMonth: true,
    });
  }

  // Trailing cells to fill the last row
  const remainder = cells.length % 7;
  if (remainder !== 0) {
    const trailing = 7 - remainder;
    for (let day = 1; day <= trailing; day++) {
      const m = month === 11 ? 1 : month + 2;
      const y = month === 11 ? year + 1 : year;
      cells.push({
        day,
        dateStr: `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        currentMonth: false,
      });
    }
  }

  return cells;
});

/* ── Date comparison ── */
function isSelected(dateStr: string): boolean {
  return dateStr === props.modelValue;
}

function isToday(dateStr: string): boolean {
  return dateStr === todayStr;
}

function isDisabled(dateStr: string): boolean {
  if (props.minDate && dateStr < props.minDate) return true;
  if (props.maxDate && dateStr > props.maxDate) return true;
  return false;
}

function selectDate(dateStr: string) {
  if (isDisabled(dateStr)) return;
  emit("update:modelValue", dateStr);
  if (!props.inline) close();
}

function clearDate(e: MouseEvent) {
  e.stopPropagation();
  emit("update:modelValue", null);
}

/* ── Display label ── */
const displayValue = computed(() => {
  if (!props.modelValue) return "";
  const d = parseISO(props.modelValue);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
});

/* ── Size ── */
const sizeMap = {
  sm: { trigger: "h-8 text-xs px-3", cell: "h-7 w-7 text-xs", header: "text-xs" },
  md: { trigger: "h-10 text-sm px-3.5", cell: "h-9 w-9 text-sm", header: "text-sm" },
  lg: { trigger: "h-12 text-base px-4", cell: "h-10 w-10 text-base", header: "text-sm" },
};
const sc = computed(() => sizeMap[props.size ?? "md"]);

/* ── Variant tokens ── */
type Tokens = {
  trigger: string;
  calendar: string;
  header: string;
  navBtn: string;
  dayName: string;
  cell: {
    base: string;
    current: string;
    other: string;
    selected: string;
    today: string;
    disabled: string;
  };
  label: string;
  hint: string;
  error: string;
  placeholder: string;
  clearBtn: string;
};

const lightTokens: Record<YDatePickerVariant, Tokens> = {
  clean: {
    trigger:
      "w-full flex items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
    calendar:
      "bg-white border border-gray-200 rounded-xl shadow-lg p-4 w-72",
    header: "text-gray-800 font-semibold",
    navBtn:
      "text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg p-1 transition-colors duration-150",
    dayName: "text-gray-400 font-medium",
    cell: {
      base: "rounded-lg flex items-center justify-center font-medium transition-all duration-100 cursor-pointer select-none",
      current: "text-gray-700 hover:bg-blue-50 hover:text-blue-600",
      other: "text-gray-300 hover:bg-gray-50",
      selected: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
      today: "ring-2 ring-blue-400 ring-offset-1",
      disabled: "text-gray-200 cursor-not-allowed pointer-events-none",
    },
    label: "text-gray-700 font-medium text-sm mb-1.5 block",
    hint: "text-gray-400 text-xs mt-1",
    error: "text-red-500 text-xs mt-1",
    placeholder: "text-gray-400",
    clearBtn: "text-gray-300 hover:text-gray-500 transition-colors",
  },
  glass: {
    trigger:
      "w-full flex items-center justify-between gap-2 rounded-lg border border-white/40 bg-white/30 backdrop-blur-sm text-gray-700 hover:border-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
    calendar:
      "bg-white/80 backdrop-blur-xl border border-white/50 rounded-xl shadow-lg p-4 w-72",
    header: "text-gray-800 font-semibold",
    navBtn:
      "text-gray-500 hover:text-gray-800 hover:bg-white/60 rounded-lg p-1 transition-colors duration-150",
    dayName: "text-gray-400 font-medium",
    cell: {
      base: "rounded-lg flex items-center justify-center font-medium transition-all duration-100 cursor-pointer select-none",
      current: "text-gray-700 hover:bg-white/70 hover:text-blue-600",
      other: "text-gray-300 hover:bg-white/40",
      selected: "bg-blue-500/80 backdrop-blur-sm text-white hover:bg-blue-600/80 shadow-sm",
      today: "ring-2 ring-blue-400/60 ring-offset-1",
      disabled: "text-gray-200 cursor-not-allowed pointer-events-none",
    },
    label: "text-gray-700 font-medium text-sm mb-1.5 block",
    hint: "text-gray-400 text-xs mt-1",
    error: "text-red-500 text-xs mt-1",
    placeholder: "text-gray-400",
    clearBtn: "text-gray-400 hover:text-gray-600 transition-colors",
  },
  dark: {
    trigger:
      "w-full flex items-center justify-between gap-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
    calendar:
      "bg-slate-900 border border-slate-700 rounded-xl shadow-xl p-4 w-72",
    header: "text-slate-100 font-semibold",
    navBtn:
      "text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg p-1 transition-colors duration-150",
    dayName: "text-slate-500 font-medium",
    cell: {
      base: "rounded-lg flex items-center justify-center font-medium transition-all duration-100 cursor-pointer select-none",
      current: "text-slate-200 hover:bg-slate-800 hover:text-indigo-400",
      other: "text-slate-600 hover:bg-slate-800/50",
      selected: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm",
      today: "ring-2 ring-indigo-500 ring-offset-1 ring-offset-slate-900",
      disabled: "text-slate-700 cursor-not-allowed pointer-events-none",
    },
    label: "text-slate-300 font-medium text-sm mb-1.5 block",
    hint: "text-slate-500 text-xs mt-1",
    error: "text-red-400 text-xs mt-1",
    placeholder: "text-slate-500",
    clearBtn: "text-slate-600 hover:text-slate-400 transition-colors",
  },
  brutalist: {
    trigger:
      "w-full flex items-center justify-between gap-2 border-4 border-black bg-yellow-300 text-black font-bold hover:bg-yellow-400 focus:outline-none focus:ring-4 focus:ring-black transition-all duration-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
    calendar:
      "bg-yellow-300 border-4 border-black shadow-[8px_8px_0_0_#000] p-4 w-72",
    header: "text-black font-black uppercase",
    navBtn:
      "text-black hover:bg-black hover:text-yellow-300 border-2 border-black p-1 font-black transition-colors duration-100",
    dayName: "text-black font-black uppercase text-xs",
    cell: {
      base: "border-2 border-transparent flex items-center justify-center font-black transition-all duration-100 cursor-pointer select-none",
      current: "text-black hover:border-black hover:bg-black hover:text-yellow-300",
      other: "text-gray-400 hover:border-gray-400",
      selected: "border-black bg-black text-yellow-300",
      today: "border-2 border-black",
      disabled: "text-gray-300 cursor-not-allowed pointer-events-none",
    },
    label: "text-black font-black text-sm mb-1.5 block uppercase",
    hint: "text-black/60 text-xs mt-1 font-bold",
    error: "text-red-600 text-xs mt-1 font-black",
    placeholder: "text-black/50",
    clearBtn: "text-black/50 hover:text-black font-bold transition-colors",
  },
  minimal: {
    trigger:
      "w-full flex items-center justify-between gap-2 rounded border-b border-gray-200 bg-transparent text-gray-600 hover:border-gray-400 focus:outline-none focus:border-gray-600 transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed px-0",
    calendar:
      "bg-white border border-gray-100 rounded-lg shadow-sm p-4 w-72",
    header: "text-gray-700 font-medium",
    navBtn:
      "text-gray-300 hover:text-gray-600 rounded p-1 transition-colors duration-150",
    dayName: "text-gray-300 font-medium",
    cell: {
      base: "rounded flex items-center justify-center font-medium transition-all duration-100 cursor-pointer select-none",
      current: "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
      other: "text-gray-200 hover:bg-gray-50",
      selected: "bg-gray-800 text-white hover:bg-gray-900",
      today: "font-bold text-gray-900",
      disabled: "text-gray-100 cursor-not-allowed pointer-events-none",
    },
    label: "text-gray-500 text-sm mb-1 block",
    hint: "text-gray-300 text-xs mt-1",
    error: "text-red-400 text-xs mt-1",
    placeholder: "text-gray-300",
    clearBtn: "text-gray-200 hover:text-gray-400 transition-colors",
  },
};

const darkOverrides: Partial<Record<YDatePickerVariant, Tokens>> = {
  clean: lightTokens.dark,
  glass: {
    ...lightTokens.glass,
    trigger:
      "w-full flex items-center justify-between gap-2 rounded-lg border border-slate-600/60 bg-slate-800/60 backdrop-blur-sm text-slate-200 hover:border-slate-500/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
    calendar:
      "bg-slate-800/90 backdrop-blur-xl border border-slate-600/50 rounded-xl shadow-lg p-4 w-72",
    header: "text-slate-100 font-semibold",
    navBtn:
      "text-slate-400 hover:text-slate-100 hover:bg-slate-700/60 rounded-lg p-1 transition-colors duration-150",
    dayName: "text-slate-500 font-medium",
    cell: {
      base: "rounded-lg flex items-center justify-center font-medium transition-all duration-100 cursor-pointer select-none",
      current: "text-slate-200 hover:bg-slate-700/60 hover:text-indigo-400",
      other: "text-slate-600 hover:bg-slate-700/40",
      selected: "bg-indigo-600/80 backdrop-blur-sm text-white hover:bg-indigo-700/80 shadow-sm",
      today: "ring-2 ring-indigo-500/60 ring-offset-1 ring-offset-slate-800",
      disabled: "text-slate-700 cursor-not-allowed pointer-events-none",
    },
    placeholder: "text-slate-500",
    clearBtn: "text-slate-600 hover:text-slate-400 transition-colors",
    label: "text-slate-300 font-medium text-sm mb-1.5 block",
    hint: "text-slate-500 text-xs mt-1",
    error: "text-red-400 text-xs mt-1",
  },
  minimal: {
    ...lightTokens.minimal,
    trigger:
      "w-full flex items-center justify-between gap-2 border-b border-slate-700 bg-transparent text-slate-300 hover:border-slate-500 focus:outline-none focus:border-slate-400 transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed px-0",
    calendar:
      "bg-slate-900 border border-slate-800 rounded-lg shadow-sm p-4 w-72",
    header: "text-slate-300 font-medium",
    navBtn:
      "text-slate-600 hover:text-slate-300 rounded p-1 transition-colors duration-150",
    dayName: "text-slate-600 font-medium",
    cell: {
      base: "rounded flex items-center justify-center font-medium transition-all duration-100 cursor-pointer select-none",
      current: "text-slate-300 hover:text-slate-100 hover:bg-slate-800",
      other: "text-slate-700 hover:bg-slate-800",
      selected: "bg-slate-200 text-slate-900 hover:bg-slate-100",
      today: "font-bold text-slate-100",
      disabled: "text-slate-700 cursor-not-allowed pointer-events-none",
    },
    placeholder: "text-slate-600",
    clearBtn: "text-slate-700 hover:text-slate-500 transition-colors",
    label: "text-slate-400 text-sm mb-1 block",
    hint: "text-slate-600 text-xs mt-1",
    error: "text-red-400 text-xs mt-1",
  },
};

const tok = computed((): Tokens => {
  const v = props.variant ?? "clean";
  if (dk.value) {
    return darkOverrides[v] ?? lightTokens[v];
  }
  return lightTokens[v];
});
</script>

<template>
  <div ref="rootRef" class="relative inline-block w-full">
    <!-- Label -->
    <label v-if="label" :class="tok.label">{{ label }}</label>

    <!-- Trigger (popup mode) -->
    <button
      v-if="!inline"
      type="button"
      :disabled="disabled"
      :class="[tok.trigger, sc.trigger]"
      @click="isOpen ? close() : open()"
    >
      <span :class="modelValue ? '' : tok.placeholder">
        {{ modelValue ? displayValue : placeholder }}
      </span>
      <span class="flex items-center gap-1 shrink-0">
        <!-- Clear button -->
        <span
          v-if="clearable && modelValue"
          :class="tok.clearBtn"
          role="button"
          aria-label="Clear date"
          @click="clearDate"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
            <path d="M2 2l10 10M12 2L2 12" />
          </svg>
        </span>
        <!-- Calendar icon -->
        <svg class="w-4 h-4 opacity-50" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
        </svg>
      </span>
    </button>

    <!-- Calendar panel (popup or inline) -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 translate-y-1 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-1 scale-95"
    >
      <div
        v-if="inline || isOpen"
        :class="[
          tok.calendar,
          !inline ? 'absolute top-full mt-2 left-0 z-50 origin-top-left' : '',
        ]"
      >
        <!-- Month/Year header -->
        <div class="flex items-center justify-between mb-3">
          <button
            type="button"
            :class="tok.navBtn"
            aria-label="Previous month"
            @click="prevMonth"
          >
            <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </button>

          <span :class="[tok.header, sc.header]">
            {{ monthNames[viewMonth] }} {{ viewYear }}
          </span>

          <button
            type="button"
            :class="tok.navBtn"
            aria-label="Next month"
            @click="nextMonth"
          >
            <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <!-- Day names row -->
        <div class="grid grid-cols-7 mb-1">
          <span
            v-for="day in dayNames"
            :key="day"
            :class="[sc.cell, tok.dayName, 'flex items-center justify-center']"
          >
            {{ day }}
          </span>
        </div>

        <!-- Calendar grid -->
        <div class="grid grid-cols-7">
          <button
            v-for="cell in calendarCells"
            :key="cell.dateStr"
            type="button"
            :disabled="isDisabled(cell.dateStr)"
            :aria-label="cell.dateStr"
            :aria-pressed="isSelected(cell.dateStr)"
            :class="[
              tok.cell.base,
              sc.cell,
              isDisabled(cell.dateStr)
                ? tok.cell.disabled
                : isSelected(cell.dateStr)
                  ? tok.cell.selected
                  : cell.currentMonth
                    ? tok.cell.current
                    : tok.cell.other,
              isToday(cell.dateStr) && !isSelected(cell.dateStr) ? tok.cell.today : '',
            ]"
            @click="selectDate(cell.dateStr)"
          >
            {{ cell.day }}
          </button>
        </div>
      </div>
    </Transition>

    <!-- Hint / Error -->
    <p v-if="error" :class="tok.error">{{ error }}</p>
    <p v-else-if="hint" :class="tok.hint">{{ hint }}</p>
  </div>
</template>
