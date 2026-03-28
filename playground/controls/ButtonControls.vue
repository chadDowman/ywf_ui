<script setup lang="ts">
import { computed } from "vue";
import {
  buttonAnimationOptions,
  buttonEffectOptions,
  buttonIntensityOptions,
  buttonPresets,
  buttonRoundedOptions,
  buttonShadowOptions,
  buttonSizes,
  buttonVariants,
  normalizeMaybeFalse,
} from "../config/buttonInspect";

const props = defineProps<{
  parsedProps: Record<string, unknown>;
  updatePropsJson: (updater: (value: Record<string, unknown>) => void) => void;
  selectButtonPreset: (preset: string) => void;
}>();

const selectedButtonPreset = computed<string>(() => {
  const current = props.parsedProps.preset;
  return typeof current === "string" ? current : "solid";
});
const selectedButtonSize = computed<string>(() => {
  const current = props.parsedProps.size;
  return typeof current === "string" ? current : "md";
});
const selectedButtonVariant = computed<string>(() => {
  const current = props.parsedProps.variant;
  return typeof current === "string" ? current : "solid";
});
const selectedButtonShadow = computed<string>(() => {
  const current = props.parsedProps.shadow;
  if (current === false) return "false";
  return typeof current === "string" ? current : "false";
});
const selectedButtonRounded = computed<string>(() => {
  const current = props.parsedProps.rounded;
  if (current === false) return "false";
  return typeof current === "string" ? current : "md";
});
const selectedButtonAnimation = computed<string>(() => {
  const current = props.parsedProps.animation;
  if (current === false) return "false";
  return typeof current === "string" ? current : "false";
});
const selectedButtonEffect = computed<string>(() => {
  const current = props.parsedProps.effect;
  if (current === false) return "false";
  return typeof current === "string" ? current : "false";
});
const selectedButtonAnimationIntensity = computed<string>(() => {
  const current = props.parsedProps.animationIntensity;
  return typeof current === "string" ? current : "moderate";
});
const selectedButtonEffectIntensity = computed<string>(() => {
  const current = props.parsedProps.effectIntensity;
  return typeof current === "string" ? current : "moderate";
});
const buttonLabel = computed<string>(() => {
  const current = props.parsedProps.label;
  return typeof current === "string" ? current : "Click Me";
});
const buttonColor = computed<string>(() => {
  const current = props.parsedProps.color;
  return typeof current === "string" ? current : "#3b82f6";
});
const buttonTextColor = computed<string>(() => {
  const current = props.parsedProps.textColor;
  return typeof current === "string" ? current : "#ffffff";
});
const buttonDisabled = computed<boolean>(
  () => props.parsedProps.disabled === true,
);
</script>

