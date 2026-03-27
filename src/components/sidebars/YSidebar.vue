<script setup lang="ts">
import { computed, ref } from "vue";
import type {
  YSidebarProps,
  YSidebarVariant,
  YSidebarSize,
  YSidebarItem,
  YSidebarGroup,
} from "../../types/sidebar";

defineOptions({ inheritAttrs: false });

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

/* ── collapse state ── */
const isOpen = computed(() => props.open);
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
  emit("update:open", !props.open);
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
interface SizeScale {
  itemH: string;
  itemPx: string;
  itemText: string;
  iconSize: string;
  logoText: string;
  groupLabel: string;
  badgeText: string;
  childText: string;
  childPl: string;
}
const sizes: Record<YSidebarSize, SizeScale> = {
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
   Each variant defines:
   shell      – the sidebar container
   border     – border direction class
   item       – idle item
   itemHover  – hover
   itemActive – active state
   itemActiveBorder – left accent classes
   groupLabel – group header text
   badge      – badge bg + text
   logo       – logo area
   separator  – divider line
   toggle     – toggle button
   tooltip    – icon-mode tooltip
───────────────────────────────────────────── */
interface VariantTokens {
  shell: string;
  border: string;
  item: string;
  itemHover: string;
  itemActive: string;
  itemActiveBorder: string;
  groupLabel: string;
  badge: string;
  logo: string;
  separator: string;
  toggle: string;
  tooltip: string;
  iconDot: string;
}

const variants: Record<YSidebarVariant, VariantTokens> = {
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
};

const vt = computed(() => variants[props.variant]);

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
    emit("update:open", false);
  }
}

/* ── chevron SVG ── */
const chevronDown = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6l4 4 4-4"/></svg>`;
const chevronRight = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4l4 4-4 4"/></svg>`;
const menuIcon = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 4h12M2 8h12M2 12h12"/></svg>`;
const closeIcon = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 3l10 10M13 3L3 13"/></svg>`;
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
      v-if="(behavior === 'overlay' || behavior === 'drawer') && open"
      class="fixed inset-0 bg-black/30 backdrop-blur-[1px]"
      :style="{ zIndex: (zIndex ?? 40) - 1 }"
      @click="
        emit('close');
        emit('update:open', false);
      "
    />
  </Transition>

  <!-- Sidebar -->
  <aside
    role="navigation"
    :class="[
      'flex flex-col h-full overflow-hidden transition-[width] duration-[250ms] ease-out',
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
    @click="isMini ? emit('update:open', true) : undefined"
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
            v-html="logoIcon"
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
              @click="toggleGroup(group.id)"
              v-html="chevronRight"
            />
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
                    :aria-current="isActive(item.id) ? 'page' : undefined"
                    :disabled="item.disabled || undefined"
                    :class="[
                      'relative w-full flex items-center gap-2.5 transition-colors duration-150 select-none',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-current/30',
                      sc.itemH,
                      isIcons ? 'justify-center px-0' : sc.itemPx,
                      sc.itemText,
                      isActive(item.id)
                        ? [vt.itemActive, vt.itemActiveBorder]
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
                      v-html="item.icon"
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
                        v-html="chevronDown"
                      />

                      <!-- Badge -->
                      <span
                        v-else-if="item.badge !== undefined"
                        :class="[
                          'shrink-0 inline-flex items-center justify-center rounded-full min-w-[18px] h-[18px] px-1 font-semibold',
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
                        v-html="child.icon"
                      />
                      <span class="flex-1 truncate text-left">{{
                        child.label
                      }}</span>
                      <span
                        v-if="child.badge !== undefined"
                        :class="[
                          'shrink-0 inline-flex items-center justify-center rounded-full min-w-[18px] h-[18px] px-1 font-semibold',
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
          :aria-label="open ? 'Collapse sidebar' : 'Expand sidebar'"
          @click="toggle"
        >
          <span
            :class="[
              'w-3.5 h-3.5 transition-transform duration-200',
              !open ? 'rotate-180' : '',
            ]"
            v-html="open ? closeIcon : menuIcon"
          />
        </button>
      </div>
    </template>
  </aside>
</template>
