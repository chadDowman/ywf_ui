<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  useSlots,
  watch,
} from "vue";
import { useDarkMode } from "@/composables/useDarkMode";
import { useAnimation } from "@/composables/useAnimation";
import { getOverlayAnimationClasses } from "@/types/animation";
import type {
  YDrawerProps,
  YDrawerVariant,
  YDrawerSize,
  YDrawerSide,
  YDrawerBackdrop,
  YDrawerPadding,
  YDrawerVariantTokens,
} from "@/types/drawer";

defineOptions({ name: "YDrawer", inheritAttrs: false });

const props = withDefaults(defineProps<YDrawerProps>(), {
  teleportTo: "body",
  variant: "clean",
  side: "right",
  size: "md",
  backdrop: "blur",
  title: undefined,
  description: undefined,
  showClose: true,
  persistent: false,
  padding: "md",
  scrollable: true,
  loading: false,
  animation: undefined,
});

const anim = useAnimation(() => props.animation);

const emit = defineEmits<{
  close: [];
  "update:open": [value: boolean];
}>();

const dk = useDarkMode(props.dark);

const uncontrolledOpen = ref(props.open ?? false);
const isControlled = computed(() => props.open !== undefined);
const isOpen = computed(() =>
  isControlled.value ? Boolean(props.open) : uncontrolledOpen.value,
);
const isInline = computed(() => props.teleportTo === false);
const teleportTarget = computed(() =>
  typeof props.teleportTo === "string" && props.teleportTo
    ? props.teleportTo
    : "body",
);

watch(
  () => props.open,
  (next) => {
    if (next !== undefined) uncontrolledOpen.value = Boolean(next);
  },
);

function setOpen(value: boolean) {
  if (!isControlled.value) uncontrolledOpen.value = value;
  emit("update:open", value);
}

function close() {
  emit("close");
  setOpen(false);
}

function onBackdropClick() {
  if (!props.persistent) close();
}

/* ── Focus trap ── */
const drawerRef = ref<HTMLElement | null>(null);
let previouslyFocusedEl: HTMLElement | null = null;

function getFocusableElements(): HTMLElement[] {
  if (!drawerRef.value) return [];
  return Array.from(
    drawerRef.value.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  );
}

function trapFocus(e: KeyboardEvent) {
  if (e.key !== "Tab" || !isOpen.value) return;
  const focusable = getFocusableElements();
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey) {
    if (document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
  } else {
    if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape" && isOpen.value && !props.persistent) close();
  trapFocus(e);
}

watch(isOpen, async (val) => {
  if (val) {
    previouslyFocusedEl = document.activeElement as HTMLElement | null;
    await nextTick();
    const focusable = getFocusableElements();
    if (focusable.length) focusable[0].focus();
  } else if (previouslyFocusedEl) {
    previouslyFocusedEl.focus();
    previouslyFocusedEl = null;
  }
});

onMounted(() => document.addEventListener("keydown", onKeydown));
onUnmounted(() => document.removeEventListener("keydown", onKeydown));

/* ── Backdrop ── */
const backdropClass = computed<string>(() => {
  const map: Record<YDrawerBackdrop, string> = {
    blur: "bg-black/40 backdrop-blur-sm",
    dim: "bg-black/60",
    none: "bg-transparent pointer-events-none",
    frosted: "bg-white/10 backdrop-blur-md",
  };
  return map[props.backdrop];
});

/* ── Size ── */
const sizeClass = computed<string>(() => {
  const side = props.side ?? "right";
  const isHorizontal = side === "left" || side === "right";

  const map: Record<YDrawerSize, string> = {
    xs: isHorizontal ? "w-64" : "h-32",
    sm: isHorizontal ? "w-72" : "h-48",
    md: isHorizontal ? "w-80" : "h-64",
    lg: isHorizontal ? "w-96" : "h-80",
    xl: isHorizontal ? "w-[28rem]" : "h-96",
    "2xl": isHorizontal ? "w-[36rem]" : "h-[28rem]",
    full: isHorizontal ? "w-screen" : "h-screen",
  };
  return map[props.size ?? "md"];
});

/* ── Padding ── */
const paddingClass = computed<string>(() => {
  const map: Record<YDrawerPadding, string> = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };
  return map[props.padding];
});