<template>
  <div class="space-y-2">
    <h3 class="text-[10px] font-bold uppercase tracking-[0.12em]">
      Button Variations
    </h3>
    <div class="flex flex-wrap gap-1.5">
      <button
        v-for="preset in buttonPresets"
        :key="preset"
        class="chip chip-button"
        :class="selectedButtonPreset === preset ? 'chip-button--active' : ''"
        @click="selectButtonPreset(preset)"
      >
        {{ preset }}
      </button>
    </div>

    <div class="prop-divider" />

    <h3 class="text-[10px] font-bold uppercase tracking-[0.12em]">
      Style Settings
    </h3>

    <label class="prop-label">Label</label>
    <input
      class="prop-input w-full text-xs"
      :value="buttonLabel"
      @input="
        updatePropsJson(
          (next) => (next.label = ($event.target as HTMLInputElement).value),
        )
      "
    />

    <div class="grid grid-cols-2 gap-2">
      <div>
        <label class="prop-label">Size</label>
        <select
          class="prop-input w-full text-xs"
          :value="selectedButtonSize"
          @change="
            updatePropsJson(
              (next) =>
                (next.size = ($event.target as HTMLSelectElement).value),
            )
          "
        >
          <option v-for="size in buttonSizes" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
      </div>
      <div>
        <label class="prop-label">Variant</label>
        <select
          class="prop-input w-full text-xs"
          :value="selectedButtonVariant"
          @change="
            updatePropsJson(
              (next) =>
                (next.variant = ($event.target as HTMLSelectElement).value),
            )
          "
        >
          <option
            v-for="variant in buttonVariants"
            :key="variant"
            :value="variant"
          >
            {{ variant }}
          </option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-2">
      <div>
        <label class="prop-label">Color</label>
        <div class="color-input-wrap">
          <input
            type="color"
            class="color-swatch"
            :value="buttonColor"
            @input="
              updatePropsJson(
                (next) =>
                  (next.color = ($event.target as HTMLInputElement).value),
              )
            "
          />
          <input
            class="prop-input w-full text-xs"
            :value="buttonColor"
            @input="
              updatePropsJson(
                (next) =>
                  (next.color = ($event.target as HTMLInputElement).value),
              )
            "
          />
        </div>
      </div>
      <div>
        <label class="prop-label">Text Color</label>
        <div class="color-input-wrap">
          <input
            type="color"
            class="color-swatch"
            :value="buttonTextColor"
            @input="
              updatePropsJson(
                (next) =>
                  (next.textColor = ($event.target as HTMLInputElement).value),
              )
            "
          />
          <input
            class="prop-input w-full text-xs"
            :value="buttonTextColor"
            @input="
              updatePropsJson(
                (next) =>
                  (next.textColor = ($event.target as HTMLInputElement).value),
              )
            "
          />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-2">
      <div>
        <label class="prop-label">Shadow</label>
        <select
          class="prop-input w-full text-xs"
          :value="selectedButtonShadow"
          @change="
            updatePropsJson(
              (next) =>
                (next.shadow = normalizeMaybeFalse(
                  ($event.target as HTMLSelectElement).value,
                )),
            )
          "
        >
          <option
            v-for="shadow in buttonShadowOptions"
            :key="shadow"
            :value="shadow"
          >
            {{ shadow }}
          </option>
        </select>
      </div>
      <div>
        <label class="prop-label">Rounded</label>
        <select
          class="prop-input w-full text-xs"
          :value="selectedButtonRounded"
          @change="
            updatePropsJson(
              (next) =>
                (next.rounded = normalizeMaybeFalse(
                  ($event.target as HTMLSelectElement).value,
                )),
            )
          "
        >
          <option
            v-for="rounded in buttonRoundedOptions"
            :key="rounded"
            :value="rounded"
          >
            {{ rounded }}
          </option>
        </select>
      </div>
    </div>

    <label class="inline-flex items-center gap-2 text-xs">
      <input
        type="checkbox"
        :checked="buttonDisabled"
        @change="
          updatePropsJson(
            (next) =>
              (next.disabled = ($event.target as HTMLInputElement).checked),
          )
        "
      />
      Disabled
    </label>

    <div class="prop-divider" />

    <h3 class="text-[10px] font-bold uppercase tracking-[0.12em]">
      Animations &amp; Effects
    </h3>

    <div class="grid grid-cols-2 gap-2">
      <div>
        <label class="prop-label">Animation</label>
        <select
          class="prop-input w-full text-xs"
          :value="selectedButtonAnimation"
          @change="
            updatePropsJson(
              (next) =>
                (next.animation = normalizeMaybeFalse(
                  ($event.target as HTMLSelectElement).value,
                )),
            )
          "
        >
          <option
            v-for="animation in buttonAnimationOptions"
            :key="animation"
            :value="animation"
          >
            {{ animation }}
          </option>
        </select>
      </div>
      <div>
        <label class="prop-label">Anim Intensity</label>
        <select
          class="prop-input w-full text-xs"
          :value="selectedButtonAnimationIntensity"
          @change="
            updatePropsJson(
              (next) =>
                (next.animationIntensity = (
                  $event.target as HTMLSelectElement
                ).value),
            )
          "
        >
          <option
            v-for="intensity in buttonIntensityOptions"
            :key="intensity"
            :value="intensity"
          >
            {{ intensity }}
          </option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-2">
      <div>
        <label class="prop-label">Effect</label>
        <select
          class="prop-input w-full text-xs"
          :value="selectedButtonEffect"
          @change="
            updatePropsJson(
              (next) =>
                (next.effect = normalizeMaybeFalse(
                  ($event.target as HTMLSelectElement).value,
                )),
            )
          "
        >
          <option
            v-for="effect in buttonEffectOptions"
            :key="effect"
            :value="effect"
          >
            {{ effect }}
          </option>
        </select>
      </div>
      <div>
        <label class="prop-label">Effect Intensity</label>
        <select
          class="prop-input w-full text-xs"
          :value="selectedButtonEffectIntensity"
          @change="
            updatePropsJson(
              (next) =>
                (next.effectIntensity = (
                  $event.target as HTMLSelectElement
                ).value),
            )
          "
        >
          <option
            v-for="intensity in buttonIntensityOptions"
            :key="intensity"
            :value="intensity"
          >
            {{ intensity }}
          </option>
        </select>
      </div>
    </div>

    <div class="prop-divider" />
  </div>
</template>
