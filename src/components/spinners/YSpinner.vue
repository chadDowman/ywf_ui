<script setup lang="ts">
import { computed } from "vue";
import { useDarkMode } from "@/composables/useDarkMode";
import { useAnimation } from '@/composables/useAnimation';
import { getAppearAnimationClasses } from '@/types/animation';
import type { YSpinnerProps } from "@/types/spinner";

defineOptions({ name: "YSpinner" });

const props = withDefaults(defineProps<YSpinnerProps>(), {
  size: "md",
  variant: "ring",
  speed: "normal",
  visible: true,
  animation: undefined,
});

const dk = useDarkMode(props.dark);
const anim = useAnimation(() => props.animation);
const appearTx = computed(() => getAppearAnimationClasses(anim.value));
const resolvedColor = computed(
  () => props.color ?? (dk.value ? "#93c5fd" : "#2563eb"),
);

const sizeMap: Record<string, string> = {
  xs: "h-4 w-4",
  sm: "h-5 w-5",
  md: "h-8 w-8",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
};

// Raw pixel sizes for variants that need them
const sizePx: Record<string, number> = {
  xs: 16,
  sm: 20,
  md: 32,
  lg: 48,
  xl: 64,
};

const speedMap: Record<string, string> = {
  slow: "1.6s",
  normal: "0.8s",
  fast: "0.4s",
};

// For grid: 3×3 dots, each ~22% of container
const gridDots = [0, 1, 2, 3, 4, 5, 6, 7, 8];
// Stagger delay per grid position (wave-like pattern)
const gridDelay = (i: number) =>
  `${((Math.floor(i / 3) + (i % 3)) * 0.12).toFixed(2)}s`;
</script>

