<script setup lang="ts">
import { computed } from "vue";
import { useDarkMode } from "@/composables/useDarkMode";
import type { YPaginationProps, YPaginationVariant } from "@/types/pagination";
import { useAnimation } from '@/composables/useAnimation';
import { getAppearAnimationClasses } from '@/types/animation';

defineOptions({ name: "YPagination" });

const props = withDefaults(defineProps<YPaginationProps>(), {
  modelValue: 1,
  totalPages: 1,
  sibling: 1,
  showFirstLast: false,
  showPrevNext: true,
  disabled: false,
  variant: "simple",
  size: "md",
  animation: undefined,
});

const emit = defineEmits<{
  "update:modelValue": [page: number];
}>();

const dk = useDarkMode(props.dark);
const anim = useAnimation(() => props.animation);
const appearTx = computed(() => getAppearAnimationClasses(anim.value));

/* ── Page generation ── */
const pages = computed((): (number | null)[] => {
  const total = props.totalPages ?? 1;
  const current = props.modelValue ?? 1;
  const s = props.sibling ?? 1;

  if (total <= 5 + s * 2) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const left = Math.max(current - s, 1);
  const right = Math.min(current + s, total);
  const showLeft = left > 2;
  const showRight = right < total - 1;

  if (!showLeft && showRight) {
    const count = 3 + 2 * s;
    return [
      ...Array.from({ length: count }, (_, i) => i + 1),
      null,
      total,
    ];
  }
  if (showLeft && !showRight) {
    const count = 3 + 2 * s;
    return [
      1,
      null,
      ...Array.from({ length: count }, (_, i) => total - count + i + 1),
    ];
  }
  return [
    1,
    null,
    ...Array.from(
      { length: right - left + 1 },
      (_, i) => left + i,
    ),
    null,
    total,
  ];
});

function go(page: number | null) {
  if (page === null || props.disabled) return;
  const clamped = Math.max(1, Math.min(page, props.totalPages ?? 1));
  if (clamped !== props.modelValue) emit("update:modelValue", clamped);
}

const current = computed(() => props.modelValue ?? 1);
const isFirst = computed(() => current.value <= 1);
const isLast = computed(() => current.value >= (props.totalPages ?? 1));

/* ── Size ── */
const sizeMap: Record<string, { btn: string; ellipsis: string }> = {
  sm: { btn: "h-7 min-w-[28px] px-2 text-xs", ellipsis: "h-7 px-1 text-xs" },
  md: { btn: "h-9 min-w-[36px] px-3 text-sm", ellipsis: "h-9 px-2 text-sm" },
  lg: { btn: "h-11 min-w-[44px] px-4 text-base", ellipsis: "h-11 px-2 text-base" },
};

const sc = computed(() => sizeMap[props.size ?? "md"]);

/* ── Variant token system ── */
type Tokens = {
  wrap: string;
  base: string;
  idle: string;
  active: string;
  nav: string;
  navDisabled: string;
  ellipsis: string;
};

