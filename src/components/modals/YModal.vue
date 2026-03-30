<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, useSlots, watch } from "vue";
import { useDarkMode } from "@/composables/useDarkMode";
import type {
  YModalProps,
  YModalVariant,
  YModalSize,
  YModalPosition,
  YModalBackdrop,
  YModalPadding,
  YModalVariantTokens,
} from "@/types/modal";

defineOptions({ name: "YModal", inheritAttrs: false });

const props = withDefaults(defineProps<YModalProps>(), {
  teleportTo: "body",
  variant: "clean",
  size: "md",
  position: "center",
  backdrop: "blur",
  title: undefined,
  description: undefined,
  showClose: true,
  persistent: false,
  rounded: true,
  padding: "md",
  fullHeight: false,
  scrollable: true,
  loading: false,
  danger: false,
});

const emit = defineEmits<{
  close: [];
  "update:open": [value: boolean];
}>();

const dk = useDarkMode(props.dark);

const uncontrolledOpen = ref(props.open ?? true);
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
    if (next !== undefined) {
      uncontrolledOpen.value = Boolean(next);
    }
  },
);

function setOpen(value: boolean) {
  if (!isControlled.value) {
    uncontrolledOpen.value = value;
  }
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
const dialogRef = ref<HTMLElement | null>(null);
let previouslyFocusedEl: HTMLElement | null = null;

function getFocusableElements(): HTMLElement[] {
  if (!dialogRef.value) return [];
  const els = dialogRef.value.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  return Array.from(els);
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
  const map: Record<YModalBackdrop, string> = {
    blur: "bg-black/40 backdrop-blur-sm",
    dim: "bg-black/60",
    none: "bg-transparent",
    frosted: "bg-white/10 backdrop-blur-md",
  };
  return map[props.backdrop];
});

/* ── Size → max-width ── */
const sizeClass = computed<string>(() => {
  const isDrawer =
    props.position === "drawer-right" || props.position === "drawer-left";
  const isFull = props.position === "bottom";
  if (isDrawer) return "w-full max-w-md";
  const map: Record<YModalSize, string> = {
    xs: "w-full max-w-xs",
    sm: "w-full max-w-sm",
    md: "w-full max-w-md",
    lg: "w-full max-w-lg",
    xl: "w-full max-w-xl",
    "2xl": "w-full max-w-2xl",
    full: "w-full max-w-none",
  };
  return isFull ? "w-full max-w-none" : map[props.size];
});

/* ── Padding ── */
const paddingClass = computed<string>(() => {
  const map: Record<YModalPadding, string> = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };
  return map[props.padding];
});

const headerPaddingClass = computed<string>(() => {
  const map: Record<YModalPadding, string> = {
    none: "px-0 py-0",
    sm: "px-4 pt-4 pb-3",
    md: "px-6 pt-5 pb-4",
    lg: "px-8 pt-6 pb-5",
  };
  return map[props.padding];
});

const footerPaddingClass = computed<string>(() => {
  const map: Record<YModalPadding, string> = {
    none: "px-0 py-0",
    sm: "px-4 py-3",
    md: "px-6 py-4",
    lg: "px-8 py-5",
  };
  return map[props.padding];
});

