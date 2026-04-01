<script setup lang="ts">
import { computed, onUnmounted, watch } from "vue";
import { useDarkMode } from "@/composables/useDarkMode";
import { useAnimation } from "@/composables/useAnimation";
import { getPopupAnimationClasses } from "@/types/animation";

defineOptions({ name: "YToast" });
import type { YToastProps } from "@/types/toast";

const props = withDefaults(defineProps<YToastProps>(), {
  type: "info",
  variant: "solid",
  position: "top-right",
  duration: 4000,
  dismissible: true,
  visible: true,
  showIcon: true,
  radius: "md",
  animation: undefined,
});

const dk = useDarkMode(props.dark);
const anim = useAnimation(() => props.animation);
const toastTransition = computed(() => {
  const a = anim.value;
  if (a === "auto") {
    return {
      enterActive: "transition duration-300 ease-out",
      enterFrom: "opacity-0 translate-y-2 scale-95",
      enterTo: "opacity-100 translate-y-0 scale-100",
      leaveActive: "transition duration-200 ease-in",
      leaveFrom: "opacity-100 translate-y-0 scale-100",
      leaveTo: "opacity-0 translate-y-2 scale-95",
    };
  }
  return getPopupAnimationClasses(a);
});

const emit = defineEmits<{
  dismiss: [];
}>();

/* ── Auto-dismiss timer ── */
let dismissTimer: ReturnType<typeof setTimeout> | null = null;

function clearDismissTimer() {
  if (dismissTimer !== null) {
    clearTimeout(dismissTimer);
    dismissTimer = null;
  }
}

function startDismissTimer() {
  clearDismissTimer();
  if (props.duration && props.duration > 0 && props.visible) {
    dismissTimer = setTimeout(() => emit("dismiss"), props.duration);
  }
}

watch(
  () => props.visible,
  (val) => {
    if (val) startDismissTimer();
    else clearDismissTimer();
  },
  { immediate: true },
);

watch(
  () => props.duration,
  () => {
    if (props.visible) startDismissTimer();
  },
);

onUnmounted(clearDismissTimer);

const iconPaths: Record<string, string> = {
  success: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  error: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
  warning:
    "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
  info: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
};

const solidBgMap: Record<string, string> = {
  success: "var(--ywf-success)",
  error: "var(--ywf-error)",
  warning: "var(--ywf-warning)",
  info: "var(--ywf-info)",
};

const softClassesLight: Record<string, string> = {
  success: "bg-green-50 border border-green-200 text-green-800",
  error: "bg-red-50 border border-red-200 text-red-800",
  warning: "bg-amber-50 border border-amber-200 text-amber-800",
  info: "bg-blue-50 border border-blue-200 text-blue-800",
};

const softClassesDark: Record<string, string> = {
  success: "bg-green-950 border border-green-800 text-green-200",
  error: "bg-red-950 border border-red-800 text-red-200",
  warning: "bg-amber-950 border border-amber-800 text-amber-200",
  info: "bg-blue-950 border border-blue-800 text-blue-200",
};

const outlineBorderMap: Record<string, string> = {
  success: "border-green-500",
  error: "border-red-500",
  warning: "border-amber-500",
  info: "border-blue-500",
};

const brutalBorderMap: Record<string, string> = {
  success: "border-green-600",
  error: "border-red-600",
  warning: "border-amber-500",
  info: "border-blue-600",
};

const minimalAccentMap: Record<string, string> = {
  success: "border-l-green-500",
  error: "border-l-red-500",
  warning: "border-l-amber-500",
  info: "border-l-blue-500",
};

const iconColorMap: Record<string, string> = {
  success: "text-green-600",
  error: "text-red-600",
  warning: "text-amber-600",
  info: "text-blue-600",
};

const radiusMap: Record<string, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-lg",
  lg: "rounded-xl",
  full: "rounded-2xl",
};

const t = computed(() => props.type ?? "info");
const r = computed(() => radiusMap[props.radius ?? "md"]);

const wrapperClasses = computed(() => {
  const base = `${r.value} p-4 flex items-start gap-3 min-w-[280px] max-w-sm`;
  const softMap = dk.value ? softClassesDark : softClassesLight;
  switch (props.variant) {
    case "soft":
      return `${base} ${softMap[t.value]} shadow-sm`;
    case "outlined":
      return `${base} border-2 ${outlineBorderMap[t.value]} ${dk.value ? "bg-gray-900" : "bg-white"} shadow-sm`;
    case "glass":
      return `${base} backdrop-blur-md ${dk.value ? "bg-gray-900/80" : "bg-white/80"} border border-white/30 shadow-xl`;
    case "aurora":
      return `${base} ytoast-aurora`;
    case "neon":
      return `${base} ytoast-neon ytoast-neon-${t.value}`;
    case "brutalist":
      return `${base} ytoast-brutalist border-[3px] ${brutalBorderMap[t.value]} bg-white rounded-none`;
    case "terminal":
      return `${base} ytoast-terminal rounded-none`;
    case "minimal":
      return `${base} border-l-4 ${minimalAccentMap[t.value]} ${dk.value ? "bg-slate-900 border-y border-r border-slate-800" : "bg-white border-y border-r border-gray-100"} shadow-md`;
    default:
      return `${base} shadow-lg`;
  }
});