const lightTokens: Record<YPaginationVariant, Tokens> = {
  simple: {
    wrap: "flex items-center gap-1",
    base: "inline-flex items-center justify-center font-medium rounded-md transition-colors duration-150 select-none",
    idle: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
    active: "bg-blue-600 text-white shadow-sm",
    nav: "text-gray-500 hover:bg-gray-100 hover:text-gray-800",
    navDisabled: "text-gray-300 cursor-not-allowed pointer-events-none",
    ellipsis: "text-gray-400",
  },
  outlined: {
    wrap: "flex items-center gap-1",
    base: "inline-flex items-center justify-center font-medium rounded-md border transition-colors duration-150 select-none",
    idle: "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50",
    active: "border-blue-500 bg-blue-50 text-blue-700",
    nav: "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50",
    navDisabled: "border-gray-100 text-gray-300 cursor-not-allowed pointer-events-none",
    ellipsis: "text-gray-400 border-transparent",
  },
  filled: {
    wrap: "flex items-center gap-1",
    base: "inline-flex items-center justify-center font-medium rounded-md transition-colors duration-150 select-none",
    idle: "bg-gray-100 text-gray-600 hover:bg-gray-200",
    active: "bg-blue-600 text-white shadow-sm",
    nav: "bg-gray-100 text-gray-500 hover:bg-gray-200",
    navDisabled: "bg-gray-50 text-gray-300 cursor-not-allowed pointer-events-none",
    ellipsis: "text-gray-400 bg-transparent",
  },
  pills: {
    wrap: "flex items-center gap-1",
    base: "inline-flex items-center justify-center font-medium rounded-full transition-colors duration-150 select-none",
    idle: "text-gray-600 hover:bg-gray-100",
    active: "bg-blue-600 text-white shadow-sm",
    nav: "text-gray-500 hover:bg-gray-100",
    navDisabled: "text-gray-300 cursor-not-allowed pointer-events-none",
    ellipsis: "text-gray-400",
  },
  ghost: {
    wrap: "flex items-center gap-1",
    base: "inline-flex items-center justify-center font-medium rounded-md transition-colors duration-150 select-none",
    idle: "text-gray-500 hover:text-gray-900",
    active: "text-blue-600 font-bold underline underline-offset-4",
    nav: "text-gray-400 hover:text-gray-700",
    navDisabled: "text-gray-200 cursor-not-allowed pointer-events-none",
    ellipsis: "text-gray-300",
  },
  minimal: {
    wrap: "flex items-center gap-3",
    base: "inline-flex items-center justify-center font-medium transition-colors duration-150 select-none",
    idle: "text-gray-400 hover:text-gray-700 text-sm",
    active: "text-gray-900 font-semibold text-sm",
    nav: "text-gray-400 hover:text-gray-600",
    navDisabled: "text-gray-200 cursor-not-allowed pointer-events-none",
    ellipsis: "text-gray-300",
  },
  brutalist: {
    wrap: "flex items-center gap-0",
    base: "inline-flex items-center justify-center font-black border-[2px] border-black transition-all duration-100 select-none -ml-[2px] first:ml-0",
    idle: "bg-white text-black hover:bg-black hover:text-white",
    active: "bg-black text-white",
    nav: "bg-white text-black hover:bg-black hover:text-white",
    navDisabled: "bg-gray-100 text-gray-300 cursor-not-allowed border-gray-200",
    ellipsis: "bg-white text-black border-[2px] border-black -ml-[2px]",
  },
  aurora: {
    wrap: "flex items-center gap-1",
    base: "inline-flex items-center justify-center font-medium rounded-md transition-colors duration-150 select-none yp-aurora-btn",
    idle: "text-slate-300 hover:text-white hover:bg-white/10",
    active: "yp-aurora-active text-white",
    nav: "text-slate-400 hover:text-white hover:bg-white/10",
    navDisabled: "text-slate-600 cursor-not-allowed pointer-events-none",
    ellipsis: "text-slate-500 yp-aurora-btn",
  },
  neon: {
    wrap: "flex items-center gap-1",
    base: "inline-flex items-center justify-center font-medium rounded-md border transition-colors duration-150 select-none",
    idle: "border-violet-500/30 bg-[#0d0d1a] text-violet-300 hover:border-violet-400/60 hover:text-violet-100",
    active: "border-violet-400 bg-violet-500/20 text-violet-100 yp-neon-active",
    nav: "border-violet-500/30 bg-[#0d0d1a] text-violet-400 hover:border-violet-400/50",
    navDisabled: "border-violet-900/20 bg-[#0d0d1a] text-violet-800 cursor-not-allowed pointer-events-none",
    ellipsis: "text-violet-600 border-transparent bg-transparent",
  },
};

