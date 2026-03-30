<script setup lang="ts">
import { ref, computed, watch, nextTick, onBeforeUnmount } from "vue";
import { useDarkMode } from "@/composables/useDarkMode";

defineOptions({ name: "YNavbar" });
import type {
  YNavbarProps,
  YNavbarLink,
  YNavbarAction,
  YNavbarVariant,
  YNavbarAlign,
} from "@/types/navbar";

const props = withDefaults(defineProps<YNavbarProps>(), {
  brand: "Brand",
  variant: "solid",
  sticky: false,
  elevated: false,
  transparent: false,
  showCta: false,
  ctaLabel: "Get Started",
  mobileMenu: true,
  align: "right",
  showSearch: false,
  searchPlaceholder: "Search…",
});

const emit = defineEmits<{
  (e: "navigate", link: YNavbarLink): void;
  (e: "ctaClick"): void;
  (e: "brandClick"): void;
  (e: "search", query: string): void;
  (e: "action", action: YNavbarAction): void;
}>();

const mobileOpen = ref(false);
const searchQuery = ref("");
const hamburgerRef = ref<HTMLButtonElement | null>(null);
const mobilePanelRef = ref<HTMLElement | null>(null);

const dk = useDarkMode(props.dark);

function toggleMobile() {
  mobileOpen.value = !mobileOpen.value;
}

watch(mobileOpen, (isOpen) => {
  if (isOpen) {
    nextTick(() => {
      const firstLink = mobilePanelRef.value?.querySelector<HTMLElement>(
        "button:not([disabled]), a:not([disabled])",
      );
      firstLink?.focus();
    });
  } else {
    hamburgerRef.value?.focus();
  }
});

