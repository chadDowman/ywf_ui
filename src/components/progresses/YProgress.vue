<script setup lang="ts">
import { computed } from "vue";
import { useDarkMode } from "@/composables/useDarkMode";
import { useAnimation } from '@/composables/useAnimation';
import { getAppearAnimationClasses } from '@/types/animation';
import type { YProgressProps, YProgressVariant } from "@/types/progress";

defineOptions({ name: "YProgress" });

const props = withDefaults(defineProps<YProgressProps>(), {
  modelValue: 0,
  max: 100,
  variant: "solid",
  size: "md",
  rounded: true,
  striped: false,
  animated: true,
  indeterminate: false,
  showLabel: false,
  label: "",
  animation: undefined,
});

const dk = useDarkMode(props.dark);
const anim = useAnimation(() => props.animation);
const appearTx = computed(() => getAppearAnimationClasses(anim.value));

const normalized = computed(() => {
  if (props.indeterminate) return 45;
  const max = Math.max(1, props.max ?? 100);
  const value = Math.min(Math.max(props.modelValue ?? 0, 0), max);
  return (value / max) * 100;
});

const ariaNow = computed(() => {
  const max = Math.max(1, props.max ?? 100);
  return Math.min(Math.max(props.modelValue ?? 0, 0), max);
});

const labelText = computed(() => {
  if (props.label) return props.label;
  return `${Math.round(normalized.value)}%`;
});

const sizeMap: Record<string, string> = {
  sm: "h-2",
  md: "h-3",
  lg: "h-4",
};

const tokenMap: Record<YProgressVariant, { track: string; fill: string }> = {
  solid: {
    track: "bg-gray-200",
    fill: "bg-blue-600",
  },
  soft: {
    track: "bg-blue-100",
    fill: "bg-blue-500",
  },
  glass: {
    track: "yp-glass-track",
    fill: "yp-glass-fill",
  },
  brutalist: {
    track: "yp-brutalist-track",
    fill: "yp-brutalist-fill",
  },
  aurora: {
    track: "yp-aurora-track",
    fill: "yp-aurora-fill",
  },
  neon: {
    track: "yp-neon-track",
    fill: "yp-neon-fill",
  },
  terminal: {
    track: "yp-terminal-track",
    fill: "yp-terminal-fill",
  },
};

const darkTokenMap: Record<YProgressVariant, { track: string; fill: string }> =
  {
    solid: {
      track: "bg-slate-700",
      fill: "bg-blue-500",
    },
    soft: {
      track: "bg-slate-800",
      fill: "bg-blue-500",
    },
    glass: {
      track: "yp-glass-track yp-glass-track-dark",
      fill: "yp-glass-fill",
    },
    brutalist: {
      track: "yp-brutalist-track",
      fill: "yp-brutalist-fill",
    },
    aurora: {
      track: "yp-aurora-track",
      fill: "yp-aurora-fill",
    },
    neon: {
      track: "yp-neon-track",
      fill: "yp-neon-fill",
    },
    terminal: {
      track: "yp-terminal-track",
      fill: "yp-terminal-fill",
    },
  };

const tok = computed(
  () => (dk.value ? darkTokenMap : tokenMap)[props.variant ?? "solid"],
);

const fillClasses = computed(() => {
  const classes = [
    "yp-fill h-full transition-[width] duration-300",
    tok.value.fill,
    props.rounded ? "rounded-full" : "rounded-none",
  ];

  if (props.striped) classes.push("yp-striped");
  if (props.striped && props.animated) classes.push("yp-striped-animated");
  if (props.indeterminate) classes.push("yp-indeterminate");

  return classes;
});

const wrapperStyle = computed(() =>
  props.textColor ? { color: props.textColor } : undefined,
);

const labelStyle = computed(() => {
  if (!props.labelColor && !props.textColor) return undefined;
  return { color: props.labelColor ?? props.textColor };
});