const headerPaddingClass = computed<string>(() => {
  const map: Record<YDrawerPadding, string> = {
    none: "px-0 py-0",
    sm: "px-4 pt-4 pb-3",
    md: "px-6 pt-5 pb-4",
    lg: "px-8 pt-6 pb-5",
  };
  return map[props.padding];
});

const footerPaddingClass = computed<string>(() => {
  const map: Record<YDrawerPadding, string> = {
    none: "px-0 py-0",
    sm: "px-4 py-3",
    md: "px-6 py-4",
    lg: "px-8 py-5",
  };
  return map[props.padding];
});

/* ── Wrapper alignment ── */
const wrapperClass = computed<string>(() => {
  const s = props.side ?? "right";
  if (s === "right") return "flex items-stretch justify-end";
  if (s === "left") return "flex items-stretch justify-start";
  if (s === "top") return "flex items-start justify-stretch";
  if (s === "bottom") return "flex items-end justify-stretch";
  return "flex items-stretch justify-end";
});

const shellClass = computed<string>(() => {
  const s = props.side ?? "right";
  const isHorizontal = s === "left" || s === "right";
  return isHorizontal ? "h-full" : "w-full";
});

/* ── Radius ── */
const radiusClass = computed<string>(() => {
  if (props.variant === "brutalist") return "rounded-none";
  const s = props.side ?? "right";
  if (s === "right") return "rounded-l-2xl";
  if (s === "left") return "rounded-r-2xl";
  if (s === "top") return "rounded-b-2xl";
  if (s === "bottom") return "rounded-t-2xl";
  return "rounded-l-2xl";
});

/* ── Enter/leave transitions ── */
const panelTransition = computed(() => {
  const a = anim.value;
  const s = props.side ?? "right";

  // "auto" or "slide": direction-aware slide (original behavior)
  if (a === "auto" || a === "slide") {
    type R = { enterFrom: string; enterTo: string };
    const map: Record<YDrawerSide, R> = {
      right: { enterFrom: "opacity-0 translate-x-full", enterTo: "opacity-100 translate-x-0" },
      left: { enterFrom: "opacity-0 -translate-x-full", enterTo: "opacity-100 translate-x-0" },
      top: { enterFrom: "opacity-0 -translate-y-full", enterTo: "opacity-100 translate-y-0" },
      bottom: { enterFrom: "opacity-0 translate-y-full", enterTo: "opacity-100 translate-y-0" },
    };
    const { enterFrom, enterTo } = map[s];
    return {
      enterActive: "transition duration-300 ease-out",
      enterFrom,
      enterTo,
      leaveActive: "transition duration-200 ease-in",
      leaveFrom: enterTo,
      leaveTo: enterFrom,
    };
  }

  // Explicit preset
  const dirMap: Record<YDrawerSide, "up" | "down" | "left" | "right"> = {
    right: "right",
    left: "left",
    top: "up",
    bottom: "down",
  };
  return getOverlayAnimationClasses(a, dirMap[s]);
});