<template>
  <div
    v-if="visible"
    role="status"
    class="inline-flex flex-col items-center gap-2"
    :aria-label="label ?? 'Loading'"
    :style="props.textColor ? { color: props.textColor } : undefined"
  >
    <!-- ── RING (original) ─────────────────────────────────────── -->
    <svg
      v-if="variant === 'ring'"
      :class="sizeMap[size ?? 'md']"
      viewBox="0 0 24 24"
      fill="none"
      :style="{
        animation: `yspinner-spin ${speedMap[speed ?? 'normal']} linear infinite`,
      }"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
        :style="{ color: resolvedColor }"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4z"
        :style="{ color: resolvedColor }"
      />
    </svg>

    <!-- ── DOTS (original) ────────────────────────────────────── -->
    <span
      v-else-if="variant === 'dots'"
      class="flex items-center gap-1"
      :class="sizeMap[size ?? 'md']"
    >
      <span
        v-for="i in 3"
        :key="i"
        class="inline-block rounded-full"
        :style="{
          width: '30%',
          height: '30%',
          backgroundColor: resolvedColor,
          animation: `yspinner-bounce ${speedMap[speed ?? 'normal']} ease-in-out infinite`,
          animationDelay: `${(i - 1) * 0.15}s`,
        }"
      />
    </span>

    <!-- ── BARS (original) ────────────────────────────────────── -->
    <span
      v-else-if="variant === 'bars'"
      class="flex items-end gap-0.5"
      :class="sizeMap[size ?? 'md']"
    >
      <span
        v-for="i in 4"
        :key="i"
        class="inline-block w-1/5 rounded-sm"
        :style="{
          height: '100%',
          backgroundColor: resolvedColor,
          animation: `yspinner-barPulse ${speedMap[speed ?? 'normal']} ease-in-out infinite`,
          animationDelay: `${(i - 1) * 0.12}s`,
        }"
      />
    </span>

    <!-- ── PULSE (original) ───────────────────────────────────── -->
    <span
      v-else-if="variant === 'pulse'"
      class="inline-block rounded-full"
      :class="sizeMap[size ?? 'md']"
      :style="{
        backgroundColor: resolvedColor,
        animation: `yspinner-pulse ${speedMap[speed ?? 'normal']} cubic-bezier(0.4,0,0.6,1) infinite`,
      }"
    />

    <!-- ── BOUNCE (original) ──────────────────────────────────── -->
    <span
      v-else-if="variant === 'bounce'"
      class="flex items-center gap-1"
      :class="sizeMap[size ?? 'md']"
    >
      <span
        v-for="i in 3"
        :key="i"
        class="inline-block rounded-full"
        :style="{
          width: '28%',
          height: '28%',
          backgroundColor: resolvedColor,
          animation: `yspinner-spinnerBounce ${speedMap[speed ?? 'normal']} ease-in-out infinite`,
          animationDelay: `${(i - 1) * 0.16}s`,
        }"
      />
    </span>

    <!-- ── RIPPLE (original) ──────────────────────────────────── -->
    <span
      v-else-if="variant === 'ripple'"
      class="relative inline-block"
      :class="sizeMap[size ?? 'md']"
    >
      <span
        v-for="i in 2"
        :key="i"
        class="absolute inset-0 rounded-full border-2"
        :style="{
          borderColor: resolvedColor,
          animation: `yspinner-ripple ${speedMap[speed ?? 'normal']} ease-out infinite`,
          animationDelay: `${(i - 1) * 0.4}s`,
        }"
      />
    </span>

    <!-- ── ORBIT ──────────────────────────────────────────────── -->
    <!-- Central dot + 3 orbiting satellites at different radii/speeds -->
    <span
      v-else-if="variant === 'orbit'"
      class="relative inline-block"
      :class="sizeMap[size ?? 'md']"
    >
      <!-- Centre -->
      <span
        class="absolute rounded-full yspinner-orbit-center"
        :style="{ backgroundColor: resolvedColor }"
      />
      <!-- Orbit ring 1 -->
      <span
        class="absolute inset-0 rounded-full yspinner-orbit-ring"
        :style="{
          borderColor: resolvedColor,
          animation: `yspinner-spin ${speedMap[speed ?? 'normal']} linear infinite`,
        }"
      >
        <span
          class="absolute rounded-full yspinner-orbit-dot"
          :style="{ backgroundColor: resolvedColor }"
        />
      </span>
      <!-- Orbit ring 2, counter-clockwise, slightly smaller -->
      <span
        class="absolute yspinner-orbit-ring2"
        :style="{
          borderColor: resolvedColor,
          animation: `yspinner-spinReverse ${parseFloat(speedMap[speed ?? 'normal']) * 1.5}s linear infinite`,
        }"
      >
        <span
          class="absolute rounded-full yspinner-orbit-dot2"
          :style="{ backgroundColor: resolvedColor }"
        />
      </span>
    </span>

    <!-- ── CLOCK ──────────────────────────────────────────────── -->
    <!-- SVG clock face: outer circle, hour hand, minute hand spinning -->
    <svg
      v-else-if="variant === 'clock'"
      :class="sizeMap[size ?? 'md']"
      viewBox="0 0 24 24"
      fill="none"
    >
      <!-- Face -->
      <circle
        cx="12"
        cy="12"
        r="10"
        :stroke="resolvedColor"
        stroke-width="1.5"
        opacity="0.25"
      />
      <!-- Tick marks -->
      <line
        x1="12"
        y1="3.5"
        x2="12"
        y2="5.5"
        :stroke="resolvedColor"
        stroke-width="1.5"
        stroke-linecap="round"
        opacity="0.5"
      />
      <line
        x1="12"
        y1="18.5"
        x2="12"
        y2="20.5"
        :stroke="resolvedColor"
        stroke-width="1.5"
        stroke-linecap="round"
        opacity="0.5"
      />
      <line
        x1="3.5"
        y1="12"
        x2="5.5"
        y2="12"
        :stroke="resolvedColor"
        stroke-width="1.5"
        stroke-linecap="round"
        opacity="0.5"
      />
      <line
        x1="18.5"
        y1="12"
        x2="20.5"
        y2="12"
        :stroke="resolvedColor"
        stroke-width="1.5"
        stroke-linecap="round"
        opacity="0.5"
      />
      <!-- Hour hand (slow) -->
      <line
        x1="12"
        y1="12"
        x2="12"
        y2="8"
        :stroke="resolvedColor"
        stroke-width="2"
        stroke-linecap="round"
        :style="{
          transformOrigin: '12px 12px',
          animation: `yspinner-spin ${parseFloat(speedMap[speed ?? 'normal']) * 12}s linear infinite`,
        }"
      />
      <!-- Minute hand (fast) -->
      <line
        x1="12"
        y1="12"
        x2="12"
        y2="6"
        :stroke="resolvedColor"
        stroke-width="1.5"
        stroke-linecap="round"
        opacity="0.7"
        :style="{
          transformOrigin: '12px 12px',
          animation: `yspinner-spin ${speedMap[speed ?? 'normal']} linear infinite`,
        }"
      />
      <!-- Centre dot -->
      <circle cx="12" cy="12" r="1.2" :fill="resolvedColor" />
    </svg>

    <!-- ── MORPH ───────────────────────────────────────────────── -->
    <!-- A square that morphs through border-radius into a circle and back -->
    <span
      v-else-if="variant === 'morph'"
      class="inline-block yspinner-morph"
      :class="sizeMap[size ?? 'md']"
      :style="{
        backgroundColor: resolvedColor,
        animation: `yspinner-morph ${speedMap[speed ?? 'normal']} ease-in-out infinite`,
      }"
    />

    <!-- ── WAVE ────────────────────────────────────────────────── -->
    <!-- 5 vertical bars that animate in a sine wave pattern -->
    <span
      v-else-if="variant === 'wave'"
      class="flex items-center gap-px"
      :class="sizeMap[size ?? 'md']"
    >
      <span
        v-for="i in 5"
        :key="i"
        class="inline-block rounded-full"
        :style="{
          width: '14%',
          height: '60%',
          backgroundColor: resolvedColor,
          animation: `yspinner-wave ${speedMap[speed ?? 'normal']} ease-in-out infinite`,
          animationDelay: `${(i - 1) * 0.1}s`,
        }"
      />
    </span>

    <!-- ── GRID ────────────────────────────────────────────────── -->
    <!-- 3×3 grid of dots that pulse in a travelling-wave pattern -->
    <span
      v-else-if="variant === 'grid'"
      class="inline-grid yspinner-grid-layout"
      :class="sizeMap[size ?? 'md']"
    >
      <span
        v-for="(_, i) in gridDots"
        :key="i"
        class="rounded-full yspinner-grid-dot"
        :style="{
          backgroundColor: resolvedColor,
          animation: `yspinner-gridPop ${speedMap[speed ?? 'normal']} ease-in-out infinite`,
          animationDelay: gridDelay(i),
        }"
      />
    </span>

    <!-- ── SPIRAL ──────────────────────────────────────────────── -->
    <!-- SVG arc that rotates AND the stroke-dashoffset animates, giving a comet/spiral feel -->
    <svg
      v-else-if="variant === 'spiral'"
      :class="sizeMap[size ?? 'md']"
      viewBox="0 0 24 24"
      fill="none"
      :style="{
        animation: `yspinner-spin ${speedMap[speed ?? 'normal']} linear infinite`,
      }"
    >
      <!-- Faint full circle track -->
      <circle
        cx="12"
        cy="12"
        r="9"
        :stroke="resolvedColor"
        stroke-width="2.5"
        opacity="0.12"
      />
      <!-- Comet arc — dasharray creates the tail effect -->
      <circle
        cx="12"
        cy="12"
        r="9"
        :stroke="resolvedColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-dasharray="20 37"
        stroke-dashoffset="0"
        opacity="0.9"
      />
      <!-- Bright leading dot -->
      <circle cx="12" cy="3" r="2" :fill="resolvedColor" />
    </svg>

    <span v-if="label" class="text-xs text-gray-500 dark:text-gray-400">{{
      label
    }}</span>
  </div>
  </Transition>