function onMobilePanelKeydown(e: KeyboardEvent) {
  if (e.key !== "Tab" || !mobilePanelRef.value) return;
  const focusable = Array.from(
    mobilePanelRef.value.querySelectorAll<HTMLElement>(
      "button:not([disabled]), a:not([disabled]), input:not([disabled])",
    ),
  );
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

function handleNav(link: YNavbarLink) {
  if (link.disabled) return;
  emit("navigate", link);
  mobileOpen.value = false;
}

function handleAction(action: YNavbarAction) {
  if (action.disabled) return;
  emit("action", action);
}

function handleSearch() {
  emit("search", searchQuery.value);
}

// --- Variants that use light (white) text on dark backgrounds ---
const lightTextVariants = new Set<YNavbarVariant>([
  "gradient",
  "enterprise",
  "terminal",
  "luxury",
]);

const isLightText = computed(() => dk.value || lightTextVariants.has(props.variant));

// --- Variant class map ---

const variantClasses = computed<Record<YNavbarVariant, string>>(() => {
  const d = dk.value;
  return {
    // Original 8
    solid: d
      ? "bg-slate-900/92 border-b border-slate-700 text-slate-100 supports-[backdrop-filter]:backdrop-blur-xl"
      : "bg-white/92 border-b border-slate-200 text-slate-800 supports-[backdrop-filter]:backdrop-blur-xl",
    outline: d
      ? "bg-slate-900/70 border border-slate-600 text-slate-100 supports-[backdrop-filter]:backdrop-blur-md"
      : "bg-white/70 border border-slate-300 text-slate-800 supports-[backdrop-filter]:backdrop-blur-md",
    ghost: d ? "bg-transparent text-slate-200" : "bg-transparent text-slate-700",
    glass: d
      ? "bg-slate-900/55 backdrop-blur-xl border-b border-slate-700/50 text-slate-100"
      : "bg-white/55 backdrop-blur-xl border-b border-white/50 text-slate-800",
    gradient: "bg-gradient-to-r from-blue-600 to-cyan-500 text-white",
    minimal: d ? "bg-transparent text-slate-300" : "bg-transparent text-gray-600",
    bordered: d
      ? "bg-slate-900 border-b-2 border-indigo-500 text-slate-100"
      : "bg-white border-b-2 border-indigo-500 text-gray-800",
    floating: d
      ? "bg-slate-900/95 rounded-2xl shadow-xl border border-slate-700 text-slate-100 mx-4 mt-3 supports-[backdrop-filter]:backdrop-blur-md"
      : "bg-white/95 rounded-2xl shadow-xl border border-slate-200 text-slate-800 mx-4 mt-3 supports-[backdrop-filter]:backdrop-blur-md",

    // New 12
    editorial: d
      ? "bg-slate-900 border-b border-slate-600 text-slate-100"
      : "bg-white border-b border-gray-900 text-gray-900",
    startup: "bg-gray-950 text-white border-b border-gray-800",
    brutalist: "bg-yellow-300 border-b-4 border-black text-black",
    luxury: "bg-gray-950 text-amber-100 border-b border-amber-700/40",
    retro: "bg-orange-50 border-b-2 border-orange-800 text-orange-900",
    enterprise: "bg-slate-800 text-slate-100 border-b border-slate-700",
    terminal: "bg-gray-950 text-green-400 border-b border-green-900/60",
    pill: d
      ? "bg-slate-800 rounded-full border border-slate-600 text-slate-100 mx-6 mt-3"
      : "bg-gray-100 rounded-full border border-gray-200 text-gray-800 mx-6 mt-3",
    split: d
      ? "bg-slate-900 border-b border-slate-700 text-slate-100"
      : "bg-white border-b border-gray-200 text-gray-800",
    stacked: d
      ? "bg-slate-900 border-b border-slate-700 text-slate-100"
      : "bg-white border-b border-gray-200 text-gray-800",
    "sidebar-header": d
      ? "bg-slate-800 border-b border-slate-700 text-slate-100"
      : "bg-gray-50 border-b border-gray-200 text-gray-800",
    topbar: "bg-indigo-600 text-white",
  };
});

// --- Per-variant nav wrapper classes ---

const navClasses = computed(() => {
  const v = props.variant;
  const base = [
    "relative w-full transition-all duration-250",
    variantClasses.value[v],
    props.sticky ? "sticky top-0 z-50" : "",
    props.elevated && v !== "floating" && v !== "pill" ? "shadow-md" : "",
    props.transparent ? "!bg-transparent" : "",
  ];

  // Stacked variant uses flex-col; others use row layout
  if (v === "stacked") {
    base.push("flex flex-col");
  } else {
    base.push("flex items-center justify-between");
  }

  // Per-variant padding rhythms
  const paddingMap: Partial<Record<YNavbarVariant, string>> = {
    editorial: "px-8 py-4",
    luxury: "px-10 py-4",
    brutalist: "px-5 py-2",
    retro: "px-6 py-2.5",
    terminal: "px-4 py-2",
    pill: "px-6 py-2",
    enterprise: "px-8 py-3",
    stacked: "px-6 pt-4 pb-0",
    topbar: "px-6 py-2",
  };
  base.push(paddingMap[v] ?? "px-6 py-3");

  return base;
});

// --- Brand classes per variant ---

const brandClass = computed(() => {
  const v = props.variant;
  const map: Partial<Record<YNavbarVariant, string>> = {
    editorial: "text-gray-900 text-xl font-serif font-bold tracking-tight",
    luxury: "text-amber-100 text-lg font-light tracking-[0.25em] uppercase",
    brutalist: "text-black text-lg font-black uppercase",
    retro: "text-orange-900 text-lg font-bold italic",
    terminal: "text-green-400 font-mono text-sm",
    startup: "text-white text-base font-bold",
    enterprise: "text-white text-base font-semibold",
    topbar: "text-white text-sm font-bold uppercase tracking-wide",
    pill: "text-gray-900 text-sm font-bold",
  };
  return map[v] ?? (isLightText.value ? "text-white" : "text-gray-900");
});

// --- Link classes per variant ---

const linkBaseClass = computed(() => {
  const v = props.variant;
  const map: Partial<Record<YNavbarVariant, string>> = {
    editorial:
      "text-gray-500 hover:text-gray-900 text-sm tracking-wide uppercase font-medium rounded-none border-b-2 border-transparent hover:border-gray-900 px-0 mx-3 py-1",
    luxury:
      "text-amber-200/60 hover:text-amber-100 text-xs tracking-[0.15em] uppercase px-4 py-1",
    brutalist:
      "text-black hover:bg-black hover:text-yellow-300 text-sm font-bold uppercase px-3 py-1.5 rounded-none",
    retro:
      "text-orange-800 hover:bg-orange-800 hover:text-orange-50 text-sm font-semibold rounded-md px-3 py-1.5",
    terminal:
      "text-green-500/70 hover:text-green-300 font-mono text-xs px-2 py-1 rounded-none hover:bg-green-900/30",
    startup:
      "text-gray-400 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10",
    enterprise:
      "text-slate-300 hover:text-white text-sm px-3 py-1.5 rounded-md hover:bg-slate-700",
    pill: "text-gray-500 hover:text-gray-900 text-xs font-medium px-3 py-1 rounded-full hover:bg-gray-200",
    split:
      "text-gray-600 hover:text-gray-900 text-sm px-4 py-2 hover:bg-gray-50 rounded-none border-r border-gray-100 last:border-r-0",
    stacked:
      "text-gray-500 hover:text-indigo-600 text-sm px-4 py-2.5 border-b-2 border-transparent hover:border-indigo-500 rounded-none",
    "sidebar-header":
      "text-gray-500 hover:text-gray-900 hover:bg-gray-100 text-sm px-3 py-1.5 rounded-lg",
    topbar:
      "text-white/70 hover:text-white text-xs font-medium px-2.5 py-1 rounded hover:bg-white/10",
  };
  return (
    map[v] ??
    (isLightText.value
      ? "text-white/80 hover:text-white hover:bg-white/10 rounded-lg px-3 py-1.5 text-sm"
      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg px-3 py-1.5 text-sm")
  );
});

const activeLinkClass = computed(() => {
  const v = props.variant;
  const map: Partial<Record<YNavbarVariant, string>> = {
    editorial: "!text-gray-900 !border-gray-900",
    luxury: "!text-amber-100",
    brutalist: "!bg-black !text-yellow-300",
    retro: "!bg-orange-800 !text-orange-50",
    terminal: "!text-green-300 bg-green-900/40",
    startup: "!text-white bg-white/15",
    enterprise: "!text-white bg-slate-700",
    pill: "!text-gray-900 bg-white shadow-sm",
    split: "!text-indigo-600 bg-indigo-50",
    stacked: "!text-indigo-600 !border-indigo-500",
    "sidebar-header": "!text-indigo-600 bg-indigo-50",
    topbar: "!text-white bg-white/20",
  };
  return (
    map[v] ??
    (isLightText.value
      ? "!text-white bg-white/15 font-semibold"
      : "!text-indigo-600 bg-indigo-50 font-semibold")
  );
});

// --- CTA classes per variant ---

const ctaClass = computed(() => {
  const v = props.variant;
  const map: Partial<Record<YNavbarVariant, string>> = {
    editorial:
      "bg-gray-900 text-white hover:bg-gray-800 text-xs uppercase tracking-wide px-5 py-2",
    luxury:
      "bg-amber-600 text-gray-950 hover:bg-amber-500 text-xs uppercase tracking-widest px-6 py-2",
    brutalist:
      "bg-black text-yellow-300 hover:bg-gray-900 text-sm font-black uppercase px-4 py-1.5 rounded-none border-2 border-black",
    retro:
      "bg-orange-800 text-orange-50 hover:bg-orange-900 text-sm font-bold rounded-md px-4 py-1.5",
    terminal:
      "bg-green-500 text-gray-950 hover:bg-green-400 font-mono text-xs px-3 py-1",
    startup:
      "bg-white text-gray-900 hover:bg-gray-100 text-sm font-medium px-4 py-1.5 rounded-lg",
    enterprise:
      "bg-blue-500 text-white hover:bg-blue-400 text-sm px-4 py-1.5 rounded-md",
    pill: "bg-gray-900 text-white hover:bg-gray-800 text-xs font-medium px-4 py-1.5 rounded-full",
    topbar:
      "bg-white text-indigo-600 hover:bg-indigo-50 text-xs font-semibold px-3 py-1 rounded",
  };
  return (
    map[v] ??
    (isLightText.value
      ? "bg-white text-indigo-600 hover:bg-gray-100 text-sm font-semibold px-4 py-1.5 rounded-lg shadow-sm"
      : "bg-indigo-600 text-white hover:bg-indigo-700 text-sm font-semibold px-4 py-1.5 rounded-lg shadow-sm")
  );
});

// --- Search input classes ---

const searchInputClass = computed(() => {
  const v = props.variant;
  if (v === "terminal")
    return "bg-gray-900 border border-green-800 text-green-400 placeholder-green-700 font-mono text-xs rounded-none px-3 py-1 focus:outline-none focus:border-green-500";
  if (v === "brutalist")
    return "bg-white border-2 border-black text-black placeholder-gray-500 text-sm rounded-none px-3 py-1 focus:outline-none";
  if (v === "luxury")
    return "bg-gray-900 border border-amber-700/40 text-amber-100 placeholder-amber-600/40 text-xs rounded-none px-3 py-1 focus:outline-none focus:border-amber-500";
  if (isLightText.value)
    return "bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-white/30";
  return "bg-gray-100 border border-gray-200 text-gray-800 placeholder-gray-400 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400/50";
});

// --- Action button classes ---

const actionBtnClass = computed(() => {
  if (isLightText.value)
    return "text-white/70 hover:text-white hover:bg-white/10 rounded-lg p-1.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40";
  return "text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg p-1.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/40";
});

// --- Mobile panel classes per variant ---

const mobilePanelClass = computed(() => {
  const v = props.variant;
  const map: Partial<Record<YNavbarVariant, string>> = {
    brutalist: "border-b-4 border-black bg-yellow-300 text-black shadow-none",
    luxury:
      "border-b border-amber-700/30 bg-gray-950 text-amber-100 shadow-2xl",
    retro:
      "border-b-2 border-orange-800 bg-orange-50 text-orange-900 shadow-lg",
    terminal: "border-b border-green-900 bg-gray-950 text-green-400 shadow-2xl",
    startup: "border-b border-gray-800 bg-gray-950 text-white shadow-2xl",
    enterprise:
      "border-b border-slate-700 bg-slate-800 text-slate-100 shadow-2xl",
    editorial: dk.value
      ? "border-b border-slate-600 bg-slate-900 text-slate-100 shadow-2xl"
      : "border-b border-gray-900 bg-white text-gray-900 shadow-lg",
    topbar: "border-b border-indigo-700 bg-indigo-600 text-white shadow-lg",
    pill: dk.value
      ? "border border-slate-600 bg-slate-800 text-slate-100 shadow-xl rounded-2xl mx-6 mt-1"
      : "border border-gray-200 bg-white text-gray-800 shadow-xl rounded-2xl mx-6 mt-1",
  };
  return (
    map[v] ??
    (isLightText.value
      ? "border-b border-white/20 bg-slate-900/95 text-white shadow-2xl"
      : "border-b border-gray-200 bg-white text-gray-900 shadow-lg")
  );
});

// --- Mobile link classes per variant ---

const mobileLinkClass = computed(() => {
  const v = props.variant;
  const map: Partial<Record<YNavbarVariant, string>> = {
    brutalist:
      "hover:bg-black hover:text-yellow-300 text-sm font-bold uppercase",
    luxury:
      "text-amber-200/70 hover:text-amber-100 text-xs tracking-wide uppercase",
    terminal:
      "text-green-500/70 hover:text-green-300 font-mono text-xs hover:bg-green-900/30",
    editorial:
      "text-gray-500 hover:text-gray-900 text-sm tracking-wide uppercase",
    topbar: "text-white/80 hover:text-white hover:bg-white/10 text-sm",
  };
  return map[v] ?? "text-gray-700 hover:bg-gray-50";
});

const mobileLinkActiveClass = computed(() => {
  const v = props.variant;
  const map: Partial<Record<YNavbarVariant, string>> = {
    brutalist: "bg-black text-yellow-300 font-bold",
    luxury: "text-amber-100 font-medium",
    terminal: "text-green-300 bg-green-900/40",
    editorial: "text-gray-900 font-semibold",
    topbar: "text-white bg-white/20 font-medium",
  };
  return map[v] ?? "text-indigo-600 bg-indigo-50 font-medium";
});

// --- Hamburger color ---

const hamburgerClass = computed(() => {
  if (
    isLightText.value ||
    props.variant === "startup" ||
    props.variant === "topbar"
  )
    return "hover:bg-white/10 text-white";
  if (props.variant === "brutalist") return "hover:bg-black/10 text-black";
  if (props.variant === "retro") return "hover:bg-orange-200 text-orange-900";
  if (props.variant === "terminal")
    return "hover:bg-green-900/30 text-green-400";
  return "hover:bg-gray-100 text-gray-600";
});

// --- Alignment ---

const alignClasses: Record<YNavbarAlign, string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
  spread: "justify-between",
};

const linksContainerClass = computed(() => {
  // Split variant uses no gap so border-r between items reads as dividers
  const gapClass = props.variant === "split" ? "gap-0" : "gap-1";
  return [
    "hidden md:flex items-center flex-1",
    gapClass,
    alignClasses[props.align],
  ];
});

// --- Secondary row classes ---

const secondaryRowClass = computed(() => {
  const v = props.variant;
  if (v === "editorial")
    return "flex items-center gap-4 border-t border-gray-200 px-8 py-2 bg-gray-50 text-xs text-gray-500";
  if (v === "enterprise")
    return "flex items-center gap-3 border-t border-slate-700 px-8 py-2 bg-slate-900 text-xs text-slate-400";
  if (v === "brutalist")
    return "flex items-center gap-2 border-t-2 border-black px-5 py-1.5 bg-yellow-200 text-xs text-black font-bold uppercase";
  if (v === "topbar")
    return "flex items-center gap-2 px-6 py-1.5 bg-indigo-700 text-xs text-white/80";
  if (isLightText.value)
    return "flex items-center gap-3 border-t border-white/10 px-6 py-2 text-xs text-white/60";
  return "flex items-center gap-3 border-t border-gray-100 px-6 py-2 bg-gray-50 text-xs text-gray-500";
});

const secondaryLinkClass = computed(() => {
  const v = props.variant;
  if (v === "brutalist")
    return "hover:bg-black hover:text-yellow-300 px-2 py-0.5 rounded-none transition-colors cursor-pointer";
  if (v === "topbar")
    return "hover:text-white hover:bg-white/10 px-2 py-0.5 rounded transition-colors cursor-pointer";
  if (isLightText.value)
    return "hover:text-white px-2 py-0.5 rounded transition-colors cursor-pointer";
  return "hover:text-gray-900 hover:bg-gray-100 px-2 py-0.5 rounded transition-colors cursor-pointer";
});

// --- Stacked variant: links go in a second row ---
const isStacked = computed(() => props.variant === "stacked");

// --- Subtitle classes ---
const subtitleClass = computed(() => {
  const v = props.variant;
  if (v === "editorial")
    return "text-xs text-gray-400 font-serif italic mt-0.5";
  if (v === "luxury")
    return "text-[10px] text-amber-400/50 tracking-[0.2em] uppercase mt-0.5";
  if (v === "terminal") return "text-[10px] text-green-700 font-mono mt-0.5";
  if (isLightText.value) return "text-[10px] text-white/40 mt-0.5";
  return "text-[10px] text-gray-400 mt-0.5";
});
</script>

<template>
  <nav :class="navClasses">
    <!-- Stacked variant: top row with brand + actions -->
    <template v-if="isStacked">
      <div class="flex items-center justify-between w-full">
        <!-- Brand area -->
        <div class="shrink-0">
          <button
            :class="[
              'cursor-pointer bg-transparent border-none font-semibold text-base',
              brandClass,
            ]"
            @click="emit('brandClick')"
          >
            {{ brand }}
          </button>
          <div v-if="subtitle" :class="subtitleClass">{{ subtitle }}</div>
        </div>

        <!-- Right: search + actions + CTA + hamburger -->
        <div class="flex items-center gap-3">
          <div v-if="showSearch" class="hidden md:block">
            <input
              v-model="searchQuery"
              :class="searchInputClass"
              :placeholder="searchPlaceholder"
              @keydown.enter="handleSearch"
            />
          </div>

          <button
            v-for="act in actions"
            :key="act.id"
            :class="[
              actionBtnClass,
              act.disabled ? 'opacity-40 pointer-events-none' : '',
            ]"
            :title="act.label"
            class="hidden md:flex bg-transparent border-none cursor-pointer"
            @click="handleAction(act)"
          >
            {{ act.icon }}
          </button>

          <button
            v-if="showCta"
            :class="[
              'hidden md:inline-flex cursor-pointer border-none',
              ctaClass,
            ]"
            @click="emit('ctaClick')"
          >
            {{ ctaLabel }}
          </button>

          <button
            v-if="mobileMenu"
            ref="hamburgerRef"
            class="md:hidden flex h-8 w-8 items-center justify-center rounded-lg transition-colors cursor-pointer bg-transparent border-none"
            :class="hamburgerClass"
            aria-label="Toggle menu"
            :aria-expanded="mobileOpen"
            @click="toggleMobile"
          >
            <svg
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                v-if="!mobileOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Stacked: links row as tabs below brand -->
      <div
        v-if="links?.length"
        class="hidden md:flex items-center gap-0 w-full mt-1 -mb-px overflow-x-auto"
      >
        <button
          v-for="link in links"
          :key="link.id"
          :class="[
            'transition-colors cursor-pointer bg-transparent border-none whitespace-nowrap',
            linkBaseClass,
            link.active ? activeLinkClass : '',
            link.disabled ? 'opacity-40 pointer-events-none' : '',
          ]"
          :disabled="link.disabled"
          role="menuitem"
          @click="handleNav(link)"
        >
          <span class="flex items-center gap-1.5">
            <span v-if="link.icon" class="text-sm">{{ link.icon }}</span>
            {{ link.label }}
          </span>
        </button>
      </div>
    </template>

    <!-- All other variants: single-row layout -->
    <template v-else>
      <!-- Brand area -->
      <div class="shrink-0">
        <button
          :class="['cursor-pointer bg-transparent border-none', brandClass]"
          @click="emit('brandClick')"
        >
          <!-- Terminal variant: prompt prefix -->
          <span v-if="variant === 'terminal'" class="text-green-600 mr-1"
            >❯</span
          >
          {{ brand }}
        </button>
        <div v-if="subtitle" :class="subtitleClass">{{ subtitle }}</div>
      </div>

      <!-- Desktop links -->
      <div v-if="links?.length" :class="linksContainerClass">
        <button
          v-for="link in links"
          :key="link.id"
          :class="[
            'transition-colors cursor-pointer bg-transparent border-none whitespace-nowrap',
            linkBaseClass,
            link.active ? activeLinkClass : '',
            link.disabled ? 'opacity-40 pointer-events-none' : '',
          ]"
          :disabled="link.disabled"
          role="menuitem"
          @click="handleNav(link)"
        >
          <span class="flex items-center gap-1.5">
            <span v-if="link.icon" class="text-sm">{{ link.icon }}</span>
            {{ link.label }}
          </span>
        </button>
      </div>

      <!-- Slot fallback when no links provided -->
      <div
        v-if="!links?.length"
        class="hidden md:flex flex-1 items-center justify-end"
      >
        <slot />
      </div>

      <!-- Right section -->
      <div class="flex items-center gap-3">
        <!-- Search -->
        <div v-if="showSearch" class="hidden md:block">
          <input
            v-model="searchQuery"
            :class="searchInputClass"
            :placeholder="searchPlaceholder"
            @keydown.enter="handleSearch"
          />
        </div>

        <!-- Icon actions -->
        <button
          v-for="act in actions"
          :key="act.id"
          :class="[
            actionBtnClass,
            act.disabled ? 'opacity-40 pointer-events-none' : '',
          ]"
          :title="act.label"
          class="hidden md:flex bg-transparent border-none cursor-pointer"
          @click="handleAction(act)"
        >
          {{ act.icon }}
        </button>

        <!-- CTA -->
        <button
          v-if="showCta"
          :class="[
            'hidden md:inline-flex cursor-pointer border-none',
            ctaClass,
          ]"
          @click="emit('ctaClick')"
        >
          {{ ctaLabel }}
        </button>

        <!-- Mobile hamburger -->
        <button
          v-if="mobileMenu"
          ref="hamburgerRef"
          class="md:hidden flex h-8 w-8 items-center justify-center rounded-lg transition-colors cursor-pointer bg-transparent border-none"
          :class="hamburgerClass"
          aria-label="Toggle menu"
          :aria-expanded="mobileOpen"
          @click="toggleMobile"
        >
          <svg
            class="h-5 w-5 transition-transform duration-200"
            :class="{ 'rotate-90': mobileOpen }"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              v-if="!mobileOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </template>

    <!-- Secondary row (categories/tabs below main bar) -->
    <div
      v-if="secondaryLinks?.length"
      :class="secondaryRowClass"
      class="w-full hidden md:flex"
    >
      <button
        v-for="link in secondaryLinks"
        :key="link.id"
        :class="[
          'bg-transparent border-none',
          secondaryLinkClass,
          link.active ? 'font-semibold' : '',
          link.disabled ? 'opacity-40 pointer-events-none' : '',
        ]"
        :disabled="link.disabled"
        @click="handleNav(link)"
      >
        {{ link.label }}
      </button>
    </div>

    <!-- Mobile menu panel -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-out"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="mobileMenu && mobileOpen && links?.length"
        ref="mobilePanelRef"
        class="absolute left-0 right-0 top-full z-40 px-6 py-3 md:hidden"
        :class="mobilePanelClass"
        role="menu"
        @keydown="onMobilePanelKeydown"
      >
        <!-- Mobile search -->
        <div v-if="showSearch" class="mb-3">
          <input
            v-model="searchQuery"
            :class="searchInputClass"
            class="w-full"
            :placeholder="searchPlaceholder"
            @keydown.enter="handleSearch"
          />
        </div>

        <button
          v-for="link in links"
          :key="link.id"
          :class="[
            'flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-left transition-colors bg-transparent border-none cursor-pointer',
            link.active ? mobileLinkActiveClass : mobileLinkClass,
            link.disabled ? 'opacity-40 pointer-events-none' : '',
          ]"
          :disabled="link.disabled"
          role="menuitem"
          @click="handleNav(link)"
        >
          <span v-if="link.icon" class="text-sm">{{ link.icon }}</span>
          {{ link.label }}
        </button>

        <!-- Mobile secondary links -->
        <template v-if="secondaryLinks?.length">
          <div class="border-t border-gray-200/20 my-2" />
          <button
            v-for="link in secondaryLinks"
            :key="link.id"
            :class="[
              'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-left transition-colors bg-transparent border-none cursor-pointer',
              link.active ? mobileLinkActiveClass : mobileLinkClass,
              link.disabled ? 'opacity-40 pointer-events-none' : '',
            ]"
            :disabled="link.disabled"
            role="menuitem"
            @click="handleNav(link)"
          >
            {{ link.label }}
          </button>
        </template>

        <!-- Mobile actions -->
        <div
          v-if="actions?.length"
          class="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200/20"
        >
          <button
            v-for="act in actions"
            :key="act.id"
            :class="[
              actionBtnClass,
              act.disabled ? 'opacity-40 pointer-events-none' : '',
            ]"
            :title="act.label"
            class="bg-transparent border-none cursor-pointer"
            @click="handleAction(act)"
          >
            {{ act.icon }}
          </button>
        </div>

        <button
          v-if="showCta"
          class="mt-2 w-full rounded-lg bg-indigo-600 border-none px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 cursor-pointer"
          @click="emit('ctaClick')"
        >
          {{ ctaLabel }}
        </button>
      </div>
    </Transition>
  </nav>
</template>