const trackStyle = computed(() => {
  const style: Record<string, string> = {};
  if (props.trackColor) {
    style.background = props.trackColor;
    style.backgroundColor = props.trackColor;
  }
  if (props.borderColor) {
    style.borderColor = props.borderColor;
  }
  return Object.keys(style).length ? style : undefined;
});

const fillStyle = computed(() => {
  const style: Record<string, string> = {
    width: props.indeterminate ? "35%" : `${normalized.value}%`,
  };
  if (props.fillColor) {
    style.background = props.fillColor;
    style.backgroundColor = props.fillColor;
    if (props.variant === "terminal" || props.variant === "neon") {
      style.boxShadow = `0 0 10px ${props.fillColor}`;
    }
  }
  return style;
});
</script>

<template>
  <div class="w-full" :style="wrapperStyle">
    <div
      class="mb-1.5 flex items-center justify-between"
      v-if="showLabel || label"
    >
      <span
        class="text-xs font-medium"
        :class="dk ? 'text-slate-300' : 'text-gray-600'"
        :style="labelStyle"
      >
        {{ labelText }}
      </span>
    </div>

    <div
      class="yp-track relative w-full overflow-hidden"
      :class="[
        tok.track,
        sizeMap[size ?? 'md'],
        rounded ? 'rounded-full' : 'rounded-none',
        variant === 'brutalist' ? 'border-2 border-black' : '',
      ]"
      :style="trackStyle"
      role="progressbar"
      :aria-valuemin="0"
      :aria-valuemax="max"
      :aria-valuenow="indeterminate ? undefined : ariaNow"
      :aria-busy="indeterminate ? 'true' : undefined"
    >
      <div :class="fillClasses" :style="fillStyle" />
    </div>
  </div>
  </Transition>
</template>

<style scoped>
.yp-glass-track {
  background: rgba(255, 255, 255, 0.42);
  border: 1px solid rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.yp-glass-track-dark {
  background: rgba(30, 41, 59, 0.45);
  border-color: rgba(148, 163, 184, 0.3);
}

.yp-glass-fill {
  background: linear-gradient(
    90deg,
    rgba(59, 130, 246, 0.85),
    rgba(14, 165, 233, 0.85)
  );
}

.yp-brutalist-track {
  background: #ffffff;
  box-shadow: 3px 3px 0 #000;
}

.yp-brutalist-fill {
  background: #111111;
}

.yp-aurora-track {
  background: #0f172a;
  border: 1px solid rgba(99, 102, 241, 0.35);
}

.yp-aurora-fill {
  background: linear-gradient(90deg, #7c3aed, #2563eb, #06b6d4, #7c3aed);
  background-size: 240% 240%;
  animation: yp-aurora-move 4s linear infinite;
}

.yp-neon-track {
  background: #0f0b1f;
  border: 1px solid rgba(167, 139, 250, 0.3);
}

.yp-neon-fill {
  background: linear-gradient(90deg, #8b5cf6, #a78bfa);
  box-shadow: 0 0 10px rgba(167, 139, 250, 0.5);
}

.yp-terminal-track {
  background: #050b05;
  border: 1px solid rgba(74, 222, 128, 0.35);
}

.yp-terminal-fill {
  background: linear-gradient(90deg, #16a34a, #22c55e, #4ade80);
  box-shadow: 0 0 8px rgba(74, 222, 128, 0.45);
}

.yp-striped {
  background-image: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.25) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.25) 50%,
    rgba(255, 255, 255, 0.25) 75%,
    transparent 75%,
    transparent
  );
  background-size: 20px 20px;
}

.yp-striped-animated {
  animation: yp-stripes 0.9s linear infinite;
}

.yp-indeterminate {
  animation: yp-indeterminate 1.2s ease-in-out infinite;
}

@keyframes yp-stripes {
  0% {
    background-position: 20px 0;
  }
  100% {
    background-position: 0 0;
  }
}

@keyframes yp-indeterminate {
  0% {
    transform: translateX(-120%);
  }
  50% {
    transform: translateX(40%);
  }
  100% {
    transform: translateX(220%);
  }
}

@keyframes yp-aurora-move {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