</template>

<style>
/* ── Original keyframes (prefixed to avoid collisions) ── */
@keyframes yspinner-spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes yspinner-spinReverse {
  to {
    transform: rotate(-360deg);
  }
}
@keyframes yspinner-barPulse {
  0%,
  100% {
    transform: scaleY(0.3);
    opacity: 0.4;
  }
  50% {
    transform: scaleY(1);
    opacity: 1;
  }
}
@keyframes yspinner-spinnerBounce {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}
@keyframes yspinner-ripple {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}
@keyframes yspinner-bounce {
  0%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-40%);
  }
}
@keyframes yspinner-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

/* ── ORBIT ── */
.yspinner-orbit-center {
  top: 50%;
  left: 50%;
  width: 20%;
  height: 20%;
  transform: translate(-50%, -50%);
}
.yspinner-orbit-ring {
  border-width: 1.5px;
  border-style: dashed;
  border-radius: 9999px;
}
.yspinner-orbit-dot {
  top: -4%;
  left: 50%;
  width: 22%;
  height: 22%;
  transform: translateX(-50%);
}
.yspinner-orbit-ring2 {
  position: absolute;
  inset: 18%;
  border-width: 1.5px;
  border-style: dashed;
  border-radius: 9999px;
}
.yspinner-orbit-dot2 {
  bottom: -8%;
  left: 50%;
  width: 28%;
  height: 28%;
  transform: translateX(-50%);
}

/* ── MORPH ── */
@keyframes yspinner-morph {
  0% {
    border-radius: 0%;
    transform: rotate(0deg) scale(1);
  }
  25% {
    border-radius: 50% 0;
    transform: rotate(90deg) scale(0.9);
  }
  50% {
    border-radius: 50%;
    transform: rotate(180deg) scale(1);
  }
  75% {
    border-radius: 0 50%;
    transform: rotate(270deg) scale(0.9);
  }
  100% {
    border-radius: 0%;
    transform: rotate(360deg) scale(1);
  }
}

/* ── WAVE ── */
@keyframes yspinner-wave {
  0%,
  100% {
    transform: scaleY(0.4);
    opacity: 0.5;
  }
  50% {
    transform: scaleY(1);
    opacity: 1;
  }
}

/* ── GRID ── */
.yspinner-grid-layout {
  grid-template-columns: repeat(3, 1fr);
  gap: 8%;
}
.yspinner-grid-dot {
  width: 100%;
  aspect-ratio: 1;
}
@keyframes yspinner-gridPop {
  0%,
  100% {
    transform: scale(0.3);
    opacity: 0.25;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
