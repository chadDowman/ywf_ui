<script setup lang="ts">
import { computed, ref, useAttrs, useId } from "vue";
import { useDarkMode } from "@/composables/useDarkMode";
import type {
  YInputProps,
  YInputVariant,
  YInputSize,
  YInputRadius,
  YInputState,
  YInputSizeScale,
  YInputVariantTokens,
} from "@/types/input";
import { sanitizeSvg } from "@/utils/sanitize";

defineOptions({ name: "YInput", inheritAttrs: false });

const props = withDefaults(defineProps<YInputProps>(), {
  modelValue: "",
  placeholder: "",
  type: "text",
  variant: "outlined",
  size: "md",
  radius: "md",
  state: "default",
  fullWidth: false,
  label: undefined,
  hint: undefined,
  error: undefined,
  success: undefined,
  warning: undefined,
  prefix: undefined,
  suffix: undefined,
  leadingIcon: undefined,
  trailingIcon: undefined,
  disabled: false,
  readonly: false,
  loading: false,
  clearable: false,
  required: false,
  maxLength: undefined,
  showCount: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  clear: [];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
  enter: [event: KeyboardEvent];
}>();

const attrs = useAttrs();
const isFocused = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);
const showPassword = ref(false);
const inputId = useId();

const resolvedType = computed(() =>
  props.type === "password" && showPassword.value ? "text" : props.type,
);

const currentLength = computed(() => String(props.modelValue ?? "").length);

