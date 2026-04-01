<script setup lang="ts">
import { computed, ref, onMounted, useAttrs, useId } from "vue";
import { useDarkMode } from "@/composables/useDarkMode";
import { useAnimation } from '@/composables/useAnimation';
import { getAppearAnimationClasses } from '@/types/animation';
import type {
  YTextareaProps,
  YTextareaVariant,
  YTextareaState,
} from "@/types/textarea";

defineOptions({ name: "YTextarea", inheritAttrs: false });

const props = withDefaults(defineProps<YTextareaProps>(), {
  modelValue: "",
  placeholder: "",
  variant: "outlined",
  size: "md",
  radius: "md",
  state: "default",
  rows: 4,
  resize: "vertical",
  autoResize: false,
  fullWidth: false,
  disabled: false,
  readonly: false,
  showCount: false,
  animation: undefined,
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
}>();

const attrs = useAttrs();
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const dk = useDarkMode(props.dark);
const anim = useAnimation(() => props.animation);
const appearTx = computed(() => getAppearAnimationClasses(anim.value));
const textareaId = useId();

const currentLength = computed(() => String(props.modelValue ?? "").length);

const resolvedState = computed<YTextareaState>(() => {
  if (props.error) return "error";
  if (props.success) return "success";
  if (props.warning) return "warning";
  return props.state;
});

const helpText = computed(() => {
  if (props.error) return props.error;
  if (props.success) return props.success;
  if (props.warning) return props.warning;
  return props.hint;
});

const sizeMap: Record<string, string> = {
  sm: "px-3 py-2 text-[13px]",
  md: "px-3.5 py-2.5 text-sm",
  lg: "px-4 py-3 text-base",
};

const labelSizeMap: Record<string, string> = {
  sm: "text-[11px] font-semibold tracking-wide uppercase mb-1.5",
  md: "text-[11.5px] font-semibold tracking-wide uppercase mb-2",
  lg: "text-xs font-semibold tracking-wide uppercase mb-2",
};

const hintSizeMap: Record<string, string> = {
  sm: "text-[11px] mt-1.5",
  md: "text-[12px] mt-2",
  lg: "text-[12.5px] mt-2",
};

const radiusMap: Record<string, string> = {
  none: "rounded-none",
  sm: "rounded",
  md: "rounded-lg",
  lg: "rounded-xl",
  full: "rounded-2xl",
};

const resolvedRadius = computed(() =>
  props.variant === "underline" || props.variant === "brutalist"
    ? "rounded-none"
    : radiusMap[props.radius ?? "md"],
);

const resizeMap: Record<string, string> = {
  none: "resize-none",
  vertical: "resize-y",
  horizontal: "resize-x",
  both: "resize",
};

/* ── Variant token system ── */
type TokenSet = {
  idle: string;
  hover: string;
  focus: string;
  error: string;
  success: string;
  warning: string;
  disabled: string;
  readonly: string;
};

const lightTokens: Record<YTextareaVariant, TokenSet> = {
  outlined: {
    idle: "bg-white border border-gray-200 shadow-sm text-gray-900 placeholder:text-gray-400",
    hover: "hover:border-gray-300",
    focus:
      "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 focus:outline-none",
    error:
      "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/15 focus:outline-none",
    success:
      "border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 focus:outline-none",
    warning:
      "border-amber-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15 focus:outline-none",
    disabled: "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed",
    readonly: "bg-gray-50/60 border-gray-200 cursor-default",
  },
  filled: {
    idle: "bg-gray-100/80 border border-transparent text-gray-900 placeholder:text-gray-400",
    hover: "hover:bg-gray-100 hover:border-gray-200",
    focus:
      "focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 focus:outline-none",
    error:
      "bg-red-50 border-red-300 focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-500/15 focus:outline-none",
    success:
      "bg-emerald-50 border-emerald-300 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 focus:outline-none",
    warning:
      "bg-amber-50 border-amber-300 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15 focus:outline-none",
    disabled: "bg-gray-100 border-transparent text-gray-400 cursor-not-allowed",
    readonly: "bg-gray-100/60 border-transparent cursor-default",
  },
  ghost: {
    idle: "bg-transparent border border-transparent text-gray-900 placeholder:text-gray-400",
    hover: "hover:bg-gray-50 hover:border-gray-200",
    focus:
      "focus:bg-white focus:border-gray-300 focus:shadow-sm focus:outline-none",
    error:
      "bg-red-50/40 border-red-300 focus:bg-white focus:border-red-400 focus:outline-none",
    success:
      "bg-emerald-50/40 border-emerald-300 focus:bg-white focus:border-emerald-400 focus:outline-none",
    warning:
      "bg-amber-50/40 border-amber-300 focus:bg-white focus:border-amber-400 focus:outline-none",
    disabled:
      "bg-transparent border-transparent text-gray-400 cursor-not-allowed",
    readonly: "bg-transparent border-transparent cursor-default",
  },
  underline: {
    idle: "bg-transparent border-0 border-b-2 border-gray-200 text-gray-900 placeholder:text-gray-400",
    hover: "hover:border-gray-300",
    focus: "focus:border-blue-500 focus:outline-none",
    error: "border-red-400 focus:border-red-500 focus:outline-none",
    success: "border-emerald-400 focus:border-emerald-500 focus:outline-none",
    warning: "border-amber-400 focus:border-amber-500 focus:outline-none",
    disabled: "border-gray-100 text-gray-400 cursor-not-allowed",
    readonly: "border-gray-200 cursor-default",
  },
  glass: {
    idle: "yta-glass bg-white/60 border border-white/50 shadow-sm text-gray-900 placeholder:text-gray-400",
    hover: "hover:bg-white/75",
    focus:
      "focus:bg-white/85 focus:border-blue-300/60 focus:ring-2 focus:ring-blue-400/10 focus:outline-none",
    error:
      "bg-red-50/40 border-red-300/60 focus:border-red-400/60 focus:outline-none",
    success:
      "bg-emerald-50/40 border-emerald-300/60 focus:border-emerald-400/60 focus:outline-none",
    warning:
      "bg-amber-50/40 border-amber-300/60 focus:border-amber-400/60 focus:outline-none",
    disabled: "bg-white/25 border-white/15 text-gray-400 cursor-not-allowed",
    readonly: "bg-white/35 cursor-default",
  },
  brutalist: {
    idle: "bg-white border-[3px] border-black text-black placeholder:text-gray-500 font-medium",
    hover: "",
    focus: "focus:shadow-[4px_4px_0_0_#000] focus:outline-none",
    error:
      "bg-white border-red-600 focus:shadow-[4px_4px_0_0_#dc2626] focus:outline-none",
    success:
      "bg-white border-green-600 focus:shadow-[4px_4px_0_0_#16a34a] focus:outline-none",
    warning:
      "bg-white border-amber-500 focus:shadow-[4px_4px_0_0_#d97706] focus:outline-none",
    disabled: "bg-gray-100 border-gray-400 text-gray-400 cursor-not-allowed",
    readonly: "bg-gray-50 border-black/40 cursor-default",
  },
  aurora: {
    idle: "yta-aurora border-0 text-slate-100 placeholder:text-slate-400 focus:outline-none",
    hover: "",
    focus: "",
    error: "",
    success: "",
    warning: "",
    disabled: "cursor-not-allowed opacity-50",
    readonly: "cursor-default",
  },
  neon: {
    idle: "yta-neon border border-violet-500/50 text-violet-100 placeholder:text-violet-300/40 focus:border-violet-400 focus:outline-none",
    hover: "hover:border-violet-400/70",
    focus: "",
    error: "border-red-500/60 focus:border-red-400/70 focus:outline-none",
    success:
      "border-emerald-500/60 focus:border-emerald-400/70 focus:outline-none",
    warning: "border-amber-500/60 focus:border-amber-400/70 focus:outline-none",
    disabled: "border-violet-800/30 cursor-not-allowed opacity-50",
    readonly: "border-violet-700/30 cursor-default",
  },
  terminal: {
    idle: "yta-terminal border border-green-500/40 text-green-300 placeholder:text-green-500/40 focus:border-green-400 focus:outline-none",
    hover: "hover:border-green-400/60",
    focus: "",
    error: "border-red-500/50 focus:border-red-400/60 focus:outline-none",
    success: "border-green-400/50 focus:border-green-300/60 focus:outline-none",
    warning: "border-amber-500/50 focus:border-amber-400/60 focus:outline-none",
    disabled: "border-green-800/30 cursor-not-allowed opacity-50",
    readonly: "border-green-700/30 cursor-default",
  },
};

const darkTokens: Record<YTextareaVariant, TokenSet> = {
  outlined: {
    idle: "bg-slate-800 border border-slate-600 shadow-sm text-slate-100 placeholder:text-slate-400",
    hover: "hover:border-slate-500",
    focus:
      "focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none",
    error:
      "border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 focus:outline-none",
    success:
      "border-emerald-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none",
    warning:
      "border-amber-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:outline-none",
    disabled: "bg-slate-900 border-slate-700 text-slate-500 cursor-not-allowed",
    readonly: "bg-slate-800/60 border-slate-700 cursor-default",
  },
  filled: {
    idle: "bg-slate-700/80 border border-transparent text-slate-100 placeholder:text-slate-400",
    hover: "hover:bg-slate-700 hover:border-slate-600",
    focus:
      "focus:bg-slate-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none",
    error:
      "bg-red-900/30 border-red-500 focus:bg-slate-800 focus:border-red-400 focus:outline-none",
    success:
      "bg-emerald-900/30 border-emerald-500 focus:bg-slate-800 focus:border-emerald-400 focus:outline-none",
    warning:
      "bg-amber-900/30 border-amber-500 focus:bg-slate-800 focus:border-amber-400 focus:outline-none",
    disabled:
      "bg-slate-800 border-transparent text-slate-500 cursor-not-allowed",
    readonly: "bg-slate-800/60 border-transparent cursor-default",
  },
  ghost: {
    idle: "bg-transparent border border-transparent text-slate-100 placeholder:text-slate-400",
    hover: "hover:bg-slate-800 hover:border-slate-700",
    focus: "focus:bg-slate-800 focus:border-slate-600 focus:outline-none",
    error: "bg-red-900/20 border-red-500 focus:outline-none",
    success: "bg-emerald-900/20 border-emerald-500 focus:outline-none",
    warning: "bg-amber-900/20 border-amber-500 focus:outline-none",
    disabled:
      "bg-transparent border-transparent text-slate-500 cursor-not-allowed",
    readonly: "bg-transparent border-transparent cursor-default",
  },
  underline: {
    idle: "bg-transparent border-0 border-b-2 border-slate-600 text-slate-100 placeholder:text-slate-400",
    hover: "hover:border-slate-500",
    focus: "focus:border-blue-400 focus:outline-none",
    error: "border-red-500 focus:border-red-400 focus:outline-none",
    success: "border-emerald-500 focus:border-emerald-400 focus:outline-none",
    warning: "border-amber-500 focus:border-amber-400 focus:outline-none",
    disabled: "border-slate-700 text-slate-500 cursor-not-allowed",
    readonly: "border-slate-700 cursor-default",
  },
  glass: {
    idle: "yta-glass bg-slate-800/40 border border-white/10 shadow-sm text-slate-100 placeholder:text-slate-400",
    hover: "hover:bg-slate-700/50 hover:border-white/20",
    focus: "focus:bg-slate-700/60 focus:border-blue-400/50 focus:outline-none",
    error: "bg-red-900/20 border-red-500/60 focus:outline-none",
    success: "bg-emerald-900/20 border-emerald-500/60 focus:outline-none",
    warning: "bg-amber-900/20 border-amber-500/60 focus:outline-none",
    disabled:
      "bg-slate-900/40 border-white/5 text-slate-500 cursor-not-allowed",
    readonly: "bg-slate-800/30 cursor-default",
  },
  brutalist: {
    idle: "bg-white border-[3px] border-black text-black placeholder:text-gray-500 font-medium",
    hover: "",
    focus: "focus:shadow-[4px_4px_0_0_#000] focus:outline-none",
    error:
      "bg-white border-red-600 focus:shadow-[4px_4px_0_0_#dc2626] focus:outline-none",
    success:
      "bg-white border-green-600 focus:shadow-[4px_4px_0_0_#16a34a] focus:outline-none",
    warning:
      "bg-white border-amber-500 focus:shadow-[4px_4px_0_0_#d97706] focus:outline-none",
    disabled: "bg-gray-100 border-gray-400 text-gray-400 cursor-not-allowed",
    readonly: "bg-gray-50 border-black/40 cursor-default",
  },
  aurora: {
    idle: "yta-aurora border-0 text-slate-100 placeholder:text-slate-400 focus:outline-none",
    hover: "",
    focus: "",
    error: "",
    success: "",
    warning: "",
    disabled: "cursor-not-allowed opacity-50",
    readonly: "cursor-default",
  },
  neon: {
    idle: "yta-neon border border-violet-500/50 text-violet-100 placeholder:text-violet-300/40 focus:border-violet-400 focus:outline-none",
    hover: "hover:border-violet-400/70",
    focus: "",
    error: "border-red-500/60 focus:border-red-400/70 focus:outline-none",
    success:
      "border-emerald-500/60 focus:border-emerald-400/70 focus:outline-none",
    warning: "border-amber-500/60 focus:border-amber-400/70 focus:outline-none",
    disabled: "border-violet-800/30 cursor-not-allowed opacity-50",
    readonly: "border-violet-700/30 cursor-default",
  },
  terminal: {
    idle: "yta-terminal border border-green-500/40 text-green-300 placeholder:text-green-500/40 focus:border-green-400 focus:outline-none",
    hover: "hover:border-green-400/60",
    focus: "",
    error: "border-red-500/50 focus:border-red-400/60 focus:outline-none",
    success: "border-green-400/50 focus:border-green-300/60 focus:outline-none",
    warning: "border-amber-500/50 focus:border-amber-400/60 focus:outline-none",
    disabled: "border-green-800/30 cursor-not-allowed opacity-50",
    readonly: "border-green-700/30 cursor-default",
  },
};

const textareaClasses = computed(() => {
  const tokens = dk.value ? darkTokens : lightTokens;
  const t = tokens[props.variant];
  const s = resolvedState.value;

  if (props.disabled)
    return [
      t.idle,
      t.disabled,
      sizeMap[props.size],
      resolvedRadius.value,
      resizeMap[props.resize ?? "vertical"],
      "w-full transition-colors duration-150",
    ];
  if (props.readonly)
    return [
      t.idle,
      t.readonly,
      sizeMap[props.size],
      resolvedRadius.value,
      resizeMap[props.resize ?? "vertical"],
      "w-full transition-colors duration-150",
    ];

  const stateClasses =
    s === "error"
      ? t.error
      : s === "success"
        ? t.success
        : s === "warning"
          ? t.warning
          : [t.idle, t.hover, t.focus].join(" ");

  return [
    stateClasses,
    sizeMap[props.size],
    resolvedRadius.value,
    resizeMap[props.resize ?? "vertical"],
    "w-full transition-colors duration-150",
  ];
});

const helpTextColor = computed(() => {
  const map: Record<YTextareaState, string> = {
    error: dk.value ? "text-red-400" : "text-red-600",
    success: dk.value ? "text-emerald-400" : "text-emerald-600",
    warning: dk.value ? "text-amber-400" : "text-amber-600",
    default: dk.value ? "text-slate-400" : "text-gray-400",
  };
  return map[resolvedState.value];
});

const counterClass = computed(() => {
  if (!props.maxLength) return "text-gray-400";
  const r = currentLength.value / props.maxLength;
  if (r >= 1) return "text-red-500 font-semibold";
  if (r >= 0.85) return "text-amber-500 font-medium";
  return dk.value ? "text-slate-400" : "text-gray-400";
});

const resolvedTextareaId = computed(
  () => (attrs.id as string | undefined) ?? textareaId,
);

const describedBy = computed(() =>
  helpText.value ? `${resolvedTextareaId.value}-help` : undefined,
);

function onInput(e: Event) {
  const el = e.target as HTMLTextAreaElement;
  emit("update:modelValue", el.value);
  if (props.autoResize) {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }
}

onMounted(() => {
  if (props.autoResize && textareaRef.value) {
    textareaRef.value.style.height = "auto";
    textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`;
  }
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
  <div
    :class="['flex flex-col', fullWidth ? 'w-full' : 'inline-flex']"
    :style="textColor ? { color: textColor } : undefined"
  >
    <!-- Label -->
    <label
      v-if="label"
      :for="resolvedTextareaId"
      :class="[
        'select-none',
        dk ? 'text-slate-400' : 'text-gray-500',
        labelSizeMap[size ?? 'md'],
      ]"
    >
      {{ label }}
    </label>

    <!-- Textarea -->
    <textarea
      ref="textareaRef"
      v-bind="attrs"
      :id="resolvedTextareaId"
      :name="(attrs.name as string | undefined) ?? 'textarea'"
      :value="modelValue"
      :placeholder="placeholder"
      :rows="rows"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxLength"
      :aria-invalid="resolvedState === 'error' ? 'true' : undefined"
      :aria-describedby="describedBy"
      :class="textareaClasses"
      @input="onInput"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)"
    />

    <!-- Footer -->
    <div
      v-if="helpText || (showCount && maxLength)"
      :class="[
        'flex items-start justify-between gap-3',
        hintSizeMap[size ?? 'md'],
      ]"
    >
      <p
        v-if="helpText"
        :id="`${resolvedTextareaId}-help`"
        :class="['flex items-center gap-1 leading-snug', helpTextColor]"
        :role="resolvedState === 'error' ? 'alert' : undefined"
      >
        {{ helpText }}
      </p>
      <span v-else class="flex-1" />
      <span
        v-if="showCount && maxLength"
        :class="[
          'tabular-nums shrink-0 transition-colors duration-200 text-[11px]',
          counterClass,
        ]"
      >
        {{ currentLength }}<span class="opacity-40">/</span>{{ maxLength }}
      </span>
    </div>
  </div>
  </Transition>
</template>

<style scoped>
.yta-glass {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.yta-aurora {
  background: linear-gradient(135deg, #0f0f2e, #0a1a2e);
  position: relative;
}
.yta-aurora::before {
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
  animation: yta-aurora-spin 4s linear infinite;
  pointer-events: none;
}
@keyframes yta-aurora-spin {
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

.yta-neon {
  background: #0d0d1a;
  box-shadow:
    0 0 8px rgba(167, 139, 250, 0.2),
    inset 0 0 8px rgba(167, 139, 250, 0.03);
  transition: box-shadow 0.2s;
}
.yta-neon:focus {
  box-shadow:
    0 0 16px rgba(167, 139, 250, 0.45),
    inset 0 0 12px rgba(167, 139, 250, 0.05);
}

.yta-terminal {
  background: #0a0a0a;
  font-family: "Courier New", Courier, monospace;
  box-shadow: 0 0 8px rgba(74, 222, 128, 0.08);
  transition: box-shadow 0.2s;
}
.yta-terminal:focus {
  box-shadow: 0 0 14px rgba(74, 222, 128, 0.2);
}
</style>
