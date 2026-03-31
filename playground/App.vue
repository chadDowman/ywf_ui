<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch, watchEffect } from "vue";
import AutoPropsControls from "./controls/AutoPropsControls.vue";
import { resolveColorHex } from "./tailwind-colors";
import type {
  PlaygroundInspectorConfig,
  PlaygroundQuickConfig,
} from "./config/types";

type VueComponent = {
  name?: string;
  props?: Record<string, unknown> | string[];
};

type ComponentEntry = {
  id: string;
  label: string;
  category: string;
  sourcePath: string;
  component: VueComponent;
  props: string[];
  defaults: Record<string, unknown>;
  propTypes: Record<string, string[]>;
};

type ColorCssProperty =
  | "color"
  | "background-color"
  | "border-color"
  | "outline-color"
  | "caret-color"
  | "fill"
  | "stroke"
  | "--tw-ring-color"
  | "placeholder-color";

type ComponentColorTarget = {
  key: string;
  label: string;
  className: string;
  cssProperty: ColorCssProperty;
  defaultValue: string;
  cssVarName: string;
};

const modules = import.meta.glob("../src/components/*/*.vue", {
  eager: true,
  import: "default",
}) as Record<string, VueComponent>;

const sourceModules = import.meta.glob("../src/components/*/*.vue?raw", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const configModules = import.meta.glob("./config/*.ts", {
  eager: true,
}) as Record<
  string,
  {
    playgroundQuickConfig?: PlaygroundQuickConfig;
    playgroundInspectorConfig?: PlaygroundInspectorConfig;
    playgroundInspectorConfigs?: PlaygroundInspectorConfig[];
  }
>;

function titleCase(input: string): string {
  return input
    .replace(/[-_]/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function readDefaultValue(value: unknown): unknown {
  if (typeof value === "function") {
    try {
      return (value as () => unknown)();
    } catch {
      return undefined;
    }
  }
  return value;
}

function readProps(component: VueComponent): {
  names: string[];
  defaults: Record<string, unknown>;
  types: Record<string, string[]>;
} {
  const defaults: Record<string, unknown> = {};
  const types: Record<string, string[]> = {};

  function mapCtorToTypeName(ctor: unknown): string {
    if (ctor === String) return "string";
    if (ctor === Number) return "number";
    if (ctor === Boolean) return "boolean";
    if (ctor === Array) return "array";
    if (ctor === Object) return "object";
    return "unknown";
  }

  function readTypeInfo(raw: unknown): string[] {
    if (!raw || typeof raw !== "object") return [];
    const propObj = raw as { type?: unknown };
    const t = propObj.type;
    if (Array.isArray(t)) {
      return t.map((entry) => mapCtorToTypeName(entry));
    }
    if (t) {
      return [mapCtorToTypeName(t)];
    }
    return [];
  }

  if (!component?.props) {
    return { names: [], defaults, types };
  }

  if (Array.isArray(component.props)) {
    return { names: [...component.props], defaults, types };
  }

  const names = Object.keys(component.props);
  for (const name of names) {
    const raw = component.props[name] as unknown;
    const typeInfo = readTypeInfo(raw);
    if (typeInfo.length) {
      types[name] = typeInfo;
    }
    if (
      raw &&
      typeof raw === "object" &&
      Object.prototype.hasOwnProperty.call(raw, "default")
    ) {
      const defaultValue = readDefaultValue(
        (raw as { default?: unknown }).default,
      );
      if (defaultValue !== undefined) {
        defaults[name] = defaultValue;
      }
    }
  }

  return { names, defaults, types };
}

function sanitizeColorKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function getColorCssProperty(prefix: string): ColorCssProperty | null {
  if (prefix === "text") return "color";
  if (prefix === "bg") return "background-color";
  if (prefix === "border") return "border-color";
  if (prefix === "outline") return "outline-color";
  if (prefix === "caret") return "caret-color";
  if (prefix === "fill") return "fill";
  if (prefix === "stroke") return "stroke";
  if (prefix === "ring") return "--tw-ring-color";
  if (prefix === "placeholder") return "placeholder-color";
  return null;
}

function normalizeHex(value: string): string | null {
  const hex = value.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(hex)) return hex;
  if (/^#[0-9a-fA-F]{3}$/.test(hex)) {
    const v = hex.slice(1);
    return `#${v[0]}${v[0]}${v[1]}${v[1]}${v[2]}${v[2]}`;
  }
  if (/^#[0-9a-fA-F]{8}$/.test(hex)) return `#${hex.slice(1, 7)}`;
  if (/^#[0-9a-fA-F]{4}$/.test(hex)) {
    const v = hex.slice(1);
    return `#${v[0]}${v[0]}${v[1]}${v[1]}${v[2]}${v[2]}`;
  }
  return null;
}

function escapeCssClassName(className: string): string {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return CSS.escape(className);
  }
  return className.replace(/([^a-zA-Z0-9_-])/g, "\\$1");
}

const components = computed<ComponentEntry[]>(() => {
  return Object.entries(modules)
    .map(([path, component]) => {
      const segments = path.split("/");
      const fileName = segments[segments.length - 1]?.replace(".vue", "") ?? "";
      const category = segments[segments.length - 2] ?? "components";
      const id = fileName || path;
      const label = fileName.startsWith("Y") ? fileName.slice(1) : fileName;
      const normalizedLabel =
        fileName === "YButton"
          ? "Buttons"
          : fileName === "YCard"
            ? "Cards"
            : titleCase(label);
      const propInfo = readProps(component);
      return {
        id,
        label: normalizedLabel,
        category: titleCase(category),
        sourcePath: path,
        component,
        props: propInfo.names,
        defaults: propInfo.defaults,
        propTypes: propInfo.types,
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));
});

const quickConfigByComponent = computed<Record<string, PlaygroundQuickConfig>>(
  () => {
    const out: Record<string, PlaygroundQuickConfig> = {};
    for (const mod of Object.values(configModules)) {
      const cfg = mod.playgroundQuickConfig;
      if (cfg?.componentId) {
        out[cfg.componentId] = cfg;
      }
    }
    return out;
  },
);

const inspectorConfigByComponent = computed<
  Record<string, PlaygroundInspectorConfig>
>(() => {
  const out: Record<string, PlaygroundInspectorConfig> = {};
  for (const mod of Object.values(configModules)) {
    const single = mod.playgroundInspectorConfig;
    if (single?.componentId) {
      out[single.componentId] = single;
    }
    for (const cfg of mod.playgroundInspectorConfigs ?? []) {
      if (cfg.componentId) {
        out[cfg.componentId] = cfg;
      }
    }
  }
  return out;
});

const search = ref("");
const activeId = ref("");
const navCollapsed = ref(false);
const darkMode = ref(localStorage.getItem("ywf-dark-mode") === "true");
const categoryFilter = ref<string>("All");

watch(darkMode, (v) => localStorage.setItem("ywf-dark-mode", String(v)));

watch(
  components,
  (list) => {
    if (!list.length) {
      activeId.value = "";
      return;
    }
    if (!activeId.value || !list.some((c) => c.id === activeId.value)) {
      activeId.value = list[0].id;
    }
  },
  { immediate: true },
);

const filteredComponents = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return components.value;
  return components.value.filter((c) => {
    return (
      c.label.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      c.props.some((p) => p.toLowerCase().includes(q))
    );
  });
});

const groupedFilteredComponents = computed(() => {
  const groups = new Map<string, ComponentEntry[]>();
  for (const item of filteredComponents.value) {
    const list = groups.get(item.category) ?? [];
    list.push(item);
    groups.set(item.category, list);
  }
  return Array.from(groups.entries()).map(([category, items]) => ({
    category,
    items,
  }));
});

const visibleGroups = computed(() => {
  if (categoryFilter.value === "All") return groupedFilteredComponents.value;
  return groupedFilteredComponents.value.filter(
    (group) => group.category === categoryFilter.value,
  );
});

function getCategoryItemCount(group: { items: ComponentEntry[] }): number {
  if (group.items.length === 1) {
    const opts = getQuickOptions(group.items[0].id);
    return opts.length || 1;
  }
  return group.items.length;
}

const categoryChips = computed(() => {
  const groups = groupedFilteredComponents.value.map((group) => ({
    category: group.category,
    count: getCategoryItemCount(group),
  }));
  const total = groups.reduce((sum, group) => sum + group.count, 0);
  return [{ category: "All", count: total }, ...groups];
});

const openCategories = ref<string[]>([]);

watch(
  groupedFilteredComponents,
  (groups) => {
    const available = new Set(groups.map((g) => g.category));
    openCategories.value = openCategories.value.filter((category) =>
      available.has(category),
    );

    if (
      categoryFilter.value !== "All" &&
      !available.has(categoryFilter.value)
    ) {
      categoryFilter.value = "All";
    }
  },
  { immediate: true },
);

function isCategoryOpen(category: string): boolean {
  return openCategories.value.includes(category);
}

function toggleCategory(category: string): void {
  if (isCategoryOpen(category)) {
    openCategories.value = [];
    return;
  }
  openCategories.value = [category];
  const group = groupedFilteredComponents.value.find(
    (g) => g.category === category,
  );
  if (group && group.items.length === 1) {
    activeId.value = group.items[0].id;
  }
}

function handleNavClick(componentId: string): void {
  activeId.value = componentId;
  const selected = components.value.find(
    (component) => component.id === componentId,
  );
  if (selected && categoryFilter.value !== "All") {
    categoryFilter.value = selected.category;
  }
}

function showCategory(category: string): void {
  categoryFilter.value = category;
  if (category !== "All" && !openCategories.value.includes(category)) {
    openCategories.value = [...openCategories.value, category];
  }
}

function expandAllCategories(): void {
  openCategories.value = groupedFilteredComponents.value.map((g) => g.category);
}

function collapseAllCategories(): void {
  openCategories.value = [];
}

function getQuickConfig(componentId: string): PlaygroundQuickConfig | null {
  return quickConfigByComponent.value[componentId] ?? null;
}

function getInspectorConfig(
  componentId: string,
): PlaygroundInspectorConfig | null {
  return inspectorConfigByComponent.value[componentId] ?? null;
}

function getQuickOptions(componentId: string): string[] {
  const cfg = getQuickConfig(componentId);
  if (!cfg) return [];
  return [...cfg.options];
}

function getQuickSelected(componentId: string): string {
  const cfg = getQuickConfig(componentId);
  if (!cfg) return "";
  const current = parsedProps.value[cfg.propKey];
  return typeof current === "string" ? current : "";
}

function applyQuickOption(componentId: string, option: string): void {
  const cfg = getQuickConfig(componentId);
  if (!cfg) return;
  activeId.value = componentId;
  updatePropsJson((next) => {
    next[cfg.propKey] = option;
    cfg.applyOption?.(next, option);
  });
}

const activeComponent = computed(
  () => components.value.find((c) => c.id === activeId.value) ?? null,
);

const activeInspectorConfig = computed<PlaygroundInspectorConfig | null>(() => {
  if (!activeComponent.value) return null;
  return getInspectorConfig(activeComponent.value.id);
});

const propsJson = ref("{}");
const slotContent = ref('<div class="p-3 text-sm">Default slot content</div>');
const copied = ref(false);

function updatePropsJson(
  updater: (value: Record<string, unknown>) => void,
): void {
  let next: Record<string, unknown> = {};
  try {
    const parsed = JSON.parse(propsJson.value) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      next = { ...(parsed as Record<string, unknown>) };
    }
  } catch {
    next = {};
  }
  updater(next);
  propsJson.value = JSON.stringify(next, null, 2);
}

