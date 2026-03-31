<script setup lang="ts">
import { computed } from "vue";
import type {
  PlaygroundInspectorConfig,
  PlaygroundInspectorControl,
  PlaygroundInspectorOption,
  PlaygroundVisibilityRule,
} from "../config/types";

const props = defineProps<{
  propNames: string[];
  propTypes: Record<string, string[]>;
  parsedProps: Record<string, unknown>;
  detectedColorTargets?: {
    key: string;
    label: string;
    defaultValue: string;
  }[];
  inspectorConfig?: PlaygroundInspectorConfig | null;
  updatePropsJson: (updater: (value: Record<string, unknown>) => void) => void;
}>();

type ResolvedControl = {
  key: string;
  control?: PlaygroundInspectorControl;
};

type ResolvedSection = {
  id: string;
  title: string;
  description?: string;
  controls: ResolvedControl[];
};

const detectedColorTargetMap = computed(
  () =>
    new Map(
      (props.detectedColorTargets ?? []).map((target) => [target.key, target]),
    ),
);

const detectedColorControlKeys = computed(() =>
  (props.detectedColorTargets ?? []).map((target) => target.key),
);

const propKeys = computed<string[]>(() => {
  const internalAllowed = new Set(detectedColorControlKeys.value);
  const keys = new Set<string>([
    ...props.propNames,
    ...Object.keys(props.parsedProps).filter(
      (key) => !key.startsWith("__") || internalAllowed.has(key),
    ),
    ...detectedColorControlKeys.value,
  ]);
  return [...keys].sort((a, b) => a.localeCompare(b));
});

