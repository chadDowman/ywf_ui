<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useDarkMode } from "@/composables/useDarkMode";
import type {
  YSidebarProps,
  YSidebarVariant,
  YSidebarSize,
  YSidebarItem,
  YSidebarGroup,
  YSidebarSizeScale,
  YSidebarVariantTokens,
} from "@/types/sidebar";
import { sanitizeSvg } from "@/utils/sanitize";

defineOptions({ name: "YSidebar", inheritAttrs: false });

const props = withDefaults(defineProps<YSidebarProps>(), {
  open: true,
  variant: "clean",
  size: "md",
  position: "left",
  behavior: "static",
  collapsedMode: "icons",
  width: "240px",
  collapsedWidth: "52px",
  items: () => [],
  groups: () => [],
  activeItemId: undefined,
  logoText: undefined,
  logoIcon: undefined,
  showToggleButton: true,
  collapsible: true,
  elevation: 0,
  rounded: false,
  sticky: false,
  zIndex: 40,
});

const emit = defineEmits<{
  close: [];
  "item-click": [item: YSidebarItem];
  "update:open": [value: boolean];
}>();

const dk = useDarkMode(props.dark);

const uncontrolledOpen = ref(props.open ?? true);
const isControlled = computed(() => props.open !== undefined);
const isOpen = computed(() =>
  isControlled.value ? Boolean(props.open) : uncontrolledOpen.value,
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

/* ── collapse state ── */
const isCollapsed = computed(
  () => !isOpen.value && props.collapsedMode !== "hidden",
);
const isMini = computed(
  () => isCollapsed.value && props.collapsedMode === "mini",
);
const isIcons = computed(
  () => isCollapsed.value && props.collapsedMode === "icons",
);

function toggle() {
  setOpen(!isOpen.value);
}

/* ── group collapse ── */
const collapsedGroups = ref<Set<string>>(new Set());
function toggleGroup(id: string) {
  const s = new Set(collapsedGroups.value);
  s.has(id) ? s.delete(id) : s.add(id);
  collapsedGroups.value = s;
}

/* ── expanded children ── */
const expandedItems = ref<Set<string>>(new Set());
function toggleItem(id: string) {
  const s = new Set(expandedItems.value);
  s.has(id) ? s.delete(id) : s.add(id);
  expandedItems.value = s;
}

/* ── tooltip hover ── */
const hoveredItem = ref<string | null>(null);

/* ── all items flat for icons mode ── */
const allGroups = computed<YSidebarGroup[]>(() => {
  const g: YSidebarGroup[] = [...props.groups];
  if (props.items.length) g.unshift({ id: "__default", items: props.items });
  return g;
});

/* ── size scale ── */
const sizes: Record<YSidebarSize, YSidebarSizeScale> = {
  sm: {
    itemH: "h-7",
    itemPx: "px-2.5",
    itemText: "text-[12.5px]",
    iconSize: "w-[15px] h-[15px]",
    logoText: "text-sm",
    groupLabel: "text-[9.5px]",
    badgeText: "text-[9px]",
    childText: "text-[11.5px]",
    childPl: "pl-7",
  },
  md: {
    itemH: "h-8",
    itemPx: "px-3",
    itemText: "text-[13px]",
    iconSize: "w-[16px] h-[16px]",
    logoText: "text-[15px]",
    groupLabel: "text-[10px]",
    badgeText: "text-[9.5px]",
    childText: "text-[12px]",
    childPl: "pl-8",
  },
  lg: {
    itemH: "h-9",
    itemPx: "px-3.5",
    itemText: "text-sm",
    iconSize: "w-[18px] h-[18px]",
    logoText: "text-base",
    groupLabel: "text-[10.5px]",
    badgeText: "text-[10px]",
    childText: "text-[12.5px]",
    childPl: "pl-9",
  },
};
const sc = computed(() => sizes[props.size]);

/* ─────────────────────────────────────────────
   VARIANT TOKEN SYSTEM
───────────────────────────────────────────── */
const variants: Record<YSidebarVariant, YSidebarVariantTokens> = {
  clean: {
    shell: "bg-white border-r border-gray-100",
    border: "border-r border-gray-100",
    item: "text-gray-600 rounded-md",
    itemHover: "hover:bg-gray-50 hover:text-gray-900",
    itemActive: "bg-indigo-50 text-indigo-700 font-medium rounded-md",
    itemActiveBorder: "border-l-[3px] border-indigo-500",
    groupLabel: "text-gray-400 font-semibold tracking-widest uppercase",
    badge: "bg-indigo-100 text-indigo-600",
    logo: "text-gray-900",
    separator: "border-gray-100",
    toggle:
      "bg-white border border-gray-200 text-gray-500 hover:text-gray-800 shadow-sm",
    tooltip: "bg-gray-900 text-white",
    iconDot: "bg-indigo-500",
  },
  dark: {
    shell: "bg-gray-950 border-r border-white/5",
    border: "border-r border-white/5",
    item: "text-gray-400 rounded-md",
    itemHover: "hover:bg-white/5 hover:text-gray-200",
    itemActive: "bg-indigo-500/10 text-indigo-400 font-medium rounded-md",
    itemActiveBorder: "border-l-[2px] border-indigo-400",
    groupLabel: "text-gray-600 font-semibold tracking-widest uppercase",
    badge: "bg-indigo-500/20 text-indigo-400",
    logo: "text-white",
    separator: "border-white/5",
    toggle: "bg-gray-800 border border-white/10 text-gray-400 hover:text-white",
    tooltip: "bg-gray-800 text-gray-100 border border-white/10",
    iconDot: "bg-indigo-400",
  },
  glass: {
    shell: "bg-white/60 backdrop-blur-2xl border-r border-white/40",
    border: "border-r border-white/40",
    item: "text-gray-600 rounded-xl",
    itemHover: "hover:bg-white/70 hover:text-gray-900",
    itemActive: "bg-white/80 text-gray-900 font-medium rounded-xl shadow-sm",
    itemActiveBorder: "border-l-[2px] border-blue-400",
    groupLabel: "text-gray-400/80 font-semibold tracking-widest uppercase",
    badge: "bg-blue-100/80 text-blue-600",
    logo: "text-gray-900",
    separator: "border-white/40",
    toggle:
      "bg-white/70 backdrop-blur border border-white/60 text-gray-500 hover:text-gray-800 shadow-sm",
    tooltip: "bg-gray-900/90 backdrop-blur text-white",
    iconDot: "bg-blue-400",
  },
  ink: {
    shell: "bg-slate-900 border-r border-slate-800",
    border: "border-r border-slate-800",
    item: "text-slate-300 rounded-md",
    itemHover: "hover:bg-slate-800 hover:text-slate-100",
    itemActive: "bg-teal-500/15 text-teal-300 font-medium rounded-md",
    itemActiveBorder: "border-l-2 border-teal-400",
    groupLabel: "text-slate-500 font-semibold tracking-widest uppercase",
    badge: "bg-teal-500/20 text-teal-400",
    logo: "text-slate-100",
    separator: "border-slate-800",
    toggle:
      "bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-100",
    tooltip: "bg-slate-800 text-slate-100 border border-slate-700",
    iconDot: "bg-teal-400",
  },
  aurora: {
    shell:
      "bg-gradient-to-b from-violet-950 to-slate-900 border-r border-violet-900/40",
    border: "border-r border-violet-900/40",
    item: "text-violet-200/70 rounded-lg",
    itemHover: "hover:bg-violet-500/10 hover:text-violet-100",
    itemActive:
      "bg-gradient-to-r from-violet-500/20 to-pink-500/20 text-violet-200 font-medium rounded-lg",
    itemActiveBorder: "border-l-2 border-violet-400",
    groupLabel: "text-violet-400/50 font-semibold tracking-widest uppercase",
    badge: "bg-violet-500/20 text-violet-300",
    logo: "text-white",
    separator: "border-violet-900/40",
    toggle:
      "bg-violet-900/50 border border-violet-700/50 text-violet-400 hover:text-violet-100",
    tooltip: "bg-violet-950 text-violet-100 border border-violet-800",
    iconDot: "bg-violet-400",
  },
  warm: {
    shell: "bg-stone-50 border-r border-stone-200",
    border: "border-r border-stone-200",
    item: "text-stone-600 rounded-md",
    itemHover: "hover:bg-stone-100 hover:text-stone-900",
    itemActive: "bg-orange-50 text-orange-700 font-medium rounded-md",
    itemActiveBorder: "border-l-2 border-orange-400",
    groupLabel: "text-stone-400 font-semibold tracking-widest uppercase",
    badge: "bg-orange-100 text-orange-600",
    logo: "text-stone-900",
    separator: "border-stone-200",
    toggle:
      "bg-stone-100 border border-stone-200 text-stone-500 hover:text-stone-800",
    tooltip: "bg-stone-800 text-stone-100",
    iconDot: "bg-orange-400",
  },
  bordered: {
    shell: "bg-white border-r-2 border-gray-900",
    border: "border-r-2 border-gray-900",
    item: "text-gray-700 rounded-none",
    itemHover: "hover:bg-gray-100 hover:text-gray-900",
    itemActive: "bg-gray-900 text-white font-medium rounded-none",
    itemActiveBorder: "",
    groupLabel: "text-gray-400 font-bold tracking-widest uppercase",
    badge: "bg-gray-900 text-white",
    logo: "text-gray-900",
    separator: "border-gray-900",
    toggle: "bg-gray-900 text-white hover:bg-gray-700",
    tooltip: "bg-gray-900 text-white",
    iconDot: "bg-gray-900",
  },
  ghost: {
    shell: "bg-transparent border-r border-transparent",
    border: "border-r border-transparent",
    item: "text-gray-600 rounded-lg",
    itemHover: "hover:bg-gray-100 hover:text-gray-900",
    itemActive: "bg-gray-100 text-gray-900 font-medium rounded-lg",
    itemActiveBorder: "border-l-[3px] border-gray-900",
    groupLabel: "text-gray-400 font-semibold tracking-widest uppercase",
    badge: "bg-gray-200 text-gray-600",
    logo: "text-gray-900",
    separator: "border-gray-100",
    toggle:
      "bg-gray-100 border border-gray-200 text-gray-500 hover:text-gray-900",
    tooltip: "bg-gray-900 text-white",
    iconDot: "bg-gray-700",
  },

  // ─── NEW VARIANTS ─────────────────────────────────────────────────

  neon: {
    shell: "ysidebar-neon-shell border-r border-cyan-500/20",
    border: "border-r border-cyan-500/20",
    item: "text-cyan-400/60 rounded-md font-mono text-[12px]",
    itemHover: "hover:text-cyan-300 hover:bg-cyan-500/5",
    itemActive:
      "ysidebar-neon-active text-cyan-300 font-mono font-semibold rounded-md",
    itemActiveBorder: "border-l-2 border-cyan-400",
    groupLabel: "text-cyan-700 font-mono font-bold tracking-[0.2em] uppercase",
    badge: "ysidebar-neon-badge text-cyan-300",
    logo: "text-cyan-400",
    separator: "border-cyan-900/60",
    toggle:
      "ysidebar-neon-toggle border border-cyan-500/30 text-cyan-500 hover:text-cyan-300",
    tooltip: "bg-gray-950 text-cyan-300 border border-cyan-500/40",
    iconDot: "ysidebar-neon-dot",
    itemActiveExtra: "ysidebar-neon-item-glow",
  },

  frosted: {
    shell: "ysidebar-frosted-shell border-r border-white/60",
    border: "border-r border-white/60",
    item: "text-gray-500 rounded-xl",
    itemHover: "hover:bg-white/80 hover:text-gray-800",
    itemActive: "bg-white text-gray-900 font-semibold rounded-xl shadow-sm",
    itemActiveBorder: "ysidebar-frosted-active-border",
    groupLabel: "text-gray-400/70 font-semibold tracking-widest uppercase",
    badge: "bg-white/70 text-indigo-500 shadow-sm",
    logo: "text-gray-800",
    separator: "border-white/50",
    toggle:
      "bg-white/80 backdrop-blur border border-white/70 text-gray-500 hover:text-gray-800 shadow-sm",
    tooltip:
      "bg-white/90 backdrop-blur text-gray-800 border border-white/60 shadow-md",
    iconDot: "bg-indigo-400",
  },

  forest: {
    shell: "bg-[#1a2e1a] border-r border-[#2d4a2d]",
    border: "border-r border-[#2d4a2d]",
    item: "text-[#8ab88a] rounded-lg",
    itemHover: "hover:bg-[#243824] hover:text-[#b8d4b8]",
    itemActive: "bg-[#2d4a2d] text-[#c8e6c8] font-medium rounded-lg",
    itemActiveBorder: "border-l-[3px] border-[#7bc47b]",
    groupLabel: "text-[#4a7a4a] font-semibold tracking-widest uppercase",
    badge: "bg-[#2d4a2d] text-[#a0c8a0]",
    logo: "text-[#c8e6c8]",
    separator: "border-[#2d4a2d]",
    toggle:
      "bg-[#243824] border border-[#2d4a2d] text-[#6a9a6a] hover:text-[#c8e6c8]",
    tooltip: "bg-[#1a2e1a] text-[#b8d4b8] border border-[#2d4a2d]",
    iconDot: "bg-[#7bc47b]",
  },

  midnight: {
    shell: "bg-[#0d1117] border-r border-[#1c2433]",
    border: "border-r border-[#1c2433]",
    item: "text-[#8892a4] rounded-md",
    itemHover: "hover:bg-[#161b22] hover:text-[#c9d1d9]",
    itemActive:
      "ysidebar-midnight-active text-[#f0c060] font-medium rounded-md",
    itemActiveBorder: "border-l-[2px] border-[#f0c060]",
    groupLabel: "text-[#3d4f69] font-semibold tracking-[0.18em] uppercase",
    badge: "ysidebar-midnight-badge text-[#f0c060]",
    logo: "ysidebar-midnight-logo",
    separator: "border-[#1c2433]",
    toggle:
      "bg-[#161b22] border border-[#30363d] text-[#6e7681] hover:text-[#c9d1d9]",
    tooltip: "bg-[#161b22] text-[#c9d1d9] border border-[#30363d]",
    iconDot: "ysidebar-midnight-dot",
  },

  chalk: {
    shell: "bg-[#f5f0e8] border-r-2 border-[#d4c9b0]",
    border: "border-r-2 border-[#d4c9b0]",
    item: "text-[#5c5244] rounded-none",
    itemHover: "hover:bg-[#ede8de] hover:text-[#2c2418]",
    itemActive: "ysidebar-chalk-active text-[#2c2418] font-bold rounded-none",
    itemActiveBorder: "ysidebar-chalk-active-border",
    groupLabel:
      "text-[#a09080] font-black tracking-[0.22em] uppercase text-[9px]",
    badge: "bg-[#2c2418] text-[#f5f0e8]",
    logo: "text-[#2c2418]",
    separator: "border-[#d4c9b0]",
    toggle:
      "bg-[#ede8de] border-2 border-[#d4c9b0] text-[#7c6c54] hover:text-[#2c2418]",
    tooltip: "bg-[#2c2418] text-[#f5f0e8]",
    iconDot: "bg-[#2c2418]",
  },

  // ─── 5 NEW VARIANTS ───────────────────────────────────────────────

  retro: {
    shell: "ysidebar-retro-shell border-r-2 border-[#c8820a]",
    border: "border-r-2 border-[#c8820a]",
    item: "text-[#d4a040] rounded-none font-mono text-[12px] tracking-wide",
    itemHover: "hover:bg-[#1a1200] hover:text-[#ffcc44]",
    itemActive:
      "ysidebar-retro-active text-[#ffdd66] font-mono font-bold rounded-none",
    itemActiveBorder: "border-l-[3px] border-[#ffcc44]",
    groupLabel: "text-[#8a6010] font-mono font-bold tracking-[0.2em] uppercase",
    badge: "ysidebar-retro-badge text-[#ffcc44]",
    logo: "text-[#ffcc44] font-mono",
    separator: "border-[#2a1e00]",
    toggle:
      "ysidebar-retro-toggle border border-[#c8820a] text-[#d4a040] hover:text-[#ffcc44]",
    tooltip: "bg-[#0d0a00] text-[#ffcc44] border border-[#c8820a] font-mono",
    iconDot: "ysidebar-retro-dot",
  },

  candy: {
    shell: "ysidebar-candy-shell border-r border-pink-200/60",
    border: "border-r border-pink-200/60",
    item: "text-purple-500 rounded-2xl",
    itemHover: "hover:bg-pink-50 hover:text-purple-700",
    itemActive:
      "ysidebar-candy-active text-purple-700 font-semibold rounded-2xl",
    itemActiveBorder: "",
    groupLabel: "text-pink-300 font-bold tracking-widest uppercase",
    badge: "ysidebar-candy-badge text-purple-600",
    logo: "ysidebar-candy-logo",
    separator: "border-pink-100",
    toggle:
      "ysidebar-candy-toggle border border-pink-200 text-pink-400 hover:text-purple-600",
    tooltip: "bg-purple-700 text-white",
    iconDot: "ysidebar-candy-dot",
  },

  carbon: {
    shell: "ysidebar-carbon-shell border-r border-white/5",
    border: "border-r border-white/5",
    item: "text-zinc-400 rounded-md",
    itemHover: "hover:bg-white/5 hover:text-zinc-200",
    itemActive: "ysidebar-carbon-active text-white font-medium rounded-md",
    itemActiveBorder: "border-l-[2px] border-zinc-300",
    groupLabel: "text-zinc-600 font-bold tracking-[0.18em] uppercase",
    badge: "bg-zinc-700 text-zinc-300 border border-zinc-600",
    logo: "text-white",
    separator: "border-white/5",
    toggle: "bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white",
    tooltip: "bg-zinc-800 text-zinc-100 border border-zinc-700",
    iconDot: "bg-zinc-300",
  },

  ocean: {
    shell: "ysidebar-ocean-shell border-r border-[#0a3a5c]/60",
    border: "border-r border-[#0a3a5c]/60",
    item: "text-[#4db8d4] rounded-lg",
    itemHover: "hover:bg-[#0a2840] hover:text-[#7dd4e8]",
    itemActive: "ysidebar-ocean-active text-[#a0eaf8] font-semibold rounded-lg",
    itemActiveBorder: "border-l-[2px] border-[#22d3ee]",
    groupLabel: "text-[#1e5a78] font-semibold tracking-widest uppercase",
    badge: "ysidebar-ocean-badge text-[#7dd4e8]",
    logo: "text-[#a0eaf8]",
    separator: "border-[#0a3a5c]/50",
    toggle:
      "ysidebar-ocean-toggle border border-[#0a3a5c] text-[#4db8d4] hover:text-[#a0eaf8]",
    tooltip: "bg-[#020d18] text-[#7dd4e8] border border-[#0a3a5c]",
    iconDot: "ysidebar-ocean-dot",
  },

  rose: {
    shell: "bg-[#fdf5f5] border-r border-[#f0d8d8]",
    border: "border-r border-[#f0d8d8]",
    item: "text-[#8c5c5c] rounded-lg",
    itemHover: "hover:bg-[#faeaea] hover:text-[#5a2a2a]",
    itemActive: "bg-[#faeaea] text-[#5a2a2a] font-semibold rounded-lg",
    itemActiveBorder: "border-l-[3px] border-[#e07070]",
    groupLabel: "text-[#c4a0a0] font-semibold tracking-widest uppercase",
    badge: "bg-[#f8e0e0] text-[#c05050] border border-[#f0c8c8]",
    logo: "text-[#5a2a2a]",
    separator: "border-[#f0d8d8]",
    toggle:
      "bg-[#faeaea] border border-[#f0d8d8] text-[#b08080] hover:text-[#5a2a2a]",
    tooltip: "bg-[#5a2a2a] text-[#fdf5f5]",
    iconDot: "bg-[#e07070]",
  },
};

const vt = computed(() => {
  // If dark prop is set and variant is light-themed, use dark tokens instead
  if (
    dk.value &&
    [
      "clean",
      "glass",
      "warm",
      "bordered",
      "ghost",
      "frosted",
      "chalk",
      "rose",
    ].includes(props.variant)
  ) {
    return variants.dark;
  }
  return variants[props.variant];
});

/* ── elevation ── */
const elevationClass = computed(() => {
  const map = ["shadow-none", "shadow-sm", "shadow-md", "shadow-xl"];
  return map[props.elevation ?? 0];
});

/* ── computed width ── */
const sidebarWidth = computed(() => {
  if (!isOpen.value) {
    if (props.collapsedMode === "hidden") return "0px";
    if (props.collapsedMode === "mini") return "8px";
    return props.collapsedWidth;
  }
  return props.width;
});

const isActive = (id: string) => props.activeItemId === id;

function handleItemClick(item: YSidebarItem) {
  if (item.disabled) return;
  if (item.children?.length) {
    toggleItem(item.id);
    return;
  }
  emit("item-click", item);
  if (props.behavior === "overlay" || props.behavior === "drawer") {
    emit("close");
    setOpen(false);
  }
}
</script>

<template>
  <!-- Overlay backdrop -->
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="(behavior === 'overlay' || behavior === 'drawer') && isOpen"
      class="fixed inset-0 bg-black/30 backdrop-blur-[1px]"
      :style="{ zIndex: (zIndex ?? 40) - 1 }"
      @click="
        emit('close');
        setOpen(false);
      "
    />
  </Transition>

  <!-- Sidebar -->
  <nav
    aria-label="Sidebar navigation"
    :class="[
      'flex flex-col h-full overflow-hidden transition-[width] duration-250 ease-out',
      vt.shell,
      elevationClass,
      rounded ? 'rounded-2xl' : '',
      sticky ? 'sticky top-0' : '',
      behavior === 'overlay' || behavior === 'drawer'
        ? 'fixed top-0 bottom-0'
        : 'relative',
      position === 'left' ? 'left-0' : 'right-0',
      isMini ? 'cursor-pointer' : '',
    ]"
    :style="{
      width: sidebarWidth,
      zIndex:
        behavior === 'overlay' || behavior === 'drawer' ? zIndex : undefined,
    }"
    @click="isMini ? setOpen(true) : undefined"
  >
    <!-- Mini mode sliver — just show accent strip -->
    <div
      v-if="isMini"
      class="h-full w-full flex flex-col gap-1 py-2 px-0.5 overflow-hidden"
    >
      <div v-for="g in allGroups" :key="g.id">
        <div
          v-for="item in g.items"
          :key="item.id"
          :class="[
            'w-full rounded-sm transition-all duration-150',
            isActive(item.id)
              ? 'h-8 ' + vt.iconDot
              : 'h-2 bg-current opacity-10',
          ]"
        />
      </div>
    </div>

    <!-- Full / icons mode -->
    <template v-else>
      <!-- Logo area -->
      <div
        v-if="logoText || logoIcon || $slots.logo"
        :class="[
          'flex items-center gap-2.5 px-4 shrink-0',
          size === 'sm' ? 'h-12' : size === 'lg' ? 'h-16' : 'h-14',
          vt.logo,
        ]"
      >
        <slot name="logo">
          <span
            v-if="logoIcon"
            :class="['shrink-0 w-5 h-5', sc.iconSize]"
            v-html="sanitizeSvg(logoIcon)"
          />
          <span
            v-if="logoText && !isIcons"
            :class="['font-semibold tracking-tight truncate', sc.logoText]"
            >{{ logoText }}</span
          >
        </slot>
      </div>

      <!-- Separator -->
      <div
        v-if="logoText || logoIcon || $slots.logo"
        :class="['shrink-0 border-t mx-0', vt.separator]"
      />

      <!-- Nav body -->
      <div
        class="flex-1 overflow-y-auto overflow-x-hidden py-2 px-2 flex flex-col gap-0.5"
        role="menu"
      >
        <template v-for="group in allGroups" :key="group.id">
          <!-- Group header -->
          <div
            v-if="group.label && !isIcons"
            :class="[
              'flex items-center justify-between px-2 pt-4 pb-1.5',
              sc.groupLabel,
              vt.groupLabel,
            ]"
          >
            <span class="truncate">{{ group.label }}</span>
            <button
              v-if="group.collapsible"
              type="button"
              :class="[
                'w-3 h-3 transition-transform duration-150',
                collapsedGroups.has(group.id) ? '' : 'rotate-90',
              ]"
              :aria-expanded="!collapsedGroups.has(group.id)"
              @click="toggleGroup(group.id)"
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-full h-full"
              >
                <path d="M6 4l4 4-4 4" />
              </svg>
            </button>
          </div>

          <!-- Group items -->
          <Transition
            enter-active-class="transition-all duration-150 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-100 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <div
              v-if="!group.collapsible || !collapsedGroups.has(group.id)"
              class="flex flex-col gap-px"
            >
              <template v-for="item in group.items" :key="item.id">
                <!-- Nav item -->
                <div class="relative group/item">
                  <component
                    :is="item.href ? 'a' : 'button'"
                    :href="item.href"
                    type="button"
                    role="menuitem"
                    :aria-current="isActive(item.id) ? 'page' : undefined"
                    :disabled="item.disabled || undefined"
                    :class="[
                      'relative w-full flex items-center gap-2.5 transition-colors duration-150 select-none',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-current/30',
                      sc.itemH,
                      isIcons ? 'justify-center px-0' : sc.itemPx,
                      sc.itemText,
                      isActive(item.id)
                        ? [
                            vt.itemActive,
                            vt.itemActiveBorder,
                            vt.itemActiveExtra,
                          ]
                            .filter(Boolean)
                            .join(' ')
                        : [vt.item, vt.itemHover],
                      item.disabled
                        ? 'opacity-40 cursor-not-allowed pointer-events-none'
                        : 'cursor-pointer',
                    ]"
                    @click="handleItemClick(item)"
                    @mouseenter="isIcons ? (hoveredItem = item.id) : undefined"
                    @mouseleave="isIcons ? (hoveredItem = null) : undefined"
                  >
                    <!-- Icon -->
                    <span
                      v-if="item.icon"
                      :class="['shrink-0', sc.iconSize]"
                      aria-hidden="true"
                      v-html="sanitizeSvg(item.icon)"
                    />

                    <!-- Icon mode dot indicator -->
                    <span
                      v-if="isIcons && isActive(item.id)"
                      :class="[
                        'absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full',
                        vt.iconDot,
                      ]"
                    />

                    <!-- Label & badge (hidden when icons only) -->
                    <template v-if="!isIcons">
                      <span class="flex-1 truncate text-left">{{
                        item.label
                      }}</span>

                      <!-- Children chevron -->
                      <span
                        v-if="item.children?.length"
                        :class="[
                          'shrink-0 w-3 h-3 transition-transform duration-150',
                          expandedItems.has(item.id) ? 'rotate-180' : '',
                        ]"
                      >
                        <svg
                          viewBox="0 0 16 16"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="w-full h-full"
                        >
                          <path d="M4 6l4 4 4-4" />
                        </svg>
                      </span>

                      <!-- Badge -->
                      <span
                        v-else-if="item.badge !== undefined"
                        :class="[
                          'shrink-0 inline-flex items-center justify-center rounded-full min-w-4.5 h-4.5 px-1 font-semibold',
                          sc.badgeText,
                          vt.badge,
                        ]"
                        >{{ item.badge }}</span
                      >
                    </template>
                  </component>

                  <!-- Tooltip (icons mode) -->
                  <Transition
                    enter-active-class="transition duration-100 ease-out"
                    enter-from-class="opacity-0 translate-x-1"
                    enter-to-class="opacity-100 translate-x-0"
                    leave-active-class="transition duration-75 ease-in"
                    leave-from-class="opacity-100"
                    leave-to-class="opacity-0"
                  >
                    <div
                      v-if="isIcons && hoveredItem === item.id"
                      :class="[
                        'absolute left-full ml-2.5 top-1/2 -translate-y-1/2 z-50',
                        'text-xs rounded px-2.5 py-1.5 whitespace-nowrap pointer-events-none font-medium shadow-lg',
                        vt.tooltip,
                      ]"
                    >
                      {{ item.label }}
                    </div>
                  </Transition>
                </div>

                <!-- Children -->
                <Transition
                  enter-active-class="transition-all duration-200 ease-out"
                  enter-from-class="opacity-0 max-h-0"
                  enter-to-class="opacity-100 max-h-96"
                  leave-active-class="transition-all duration-150 ease-in"
                  leave-from-class="opacity-100 max-h-96"
                  leave-to-class="opacity-0 max-h-0"
                >
                  <div
                    v-if="
                      item.children?.length &&
                      expandedItems.has(item.id) &&
                      !isIcons
                    "
                    class="overflow-hidden flex flex-col gap-px mt-px"
                  >
                    <component
                      :is="child.href ? 'a' : 'button'"
                      v-for="child in item.children"
                      :key="child.id"
                      :href="child.href"
                      type="button"
                      role="menuitem"
                      :aria-current="isActive(child.id) ? 'page' : undefined"
                      :disabled="child.disabled || undefined"
                      :class="[
                        'w-full flex items-center gap-2 transition-colors duration-150 truncate',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-current/30',
                        sc.itemH,
                        sc.childPl,
                        sc.childText,
                        sc.itemPx,
                        isActive(child.id)
                          ? [vt.itemActive, vt.itemActiveBorder]
                              .filter(Boolean)
                              .join(' ')
                          : [vt.item, vt.itemHover],
                        child.disabled
                          ? 'opacity-40 cursor-not-allowed pointer-events-none'
                          : 'cursor-pointer',
                      ]"
                      @click="handleItemClick(child)"
                    >
                      <span
                        v-if="child.icon"
                        :class="['shrink-0 opacity-70', sc.iconSize]"
                        v-html="sanitizeSvg(child.icon)"
                      />
                      <span class="flex-1 truncate text-left">{{
                        child.label
                      }}</span>
                      <span
                        v-if="child.badge !== undefined"
                        :class="[
                          'shrink-0 inline-flex items-center justify-center rounded-full min-w-4.5 h-4.5 px-1 font-semibold',
                          sc.badgeText,
                          vt.badge,
                        ]"
                        >{{ child.badge }}</span
                      >
                    </component>
                  </div>
                </Transition>
              </template>
            </div>
          </Transition>
        </template>
      </div>

      <!-- Footer slot -->
      <div v-if="$slots.footer" :class="['shrink-0 border-t', vt.separator]">
        <slot name="footer" />
      </div>

      <!-- Toggle button -->
      <div
        v-if="showToggleButton && collapsible"
        :class="[
          'shrink-0 flex px-3 py-3',
          isIcons ? 'justify-center' : 'justify-start',
        ]"
      >
        <button
          type="button"
          :class="[
            'inline-flex items-center justify-center w-7 h-7 rounded-md transition-all duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current/30',
            vt.toggle,
          ]"
          :aria-label="isOpen ? 'Collapse sidebar' : 'Expand sidebar'"
          :aria-expanded="isOpen"
          @click="toggle"
        >
          <span
            :class="[
              'w-3.5 h-3.5 transition-transform duration-200',
              !isOpen ? 'rotate-180' : '',
            ]"
          >
            <svg
              v-if="isOpen"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              class="w-full h-full"
            >
              <path d="M3 3l10 10M13 3L3 13" />
            </svg>
            <svg
              v-else
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              class="w-full h-full"
            >
              <path d="M2 4h12M2 8h12M2 12h12" />
            </svg>
          </span>
        </button>
      </div>
    </template>
  </nav>