watch(
  activeComponent,
  (c) => {
    if (!c) {
      propsJson.value = "{}";
      return;
    }
    const defaults = { ...c.defaults };
    const quickCfg = getQuickConfig(c.id);
    if (quickCfg?.init) {
      quickCfg.init(defaults);
    }
    const inspectorCfg = getInspectorConfig(c.id);
    if (inspectorCfg?.init) {
      inspectorCfg.init(defaults);
    }
    propsJson.value = JSON.stringify(defaults, null, 2);
  },
  { immediate: true },
);

const parsedProps = computed<Record<string, unknown>>(() => {
  try {
    const parsed = JSON.parse(propsJson.value) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
    return {};
  } catch {
    return {};
  }
});

const activeComponentSource = computed(() => {
  if (!activeComponent.value) return "";
  return sourceModules[`${activeComponent.value.sourcePath}?raw`] ?? "";
});

const detectedColorTargets = computed<ComponentColorTarget[]>(() => {
  const source = activeComponentSource.value;
  if (!source) return [];

  const targets: ComponentColorTarget[] = [];
  const seen = new Set<string>();

  const utilityRegex =
    /\b((?:[a-z-]+:)*)((text|bg|border|ring|outline|placeholder|caret|fill|stroke)-((?:[a-z]+(?:-[a-z]+)?(?:-\d{2,3})?|black|white))(?:\/\d{1,3})?)\b/g;
  for (const match of source.matchAll(utilityRegex)) {
    const fullClass = match[0];
    const prefix = match[3];
    const paletteKey = match[4];
    const cssProperty = getColorCssProperty(prefix);
    const seenKey = `${fullClass}|${cssProperty}`;
    if (!cssProperty || seen.has(seenKey)) continue;

    let defaultValue = "#000000";
    try {
      defaultValue = resolveColorHex(paletteKey);
    } catch {
      defaultValue = "#000000";
    }

    const key = `__pc_${sanitizeColorKey(fullClass)}`;
    const cssVarName = `--${sanitizeColorKey(`pg-${fullClass}`)}`;
    targets.push({
      key,
      label: fullClass,
      className: fullClass,
      cssProperty,
      defaultValue,
      cssVarName,
    });
    seen.add(seenKey);
  }

  const arbitraryHexRegex =
    /\b((?:[a-z-]+:)*)((text|bg|border|ring|outline|placeholder|caret|fill|stroke)-\[(#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8}))\])\b/g;
  for (const match of source.matchAll(arbitraryHexRegex)) {
    const fullClass = match[0];
    const prefix = match[3];
    const rawHex = match[4];
    const cssProperty = getColorCssProperty(prefix);
    const seenKey = `${fullClass}|${cssProperty}`;
    if (!cssProperty || seen.has(seenKey)) continue;

    const normalized = normalizeHex(rawHex);
    if (!normalized) continue;

    const key = `__pc_${sanitizeColorKey(fullClass)}`;
    const cssVarName = `--${sanitizeColorKey(`pg-${fullClass}`)}`;
    targets.push({
      key,
      label: fullClass,
      className: fullClass,
      cssProperty,
      defaultValue: normalized,
      cssVarName,
    });
    seen.add(seenKey);
  }

  const cssBlockRegex = /([^{}]+)\{([^{}]+)\}/g;
  const cssColorDeclRegex =
    /(color|background(?:-color)?|border(?:-color)?|outline-color|fill|stroke)\s*:\s*(#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8}))/g;
  for (const blockMatch of source.matchAll(cssBlockRegex)) {
    const selectorText = blockMatch[1] ?? "";
    const declarations = blockMatch[2] ?? "";

    const classMatches = [...selectorText.matchAll(/\.([_a-zA-Z0-9\\:-]+)/g)];
    if (!classMatches.length) continue;

    for (const declMatch of declarations.matchAll(cssColorDeclRegex)) {
      const rawProperty = (declMatch[1] ?? "").trim();
      const rawHex = declMatch[2] ?? "";
      const normalized = normalizeHex(rawHex);
      if (!normalized) continue;

      const cssProperty: ColorCssProperty =
        rawProperty === "background"
          ? "background-color"
          : (rawProperty as ColorCssProperty);

      for (const classMatch of classMatches) {
        const className = (classMatch[1] ?? "").replace(/\\:/g, ":");
        const seenKey = `${className}|${cssProperty}`;
        if (!className || seen.has(seenKey)) continue;

        const key = `__pc_${sanitizeColorKey(`${className}-${cssProperty}`)}`;
        const cssVarName = `--${sanitizeColorKey(`pg-${className}-${cssProperty}`)}`;
        targets.push({
          key,
          label: `${className} (${cssProperty})`,
          className,
          cssProperty,
          defaultValue: normalized,
          cssVarName,
        });
        seen.add(seenKey);
      }
    }
  }

  return targets;
});

const previewOverrideStyle = computed<Record<string, string>>(() => {
  const style: Record<string, string> = {};
  for (const target of detectedColorTargets.value) {
    const raw = parsedProps.value[target.key];
    if (typeof raw !== "string") continue;
    const value = raw.trim();
    if (!value) continue;
    style[target.cssVarName] = value;
  }
  return style;
});

const hasPreviewColorOverrides = computed(
  () => Object.keys(previewOverrideStyle.value).length > 0,
);

const componentColorOverrideCss = computed(() => {
  if (!detectedColorTargets.value.length) return "";

  return detectedColorTargets.value
    .map((target) => {
      const selector = `.preview-color-overrides .${escapeCssClassName(target.className)}`;
      const value = `var(${target.cssVarName})`;

      if (target.cssProperty === "placeholder-color") {
        return `${selector}::placeholder { color: ${value} !important; }`;
      }
      if (target.cssProperty === "--tw-ring-color") {
        return `${selector} { --tw-ring-color: ${value} !important; }`;
      }
      return `${selector} { ${target.cssProperty}: ${value} !important; }`;
    })
    .join("\n");
});

let componentColorStyleEl: HTMLStyleElement | null = null;

watchEffect(() => {
  if (typeof document === "undefined") return;
  const css = componentColorOverrideCss.value;

  if (!css) {
    if (componentColorStyleEl) {
      componentColorStyleEl.remove();
      componentColorStyleEl = null;
    }
    return;
  }

  if (!componentColorStyleEl) {
    componentColorStyleEl = document.createElement("style");
    componentColorStyleEl.setAttribute("data-ywf-preview-overrides", "true");
    document.head.appendChild(componentColorStyleEl);
  }

  if (componentColorStyleEl.textContent !== css) {
    componentColorStyleEl.textContent = css;
  }
});

onBeforeUnmount(() => {
  if (!componentColorStyleEl) return;
  componentColorStyleEl.remove();
  componentColorStyleEl = null;
});

/** Merge the playground dark-mode toggle into every component render. */
const finalProps = computed<Record<string, unknown>>(() => {
  const allowedProps = new Set(activeComponent.value?.props ?? []);
  const next: Record<string, unknown> = Object.fromEntries(
    Object.entries(parsedProps.value).filter(([key]) => allowedProps.has(key)),
  );

  next.dark = darkMode.value;
  return next;
});

const hasPropsError = computed(() => {
  try {
    JSON.parse(propsJson.value);
    return false;
  } catch {
    return true;
  }
});

const topBarTitle = computed(() => {
  if (!activeComponent.value) return "No Components";
  return `${activeComponent.value.label} Preview`;
});

const topBarSubtitle = computed(() => {
  if (!activeComponent.value) return "Add components in src/components/*/*.vue";
  return `${activeComponent.value.category} component`;
});

const activeQuickOptions = computed<string[]>(() => {
  if (!activeComponent.value) return [];
  const cfg = getQuickConfig(activeComponent.value.id);
  if (!cfg) return [];
  return [...cfg.options];
});

const isNavbarActive = computed(() => activeComponent.value?.id === "YNavbar");
const isSidebarActive = computed(
  () => activeComponent.value?.id === "YSidebar",
);

const previewSnippet = computed(() => {
  if (!activeComponent.value) return "";
  const name = activeComponent.value.component.name ?? activeComponent.value.id;
  const props = Object.entries(finalProps.value)
    .map(([k, v]) => {
      if (typeof v === "string") return `  ${k}=${JSON.stringify(v)}`;
      return `  :${k}='${JSON.stringify(v)}'`;
    })
    .join("\n");

  if (!slotContent.value.trim()) {
    return `<${name}${props ? "\n" + props : ""}\n/>`;
  }

  return `<${name}${props ? "\n" + props : ""}>\n${slotContent.value}\n</${name}>`;
});

function copySnippet(): void {
  if (!previewSnippet.value) return;
  navigator.clipboard.writeText(previewSnippet.value);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 1600);
}
</script>

<template>
  <div
    class="playground-root flex h-screen overflow-hidden font-sans transition-colors duration-300"
    :class="darkMode ? 'dark-scheme' : 'light-scheme'"
  >
    <nav
      class="nav-panel flex shrink-0 flex-col transition-all duration-300 ease-out"
      :class="navCollapsed ? 'w-14' : 'w-64'"
    >
      <div class="nav-header flex h-14 items-center px-3">
        <button
          class="nav-toggle flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-200"
          @click="navCollapsed = !navCollapsed"
        >
          <svg
            class="h-4 w-4 transition-transform duration-300"
            :style="{
              transform: navCollapsed ? 'rotate(0deg)' : 'rotate(90deg)',
            }"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
        <span
          v-if="!navCollapsed"
          class="ml-2 text-xs font-semibold uppercase tracking-wide"
          >YWF UI</span
        >
      </div>

      <div v-if="!navCollapsed" class="px-3 pb-2">
        <input
          v-model="search"
          id="playground-component-search"
          name="componentSearch"
          type="text"
          class="search-input w-full rounded-lg px-3 py-2 text-xs"
          placeholder="Search components or props"
          aria-label="Search components or props"
        />

        <div class="nav-toolbar mt-2 flex items-center justify-between gap-2">
          <button class="nav-toolbar-btn" @click="expandAllCategories">
            Expand all
          </button>
          <button class="nav-toolbar-btn" @click="collapseAllCategories">
            Collapse all
          </button>
        </div>

        <div class="nav-chips mt-2">
          <button
            v-for="chip in categoryChips"
            :key="chip.category"
            class="nav-chip"
            :class="categoryFilter === chip.category ? 'nav-chip--active' : ''"
            @click="showCategory(chip.category)"
          >
            <span>{{ chip.category }}</span>
            <span class="nav-chip-count">{{ chip.count }}</span>
          </button>
        </div>
      </div>

      <ul
        v-if="navCollapsed"
        class="flex-1 space-y-1 overflow-y-auto px-2 pb-3"
      >
        <li v-for="item in filteredComponents" :key="item.id">
          <button
            class="nav-item flex w-full items-center justify-center rounded-lg px-2.5 py-2 text-left text-xs transition-all"
            :class="activeId === item.id ? 'nav-item--active' : ''"
            :title="`${item.label} (${item.category})`"
            @click="handleNavClick(item.id)"
          >
            <span class="nav-item-dot h-2 w-2 shrink-0 rounded-full" />
          </button>
        </li>
      </ul>

      <div v-else class="flex-1 overflow-y-auto px-2 pb-3 space-y-2">
        <section
          v-for="group in visibleGroups"
          :key="group.category"
          class="space-y-1"
        >
          <button
            class="nav-category flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide"
            @click="toggleCategory(group.category)"
          >
            <span class="inline-flex items-center gap-1.5">
              <span>{{ group.category }}</span>
              <span class="nav-category-count">{{
                getCategoryItemCount(group)
              }}</span>
            </span>
            <svg
              class="h-3.5 w-3.5 transition-transform duration-150"
              :style="{
                transform: isCategoryOpen(group.category)
                  ? 'rotate(90deg)'
                  : 'rotate(0deg)',
              }"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <!-- Single-item category: skip component row, show quick options directly -->
          <ul
            v-if="
              isCategoryOpen(group.category) &&
              group.items.length === 1 &&
              getQuickOptions(group.items[0].id).length
            "
            class="nav-sublist mt-1 mb-2 ml-4 mr-2 space-y-1"
          >
            <li
              v-for="option in getQuickOptions(group.items[0].id)"
              :key="option"
            >
              <button
                class="nav-subitem w-full rounded-md px-2 py-1.5 text-left text-[11px] transition-all duration-150"
                :class="
                  getQuickSelected(group.items[0].id) === option
                    ? 'nav-subitem--active'
                    : ''
                "
                @click="applyQuickOption(group.items[0].id, option)"
              >
                {{ option }}
              </button>
            </li>
          </ul>

          <!-- Multi-item category: show component rows with nested quick options -->
          <ul v-else-if="isCategoryOpen(group.category)" class="space-y-1">
            <li v-for="item in group.items" :key="item.id">
              <button
                class="nav-item flex w-full items-center rounded-lg px-2.5 py-2 text-left text-xs transition-all"
                :class="activeId === item.id ? 'nav-item--active' : ''"
                :title="`${item.label} (${item.category})`"
                @click="handleNavClick(item.id)"
              >
                <span class="nav-item-dot h-2 w-2 shrink-0 rounded-full" />
                <div class="ml-2 min-w-0">
                  <div class="truncate font-medium">{{ item.label }}</div>
                </div>
              </button>

              <ul
                v-if="activeId === item.id && getQuickOptions(item.id).length"
                class="nav-sublist mt-1 mb-2 ml-6 mr-2 space-y-1"
              >
                <li v-for="option in getQuickOptions(item.id)" :key="option">
                  <button
                    class="nav-subitem w-full rounded-md px-2 py-1.5 text-left text-[11px] transition-all duration-150"
                    :class="
                      getQuickSelected(item.id) === option
                        ? 'nav-subitem--active'
                        : ''
                    "
                    @click="applyQuickOption(item.id, option)"
                  >
                    {{ option }}
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </section>
      </div>

      <div class="border-t border-(--border-panel) p-3">
        <button
          class="theme-toggle w-full rounded-lg py-1.5 text-xs"
          @click="darkMode = !darkMode"
        >
          {{ darkMode ? "Light" : "Dark" }}
        </button>
      </div>
    </nav>

    <main class="flex min-w-0 flex-1 flex-col overflow-hidden">
      <header
        class="top-bar flex h-14 shrink-0 items-center justify-between px-6"
      >
        <div>
          <h2 class="text-base font-semibold">{{ topBarTitle }}</h2>
          <p class="text-[11px] opacity-70">{{ topBarSubtitle }}</p>
        </div>
        <button
          class="copy-btn rounded-lg px-3 py-1.5 text-xs"
          @click="copySnippet"
        >
          {{ copied ? "Copied" : "Copy code" }}
        </button>
      </header>

      <div class="flex-1 overflow-y-auto p-6">
        <div class="space-y-5">
          <div
            class="preview-stage min-h-72 rounded-2xl p-6"
            :class="[
              ['YButton', 'YAvatar'].includes(activeComponent?.id ?? '')
                ? 'flex items-center justify-center'
                : '',
              activeComponent?.id === 'YModal'
                ? 'relative overflow-hidden'
                : '',
              hasPreviewColorOverrides ? 'preview-color-overrides' : '',
            ]"
            :style="previewOverrideStyle"
          >
            <div v-if="!activeComponent" class="text-sm opacity-70">
              No components found. Add one under
              src/components/&lt;category&gt;/YName.vue.
            </div>
            <div v-else-if="isNavbarActive" class="navbar-preview-shell">
              <component :is="activeComponent.component" v-bind="finalProps">
                <div v-html="slotContent" />
              </component>
              <div class="navbar-preview-content">
                <h3>Navbar Preview Context</h3>
                <p>
                  This area simulates page content so sticky and floating navbar
                  variants are easier to evaluate.
                </p>
              </div>
            </div>
            <div v-else-if="isSidebarActive" class="sidebar-preview-shell">
              <component :is="activeComponent.component" v-bind="finalProps" />
              <div class="sidebar-preview-content">
                <h3>Sidebar Preview Context</h3>
                <p>
                  This content area simulates an app workspace so spacing,
                  width, and navigation rhythm feel like a real sidebar layout.
                </p>
                <div class="sidebar-preview-grid">
                  <div class="sidebar-preview-card" />
                  <div class="sidebar-preview-card" />
                  <div class="sidebar-preview-card" />
                </div>
              </div>
            </div>
            <component
              :is="activeComponent?.component"
              v-else
              v-bind="finalProps"
            >
              <div v-html="slotContent" />
            </component>
          </div>

          <div class="code-block overflow-hidden rounded-xl">
            <div
              class="code-block-header px-4 py-2 text-[11px] uppercase tracking-wide"
            >
              Vue Template
            </div>
            <pre
              class="code-block-body px-4 py-3 text-[13px]"
            ><code>{{ previewSnippet }}</code></pre>
          </div>
        </div>
      </div>
    </main>

    <aside class="props-panel w-96 shrink-0 space-y-4 overflow-y-auto p-4">
      <div class="props-panel-head">
        <p class="props-kicker">Inspector</p>
        <h2 class="props-title">
          {{ activeComponent?.label ?? "Properties" }}
        </h2>
      </div>

      <section
        v-if="activeComponent && activeQuickOptions.length"
        class="props-section"
      >
        <h3 class="props-section-title">Quick Variations</h3>
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="option in activeQuickOptions"
            :key="option"
            class="chip chip-button"
            :class="
              getQuickSelected(activeComponent.id) === option
                ? 'chip-button--active'
                : ''
            "
            @click="applyQuickOption(activeComponent.id, option)"
          >
            {{ option }}
          </button>
        </div>
      </section>

      <section v-if="activeComponent" class="props-section">
        <AutoPropsControls
          :prop-names="activeComponent.props"
          :prop-types="activeComponent.propTypes"
          :parsed-props="parsedProps"
          :detected-color-targets="detectedColorTargets"
          :inspector-config="activeInspectorConfig"
          :update-props-json="updatePropsJson"
        />
      </section>

      <section class="props-section">
        <h3 class="props-section-title">Props JSON</h3>
        <textarea
          v-model="propsJson"
          id="playground-props-json"
          name="propsJson"
          aria-label="Props JSON"
          class="prop-input min-h-64 w-full font-mono text-xs"
          :class="hasPropsError ? 'border-red-500' : ''"
          spellcheck="false"
        />
        <p v-if="hasPropsError" class="text-xs text-red-500">
          Invalid JSON. Preview is using empty props.
        </p>
      </section>

      <section class="props-section">
        <h3 class="props-section-title">Default Slot HTML</h3>
        <textarea
          v-model="slotContent"
          id="playground-slot-html"
          name="slotContent"
          aria-label="Default slot HTML"
          class="prop-input min-h-32 w-full font-mono text-xs"
          spellcheck="false"
        />
      </section>

      <section class="props-section">
        <h3 class="props-section-title">Detected Props</h3>
        <div v-if="activeComponent?.props.length" class="flex flex-wrap gap-1">
          <span v-for="p in activeComponent.props" :key="p" class="chip">{{
            p
          }}</span>
        </div>
        <p v-else class="text-xs opacity-70">
          No runtime props detected for this component.
        </p>
      </section>
    </aside>
  </div>