const wrapperStyle = computed(() => {
  const style =
    props.variant === "solid" ? { backgroundColor: solidBgMap[t.value] } : {};
  return props.textColor ? { ...style, color: props.textColor } : style;
});
</script>

<template>
  <Transition
    :enter-active-class="toastTransition.enterActive"
    :enter-from-class="toastTransition.enterFrom"
    :enter-to-class="toastTransition.enterTo"
    :leave-active-class="toastTransition.leaveActive"
    :leave-from-class="toastTransition.leaveFrom"
    :leave-to-class="toastTransition.leaveTo"
  >
  <div
    v-if="visible"
    :class="wrapperClasses"
    :style="wrapperStyle"
    role="alert"
    :aria-live="type === 'error' || type === 'warning' ? 'assertive' : 'polite'"
  >
    <svg
      v-if="showIcon"
      class="mt-0.5 h-5 w-5 shrink-0"
      :class="
        variant === 'solid' || variant === 'aurora' || variant === 'neon' || variant === 'terminal'
          ? 'text-white'
          : iconColorMap[t]
      "
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      viewBox="0 0 24 24"
    >
      <path stroke-linecap="round" stroke-linejoin="round" :d="iconPaths[t]" />
    </svg>

    <div class="min-w-0 flex-1">
      <p
        v-if="title"
        class="text-sm font-semibold leading-tight"
        :class="
          variant === 'solid' || variant === 'aurora' || variant === 'neon' || variant === 'terminal'
            ? 'text-white'
            : variant === 'brutalist'
              ? 'text-black font-black uppercase tracking-wide'
              : ''
        "
      >
        {{ title }}
      </p>
      <p
        v-if="message"
        class="mt-0.5 text-sm"
        :class="
          variant === 'solid' || variant === 'aurora' || variant === 'neon' || variant === 'terminal'
            ? 'text-white/85'
            : variant === 'brutalist'
              ? 'text-black font-medium'
              : 'opacity-80'
        "
      >
        {{ message }}
      </p>
    </div>

    <button
      v-if="dismissible"
      type="button"
      class="shrink-0 rounded p-0.5 transition-opacity hover:opacity-70"
      :class="
        variant === 'solid'
          ? 'text-white'
          : dk
            ? 'text-gray-400'
            : 'text-gray-500'
      "
      @click="emit('dismiss')"
    >
      <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path
          fill-rule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </div>
  </Transition>
</template>

<style scoped>
/* ── Aurora ──────────────────────────────────────────────── */
.ytoast-aurora {
  background: linear-gradient(135deg, #0f0f2e, #0a1a2e);
  color: #e2e8f0;
  position: relative;
  box-shadow: 0 8px 32px rgba(124, 58, 237, 0.3);
}
.ytoast-aurora::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.5px;
  background: linear-gradient(135deg, #7c3aed, #2563eb, #06b6d4, #7c3aed);
  background-size: 300% 300%;
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: ytoast-aurora-spin 4s linear infinite;
  pointer-events: none;
}
@keyframes ytoast-aurora-spin {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* ── Neon ────────────────────────────────────────────────── */
.ytoast-neon {
  background: #0d0d1a;
  color: #e2e8f0;
}
.ytoast-neon-success {
  border: 1px solid rgba(74, 222, 128, 0.5);
  box-shadow: 0 0 20px rgba(74, 222, 128, 0.25), inset 0 0 20px rgba(74, 222, 128, 0.04);
}
.ytoast-neon-error {
  border: 1px solid rgba(248, 113, 113, 0.5);
  box-shadow: 0 0 20px rgba(248, 113, 113, 0.25), inset 0 0 20px rgba(248, 113, 113, 0.04);
}
.ytoast-neon-warning {
  border: 1px solid rgba(251, 191, 36, 0.5);
  box-shadow: 0 0 20px rgba(251, 191, 36, 0.25), inset 0 0 20px rgba(251, 191, 36, 0.04);
}
.ytoast-neon-info {
  border: 1px solid rgba(96, 165, 250, 0.5);
  box-shadow: 0 0 20px rgba(96, 165, 250, 0.25), inset 0 0 20px rgba(96, 165, 250, 0.04);
}

/* ── Brutalist ───────────────────────────────────────────── */
.ytoast-brutalist {
  box-shadow: 5px 5px 0 #000;
  font-family: inherit;
}

/* ── Terminal ────────────────────────────────────────────── */
.ytoast-terminal {
  background: #0a0a0a;
  border: 1px solid rgba(74, 222, 128, 0.4);
  color: #4ade80;
  font-family: "Courier New", Courier, monospace;
  box-shadow: 0 0 16px rgba(74, 222, 128, 0.15);
}
.ytoast-terminal :deep(p) {
  color: #86efac;
}
.ytoast-terminal :deep(p:first-child) {
  color: #4ade80;
  text-shadow: 0 0 6px rgba(74, 222, 128, 0.5);
}
</style>