function titleCase(input: string): string {
  return input
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getControl(key: string): PlaygroundInspectorControl | undefined {
  const configured = props.inspectorConfig?.controls.find(
    (control) => control.key === key,
  );
  if (configured) return configured;

  const detected = detectedColorTargetMap.value.get(key);
  if (detected) {
    return {
      key,
      label: detected.label,
      section: "colors",
      editor: "color",
    };
  }

  return undefined;
}

function isRuleMatch(rule: PlaygroundVisibilityRule): boolean {
  const value = props.parsedProps[rule.key];
  if (rule.equals !== undefined && value !== rule.equals) return false;
  if (rule.notEquals !== undefined && value === rule.notEquals) return false;
  if (rule.in && !rule.in.includes(value)) return false;
  if (rule.truthy && !value) return false;
  if (rule.falsy && !!value) return false;
  return true;
}

function isControlVisible(control: PlaygroundInspectorControl): boolean {
  if (!control.visibleWhen) return true;
  const rules = Array.isArray(control.visibleWhen)
    ? control.visibleWhen
    : [control.visibleWhen];
  return rules.every(isRuleMatch);
}

const visibleControls = computed<ResolvedControl[]>(() => {
  if (!props.inspectorConfig) {
    return propKeys.value.map((key) => ({ key }));
  }

  const configured = props.inspectorConfig.controls
    .filter(isControlVisible)
    .map((control) => ({ key: control.key, control }));

  if (props.inspectorConfig.strict) {
    const configuredKeys = new Set(configured.map((entry) => entry.key));
    const detectedColors = detectedColorControlKeys.value
      .filter((key) => !configuredKeys.has(key))
      .map((key) => ({
        key,
        control: {
          key,
          section: "colors",
          editor: "color",
          label: detectedColorTargetMap.value.get(key)?.label,
        } satisfies PlaygroundInspectorControl,
      }));

    const reservedDetected = new Set(detectedColors.map((entry) => entry.key));
    const autoColorControls = propKeys.value
      .filter(
        (key) =>
          !configuredKeys.has(key) &&
          !reservedDetected.has(key) &&
          isColorControlCandidate(key),
      )
      .map((key) => ({
        key,
        control: {
          key,
          section: "colors",
          editor: "color",
        } satisfies PlaygroundInspectorControl,
      }));
    return [...configured, ...detectedColors, ...autoColorControls];
  }

  const configuredKeys = new Set(configured.map((entry) => entry.key));
  const extras = propKeys.value
    .filter((key) => !configuredKeys.has(key))
    .map((key) => ({ key }));

  return [...configured, ...extras];
});

const groupedControls = computed<ResolvedSection[]>(() => {
  if (!visibleControls.value.length) return [];

  const sectionMeta = new Map(
    (props.inspectorConfig?.sections ?? []).map((section) => [
      section.id,
      section,
    ]),
  );
  const grouped = new Map<string, ResolvedControl[]>();
  const sectionOrder: string[] = [];

  for (const entry of visibleControls.value) {
    const sectionId = entry.control?.section ?? "properties";
    if (!grouped.has(sectionId)) {
      grouped.set(sectionId, []);
      sectionOrder.push(sectionId);
    }
    grouped.get(sectionId)?.push(entry);
  }

  const orderedIds = [
    ...(props.inspectorConfig?.sections?.map((section) => section.id) ?? []),
    ...sectionOrder.filter(
      (sectionId) =>
        !(props.inspectorConfig?.sections ?? []).some(
          (section) => section.id === sectionId,
        ),
    ),
  ];

  return orderedIds
    .filter((sectionId) => grouped.has(sectionId))
    .map((sectionId) => ({
      id: sectionId,
      title: sectionMeta.get(sectionId)?.title ?? titleCase(sectionId),
      description: sectionMeta.get(sectionId)?.description,
      controls: grouped.get(sectionId) ?? [],
    }));
});

function isColorValue(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const v = value.trim();
  if (!v) return false;

  if (
    /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(v)
  ) {
    return true;
  }

  if (/^(rgb|rgba|hsl|hsla)\(/i.test(v)) return true;
  if (/^var\(--[^)]+\)$/i.test(v)) return true;
  if (/^color-mix\(/i.test(v)) return true;

  return resolveCssColorToHex(v) !== null;
}

function looksColorKey(key: string): boolean {
  return (
    /(color|colour)/i.test(key) ||
    /(bg|background|foreground|fg|fill|stroke|accent|tint|shade|hue|ink|overlay|glow|ring|caret|placeholder|border|outline)$/i.test(
      key,
    )
  );
}

function isColorControlCandidate(key: string): boolean {
  if (detectedColorTargetMap.value.has(key)) return true;
  return looksColorKey(key) || isColorValue(props.parsedProps[key]);
}

function looksBooleanKey(key: string): boolean {
  return (
    /^(is[A-Z]|has[A-Z]|can[A-Z])/.test(key) ||
    /(enabled|disabled|show|hidden|sticky|elevated|transparent|bordered|mobile|open)$/i.test(
      key,
    )
  );
}

function getEditorType(
  key: string,
): "boolean" | "number" | "color" | "json" | "text" | "textarea" | "select" {
  const configured = getControl(key);
  if (configured?.editor && configured.editor !== "text") {
    return configured.editor;
  }
  if (configured?.editor === "text" && isColorControlCandidate(key)) {
    return "color";
  }
  if (configured?.options?.length) {
    return "select";
  }

  const declaredTypes = props.propTypes[key] ?? [];
  const value = props.parsedProps[key];

  if (declaredTypes.length === 1 && declaredTypes[0] === "boolean") {
    return "boolean";
  }
  if (declaredTypes.length === 1 && declaredTypes[0] === "number") {
    return "number";
  }
  if (declaredTypes.includes("array") || declaredTypes.includes("object")) {
    return "json";
  }

  if (typeof value === "boolean") return "boolean";
  if (typeof value === "number") return "number";
  if (Array.isArray(value)) return "json";
  if (value && typeof value === "object") return "json";
  if (isColorControlCandidate(key)) return "color";
  if (value === undefined && looksBooleanKey(key)) return "boolean";
  return "text";
}

function getLabel(key: string): string {
  return getControl(key)?.label ?? titleCase(key);
}

function isInspectorOption(value: unknown): value is PlaygroundInspectorOption {
  return (
    !!value && typeof value === "object" && "label" in value && "value" in value
  );
}

function getSelectOptions(key: string): PlaygroundInspectorOption[] {
  const configuredOptions = getControl(key)?.options ?? [];
  return configuredOptions.map((option) => {
    if (isInspectorOption(option)) return option;
    if (option === false) return { label: "Off", value: false };
    if (option === true) return { label: "On", value: true };
    return {
      label: titleCase(String(option)),
      value: option,
    };
  });
}

function valuesEqual(left: unknown, right: unknown): boolean {
  if (left === right) return true;
  try {
    return JSON.stringify(left) === JSON.stringify(right);
  } catch {
    return false;
  }
}

function isOptionSelected(key: string, optionValue: unknown): boolean {
  return valuesEqual(props.parsedProps[key], optionValue);
}

function getTextValue(key: string): string {
  const value = props.parsedProps[key];
  if (value === undefined || value === null) {
    const detected = detectedColorTargetMap.value.get(key);
    return detected?.defaultValue ?? "";
  }
  if (typeof value === "string") return value;
  return String(value);
}

function getNumberValue(key: string): string {
  const value = props.parsedProps[key];
  return typeof value === "number" ? String(value) : "";
}

function getBooleanValue(key: string): boolean {
  const value = props.parsedProps[key];
  return value === true;
}

function getColorValue(key: string): string {
  const value = props.parsedProps[key];
  if (typeof value === "string") {
    const direct = value.trim();
    if (/^#([0-9a-fA-F]{6})$/.test(direct)) return direct;

    if (/^#([0-9a-fA-F]{3})$/.test(direct)) {
      const hex = direct.slice(1);
      return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    }

    const resolved = resolveCssColorToHex(direct);
    if (resolved) return resolved;
  }
  return "#000000";
}

function resolveCssColorToHex(value: string): string | null {
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#000000";
  const before = ctx.fillStyle;
  ctx.fillStyle = value;
  const normalized = String(ctx.fillStyle).trim();

  if (normalized === before && value.toLowerCase() !== "#000000") {
    return null;
  }

  if (/^#([0-9a-fA-F]{6})$/.test(normalized)) return normalized;
  if (/^#([0-9a-fA-F]{3})$/.test(normalized)) {
    const hex = normalized.slice(1);
    return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
  }

  const rgbMatch = normalized.match(
    /^rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[0-9.]+)?\)$/i,
  );
  if (!rgbMatch) return null;

  const [r, g, b] = rgbMatch.slice(1, 4).map((n) => Number(n));
  if ([r, g, b].some((n) => !Number.isFinite(n))) return null;

  return `#${[r, g, b]
    .map((n) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, "0"))
    .join("")}`;
}

function getJsonValue(key: string): string {
  const value = props.parsedProps[key];
  if (value === undefined) return "";
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "";
  }
}

function updateText(key: string, value: string): void {
  props.updatePropsJson((next) => {
    const declaredTypes = props.propTypes[key] ?? [];
    const isOnlyNumber =
      declaredTypes.length === 1 && declaredTypes[0] === "number";
    const isOnlyBoolean =
      declaredTypes.length === 1 && declaredTypes[0] === "boolean";

    if (isOnlyNumber) {
      const parsed = Number(value);
      next[key] = Number.isFinite(parsed) ? parsed : 0;
      return;
    }
    if (isOnlyBoolean) {
      next[key] = value.toLowerCase() === "true";
      return;
    }
    next[key] = value;
  });
}

function updateNumber(key: string, value: string): void {
  props.updatePropsJson((next) => {
    const parsed = Number(value);
    next[key] = Number.isFinite(parsed) ? parsed : 0;
  });
}

function updateBoolean(key: string, value: boolean): void {
  props.updatePropsJson((next) => {
    next[key] = value;
  });
}

function updateSelectValue(key: string, value: unknown): void {
  props.updatePropsJson((next) => {
    next[key] = value;
  });
}

function updateJson(key: string, raw: string): void {
  props.updatePropsJson((next) => {
    if (!raw.trim()) {
      delete next[key];
      return;
    }
    try {
      next[key] = JSON.parse(raw) as unknown;
    } catch {
      // Keep previous value when JSON is invalid.
    }
  });
}

function getRows(key: string): number {
  return getControl(key)?.rows ?? 4;
}

function getFieldId(key: string): string {
  return `auto-prop-${key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}

function getFieldName(key: string): string {
  return key;
}
</script>

<template>
  <div class="auto-controls">
    <h3 class="text-[10px] font-bold uppercase tracking-[0.12em]">
      Auto Props Controls
    </h3>
    <p class="text-xs opacity-70">
      Generated from component runtime props and current values.
    </p>

    <div v-if="groupedControls.length" class="auto-controls-list">
      <section
        v-for="section in groupedControls"
        :key="section.id"
        class="prop-group"
      >
        <div class="prop-group-head">
          <h4 class="prop-group-title">{{ section.title }}</h4>
          <p v-if="section.description" class="prop-help">
            {{ section.description }}
          </p>
        </div>

        <div
          v-for="entry in section.controls"
          :key="entry.key"
          class="prop-row"
        >
          <label :for="getFieldId(entry.key)" class="prop-label">{{
            getLabel(entry.key)
          }}</label>

          <label
            v-if="getEditorType(entry.key) === 'boolean'"
            class="prop-boolean"
          >
            <input
              :id="getFieldId(entry.key)"
              :name="getFieldName(entry.key)"
              type="checkbox"
              :checked="getBooleanValue(entry.key)"
              @change="
                updateBoolean(
                  entry.key,
                  ($event.target as HTMLInputElement).checked,
                )
              "
            />
            <span>{{
              getBooleanValue(entry.key) ? "Enabled" : "Disabled"
            }}</span>
          </label>

          <div
            v-else-if="getEditorType(entry.key) === 'select'"
            class="option-chips"
          >
            <button
              v-for="(option, index) in getSelectOptions(entry.key)"
              :key="`${entry.key}-${index}-${String(option.value)}`"
              type="button"
              class="option-chip"
              :class="
                isOptionSelected(entry.key, option.value)
                  ? 'option-chip--active'
                  : ''
              "
              @click="updateSelectValue(entry.key, option.value)"
            >
              {{ option.label }}
            </button>
          </div>

          <input
            v-else-if="getEditorType(entry.key) === 'number'"
            :id="getFieldId(entry.key)"
            :name="getFieldName(entry.key)"
            class="prop-input w-full text-xs"
            type="number"
            :value="getNumberValue(entry.key)"
            @input="
              updateNumber(entry.key, ($event.target as HTMLInputElement).value)
            "
          />

          <div
            v-else-if="getEditorType(entry.key) === 'color'"
            class="color-input-wrap"
          >
            <input
              type="color"
              :id="`${getFieldId(entry.key)}-swatch`"
              :name="`${getFieldName(entry.key)}Swatch`"
              class="color-swatch"
              :value="getColorValue(entry.key)"
              @input="
                updateText(entry.key, ($event.target as HTMLInputElement).value)
              "
            />
            <input
              :id="getFieldId(entry.key)"
              :name="getFieldName(entry.key)"
              class="prop-input w-full text-xs"
              :value="getTextValue(entry.key)"
              @input="
                updateText(entry.key, ($event.target as HTMLInputElement).value)
              "
            />
          </div>

          <textarea
            v-else-if="getEditorType(entry.key) === 'json'"
            :id="getFieldId(entry.key)"
            :name="getFieldName(entry.key)"
            class="prop-input w-full text-xs font-mono"
            :rows="getRows(entry.key)"
            :value="getJsonValue(entry.key)"
            @change="
              updateJson(
                entry.key,
                ($event.target as HTMLTextAreaElement).value,
              )
            "
          />

          <textarea
            v-else-if="getEditorType(entry.key) === 'textarea'"
            :id="getFieldId(entry.key)"
            :name="getFieldName(entry.key)"
            class="prop-input w-full text-xs"
            :rows="getRows(entry.key)"
            :value="getTextValue(entry.key)"
            @input="
              updateText(
                entry.key,
                ($event.target as HTMLTextAreaElement).value,
              )
            "
          />

          <input
            v-else
            :id="getFieldId(entry.key)"
            :name="getFieldName(entry.key)"
            class="prop-input w-full text-xs"
            :value="getTextValue(entry.key)"
            @input="
              updateText(entry.key, ($event.target as HTMLInputElement).value)
            "
          />
        </div>
      </section>
    </div>

    <p v-else class="text-xs opacity-70">
      No runtime props detected. Use Props JSON below.
    </p>
  </div>
</template>

<style scoped>
.auto-controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.auto-controls-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.prop-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.prop-group-head {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.prop-group-title {
  margin: 0;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-secondary);
}

.prop-help {
  margin: 0;
  font-size: 11px;
  color: var(--text-secondary);
}

.prop-row {
  padding: 8px;
  border-radius: 8px;
  border: 1px solid color-mix(in srgb, var(--border-panel) 85%, transparent);
  background: color-mix(in srgb, var(--bg-input) 65%, transparent);
}

.prop-label {
  display: block;
  margin-bottom: 6px;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
}

.prop-input {
  width: 100%;
  background: color-mix(in srgb, var(--bg-input) 90%, var(--bg-panel));
  border: 1px solid color-mix(in srgb, var(--border-input) 90%, transparent);
  border-radius: 8px;
  color: var(--text-primary);
  padding: 8px 10px;
  transition:
    border-color 120ms ease,
    box-shadow 120ms ease,
    background-color 120ms ease;
}

.prop-input:focus {
  outline: none;
  border-color: color-mix(in srgb, var(--text-accent) 40%, var(--border-input));
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--text-accent) 16%, transparent);
}

.color-input-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-swatch {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: 1px solid color-mix(in srgb, var(--border-input) 85%, transparent);
  background: transparent;
  padding: 0;
  flex-shrink: 0;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
}

.color-swatch::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-swatch::-webkit-color-swatch {
  border: none;
  border-radius: 7px;
}

.prop-boolean {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.option-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.option-chip {
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--border-input) 80%, transparent);
  background: color-mix(in srgb, var(--bg-input) 80%, var(--bg-panel));
  color: var(--text-primary);
  padding: 4px 10px;
  font-size: 11px;
  line-height: 1.2;
  text-transform: capitalize;
  cursor: pointer;
  transition:
    background-color 120ms ease,
    color 120ms ease,
    border-color 120ms ease,
    transform 120ms ease;
}

.option-chip:hover {
  border-color: color-mix(in srgb, var(--text-accent) 30%, transparent);
  transform: translateY(-1px);
}

.option-chip--active {
  background: color-mix(in srgb, var(--text-accent) 18%, var(--bg-panel));
  color: var(--text-accent);
  border-color: color-mix(in srgb, var(--text-accent) 35%, transparent);
}

.option-chip:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--text-accent) 20%, transparent);
}
</style>