</template>

<style scoped>
.light-scheme {
  --bg-root: #eef3f8;
  --bg-panel: #ffffff;
  --bg-panel-hover: #f6f8fb;
  --bg-stage: #ffffff;
  --bg-input: #f3f6fa;
  --bg-chip: #edf2f8;
  --bg-chip-active: #1f3556;
  --bg-code: #111827;
  --bg-code-header: #0b1220;
  --border-panel: #dce4ef;
  --border-input: #d4deea;
  --text-primary: #0f172a;
  --text-secondary: #64748b;
  --text-code: #86efac;
  --text-accent: #2563eb;
}
.dark-scheme {
  --bg-root: #090d15;
  --bg-panel: #0f1726;
  --bg-panel-hover: #151f31;
  --bg-stage: #0e1626;
  --bg-input: #162135;
  --bg-chip: #1b2a43;
  --bg-chip-active: #3b82f6;
  --bg-code: #070b12;
  --bg-code-header: #05080e;
  --border-panel: #1f2f4a;
  --border-input: #2a3f62;
  --text-primary: #e2e8f0;
  --text-secondary: #94a3b8;
  --text-code: #86efac;
  --text-accent: #60a5fa;
}
.playground-root {
  background: var(--bg-root);
  color: var(--text-primary);
  font-family: var(--ywf-font-sans);
}
.nav-panel {
  background: var(--bg-panel);
  border-right: 1px solid var(--border-panel);
}
.nav-header {
  border-bottom: 1px solid var(--border-panel);
}
.nav-toggle:hover {
  background: var(--bg-panel-hover);
}
.search-input {
  background: var(--bg-input);
  border: 1px solid var(--border-input);
}
.nav-toolbar-btn {
  flex: 1;
  background: var(--bg-input);
  border: 1px solid var(--border-input);
  color: var(--text-secondary);
  border-radius: 8px;
  padding: 5px 8px;
  font-size: 11px;
  font-weight: 600;
  transition:
    border-color 120ms ease,
    color 120ms ease,
    transform 120ms ease;
}
.nav-toolbar-btn:hover {
  color: var(--text-primary);
  border-color: color-mix(in srgb, var(--text-accent) 24%, transparent);
  transform: translateY(-1px);
}
.nav-chips {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 2px;
}
.nav-chips::-webkit-scrollbar {
  height: 5px;
}
.nav-chips::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--border-input) 70%, transparent);
  border-radius: 999px;
}
.nav-chip {
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--border-input) 80%, transparent);
  background: var(--bg-input);
  color: var(--text-secondary);
  padding: 4px 8px;
  font-size: 11px;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  transition:
    border-color 120ms ease,
    color 120ms ease,
    background-color 120ms ease,
    transform 120ms ease;
}
.nav-chip:hover {
  color: var(--text-primary);
  border-color: color-mix(in srgb, var(--text-accent) 24%, transparent);
  transform: translateY(-1px);
}
.nav-chip--active {
  background: color-mix(in srgb, var(--text-accent) 14%, transparent);
  border-color: color-mix(in srgb, var(--text-accent) 32%, transparent);
  color: var(--text-accent);
}
.nav-chip-count {
  min-width: 16px;
  height: 16px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  background: color-mix(in srgb, var(--border-input) 70%, transparent);
}
.nav-chip--active .nav-chip-count {
  background: color-mix(in srgb, var(--text-accent) 24%, transparent);
}
.nav-item {
  color: var(--text-secondary);
}
.nav-category {
  color: var(--text-secondary);
}
.nav-category-count {
  min-width: 16px;
  height: 16px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  background: color-mix(in srgb, var(--border-input) 68%, transparent);
}
.nav-category:hover {
  background: var(--bg-panel-hover);
  color: var(--text-primary);
}
.nav-item:hover {
  background: var(--bg-panel-hover);
  color: var(--text-primary);
}
.nav-item--active {
  background: color-mix(in srgb, var(--text-accent) 12%, transparent);
  color: var(--text-accent);
}
.nav-subitem {
  color: var(--text-secondary);
  border: 1px solid transparent;
  text-transform: capitalize;
}
.nav-subitem:hover {
  background: var(--bg-panel-hover);
  color: var(--text-primary);
}
.nav-subitem--active {
  background: color-mix(in srgb, var(--text-accent) 12%, transparent);
  color: var(--text-accent);
  border-color: color-mix(in srgb, var(--text-accent) 20%, transparent);
}
.nav-item-dot {
  background: var(--border-input);
}
.nav-item--active .nav-item-dot {
  background: var(--text-accent);
}
.theme-toggle {
  background: var(--bg-input);
  border: 1px solid var(--border-input);
}
.top-bar {
  border-bottom: 1px solid var(--border-panel);
}
.copy-btn {
  background: var(--bg-input);
  border: 1px solid var(--border-input);
}
.preview-stage {
  background: var(--bg-stage);
  border: 1px solid var(--border-panel);
  box-shadow:
    0 12px 28px color-mix(in srgb, var(--text-accent) 8%, transparent),
    0 2px 6px color-mix(in srgb, #0f172a 7%, transparent);
}
.code-block {
  border: 1px solid var(--border-panel);
}
.code-block-header {
  background: var(--bg-code-header);
  color: var(--text-secondary);
}
.code-block-body {
  margin: 0;
  overflow-x: auto;
  background: var(--bg-code);
  color: var(--text-code);
  font-family: "JetBrains Mono", "Cascadia Code", monospace;
}
.props-panel {
  background: var(--bg-panel);
  border-left: 1px solid var(--border-panel);
}
.props-panel-head {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 6px 8px;
}
.props-kicker {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 10px;
  font-weight: 700;
  color: var(--text-secondary);
}
.props-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.2;
}
.props-section {
  border: 1px solid var(--border-panel);
  background: color-mix(in srgb, var(--bg-panel) 88%, var(--bg-input));
  border-radius: 12px;
  padding: 10px;
}
.props-section-title {
  margin: 0 0 8px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 10px;
  font-weight: 700;
  color: var(--text-secondary);
}
.prop-input {
  background: var(--bg-input);
  border: 1px solid var(--border-input);
  border-radius: 8px;
  padding: 8px 10px;
  color: var(--text-primary);
  transition:
    border-color 120ms ease,
    box-shadow 120ms ease,
    background-color 120ms ease;
}
.prop-input:focus {
  outline: none;
  border-color: color-mix(in srgb, var(--text-accent) 45%, var(--border-input));
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--text-accent) 16%, transparent);
}
.prop-label {
  display: block;
  margin-bottom: 4px;
  font-size: 11px;
  color: var(--text-secondary);
}
.prop-divider {
  height: 1px;
  background: var(--border-panel);
  margin-top: 8px;
}
.color-input-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}
.color-swatch {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 2px solid var(--border-input);
  cursor: pointer;
  padding: 0;
  -webkit-appearance: none;
  appearance: none;
  flex-shrink: 0;
}
.color-swatch::-webkit-color-swatch-wrapper {
  padding: 0;
}
.color-swatch::-webkit-color-swatch {
  border: none;
  border-radius: 6px;
}
.chip {
  border-radius: 999px;
  background: var(--bg-chip);
  border: 1px solid color-mix(in srgb, var(--border-input) 65%, transparent);
  padding: 4px 9px;
  font-size: 11px;
}
.chip-button {
  border: 1px solid color-mix(in srgb, var(--border-input) 80%, transparent);
  cursor: pointer;
  text-transform: capitalize;
  transition:
    background-color 120ms ease,
    color 120ms ease,
    transform 120ms ease,
    border-color 120ms ease;
}
.chip-button:hover {
  transform: translateY(-1px);
  border-color: color-mix(in srgb, var(--text-accent) 28%, transparent);
}
.chip-button--active {
  background: var(--bg-chip-active);
  color: #fff;
}

