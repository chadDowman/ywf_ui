<script setup lang="ts">
import { ref, computed } from "vue";
import { useDarkMode } from "@/composables/useDarkMode";
import { useAnimation } from "@/composables/useAnimation";
import { getPopupAnimationClasses } from "@/types/animation";

defineOptions({ name: "YAlert" });
import type {
  YAlertProps,
  AlertType,
  AlertVariant,
  AlertSize,
  AlertIntensity,
  AlertRadius,
} from "@/types/alert";
import {
  defaultIcons,
  radiusMap,
  sizeClasses,
  iconSizeClasses,
  closeSizeClasses,
  titleSizeClasses,
  actionBtnSizeClasses,
  buildColorMap,
  actionColorMap,
  darkActionColorMap,
  solidActionOverride,
} from "./alertConstants";

const props = withDefaults(defineProps<YAlertProps>(), {
  type: "info",
  variant: "soft",
  size: "md",
  intensity: "medium",
  showIcon: true,
  dismissible: false,
  fullWidth: false,
  loading: false,
  disabled: false,
  radius: "md",
  animation: undefined,
});

const dk = useDarkMode(props.dark);
const anim = useAnimation(() => props.animation);
const alertTransition = computed(() => {
  const a = anim.value;
  if (a === "auto") {
    return {
      enterActive: "transition duration-200 ease-out",
      enterFrom: "opacity-0 -translate-y-1",
      enterTo: "opacity-100 translate-y-0",
      leaveActive: "transition duration-150 ease-in",
      leaveFrom: "opacity-100 translate-y-0",
      leaveTo: "opacity-0 -translate-y-1",
    };
  }
  return getPopupAnimationClasses(a);
});

const emit = defineEmits<{
  dismiss: [];
  action: [];
  secondaryAction: [];
}>();

const visible = ref(true);

function dismiss() {
  if (props.disabled || props.loading) return;
  visible.value = false;
  emit("dismiss");
}

function onAction() {
  if (props.disabled || props.loading) return;
  emit("action");
}

function onSecondaryAction() {
  if (props.disabled || props.loading) return;
  emit("secondaryAction");
}

const resolvedIcon = computed(() => props.icon ?? defaultIcons[props.type]);

const colorClasses = computed(
  () => buildColorMap(props.intensity, dk.value)[props.type][props.variant],
);

function actionBtnClasses(actionCfg: {
  variant?: "link" | "outline" | "solid";
}): string {
  const v = actionCfg.variant ?? "link";
  if (props.variant === "solid") return solidActionOverride[v];
  const map = dk.value ? darkActionColorMap : actionColorMap;
  return map[props.type][v];
}

/* ───── Wrapper classes ───── */
const wrapperClasses = computed(() => [
  "flex items-start transition-all duration-200",
  sizeClasses[props.size],
  props.radius !== undefined ? radiusMap[props.radius] : radiusMap.md,
  colorClasses.value,
  props.fullWidth ? "w-full" : "inline-flex max-w-full",
  props.loading ? "opacity-70 pointer-events-none" : "",
  props.disabled ? "opacity-50 cursor-not-allowed select-none" : "",
]);

/* ───── ARIA ───── */
const ariaLive = computed(() =>
  props.type === "error" || props.type === "warning" ? "assertive" : "polite",
);
</script>

<template>
  <Transition
    :enter-active-class="alertTransition.enterActive"
    :enter-from-class="alertTransition.enterFrom"
    :enter-to-class="alertTransition.enterTo"
    :leave-active-class="alertTransition.leaveActive"
    :leave-from-class="alertTransition.leaveFrom"
    :leave-to-class="alertTransition.leaveTo"
  >
    <div
      v-if="visible"
      :class="wrapperClasses"
      role="alert"
      :aria-live="ariaLive"
      :aria-disabled="disabled || undefined"
      :aria-busy="loading || undefined"
    >
      <!-- Loading spinner -->
      <span
        v-if="loading"
        class="shrink-0 mt-0.5 animate-spin"
        :class="iconSizeClasses[size]"
        aria-hidden="true"
      >
        <svg
          class="w-[1em] h-[1em]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round" />
        </svg>
      </span>

      <!-- Icon -->
      <span
        v-else-if="showIcon"
        class="shrink-0 font-bold leading-none mt-0.5"
        :class="iconSizeClasses[size]"
        aria-hidden="true"
      >
        {{ resolvedIcon }}
      </span>

      <!-- Body -->
      <div class="flex-1 min-w-0">
        <p
          v-if="title"
          class="font-semibold leading-snug"
          :class="[
            titleSizeClasses[size],
            message || $slots.default ? 'mb-0.5' : '',
          ]"
        >
          {{ title }}
        </p>
        <p v-if="message || $slots.default" class="leading-snug">
          <slot>{{ message }}</slot>
        </p>

        <!-- Actions row -->
        <div
          v-if="action || secondaryAction"
          class="flex items-center gap-2 mt-2"
        >
          <button
            v-if="action"
            type="button"
            :disabled="disabled || loading"
            :class="[
              'inline-flex items-center font-medium rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-current',
              actionBtnSizeClasses[size],
              actionBtnClasses(action),
              disabled || loading
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer',
            ]"
            @click="onAction"
          >
            {{ action.label }}
          </button>
          <button
            v-if="secondaryAction"
            type="button"
            :disabled="disabled || loading"
            :class="[
              'inline-flex items-center font-medium rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-current',
              actionBtnSizeClasses[size],
              actionBtnClasses(secondaryAction),
              disabled || loading
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer',
            ]"
            @click="onSecondaryAction"
          >
            {{ secondaryAction.label }}
          </button>
        </div>
      </div>

      <!-- Dismiss button -->
      <button
        v-if="dismissible && !disabled"
        type="button"
        :disabled="loading"
        :class="[
          'shrink-0 ml-1 inline-flex items-center justify-center rounded-md transition-all',
          'opacity-60 hover:opacity-100 focus:opacity-100',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-1',
          closeSizeClasses[size],
          loading ? 'cursor-not-allowed' : 'cursor-pointer',
        ]"
        aria-label="Dismiss alert"
        @click="dismiss"
      >
        <svg
          class="w-[0.75em] h-[0.75em]"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          aria-hidden="true"
        >
          <path d="M2 2l8 8M10 2l-8 8" />
        </svg>
      </button>
    </div>
  </Transition>
</template>