const darkTokens: Record<YPaginationVariant, Tokens> = {
  simple: {
    wrap: "flex items-center gap-1",
    base: "inline-flex items-center justify-center font-medium rounded-md transition-colors duration-150 select-none",
    idle: "text-slate-300 hover:bg-slate-700 hover:text-slate-100",
    active: "bg-blue-600 text-white shadow-sm",
    nav: "text-slate-400 hover:bg-slate-700 hover:text-slate-200",
    navDisabled: "text-slate-600 cursor-not-allowed pointer-events-none",
    ellipsis: "text-slate-500",
  },
  outlined: {
    wrap: "flex items-center gap-1",
    base: "inline-flex items-center justify-center font-medium rounded-md border transition-colors duration-150 select-none",
    idle: "border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-800",
    active: "border-blue-500 bg-blue-900/40 text-blue-300",
    nav: "border-slate-600 text-slate-400 hover:border-slate-500 hover:bg-slate-800",
    navDisabled: "border-slate-700 text-slate-600 cursor-not-allowed pointer-events-none",
    ellipsis: "text-slate-500 border-transparent",
  },
  filled: {
    wrap: "flex items-center gap-1",
    base: "inline-flex items-center justify-center font-medium rounded-md transition-colors duration-150 select-none",
    idle: "bg-slate-700 text-slate-300 hover:bg-slate-600",
    active: "bg-blue-600 text-white shadow-sm",
    nav: "bg-slate-700 text-slate-400 hover:bg-slate-600",
    navDisabled: "bg-slate-800 text-slate-600 cursor-not-allowed pointer-events-none",
    ellipsis: "text-slate-500 bg-transparent",
  },
  pills: {
    wrap: "flex items-center gap-1",
    base: "inline-flex items-center justify-center font-medium rounded-full transition-colors duration-150 select-none",
    idle: "text-slate-300 hover:bg-slate-700",
    active: "bg-blue-600 text-white shadow-sm",
    nav: "text-slate-400 hover:bg-slate-700",
    navDisabled: "text-slate-600 cursor-not-allowed pointer-events-none",
    ellipsis: "text-slate-500",
  },
  ghost: {
    wrap: "flex items-center gap-1",
    base: "inline-flex items-center justify-center font-medium rounded-md transition-colors duration-150 select-none",
    idle: "text-slate-400 hover:text-slate-100",
    active: "text-blue-400 font-bold underline underline-offset-4",
    nav: "text-slate-500 hover:text-slate-300",
    navDisabled: "text-slate-700 cursor-not-allowed pointer-events-none",
    ellipsis: "text-slate-600",
  },
  minimal: {
    wrap: "flex items-center gap-3",
    base: "inline-flex items-center justify-center font-medium transition-colors duration-150 select-none",
    idle: "text-slate-500 hover:text-slate-200 text-sm",
    active: "text-slate-100 font-semibold text-sm",
    nav: "text-slate-500 hover:text-slate-300",
    navDisabled: "text-slate-700 cursor-not-allowed pointer-events-none",
    ellipsis: "text-slate-600",
  },
  brutalist: {
    wrap: "flex items-center gap-0",
    base: "inline-flex items-center justify-center font-black border-[2px] border-black transition-all duration-100 select-none -ml-[2px] first:ml-0",
    idle: "bg-white text-black hover:bg-black hover:text-white",
    active: "bg-black text-white",
    nav: "bg-white text-black hover:bg-black hover:text-white",
    navDisabled: "bg-gray-100 text-gray-300 cursor-not-allowed border-gray-200",
    ellipsis: "bg-white text-black border-[2px] border-black -ml-[2px]",
  },
  aurora: {
    wrap: "flex items-center gap-1",
    base: "inline-flex items-center justify-center font-medium rounded-md transition-colors duration-150 select-none yp-aurora-btn",
    idle: "text-slate-300 hover:text-white hover:bg-white/10",
    active: "yp-aurora-active text-white",
    nav: "text-slate-400 hover:text-white hover:bg-white/10",
    navDisabled: "text-slate-600 cursor-not-allowed pointer-events-none",
    ellipsis: "text-slate-500 yp-aurora-btn",
  },
  neon: {
    wrap: "flex items-center gap-1",
    base: "inline-flex items-center justify-center font-medium rounded-md border transition-colors duration-150 select-none",
    idle: "border-violet-500/30 bg-[#0d0d1a] text-violet-300 hover:border-violet-400/60 hover:text-violet-100",
    active: "border-violet-400 bg-violet-500/20 text-violet-100 yp-neon-active",
    nav: "border-violet-500/30 bg-[#0d0d1a] text-violet-400 hover:border-violet-400/50",
    navDisabled: "border-violet-900/20 bg-[#0d0d1a] text-violet-800 cursor-not-allowed pointer-events-none",
    ellipsis: "text-violet-600 border-transparent bg-transparent",
  },
};