</template>

<style scoped>
/* ═══════════════════════════════════════════════════════
   NEON VARIANT
   ═══════════════════════════════════════════════════════ */
.ysidebar-neon-shell {
  background: #020a06;
  /* Subtle scanline texture */
  background-image: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 255, 150, 0.015) 2px,
    rgba(0, 255, 150, 0.015) 4px
  );
}

.ysidebar-neon-active {
  background: rgba(0, 255, 180, 0.06);
}

.ysidebar-neon-item-glow {
  text-shadow: 0 0 12px rgba(103, 232, 249, 0.7);
  filter: drop-shadow(0 0 4px rgba(103, 232, 249, 0.4));
}

.ysidebar-neon-badge {
  background: rgba(0, 255, 180, 0.1);
  border: 1px solid rgba(0, 255, 180, 0.3);
  box-shadow: 0 0 8px rgba(0, 255, 180, 0.2);
}

.ysidebar-neon-dot {
  background: #22d3ee;
  box-shadow: 0 0 6px #22d3ee;
}

.ysidebar-neon-toggle {
  background: rgba(0, 20, 12, 0.8);
}

/* ═══════════════════════════════════════════════════════
   FROSTED VARIANT
   ═══════════════════════════════════════════════════════ */
.ysidebar-frosted-shell {
  background: linear-gradient(
    160deg,
    rgba(255, 255, 255, 0.82) 0%,
    rgba(240, 245, 255, 0.78) 100%
  );
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  /* Subtle left edge gradient for depth */
  box-shadow: inset -1px 0 0 rgba(255, 255, 255, 0.9);
}

