<script setup lang="ts">
import { computed } from "vue";
import {
  dropdownPlacements,
  dropdownSizes,
  dropdownVariants,
} from "../config/dropdown";
import type { YDropdownVariant } from "../../src/types/dropdown";

const props = defineProps<{
  parsedProps: Record<string, unknown>;
  updatePropsJson: (updater: (value: Record<string, unknown>) => void) => void;
  selectDropdownVariant: (variant: YDropdownVariant) => void;
}>();

const selectedDropdownVariant = computed<string>(() => {
  const current = props.parsedProps.variant;
  return typeof current === "string" ? current : "basic";
});
const selectedDropdownSize = computed<string>(() => {
  const current = props.parsedProps.size;
  return typeof current === "string" ? current : "md";
});
const selectedDropdownPlacement = computed<string>(() => {
  const current = props.parsedProps.placement;
  return typeof current === "string" ? current : "bottom-start";
});
const dropdownLabel = computed<string>(() => {
  const current = props.parsedProps.label;
  return typeof current === "string" ? current : "Dropdown";
});
const dropdownPlaceholder = computed<string>(() => {
  const current = props.parsedProps.placeholder;
  return typeof current === "string" ? current : "Search...";
});
const dropdownMaxHeight = computed<string>(() => {
  const current = props.parsedProps.maxHeight;
  return typeof current === "string" ? current : "16rem";
});
const dropdownSplitLabel = computed<string>(() => {
  const current = props.parsedProps.splitLabel;
  return typeof current === "string" ? current : "Action";
});
const dropdownDisabled = computed<boolean>(
  () => props.parsedProps.disabled === true,
);
const dropdownCloseOnSelect = computed<boolean>(
  () => props.parsedProps.closeOnSelect !== false,
);
const dropdownKeyboardNavigation = computed<boolean>(
  () => props.parsedProps.keyboardNavigation !== false,
);
const dropdownSearchable = computed<boolean>(
  () => props.parsedProps.searchable === true,
);
const dropdownMultiSelect = computed<boolean>(
  () => props.parsedProps.multiSelect === true,
);
</script>

<template>
  <div class="space-y-2">
    <h3 class="text-[10px] font-bold uppercase tracking-[0.12em]">
      Dropdown Variations
    </h3>
    <div class="flex flex-wrap gap-1.5">
      <button
        v-for="variant in dropdownVariants"
        :key="variant"
        class="chip chip-button"
        :class="
          selectedDropdownVariant === variant ? 'chip-button--active' : ''
        "
        @click="selectDropdownVariant(variant as YDropdownVariant)"
      >
        {{ variant }}
      </button>
    </div>

    <div class="prop-divider" />

    <h3 class="text-[10px] font-bold uppercase tracking-[0.12em]">
      Dropdown Properties
    </h3>

    <label class="prop-label">Label</label>
    <input
      class="prop-input w-full text-xs"
      :value="dropdownLabel"
      @input="
        updatePropsJson(
          (next) => (next.label = ($event.target as HTMLInputElement).value),
        )
      "
    />

    <div v-if="selectedDropdownVariant === 'split'">
      <label class="prop-label">Split Label</label>
      <input
        class="prop-input w-full text-xs"
        :value="dropdownSplitLabel"
        @input="
          updatePropsJson(
            (next) =>
              (next.splitLabel = ($event.target as HTMLInputElement).value),
          )
        "
      />
    </div>

    <div
      v-if="
        selectedDropdownVariant === 'searchable' ||
        selectedDropdownVariant === 'command-palette'
      "
    >
      <label class="prop-label">Search Placeholder</label>
      <input
        class="prop-input w-full text-xs"
        :value="dropdownPlaceholder"
        @input="
          updatePropsJson(
            (next) =>
              (next.placeholder = ($event.target as HTMLInputElement).value),
          )
        "
      />
    </div>

    <div class="grid grid-cols-2 gap-2">
      <div>
        <label class="prop-label">Size</label>
        <select
          class="prop-input w-full text-xs"
          :value="selectedDropdownSize"
          @change="
            updatePropsJson(
              (next) =>
                (next.size = ($event.target as HTMLSelectElement).value),
            )
          "
        >
          <option v-for="size in dropdownSizes" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
      </div>
      <div>
        <label class="prop-label">Placement</label>
        <select
          class="prop-input w-full text-xs"
          :value="selectedDropdownPlacement"
          @change="
            updatePropsJson(
              (next) =>
                (next.placement = ($event.target as HTMLSelectElement).value),
            )
          "
        >
          <option
            v-for="placement in dropdownPlacements"
            :key="placement"
            :value="placement"
          >
            {{ placement }}
          </option>
        </select>
      </div>
    </div>

    <label class="prop-label">Max Height</label>
    <input
      class="prop-input w-full text-xs"
      :value="dropdownMaxHeight"
      @input="
        updatePropsJson(
          (next) =>
            (next.maxHeight = ($event.target as HTMLInputElement).value),
        )
      "
    />

    <label class="inline-flex items-center gap-2 text-xs">
      <input
        type="checkbox"
        :checked="dropdownDisabled"
        @change="
          updatePropsJson(
            (next) =>
              (next.disabled = ($event.target as HTMLInputElement).checked),
          )
        "
      />
      Disabled
    </label>

    <label class="inline-flex items-center gap-2 text-xs">
      <input
        type="checkbox"
        :checked="dropdownCloseOnSelect"
        @change="
          updatePropsJson(
            (next) =>
              (next.closeOnSelect = (
                $event.target as HTMLInputElement
              ).checked),
          )
        "
      />
      Close On Select
    </label>

    <label class="inline-flex items-center gap-2 text-xs">
      <input
        type="checkbox"
        :checked="dropdownKeyboardNavigation"
        @change="
          updatePropsJson(
            (next) =>
              (next.keyboardNavigation = (
                $event.target as HTMLInputElement
              ).checked),
          )
        "
      />
      Keyboard Navigation
    </label>

    <label class="inline-flex items-center gap-2 text-xs">
      <input
        type="checkbox"
        :checked="dropdownSearchable"
        @change="
          updatePropsJson(
            (next) =>
              (next.searchable = ($event.target as HTMLInputElement).checked),
          )
        "
      />
      Searchable
    </label>

    <label class="inline-flex items-center gap-2 text-xs">
      <input
        type="checkbox"
        :checked="dropdownMultiSelect"
        @change="
          updatePropsJson((next) => {
            const checked = ($event.target as HTMLInputElement).checked;
            next.multiSelect = checked;
            if (checked) {
              if (!Array.isArray(next.modelValue)) next.modelValue = [];
            } else if (Array.isArray(next.modelValue)) {
              next.modelValue = '';
            }
          })
        "
      />
      Multi Select
    </label>

    <div class="prop-divider" />
  </div>
</template>
