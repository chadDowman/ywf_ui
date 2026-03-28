<script setup lang="ts">
import { computed } from "vue";
import {
  cardColorFieldsByPreset,
  cardPresets,
  cardTextFieldsByPreset,
  commonCardColorFields,
  type CardColorField,
  type CardTextField,
} from "../config/cardInspect";

const props = defineProps<{
  parsedProps: Record<string, unknown>;
  updatePropsJson: (updater: (value: Record<string, unknown>) => void) => void;
  selectCardPreset: (preset: string) => void;
}>();

const selectedCardPreset = computed<string>(() => {
  const current = props.parsedProps.preset;
  return typeof current === "string" ? current : "basic";
});

const activeCardTextFields = computed<CardTextField[]>(() => {
  return cardTextFieldsByPreset[selectedCardPreset.value] ?? [];
});

const activeCardColorFields = computed<CardColorField[]>(() => {
  const presetFields = cardColorFieldsByPreset[selectedCardPreset.value] ?? [];
  const merged = [...commonCardColorFields, ...presetFields];
  const seen = new Set<string>();
  return merged.filter((field) => {
    if (seen.has(field.key)) return false;
    seen.add(field.key);
    return true;
  });
});

function getStringProp(key: string): string {
  const value = props.parsedProps[key];
  return typeof value === "string" ? value : "";
}

function getColorProp(field: CardColorField): string {
  const value = props.parsedProps[field.key];
  if (
    typeof value === "string" &&
    /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value)
  ) {
    return value;
  }
  return field.fallback;
}
</script>

<template>
  <div class="space-y-2">
    <h3 class="text-[10px] font-bold uppercase tracking-[0.12em]">
      Card Variations
    </h3>
    <div class="flex flex-wrap gap-1.5">
      <button
        v-for="preset in cardPresets"
        :key="preset"
        class="chip chip-button"
        :class="selectedCardPreset === preset ? 'chip-button--active' : ''"
        @click="selectCardPreset(preset)"
      >
        {{ preset }}
      </button>
    </div>

    <div class="prop-divider" />

    <h3 class="text-[10px] font-bold uppercase tracking-[0.12em]">
      Text Content
    </h3>

    <div v-if="activeCardTextFields.length" class="space-y-2">
      <div v-for="field in activeCardTextFields" :key="field.key">
        <label class="prop-label">{{ field.label }}</label>
        <textarea
          v-if="field.multiline"
          class="prop-input w-full text-xs"
          rows="3"
          :value="getStringProp(field.key)"
          @input="
            updatePropsJson(
              (next) =>
                (next[field.key] = (
                  $event.target as HTMLTextAreaElement
                ).value),
            )
          "
        />
        <input
          v-else
          class="prop-input w-full text-xs"
          :value="getStringProp(field.key)"
          @input="
            updatePropsJson(
              (next) =>
                (next[field.key] = ($event.target as HTMLInputElement).value),
            )
          "
        />
      </div>
    </div>

    <p v-else class="text-xs opacity-70">
      This card variation has no direct text fields in quick controls.
    </p>

    <div class="prop-divider" />

    <h3 class="text-[10px] font-bold uppercase tracking-[0.12em]">
      Color Settings
    </h3>

    <div v-if="activeCardColorFields.length" class="space-y-2">
      <div v-for="field in activeCardColorFields" :key="field.key">
        <label class="prop-label">{{ field.label }}</label>
        <div class="color-input-wrap">
          <input
            type="color"
            class="color-swatch"
            :value="getColorProp(field)"
            @input="
              updatePropsJson(
                (next) =>
                  (next[field.key] = ($event.target as HTMLInputElement).value),
              )
            "
          />
          <input
            class="prop-input w-full text-xs"
            :value="getStringProp(field.key)"
            @input="
              updatePropsJson(
                (next) =>
                  (next[field.key] = ($event.target as HTMLInputElement).value),
              )
            "
          />
        </div>
      </div>
    </div>

    <div class="prop-divider" />
  </div>
</template>