.ysidebar-frosted-active-border {
  /* Iridescent left border — shifts color on different items */
  border-left: 2.5px solid transparent;
  background-clip: padding-box;
  position: relative;
}

.ysidebar-frosted-active-border::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2.5px;
  background: linear-gradient(180deg, #818cf8, #38bdf8, #34d399);
  border-radius: 0 2px 2px 0;
}

/* ═══════════════════════════════════════════════════════
   FOREST VARIANT — uses raw hex colours, no extra CSS needed
   ═══════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════
   MIDNIGHT VARIANT
   ═══════════════════════════════════════════════════════ */
.ysidebar-midnight-active {
  background: rgba(240, 192, 96, 0.08);
}

.ysidebar-midnight-badge {
  background: rgba(240, 192, 96, 0.12);
  border: 1px solid rgba(240, 192, 96, 0.25);
}

.ysidebar-midnight-logo {
  color: #c9d1d9;
  letter-spacing: 0.04em;
}

.ysidebar-midnight-dot {
  background: #f0c060;
  box-shadow: 0 0 6px rgba(240, 192, 96, 0.6);
}

/* ═══════════════════════════════════════════════════════
   RETRO / CRT VARIANT
   ═══════════════════════════════════════════════════════ */
.ysidebar-retro-shell {
  background: #0d0a00;
  /* P3 phosphor scanlines */
  background-image: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 3px,
    rgba(255, 180, 0, 0.018) 3px,
    rgba(255, 180, 0, 0.018) 4px
  );
}

