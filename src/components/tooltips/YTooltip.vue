<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import type { YTooltipProps } from "../../types/tooltip";

const props = withDefaults(defineProps<YTooltipProps>(), {
  placement: "top",
  variant: "dark",
});

const positionClasses: Record<string, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

const variantClasses: Record<string, string> = {
  dark: "bg-gray-900 text-white",
  light: "bg-white text-gray-800 border border-gray-200 shadow-md",
  primary: "bg-blue-600 text-white",
  success: "bg-green-600 text-white",
  warning: "bg-amber-500 text-white",
  danger: "bg-red-600 text-white",
  gradient: "bg-gradient-to-r from-purple-600 to-pink-500 text-white",
};

const arrowClasses: Record<string, string> = {
  dark: "border-gray-900",
  light: "border-white",
  primary: "border-blue-600",
  success: "border-green-600",
  warning: "border-amber-500",
  danger: "border-red-600",
  gradient: "border-purple-600",
};

const open = ref(false);
let hideTimer: ReturnType<typeof setTimeout> | null = null;
const tooltipId = `y-tooltip-${Math.random().toString(36).slice(2, 9)}`;

const arrowPositionClass = computed(() => {
  const map: Record<string, string> = {
    top: "top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-[6px]",
    bottom:
      "bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-[6px]",
    left: "left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-[6px]",
    right:
      "right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-[6px]",
  };
  return map[props.placement];
});

function clearHideTimer() {
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
}

function showTooltip() {
  clearHideTimer();
  open.value = true;
}

function hideTooltip() {
  clearHideTimer();
  hideTimer = setTimeout(() => {
    open.value = false;
  }, 80);
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    open.value = false;
  }
}

onBeforeUnmount(() => clearHideTimer());
</script>

<template>
  <span
    class="relative inline-block"
    @mouseenter="showTooltip"
    @mouseleave="hideTooltip"
    @focusin="showTooltip"
    @focusout="hideTooltip"
    @keydown="onKeydown"
  >
    <slot />
    <Transition
      enter-active-class="transition duration-120 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <span
        v-if="open"
        :id="tooltipId"
        role="tooltip"
        class="absolute z-50 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium shadow-lg pointer-events-none"
        :class="[positionClasses[placement], variantClasses[variant]]"
        :style="maxWidth ? { maxWidth, whiteSpace: 'normal' } : {}"
      >
        {{ text }}
        <span
          class="absolute w-0 h-0 border-[6px]"
          :class="[arrowPositionClass, arrowClasses[variant]]"
        />
      </span>
    </Transition>
  </span>
</template>