/* ── Variant tokens ── */
const variants: Record<YModalVariant, YModalVariantTokens> = {
  clean: {
    shell:
      "bg-white ring-1 ring-slate-900/6 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.45)]",
    header: "",
    separator: "border-b border-gray-100",
    footer: "border-t border-gray-100 bg-gray-50/70",
    title: "text-slate-900 font-semibold text-[1.03rem] tracking-tight",
    description: "text-slate-500 text-sm leading-relaxed",
    closeBtn: "text-slate-400 hover:text-slate-700 hover:bg-slate-100",
    closeBtnHover: "",
    spinner: "border-gray-200 border-t-indigo-500",
    loadingOverlay: "bg-white/80 backdrop-blur-sm",
  },
  glass: {
    shell:
      "bg-white/72 backdrop-blur-2xl border border-white/60 ring-1 ring-white/35 shadow-[0_20px_48px_-24px_rgba(30,41,59,0.45)]",
    header: "",
    separator: "border-b border-white/30",
    footer: "border-t border-white/30 bg-white/20",
    title: "text-slate-900 font-semibold text-[1.03rem] tracking-tight",
    description: "text-slate-500 text-sm leading-relaxed",
    closeBtn: "text-slate-400 hover:text-slate-700 hover:bg-white/70",
    closeBtnHover: "",
    spinner: "border-white/30 border-t-blue-400",
    loadingOverlay: "bg-white/60 backdrop-blur-md",
  },
  dark: {
    shell:
      "bg-slate-950 border border-slate-800/80 shadow-[0_22px_52px_-24px_rgba(2,6,23,0.9)]",
    header: "",
    separator: "border-b border-white/5",
    footer: "border-t border-white/5 bg-white/[0.02]",
    title: "text-slate-100 font-semibold text-[1.03rem] tracking-tight",
    description: "text-slate-400 text-sm leading-relaxed",
    closeBtn: "text-slate-500 hover:text-white hover:bg-slate-800",
    closeBtnHover: "",
    spinner: "border-white/10 border-t-indigo-400",
    loadingOverlay: "bg-gray-950/80 backdrop-blur-sm",
  },
  ink: {
    shell: "bg-slate-900 border border-slate-700 shadow-2xl",
    header: "",
    separator: "border-b border-slate-800",
    footer: "border-t border-slate-800 bg-slate-800/40",
    title: "text-slate-100 font-semibold text-base",
    description: "text-slate-400 text-sm",
    closeBtn: "text-slate-400 hover:text-teal-400 hover:bg-slate-800",
    closeBtnHover: "",
    spinner: "border-slate-700 border-t-teal-400",
    loadingOverlay: "bg-slate-900/80 backdrop-blur-sm",
  },
  aurora: {
    shell:
      "bg-gradient-to-br from-violet-950 to-slate-900 border border-violet-800/40 shadow-2xl",
    header: "",
    separator: "border-b border-violet-800/30",
    footer: "border-t border-violet-800/30 bg-violet-950/40",
    title:
      "text-white font-semibold text-base drop-shadow-[0_0_12px_rgba(167,139,250,0.4)]",
    description: "text-violet-300/70 text-sm",
    closeBtn: "text-violet-400 hover:text-violet-200 hover:bg-violet-500/20",
    closeBtnHover: "",
    spinner: "border-violet-900 border-t-violet-400",
    loadingOverlay: "bg-violet-950/80 backdrop-blur-sm",
  },
  warm: {
    shell:
      "bg-stone-50 border border-stone-200/90 shadow-[0_20px_44px_-26px_rgba(120,53,15,0.36)]",
    header: "",
    separator: "border-b border-stone-100",
    footer: "border-t border-stone-100 bg-stone-100/60",
    title: "text-stone-900 font-semibold text-[1.03rem] tracking-tight",
    description: "text-stone-500 text-sm leading-relaxed",
    closeBtn: "text-stone-400 hover:text-stone-700 hover:bg-stone-200",
    closeBtnHover: "",
    spinner: "border-stone-200 border-t-orange-400",
    loadingOverlay: "bg-stone-50/80 backdrop-blur-sm",
  },
  brutalist: {
    shell: "bg-yellow-300 border-4 border-black shadow-[8px_8px_0px_0px_#000]",
    header: "",
    separator: "border-b-4 border-black",
    footer: "border-t-4 border-black bg-yellow-200",
    title: "text-black font-black text-xl uppercase tracking-tight",
    description: "text-black/70 text-sm font-bold",
    closeBtn:
      "text-black hover:bg-black hover:text-yellow-300 border-2 border-black rounded-none font-black",
    closeBtnHover: "",
    spinner: "border-yellow-200 border-t-black",
    loadingOverlay: "bg-yellow-300/80",
  },
  minimal: {
    shell:
      "bg-white ring-1 ring-slate-900/6 shadow-[0_16px_36px_-26px_rgba(15,23,42,0.42)]",
    header: "",
    separator: "",
    footer: "bg-gray-50/50",
    title: "text-slate-700 font-medium text-[1rem] tracking-tight",
    description: "text-slate-400 text-sm leading-relaxed",
    closeBtn: "text-gray-300 hover:text-gray-600 hover:bg-gray-50",
    closeBtnHover: "",
    spinner: "border-gray-100 border-t-gray-400",
    loadingOverlay: "bg-white/80 backdrop-blur-sm",
  },
};

const vt = computed(() => {
  // If dark prop is set and variant is light-themed, use dark tokens instead
  if (dk.value && ['clean', 'glass', 'warm', 'minimal'].includes(props.variant)) {
    return variants.dark;
  }
  return variants[props.variant];
});