/* ── Variant tokens ── */
const variants: Record<YDrawerVariant, YDrawerVariantTokens> = {
  clean: {
    shell:
      "bg-white ring-1 ring-slate-900/6 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.45)]",
    separator: "border-b border-gray-100",
    footer: "border-t border-gray-100 bg-gray-50/70",
    title: "text-slate-900 font-semibold text-[1.03rem] tracking-tight",
    description: "text-slate-500 text-sm leading-relaxed",
    closeBtn: "text-slate-400 hover:text-slate-700 hover:bg-slate-100",
    spinner: "border-gray-200 border-t-indigo-500",
    loadingOverlay: "bg-white/80 backdrop-blur-sm",
  },
  glass: {
    shell:
      "bg-white/72 backdrop-blur-2xl border border-white/60 ring-1 ring-white/35 shadow-[0_20px_48px_-24px_rgba(30,41,59,0.45)]",
    separator: "border-b border-white/30",
    footer: "border-t border-white/30 bg-white/20",
    title: "text-slate-900 font-semibold text-[1.03rem] tracking-tight",
    description: "text-slate-500 text-sm leading-relaxed",
    closeBtn: "text-slate-400 hover:text-slate-700 hover:bg-white/70",
    spinner: "border-white/30 border-t-blue-400",
    loadingOverlay: "bg-white/60 backdrop-blur-md",
  },
  dark: {
    shell:
      "bg-slate-950 border border-slate-800/80 shadow-[0_22px_52px_-24px_rgba(2,6,23,0.9)]",
    separator: "border-b border-white/5",
    footer: "border-t border-white/5 bg-white/[0.02]",
    title: "text-slate-100 font-semibold text-[1.03rem] tracking-tight",
    description: "text-slate-400 text-sm leading-relaxed",
    closeBtn: "text-slate-500 hover:text-white hover:bg-slate-800",
    spinner: "border-white/10 border-t-indigo-400",
    loadingOverlay: "bg-gray-950/80 backdrop-blur-sm",
  },
  ink: {
    shell: "bg-slate-900 border border-slate-700 shadow-2xl",
    separator: "border-b border-slate-800",
    footer: "border-t border-slate-800 bg-slate-800/40",
    title: "text-slate-100 font-semibold text-base",
    description: "text-slate-400 text-sm",
    closeBtn: "text-slate-400 hover:text-teal-400 hover:bg-slate-800",
    spinner: "border-slate-700 border-t-teal-400",
    loadingOverlay: "bg-slate-900/80 backdrop-blur-sm",
  },
  aurora: {
    shell:
      "bg-gradient-to-br from-violet-950 to-slate-900 border border-violet-800/40 shadow-2xl",
    separator: "border-b border-violet-800/30",
    footer: "border-t border-violet-800/30 bg-violet-950/40",
    title:
      "text-white font-semibold text-base drop-shadow-[0_0_12px_rgba(167,139,250,0.4)]",
    description: "text-violet-300/70 text-sm",
    closeBtn: "text-violet-400 hover:text-violet-200 hover:bg-violet-500/20",
    spinner: "border-violet-900 border-t-violet-400",
    loadingOverlay: "bg-violet-950/80 backdrop-blur-sm",
  },
  warm: {
    shell:
      "bg-stone-50 border border-stone-200/90 shadow-[0_20px_44px_-26px_rgba(120,53,15,0.36)]",
    separator: "border-b border-stone-100",
    footer: "border-t border-stone-100 bg-stone-100/60",
    title: "text-stone-900 font-semibold text-[1.03rem] tracking-tight",
    description: "text-stone-500 text-sm leading-relaxed",
    closeBtn: "text-stone-400 hover:text-stone-700 hover:bg-stone-200",
    spinner: "border-stone-200 border-t-orange-400",
    loadingOverlay: "bg-stone-50/80 backdrop-blur-sm",
  },
  brutalist: {
    shell: "bg-yellow-300 border-4 border-black shadow-[8px_8px_0px_0px_#000]",
    separator: "border-b-4 border-black",
    footer: "border-t-4 border-black bg-yellow-200",
    title: "text-black font-black text-xl uppercase tracking-tight",
    description: "text-black/70 text-sm font-bold",
    closeBtn:
      "text-black hover:bg-black hover:text-yellow-300 border-2 border-black rounded-none font-black",
    spinner: "border-yellow-200 border-t-black",
    loadingOverlay: "bg-yellow-300/80",
  },
  minimal: {
    shell:
      "bg-white ring-1 ring-slate-900/6 shadow-[0_16px_36px_-26px_rgba(15,23,42,0.42)]",
    separator: "",
    footer: "bg-gray-50/50",
    title: "text-slate-700 font-medium text-[1rem] tracking-tight",
    description: "text-slate-400 text-sm leading-relaxed",
    closeBtn: "text-gray-300 hover:text-gray-600 hover:bg-gray-50",
    spinner: "border-gray-100 border-t-gray-400",
    loadingOverlay: "bg-white/80 backdrop-blur-sm",
  },
};