const resolvedState = computed<YInputState>(() => {
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

/* ───── Size scales ───── */
const scales: Record<YInputSize, YInputSizeScale> = {
  sm: {
    height: "h-8",
    text: "text-[13px] leading-none",
    px: "px-3",
    labelText: "text-[11px] font-semibold tracking-wide uppercase",
    labelGap: "mb-1.5",
    hintText: "text-[11px]",
    hintGap: "mt-1.5",
    affixText: "text-[12px]",
    affixPx: "px-2.5",
    icon: "w-3.5 h-3.5",
    iconLeft: "left-2.5",
    iconRight: "right-2.5",
    inputPl: "pl-3",
    inputPr: "pr-3",
    inputPlIcon: "pl-8",
    inputPrIcon: "pr-8",
    ring: "focus-within:ring-[3px]",
    closeBtn: "w-3.5 h-3.5",
  },
  md: {
    height: "h-10",
    text: "text-[14px] leading-none",
    px: "px-3.5",
    labelText: "text-[11.5px] font-semibold tracking-wide uppercase",
    labelGap: "mb-2",
    hintText: "text-[12px]",
    hintGap: "mt-2",
    affixText: "text-[13px]",
    affixPx: "px-3",
    icon: "w-4 h-4",
    iconLeft: "left-3",
    iconRight: "right-3",
    inputPl: "pl-3.5",
    inputPr: "pr-3.5",
    inputPlIcon: "pl-9",
    inputPrIcon: "pr-9",
    ring: "focus-within:ring-[3px]",
    closeBtn: "w-4 h-4",
  },
  lg: {
    height: "h-12",
    text: "text-[15px] leading-none",
    px: "px-4",
    labelText: "text-xs font-semibold tracking-wide uppercase",
    labelGap: "mb-2",
    hintText: "text-[12.5px]",
    hintGap: "mt-2",
    affixText: "text-[13.5px]",
    affixPx: "px-3.5",
    icon: "w-[18px] h-[18px]",
    iconLeft: "left-3.5",
    iconRight: "right-3.5",
    inputPl: "pl-4",
    inputPr: "pr-4",
    inputPlIcon: "pl-10",
    inputPrIcon: "pr-10",
    ring: "focus-within:ring-[3px]",
    closeBtn: "w-[18px] h-[18px]",
  },
};

const sc = computed(() => scales[props.size]);

/* ───── Dark mode ───── */
const dk = useDarkMode(props.dark);

/* ───── Radius ───── */
const radiusMap: Record<YInputRadius, string> = {
  none: "rounded-none",
  sm: "rounded",
  md: "rounded-lg",
  lg: "rounded-xl",
  full: "rounded-full",
};

const resolvedRadius = computed(() =>
  props.variant === "underline" ? "rounded-none" : radiusMap[props.radius],
);

/* ───── Variant token system ───── */
const lightVariantTokens: Record<YInputVariant, YInputVariantTokens> = {
  outlined: {
    idle: "bg-white border border-gray-200 shadow-sm text-gray-900 placeholder:text-gray-400",
    hover: "hover:border-gray-300 hover:shadow",
    focus: "focus-within:border-blue-500 focus-within:shadow-sm",
    ring: "focus-within:ring-blue-500/15",
    error: "border-red-400 shadow-sm",
    errorRing: "focus-within:border-red-500 focus-within:ring-red-500/15",
    success: "border-emerald-400 shadow-sm",
    successRing:
      "focus-within:border-emerald-500 focus-within:ring-emerald-500/15",
    warning: "border-amber-400 shadow-sm",
    warningRing: "focus-within:border-amber-500 focus-within:ring-amber-500/15",
    disabled:
      "bg-gray-50 border-gray-200 text-gray-400 shadow-none cursor-not-allowed",
    readonly: "bg-gray-50/60 border-gray-200 cursor-default",
    affix: "bg-gray-50 text-gray-500 border-gray-200",
    affixBorderL: "border-l",
    affixBorderR: "border-r",
  },
  filled: {
    idle: "bg-gray-100/80 border border-transparent text-gray-900 placeholder:text-gray-400",
    hover: "hover:bg-gray-100 hover:border-gray-200",
    focus:
      "focus-within:bg-white focus-within:border-blue-500 focus-within:shadow-sm",
    ring: "focus-within:ring-blue-500/15",
    error: "bg-red-50 border-red-300",
    errorRing:
      "focus-within:bg-white focus-within:border-red-500 focus-within:ring-red-500/15",
    success: "bg-emerald-50 border-emerald-300",
    successRing:
      "focus-within:bg-white focus-within:border-emerald-500 focus-within:ring-emerald-500/15",
    warning: "bg-amber-50 border-amber-300",
    warningRing:
      "focus-within:bg-white focus-within:border-amber-500 focus-within:ring-amber-500/15",
    disabled: "bg-gray-100 border-transparent text-gray-400 cursor-not-allowed",
    readonly: "bg-gray-100/60 border-transparent cursor-default",
    affix: "bg-gray-200/60 text-gray-500 border-gray-200",
    affixBorderL: "border-l",
    affixBorderR: "border-r",
  },
  ghost: {
    idle: "bg-transparent border border-transparent text-gray-900 placeholder:text-gray-400",
    hover: "hover:bg-gray-50 hover:border-gray-200",
    focus:
      "focus-within:bg-white focus-within:border-gray-300 focus-within:shadow-sm",
    ring: "focus-within:ring-gray-400/10",
    error: "bg-red-50/40 border-red-300",
    errorRing:
      "focus-within:bg-white focus-within:border-red-400 focus-within:ring-red-500/10",
    success: "bg-emerald-50/40 border-emerald-300",
    successRing:
      "focus-within:bg-white focus-within:border-emerald-400 focus-within:ring-emerald-500/10",
    warning: "bg-amber-50/40 border-amber-300",
    warningRing:
      "focus-within:bg-white focus-within:border-amber-400 focus-within:ring-amber-500/10",
    disabled:
      "bg-transparent border-transparent text-gray-400 cursor-not-allowed",
    readonly: "bg-transparent border-transparent cursor-default",
    affix: "bg-transparent text-gray-400 border-gray-200",
    affixBorderL: "border-l",
    affixBorderR: "border-r",
  },
  underline: {
    idle: "bg-transparent border-0 border-b-2 border-gray-200 text-gray-900 placeholder:text-gray-400",
    hover: "hover:border-gray-300",
    focus: "focus-within:border-blue-500",
    ring: "",
    error: "border-red-400",
    errorRing: "focus-within:border-red-500",
    success: "border-emerald-400",
    successRing: "focus-within:border-emerald-500",
    warning: "border-amber-400",
    warningRing: "focus-within:border-amber-500",
    disabled: "border-gray-100 text-gray-400 cursor-not-allowed",
    readonly: "border-gray-200 cursor-default",
    affix: "bg-transparent text-gray-400 border-gray-200",
    affixBorderL: "border-l",
    affixBorderR: "border-r",
  },
};

const darkVariantTokens: Record<YInputVariant, YInputVariantTokens> = {
  outlined: {
    idle: "bg-slate-800 border border-slate-600 shadow-sm text-slate-100 placeholder:text-slate-400",
    hover: "hover:border-slate-500 hover:shadow",
    focus: "focus-within:border-blue-400 focus-within:shadow-sm",
    ring: "focus-within:ring-blue-400/20",
    error: "border-red-500 shadow-sm",
    errorRing: "focus-within:border-red-400 focus-within:ring-red-400/20",
    success: "border-emerald-500 shadow-sm",
    successRing:
      "focus-within:border-emerald-400 focus-within:ring-emerald-400/20",
    warning: "border-amber-500 shadow-sm",
    warningRing: "focus-within:border-amber-400 focus-within:ring-amber-400/20",
    disabled:
      "bg-slate-900 border-slate-700 text-slate-500 shadow-none cursor-not-allowed",
    readonly: "bg-slate-800/60 border-slate-700 cursor-default",
    affix: "bg-slate-700 text-slate-400 border-slate-600",
    affixBorderL: "border-l",
    affixBorderR: "border-r",
  },
  filled: {
    idle: "bg-slate-700/80 border border-transparent text-slate-100 placeholder:text-slate-400",
    hover: "hover:bg-slate-700 hover:border-slate-600",
    focus:
      "focus-within:bg-slate-800 focus-within:border-blue-400 focus-within:shadow-sm",
    ring: "focus-within:ring-blue-400/20",
    error: "bg-red-900/30 border-red-500",
    errorRing:
      "focus-within:bg-slate-800 focus-within:border-red-400 focus-within:ring-red-400/20",
    success: "bg-emerald-900/30 border-emerald-500",
    successRing:
      "focus-within:bg-slate-800 focus-within:border-emerald-400 focus-within:ring-emerald-400/20",
    warning: "bg-amber-900/30 border-amber-500",
    warningRing:
      "focus-within:bg-slate-800 focus-within:border-amber-400 focus-within:ring-amber-400/20",
    disabled:
      "bg-slate-800 border-transparent text-slate-500 cursor-not-allowed",
    readonly: "bg-slate-800/60 border-transparent cursor-default",
    affix: "bg-slate-600/60 text-slate-400 border-slate-600",
    affixBorderL: "border-l",
    affixBorderR: "border-r",
  },
  ghost: {
    idle: "bg-transparent border border-transparent text-slate-100 placeholder:text-slate-400",
    hover: "hover:bg-slate-800 hover:border-slate-700",
    focus:
      "focus-within:bg-slate-800 focus-within:border-slate-600 focus-within:shadow-sm",
    ring: "focus-within:ring-slate-500/15",
    error: "bg-red-900/20 border-red-500",
    errorRing:
      "focus-within:bg-slate-800 focus-within:border-red-400 focus-within:ring-red-400/15",
    success: "bg-emerald-900/20 border-emerald-500",
    successRing:
      "focus-within:bg-slate-800 focus-within:border-emerald-400 focus-within:ring-emerald-400/15",
    warning: "bg-amber-900/20 border-amber-500",
    warningRing:
      "focus-within:bg-slate-800 focus-within:border-amber-400 focus-within:ring-amber-400/15",
    disabled:
      "bg-transparent border-transparent text-slate-500 cursor-not-allowed",
    readonly: "bg-transparent border-transparent cursor-default",
    affix: "bg-transparent text-slate-500 border-slate-600",
    affixBorderL: "border-l",
    affixBorderR: "border-r",
  },
  underline: {
    idle: "bg-transparent border-0 border-b-2 border-slate-600 text-slate-100 placeholder:text-slate-400",
    hover: "hover:border-slate-500",
    focus: "focus-within:border-blue-400",
    ring: "",
    error: "border-red-500",
    errorRing: "focus-within:border-red-400",
    success: "border-emerald-500",
    successRing: "focus-within:border-emerald-400",
    warning: "border-amber-500",
    warningRing: "focus-within:border-amber-400",
    disabled: "border-slate-700 text-slate-500 cursor-not-allowed",
    readonly: "border-slate-700 cursor-default",
    affix: "bg-transparent text-slate-500 border-slate-600",
    affixBorderL: "border-l",
    affixBorderR: "border-r",
  },
};

const variantTokens = computed(() =>
  dk.value ? darkVariantTokens : lightVariantTokens,
);

const wrapperClasses = computed(() => {
  const t = variantTokens.value[props.variant];
  const s = resolvedState.value;
  const isUnderline = props.variant === "underline";

  if (props.disabled) {
    return [
      "relative flex items-center w-full transition-all duration-200 ease-out",
      t.idle,
      t.disabled,
      resolvedRadius.value,
      "opacity-60 select-none",
    ];
  }

  if (props.readonly) {
    return [
      "relative flex items-center w-full transition-all duration-200 ease-out",
      t.idle,
      t.readonly,
      resolvedRadius.value,
    ];
  }

  const stateIdle =
    s === "error"
      ? t.error
      : s === "success"
        ? t.success
        : s === "warning"
          ? t.warning
          : null;

  const stateRing =
    s === "error"
      ? t.errorRing
      : s === "success"
        ? t.successRing
        : s === "warning"
          ? t.warningRing
          : null;

  return [
    "relative flex items-center w-full transition-all duration-200 ease-out",
    stateIdle ?? t.idle,
    stateIdle ? "" : t.hover,
    stateRing ?? t.focus,
    !isUnderline && (stateRing ?? t.ring)
      ? `${sc.value.ring} ${stateRing ?? t.ring}`
      : "",
    resolvedRadius.value,
  ];
});

/* ───── Input element classes ───── */
const inputClasses = computed(() => {
  const hasLeadingIcon = !!props.leadingIcon && !props.prefix;
  const hasTrailingContent =
    showTrailingArea.value || (!!props.trailingIcon && !props.suffix);

  const plClass = props.prefix
    ? "pl-0"
    : hasLeadingIcon
      ? sc.value.inputPlIcon
      : sc.value.inputPl;

  const prClass = props.suffix
    ? "pr-0"
    : hasTrailingContent
      ? sc.value.inputPrIcon
      : sc.value.inputPr;

  return [
    "w-full min-w-0 bg-transparent outline-none border-none ring-0",
    "font-[450] antialiased tabular-nums-off",
    "transition-colors duration-150",
    sc.value.height,
    sc.value.text,
    plClass,
    prClass,
    props.disabled
      ? dk.value
        ? "cursor-not-allowed text-slate-500 placeholder:text-slate-600"
        : "cursor-not-allowed text-gray-400 placeholder:text-gray-300"
      : "",
    props.readonly ? "cursor-default" : "",
    "placeholder:font-normal",
  ];
});

/* ───── Affix classes ───── */
const affixBaseClasses = computed(() =>
  [
    "shrink-0 flex items-center self-stretch",
    "font-medium select-none",
    sc.value.affixText,
    sc.value.affixPx,
    variantTokens.value[props.variant].affix,
  ].join(" "),
);

/* ───── Leading / trailing icon classes ───── */
const leadingIconClass = computed(() => [
  "absolute top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center",
  dk.value ? "text-slate-400" : "text-gray-400",
  "transition-colors duration-150",
  sc.value.iconLeft,
  sc.value.icon,
]);

/* ───── State colors ───── */
const stateIconColor = computed(() => {
  const map: Record<YInputState, string> = {
    error: "text-red-400",
    success: "text-emerald-400",
    warning: "text-amber-400",
    default: dk.value ? "text-slate-400" : "text-gray-400",
  };
  return map[resolvedState.value];
});

const helpTextColor = computed(() => {
  const map: Record<YInputState, string> = {
    error: dk.value ? "text-red-400" : "text-red-600",
    success: dk.value ? "text-emerald-400" : "text-emerald-600",
    warning: dk.value ? "text-amber-400" : "text-amber-600",
    default: dk.value ? "text-slate-400" : "text-gray-400",
  };
  return map[resolvedState.value];
});

/* ───── Help icon visibility ───── */
const showHelpIcon = computed(
  () =>
    resolvedState.value === "error" ||
    resolvedState.value === "success" ||
    resolvedState.value === "warning",
);

/* ───── Trailing area visibility ───── */
const showTrailingArea = computed(
  () =>
    props.loading ||
    (props.clearable &&
      currentLength.value > 0 &&
      !props.disabled &&
      !props.readonly) ||
    props.type === "password",
);

/* ───── Counter ───── */
const counterClass = computed(() => {
  if (!props.maxLength) return "text-gray-400";
  const r = currentLength.value / props.maxLength;
  if (r >= 1) return "text-red-500 font-semibold";
  if (r >= 0.85) return "text-amber-500 font-medium";
  return "text-gray-400";
});

/* ───── Handlers ───── */
function onInput(e: Event) {
  emit("update:modelValue", (e.target as HTMLInputElement).value);
}
function onFocus(e: FocusEvent) {
  isFocused.value = true;
  emit("focus", e);
}
function onBlur(e: FocusEvent) {
  isFocused.value = false;
  emit("blur", e);
}
function onKeydown(e: KeyboardEvent) {
  if (e.key === "Enter") emit("enter", e);
}
function onClear() {
  emit("update:modelValue", "");
  emit("clear");
  inputRef.value?.focus();
}
</script>

<template>
  <div :class="['flex flex-col', fullWidth ? 'w-full' : 'inline-flex']">
    <!-- Label -->
    <label
      v-if="label"
      :for="inputId"
      :class="[
        'text-gray-500 select-none letter-spacing-wide',
        sc.labelText,
        sc.labelGap,
      ]"
    >
      {{ label }}
      <span
        v-if="required"
        class="text-red-500 ml-0.5 font-normal not-uppercase"
        aria-hidden="true"
        >*</span
      >
    </label>

    <!-- Input shell -->
    <div :class="wrapperClasses">
      <!-- Prefix -->
      <span
        v-if="prefix"
        :class="[
          affixBaseClasses,
          variantTokens[variant].affixBorderR,
          variant === 'underline' ? 'border-r-0 pl-0' : '',
        ]"
        aria-hidden="true"
        >{{ prefix }}</span
      >

      <!-- Leading icon -->
      <span
        v-if="leadingIcon && !prefix"
        :class="leadingIconClass"
        aria-hidden="true"
        v-html="sanitizeSvg(leadingIcon)"
      />

      <!-- Native input -->
      <input
        ref="inputRef"
        v-bind="attrs"
        :id="inputId"
        :value="modelValue"
        :type="resolvedType"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxLength"
        :required="required"
        :aria-invalid="resolvedState === 'error' ? 'true' : undefined"
        :aria-describedby="
          helpText ? `${(attrs.id as string) ?? 'yi'}-help` : undefined
        "
        :class="inputClasses"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="onKeydown"
      />

      <!-- Trailing interactive area -->
      <span
        v-if="showTrailingArea || (trailingIcon && !suffix)"
        :class="[
          'absolute top-1/2 -translate-y-1/2 flex items-center gap-1',
          sc.iconRight,
        ]"
      >
        <!-- Spinner -->
        <span
          v-if="loading"
          :class="['flex items-center justify-center text-gray-400', sc.icon]"
          role="status"
          aria-label="Loading"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            class="animate-spin w-full h-full"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-dasharray="42 85"
              class="opacity-30"
            />
            <path
              fill="currentColor"
              d="M12 3a9 9 0 019 9h-2.5A6.5 6.5 0 0012 5.5V3z"
            />
          </svg>
        </span>

        <!-- Clear button -->
        <button
          v-else-if="clearable && currentLength > 0 && !disabled && !readonly"
          type="button"
          :class="[
            'flex items-center justify-center rounded-full',
            'text-gray-300 hover:text-gray-500',
            'transition-all duration-150 ease-out',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1',
            sc.closeBtn,
          ]"
          aria-label="Clear"
          @click="onClear"
        >
          <svg viewBox="0 0 14 14" fill="currentColor" class="w-full h-full">
            <path
              d="M4.47 3.47a.75.75 0 00-1.06 1.06L5.94 7 3.41 9.53a.75.75 0 001.06 1.06L7 8.06l2.53 2.53a.75.75 0 001.06-1.06L8.06 7l2.53-2.53a.75.75 0 00-1.06-1.06L7 5.94 4.47 3.47z"
            />
          </svg>
        </button>

        <!-- Password toggle -->
        <button
          v-else-if="type === 'password' && !disabled && !loading"
          type="button"
          :class="[
            'flex items-center justify-center',
            'text-gray-350 hover:text-gray-500',
            'transition-colors duration-150',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 rounded',
            sc.icon,
          ]"
          :aria-label="showPassword ? 'Hide password' : 'Show password'"
          @click="showPassword = !showPassword"
        >
          <svg
            v-if="showPassword"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="w-full h-full"
          >
            <path
              fill-rule="evenodd"
              d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.091 1.092a4 4 0 00-5.557-5.557z"
              clip-rule="evenodd"
            />
            <path
              d="M10.748 13.93l2.523 2.523a9.987 9.987 0 01-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 010-1.186A10.007 10.007 0 012.839 6.02L6.07 9.252a4 4 0 004.678 4.678z"
            />
          </svg>
          <svg
            v-else
            viewBox="0 0 20 20"
            fill="currentColor"
            class="w-full h-full"
          >
            <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
            <path
              fill-rule="evenodd"
              d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>

        <!-- Static trailing icon -->
        <span
          v-else-if="trailingIcon && !suffix"
          :class="[
            'flex items-center justify-center pointer-events-none',
            stateIconColor,
            sc.icon,
          ]"
          aria-hidden="true"
          v-html="sanitizeSvg(trailingIcon)"
        />
      </span>

      <!-- Suffix -->
      <span
        v-if="suffix"
        :class="[
          affixBaseClasses,
          variantTokens[variant].affixBorderL,
          variant === 'underline' ? 'border-l-0 pr-0' : '',
        ]"
        aria-hidden="true"
        >{{ suffix }}</span
      >
    </div>

    <!-- Footer row -->
    <div
      v-if="helpText || (showCount && maxLength)"
      :class="['flex items-start justify-between gap-3', sc.hintGap]"
    >
      <p
        v-if="helpText"
        :id="`${(attrs.id as string) ?? 'yi'}-help`"
        :class="[
          'flex items-center gap-1 leading-snug',
          sc.hintText,
          helpTextColor,
        ]"
        :role="resolvedState === 'error' ? 'alert' : undefined"
        :aria-live="resolvedState === 'error' ? 'polite' : undefined"
      >
        <svg
          v-if="resolvedState === 'error'"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="w-3.5 h-3.5 shrink-0 mt-px"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M8 15A7 7 0 108 1a7 7 0 000 14zm-.75-9.25a.75.75 0 011.5 0v3.5a.75.75 0 01-1.5 0v-3.5zM8 12a1 1 0 110-2 1 1 0 010 2z"
            clip-rule="evenodd"
          />
        </svg>
        <svg
          v-else-if="resolvedState === 'success'"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="w-3.5 h-3.5 shrink-0 mt-px"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M8 15A7 7 0 108 1a7 7 0 000 14zm3.78-8.22a.75.75 0 00-1.06-1.06L7 9.44 5.28 7.72a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l4.25-4.25z"
            clip-rule="evenodd"
          />
        </svg>
        <svg
          v-else-if="resolvedState === 'warning'"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="w-3.5 h-3.5 shrink-0 mt-px"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M6.701 2.25c.577-1 2.02-1 2.598 0l5.196 9a1.5 1.5 0 01-1.299 2.25H2.804A1.5 1.5 0 011.505 11.25l5.196-9zM8 5a.75.75 0 01.75.75v2.5a.75.75 0 01-1.5 0v-2.5A.75.75 0 018 5zm0 7a1 1 0 110-2 1 1 0 010 2z"
            clip-rule="evenodd"
          />
        </svg>
        {{ helpText }}
      </p>

      <span v-else class="flex-1" />

      <span
        v-if="showCount && maxLength"
        :class="[
          'tabular-nums shrink-0 transition-colors duration-200',
          sc.hintText,
          counterClass,
        ]"
        aria-live="polite"
        :aria-label="`${currentLength} of ${maxLength} characters used`"
      >
        {{ currentLength }}<span class="opacity-40">/</span>{{ maxLength }}
      </span>
    </div>
  </div>
</template>