.ysidebar-retro-active {
  background: rgba(255, 180, 0, 0.07);
}

.ysidebar-retro-badge {
  background: rgba(255, 180, 0, 0.1);
  border: 1px solid rgba(200, 130, 10, 0.5);
}

.ysidebar-retro-toggle {
  background: rgba(20, 14, 0, 0.9);
}

.ysidebar-retro-dot {
  background: #ffcc44;
  box-shadow:
    0 0 8px #ffcc44,
    0 0 2px #ffcc44;
}

/* ═══════════════════════════════════════════════════════
   CANDY VARIANT
   ═══════════════════════════════════════════════════════ */
.ysidebar-candy-shell {
  background: linear-gradient(170deg, #fff0f8 0%, #f5f0ff 50%, #f0f8ff 100%);
}

.ysidebar-candy-logo {
  background: linear-gradient(135deg, #f472b6, #a78bfa, #60a5fa);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
}

.ysidebar-candy-active {
  background: linear-gradient(
    135deg,
    rgba(244, 114, 182, 0.12),
    rgba(167, 139, 250, 0.12)
  );
  box-shadow: 0 2px 8px rgba(167, 139, 250, 0.15);
}

.ysidebar-candy-badge {
  background: linear-gradient(135deg, #fce7f3, #ede9fe);
  border: 1px solid rgba(167, 139, 250, 0.3);
}

.ysidebar-candy-toggle {
  background: linear-gradient(135deg, #fce7f3, #ede9fe);
}

.ysidebar-candy-dot {
  background: linear-gradient(135deg, #f472b6, #a78bfa);
  box-shadow: 0 0 6px rgba(167, 139, 250, 0.5);
}

/* ═══════════════════════════════════════════════════════
   CARBON VARIANT
   ═══════════════════════════════════════════════════════ */
.ysidebar-carbon-shell {
  /* Carbon fiber weave pattern */
  background-color: #1a1a1a;
  background-image:
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 2px,
      rgba(255, 255, 255, 0.015) 2px,
      rgba(255, 255, 255, 0.015) 4px
    ),
    repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 2px,
      rgba(255, 255, 255, 0.015) 2px,
      rgba(255, 255, 255, 0.015) 4px
    );
}

.ysidebar-carbon-active {
  background: rgba(255, 255, 255, 0.06);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

/* ═══════════════════════════════════════════════════════
   OCEAN VARIANT
   ═══════════════════════════════════════════════════════ */
.ysidebar-ocean-shell {
  background: linear-gradient(180deg, #020d18 0%, #041824 40%, #020f1e 100%);
  /* Subtle bioluminescent shimmer at top */
  box-shadow: inset 0 60px 80px -40px rgba(6, 100, 140, 0.25);
}

.ysidebar-ocean-active {
  background: rgba(34, 211, 238, 0.08);
  box-shadow: 0 0 16px rgba(34, 211, 238, 0.06);
}

.ysidebar-ocean-badge {
  background: rgba(34, 211, 238, 0.1);
  border: 1px solid rgba(34, 211, 238, 0.25);
}

.ysidebar-ocean-toggle {
  background: rgba(2, 18, 36, 0.8);
}

.ysidebar-ocean-dot {
  background: #22d3ee;
  box-shadow: 0 0 8px rgba(34, 211, 238, 0.7);
}

/* ═══════════════════════════════════════════════════════
   ROSE VARIANT — uses raw hex, no extra CSS needed
   ═══════════════════════════════════════════════════════ */

.ysidebar-chalk-active {
  background: rgba(44, 36, 24, 0.07);
}

.ysidebar-chalk-active-border {
  /* Hand-drawn feel: rough left underline instead of solid bar */
  border-left: 3px solid transparent;
  position: relative;
}

.ysidebar-chalk-active-border::before {
  content: "";
  position: absolute;
  left: 0;
  top: 15%;
  bottom: 15%;
  width: 3px;
  background: #2c2418;
  border-radius: 2px;
  /* Sketch-like roughness via clip-path */
  clip-path: polygon(
    0% 0%,
    100% 4%,
    95% 20%,
    100% 38%,
    98% 55%,
    100% 72%,
    96% 88%,
    100% 100%,
    0% 100%
  );
}
</style>
