<script setup lang="ts">
import { computed } from "vue";
import { useDarkMode } from "@/composables/useDarkMode";
import type { YDividerProps } from "@/types/divider";
import { useAnimation } from '@/composables/useAnimation';
import { getAppearAnimationClasses } from '@/types/animation';

defineOptions({ name: "YDivider" });

const props = withDefaults(defineProps<YDividerProps>(), {
  orientation: "horizontal",
  variant: "solid",
  thickness: "base",
  align: "center",
  animation: undefined,
});

const dk = useDarkMode(props.dark);
const anim = useAnimation(() => props.animation);
const appearTx = computed(() => getAppearAnimationClasses(anim.value));

const isVertical = computed(() => (props.orientation ?? "horizontal") === "vertical");

const lineStyle = computed(() => {
  const variantMap = { solid: "solid", dashed: "dashed", dotted: "dotted" };
  const thicknessMap = { thin: "1px", base: "1px", thick: "2px" };
  const borderStyle = variantMap[props.variant ?? "solid"];
  const borderWidth = thicknessMap[props.thickness ?? "base"];
  const color = props.color ?? (dk.value ? "rgb(51 65 85)" : "rgb(226 232 240)");

  if (isVertical.value) {
    return { borderLeft: `${borderWidth} ${borderStyle} ${color}`, height: "100%", width: "0px" };
  }
  return { borderTop: `${borderWidth} ${borderStyle} ${color}` };
});

const labelClass = computed(() =>
  dk.value ? "text-slate-500 text-xs font-medium bg-transparent px-3" : "text-gray-400 text-xs font-medium bg-transparent px-3",
);

const wrapClass = computed(() => {
  if (isVertical.value) return "inline-flex h-full items-center";
  return "flex items-center w-full";
});

const alignClass = computed(() => {
  if (!props.label || isVertical.value) return "";
  const map = { left: "justify-start", center: "justify-center", right: "justify-end" };
  return map[props.align ?? "center"];
});
</script>

<template>
  <Transition
    appear
    :enter-active-class="appearTx.enterActive"
    :enter-from-class="appearTx.enterFrom"
    :enter-to-class="appearTx.enterTo"
    :leave-active-class="appearTx.leaveActive"
    :leave-from-class="appearTx.leaveFrom"
    :leave-to-class="appearTx.leaveTo"
  >
  <!-- Horizontal with label -->
  <div
    v-if="!isVertical && label"
    :class="['flex items-center w-full gap-0', alignClass]"
    role="separator"
    :aria-orientation="orientation"
  >
    <div
      v-if="align !== 'left'"
      class="flex-1"
      :style="lineStyle"
    />
    <span :class="labelClass">{{ label }}</span>
    <div
      v-if="align !== 'right'"
      class="flex-1"
      :style="lineStyle"
    />
  </div>

  <!-- Horizontal without label -->
  <div
    v-else-if="!isVertical"
    class="w-full"
    :style="lineStyle"
    role="separator"
    aria-orientation="horizontal"
  />

  <!-- Vertical -->
  <div
    v-else
    :class="wrapClass"
    role="separator"
    aria-orientation="vertical"
  >
    <div class="self-stretch" :style="lineStyle" />
    <span v-if="label" :class="labelClass" style="writing-mode: vertical-rl">{{ label }}</span>
  </div>
  </Transition>
</template>