.navbar-preview-shell {
  width: 100%;
  min-height: 360px;
  border: 1px solid var(--border-panel);
  border-radius: 14px;
  overflow: hidden;
  background:
    radial-gradient(circle at top right, #e0e7ff 0%, transparent 42%),
    radial-gradient(circle at 15% 100%, #bfdbfe 0%, transparent 35%),
    linear-gradient(180deg, #f8fafc 0%, #edf3fb 100%);
}

.navbar-preview-content {
  padding: 22px;
  color: #334155;
}

.navbar-preview-content h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
}

.navbar-preview-content p {
  margin: 8px 0 0;
  font-size: 12px;
  line-height: 1.45;
}

.sidebar-preview-shell {
  width: 100%;
  min-height: 360px;
  border: 1px solid var(--border-panel);
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  background:
    radial-gradient(circle at top right, #dbeafe 0%, transparent 42%),
    linear-gradient(180deg, #f8fafc 0%, #edf3fb 100%);
}

.sidebar-preview-shell :deep(aside) {
  height: 100%;
}

.sidebar-preview-content {
  flex: 1;
  padding: 18px;
  color: #334155;
}

.sidebar-preview-content h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
}

.sidebar-preview-content p {
  margin: 8px 0 0;
  font-size: 12px;
  line-height: 1.45;
}

.sidebar-preview-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 14px;
}

.sidebar-preview-card {
  border-radius: 10px;
  height: 72px;
  border: 1px solid rgba(100, 116, 139, 0.2);
  background: rgba(255, 255, 255, 0.65);
}
</style>