const tok = computed(() =>
  (dk.value ? darkTokens : lightTokens)[props.variant ?? "simple"],
);
</script>

<template>
  <Transition
    appear
    :enter-active-class="appearTx.enterActive"
    :enter-from-class="appearTx.enterFrom"
    :enter-to-class="appearTx.enterTo"
    :leave-active-class="appearTx.leaveActive"
    :leave-from-class="appearTx.leaveFrom"
    :leave-to-class="appearTx.leaveTo"
  >
  <nav
    :aria-label="'Pagination'"
    :class="tok.wrap"
    :style="textColor ? { color: textColor } : undefined"
  >
    <!-- First -->
    <button
      v-if="showFirstLast"
      type="button"
      :disabled="disabled || isFirst"
      :aria-label="'First page'"
      :class="[tok.base, sc.btn, disabled || isFirst ? tok.navDisabled : tok.nav]"
      @click="go(1)"
    >
      <svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0L9 10.414l5.293-5.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zM7 4a1 1 0 00-1 1v10a1 1 0 102 0V5a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
    </button>

    <!-- Prev -->
    <button
      v-if="showPrevNext"
      type="button"
      :disabled="disabled || isFirst"
      :aria-label="'Previous page'"
      :class="[tok.base, sc.btn, disabled || isFirst ? tok.navDisabled : tok.nav]"
      @click="go(current - 1)"
    >
      <svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
    </button>

    <!-- Pages -->
    <template v-for="(page, i) in pages" :key="i">
      <!-- Ellipsis -->
      <span
        v-if="page === null"
        :class="[tok.base, tok.ellipsis, sc.ellipsis]"
        aria-hidden="true"
      >
        &hellip;
      </span>

      <!-- Page button -->
      <button
        v-else
        type="button"
        :disabled="disabled"
        :aria-label="`Page ${page}`"
        :aria-current="page === current ? 'page' : undefined"
        :class="[tok.base, sc.btn, page === current ? tok.active : (disabled ? tok.navDisabled : tok.idle)]"
        @click="go(page)"
      >
        {{ page }}
      </button>
    </template>

    <!-- Next -->
    <button
      v-if="showPrevNext"
      type="button"
      :disabled="disabled || isLast"
      :aria-label="'Next page'"
      :class="[tok.base, sc.btn, disabled || isLast ? tok.navDisabled : tok.nav]"
      @click="go(current + 1)"
    >
      <svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
      </svg>
    </button>

    <!-- Last -->
    <button
      v-if="showFirstLast"
      type="button"
      :disabled="disabled || isLast"
      :aria-label="'Last page'"
      :class="[tok.base, sc.btn, disabled || isLast ? tok.navDisabled : tok.nav]"
      @click="go(totalPages ?? 1)"
    >
      <svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L11 9.586l-5.293 5.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414zM13 4a1 1 0 011 1v10a1 1 0 11-2 0V5a1 1 0 011-1z" clip-rule="evenodd" />
      </svg>
    </button>
  </nav>
  </Transition>
</template>

<style scoped>
/* ── Aurora ── */
.yp-aurora-btn {
  background: linear-gradient(135deg, #0f0f2e, #0a1a2e);
  border: 1px solid rgba(124, 58, 237, 0.3);
}
.yp-aurora-active {
  background: linear-gradient(135deg, #7c3aed, #2563eb) !important;
  border-color: transparent !important;
  box-shadow: 0 0 12px rgba(124, 58, 237, 0.5);
}

/* ── Neon ── */
.yp-neon-active {
  box-shadow: 0 0 10px rgba(167, 139, 250, 0.5), inset 0 0 8px rgba(167, 139, 250, 0.1);
}
</style>