const vt = computed(() => {
  if (
    dk.value &&
    ["clean", "glass", "warm", "minimal"].includes(props.variant)
  ) {
    return variants.dark;
  }
  return variants[props.variant];
});

const overlayClass = computed<string>(() =>
  isInline.value ? "absolute inset-0 z-20" : "fixed inset-0 z-50",
);

const slots = useSlots();
const hasHeader = computed(
  () => props.title || props.description || slots.header || props.showClose,
);
</script>

<template>
  <Teleport :to="teleportTarget" :disabled="isInline">
    <Transition
      enter-active-class="transition duration-250 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-180 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        :class="[overlayClass, backdropClass, wrapperClass]"
        @click.self="onBackdropClick"
      >
        <Transition
          :enter-active-class="panelTransition.enterActive"
          :enter-from-class="panelTransition.enterFrom"
          :enter-to-class="panelTransition.enterTo"
          :leave-active-class="panelTransition.leaveActive"
          :leave-from-class="panelTransition.leaveFrom"
          :leave-to-class="panelTransition.leaveTo"
          appear
        >
          <div
            v-if="isOpen"
            ref="drawerRef"
            class="relative flex flex-col overflow-hidden"
            :class="[vt.shell, sizeClass, shellClass, radiusClass]"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="title ? 'drawer-title' : undefined"
            :aria-describedby="description ? 'drawer-desc' : undefined"
            @click.stop
          >
            <!-- Header -->
            <div
              v-if="hasHeader"
              :class="[
                'shrink-0 flex items-start justify-between gap-4',
                headerPaddingClass,
                vt.separator,
              ]"
            >
              <slot name="header">
                <div class="flex-1 min-w-0">
                  <h2
                    v-if="title"
                    id="drawer-title"
                    :class="vt.title"
                  >
                    {{ title }}
                  </h2>
                  <p
                    v-if="description"
                    id="drawer-desc"
                    :class="['mt-1', vt.description]"
                  >
                    {{ description }}
                  </p>
                </div>
              </slot>

              <button
                v-if="showClose"
                type="button"
                :class="[
                  'inline-flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current/30 shrink-0',
                  vt.closeBtn,
                ]"
                aria-label="Close drawer"
                @click="close"
              >
                <svg
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  class="w-3.5 h-3.5"
                  aria-hidden="true"
                >
                  <path d="M2 2l10 10M12 2L2 12" />
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div
              :class="[
                'flex-1 min-h-0',
                scrollable ? 'overflow-y-auto' : 'overflow-hidden',
                hasHeader && $slots.default ? paddingClass : '',
                !hasHeader ? paddingClass : '',
              ]"
            >
              <slot />
            </div>

            <!-- Footer -->
            <div
              v-if="$slots.footer"
              :class="['shrink-0', footerPaddingClass, vt.footer]"
            >
              <slot name="footer" />
            </div>

            <!-- Loading overlay -->
            <Transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="opacity-0"
              enter-to-class="opacity-100"
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <div
                v-if="loading"
                class="absolute inset-0 z-10 flex items-center justify-center"
                :class="[vt.loadingOverlay, radiusClass]"
                aria-label="Loading"
                role="status"
              >
                <span
                  class="w-7 h-7 rounded-full border-[3px] animate-spin block"
                  :class="vt.spinner"
                />
              </div>
            </Transition>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