/* ── Danger overrides ── */
const titleClass = computed(() => {
  if (props.danger) {
    const lightVariants: YModalVariant[] = [
      "clean",
      "glass",
      "warm",
      "minimal",
      "brutalist",
    ];
    if (lightVariants.includes(props.variant))
      return vt.value.title + " !text-red-600";
  }
  return vt.value.title;
});

const closeBtnClass = computed(() => {
  const base =
    "inline-flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current/30";
  if (props.danger)
    return base + " text-red-400 hover:text-red-600 hover:bg-red-50";
  return `${base} ${vt.value.closeBtn}`;
});

/* ── Radius ── */
const radiusClass = computed<string>(() => {
  if (!props.rounded) return "rounded-none";
  const isBottom = props.position === "bottom";
  const isDrawerR = props.position === "drawer-right";
  const isDrawerL = props.position === "drawer-left";
  if (isBottom) return "rounded-t-2xl";
  if (isDrawerR) return "rounded-l-2xl";
  if (isDrawerL) return "rounded-r-2xl";
  if (props.variant === "brutalist") return "rounded-none";
  return "rounded-2xl";
});

/* ── Wrapper alignment ── */
const wrapperClass = computed<string>(() => {
  const p = props.position;
  if (p === "center") return "flex items-center justify-center p-4";
  if (p === "top") return "flex items-start justify-center pt-8 px-4";
  if (p === "bottom") return "flex items-end justify-center";
  if (p === "drawer-right") return "flex items-stretch justify-end";
  if (p === "drawer-left") return "flex items-stretch justify-start";
  return "flex items-center justify-center p-4";
});

const overlayClass = computed<string>(() =>
  isInline.value ? "absolute inset-0 z-20" : "fixed inset-0 z-50",
);

const shellHeightClass = computed<string>(() => {
  const p = props.position;
  if (p === "drawer-right" || p === "drawer-left" || props.fullHeight)
    return "h-full";
  if (p === "bottom") return "";
  return "";
});

/* ── Enter/leave transitions ── */
const enterFrom = computed<string>(() => {
  const p = props.position;
  if (p === "center") return "opacity-0 scale-95";
  if (p === "top") return "opacity-0 -translate-y-4";
  if (p === "bottom") return "opacity-0 translate-y-4";
  if (p === "drawer-right") return "opacity-0 translate-x-full";
  if (p === "drawer-left") return "opacity-0 -translate-x-full";
  return "opacity-0 scale-95";
});

const enterTo = computed<string>(() => {
  const p = props.position;
  if (p === "center") return "opacity-100 scale-100";
  if (p === "top") return "opacity-100 translate-y-0";
  if (p === "bottom") return "opacity-100 translate-y-0";
  if (p === "drawer-right") return "opacity-100 translate-x-0";
  if (p === "drawer-left") return "opacity-100 translate-x-0";
  return "opacity-100 scale-100";
});

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
          enter-active-class="transition duration-250 ease-out"
          :enter-from-class="enterFrom"
          :enter-to-class="enterTo"
          leave-active-class="transition duration-180 ease-in"
          :leave-from-class="enterTo"
          :leave-to-class="enterFrom"
          appear
        >
          <div
            v-if="isOpen"
            ref="dialogRef"
            class="relative flex flex-col overflow-hidden"
            :class="[
              vt.shell,
              sizeClass,
              radiusClass,
              shellHeightClass,
              size === 'full' ? 'w-screen h-screen rounded-none' : '',
            ]"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="title ? 'modal-title' : undefined"
            :aria-describedby="description ? 'modal-desc' : undefined"
            @click.stop
          >
            <!-- Header -->
            <div
              v-if="hasHeader"
              :class="[
                'shrink-0 flex items-start justify-between gap-4',
                headerPaddingClass,
                vt.separator,
                $slots.footer ? '' : '',
              ]"
            >
              <slot name="header">
                <div class="flex-1 min-w-0">
                  <h2 v-if="title" id="modal-title" :class="titleClass">
                    {{ title }}
                  </h2>
                  <p
                    v-if="description"
                    id="modal-desc"
                    :class="['mt-1', vt.description]"
                  >
                    {{ description }}
                  </p>
                </div>
              </slot>

              <button
                v-if="showClose"
                type="button"
                :class="closeBtnClass"
                aria-label="Close dialog"
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
