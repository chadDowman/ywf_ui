<script setup lang="ts">
import { computed } from "vue";
import { useDarkMode } from "@/composables/useDarkMode";

defineOptions({ name: "YSkeleton" });
import type { YSkeletonProps } from "@/types/skeleton";

const props = withDefaults(defineProps<YSkeletonProps>(), {
  variant: "rect",
  animated: true,
  count: 1,
  radius: "md",
});

const dk = useDarkMode(props.dark);

const radiusMap: Record<string, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

const bg = computed(() => (dk.value ? "bg-slate-700" : "bg-gray-200"));
const pulse = computed(() => (props.animated ? "animate-pulse" : ""));

const baseStyle = computed(() => ({
  width: props.width
    ? typeof props.width === "number"
      ? `${props.width}px`
      : props.width
    : undefined,
  height: props.height
    ? typeof props.height === "number"
      ? `${props.height}px`
      : props.height
    : undefined,
}));

const isComposite = computed(
  () => props.variant === "card" || props.variant === "list-item",
);

const variantClasses = computed(() => {
  switch (props.variant) {
    case "circle":
      return "rounded-full";
    case "line":
      return "h-4 w-full rounded";
    case "text":
      return "h-3 w-3/4 rounded";
    case "avatar":
      return "h-12 w-12 rounded-full";
    case "block":
      return "h-32 w-full rounded-lg";
    case "button":
      return "h-9 w-28 rounded-md";
    case "badge":
      return "h-5 w-16 rounded-full";
    case "image":
      return "h-48 w-full rounded-xl";
    default:
      return radiusMap[props.radius ?? "md"];
  }
});
</script>

<template>
  <div
    class="flex flex-col gap-2"
    :style="props.textColor ? { color: props.textColor } : undefined"
  >
    <!-- ── Card composite ── -->
    <template v-if="variant === 'card'">
      <div
        v-for="i in count ?? 1"
        :key="i"
        :class="[
          'w-full rounded-xl overflow-hidden',
          dk
            ? 'bg-slate-800 border border-slate-700'
            : 'bg-white border border-gray-100 shadow-sm',
          pulse,
        ]"
      >
        <!-- image placeholder -->
        <div :class="[bg, 'h-40 w-full']" />
        <div class="p-4 flex flex-col gap-3">
          <!-- title line -->
          <div :class="[bg, 'h-4 w-3/4 rounded']" />
          <!-- subtitle lines -->
          <div :class="[bg, 'h-3 w-full rounded']" />
          <div :class="[bg, 'h-3 w-5/6 rounded']" />
          <!-- footer row -->
          <div class="flex items-center justify-between pt-1">
            <div :class="[bg, 'h-6 w-6 rounded-full']" />
            <div :class="[bg, 'h-3 w-16 rounded']" />
          </div>
        </div>
      </div>
    </template>

    <!-- ── List-item composite ── -->
    <template v-else-if="variant === 'list-item'">
      <div
        v-for="i in count ?? 1"
        :key="i"
        :class="[
          'w-full flex items-center gap-3 px-3 py-2 rounded-lg',
          dk ? 'bg-slate-800/50' : 'bg-gray-50',
          pulse,
        ]"
      >
        <!-- avatar -->
        <div :class="[bg, 'h-10 w-10 shrink-0 rounded-full']" />
        <!-- text lines -->
        <div class="flex-1 flex flex-col gap-2">
          <div :class="[bg, 'h-3.5 w-1/2 rounded']" />
          <div :class="[bg, 'h-2.5 w-3/4 rounded']" />
        </div>
        <!-- trailing badge -->
        <div :class="[bg, 'h-5 w-12 rounded-full shrink-0']" />
      </div>
    </template>

    <!-- ── Simple variants ── -->
    <template v-else>
      <div
        v-for="i in count ?? 1"
        :key="i"
        :class="[bg, variantClasses, pulse]"
        :style="baseStyle"
      />
    </template>
  </div>
</template>
