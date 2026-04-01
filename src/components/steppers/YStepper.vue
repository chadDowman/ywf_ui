<script setup lang="ts">
import { computed } from "vue";
import { useDarkMode } from "@/composables/useDarkMode";
import type { YStepperProps, YStepperVariant } from "@/types/stepper";
import { useAnimation } from '@/composables/useAnimation';
import { getAppearAnimationClasses } from '@/types/animation';

defineOptions({ name: "YStepper" });

const props = withDefaults(defineProps<YStepperProps>(), {
  modelValue: 0,
  variant: "simple",
  size: "md",
  orientation: "horizontal",
  clickable: false,
  disabled: false,
  animation: undefined,
});

const emit = defineEmits<{
  "update:modelValue": [step: number];
}>();

const dk = useDarkMode(props.dark);
const anim = useAnimation(() => props.animation);
const appearTx = computed(() => getAppearAnimationClasses(anim.value));

function go(i: number) {
  if (!props.clickable || props.disabled) return;
  emit("update:modelValue", i);
}

const current = computed(() => props.modelValue ?? 0);

function stepState(i: number): "completed" | "active" | "upcoming" {
  if (i < current.value) return "completed";
  if (i === current.value) return "active";
  return "upcoming";
}

/* ── Size ── */
const sizeMap = {
  sm: { circle: "w-7 h-7 text-xs", label: "text-xs", desc: "text-xs", connector: "h-0.5 sm:h-px" },
  md: { circle: "w-9 h-9 text-sm", label: "text-sm", desc: "text-xs", connector: "h-0.5" },
  lg: { circle: "w-11 h-11 text-base", label: "text-base", desc: "text-sm", connector: "h-0.5" },
};
const sc = computed(() => sizeMap[props.size ?? "md"]);

/* ── Variant tokens ── */
type StepTokens = {
  completed: { circle: string; label: string; connector: string };
  active: { circle: string; label: string; connector: string };
  upcoming: { circle: string; label: string; connector: string };
  base: string;
};

const lightTokens: Record<YStepperVariant, StepTokens> = {
  simple: {
    base: "rounded-full flex items-center justify-center font-semibold transition-all duration-200",
    completed: {
      circle: "bg-blue-600 text-white",
      label: "text-blue-600 font-medium",
      connector: "bg-blue-600",
    },
    active: {
      circle: "bg-blue-600 text-white ring-4 ring-blue-100",
      label: "text-gray-900 font-semibold",
      connector: "bg-gray-200",
    },
    upcoming: {
      circle: "bg-gray-100 text-gray-400",
      label: "text-gray-400",
      connector: "bg-gray-200",
    },
  },
  outlined: {
    base: "rounded-full flex items-center justify-center font-semibold border-2 transition-all duration-200",
    completed: {
      circle: "border-blue-600 bg-blue-600 text-white",
      label: "text-blue-600 font-medium",
      connector: "bg-blue-600",
    },
    active: {
      circle: "border-blue-600 bg-white text-blue-600 ring-4 ring-blue-50",
      label: "text-gray-900 font-semibold",
      connector: "bg-gray-200",
    },
    upcoming: {
      circle: "border-gray-200 bg-white text-gray-400",
      label: "text-gray-400",
      connector: "bg-gray-200",
    },
  },
  filled: {
    base: "rounded-full flex items-center justify-center font-semibold transition-all duration-200",
    completed: {
      circle: "bg-blue-600 text-white",
      label: "text-blue-700 font-medium",
      connector: "bg-blue-600",
    },
    active: {
      circle: "bg-blue-600 text-white shadow-lg shadow-blue-200",
      label: "text-gray-900 font-semibold",
      connector: "bg-gray-200",
    },
    upcoming: {
      circle: "bg-gray-100 text-gray-400",
      label: "text-gray-400",
      connector: "bg-gray-100",
    },
  },
  pills: {
    base: "rounded-2xl flex items-center justify-center font-semibold transition-all duration-200 px-3",
    completed: {
      circle: "bg-blue-600 text-white",
      label: "text-blue-600 font-medium",
      connector: "bg-blue-600",
    },
    active: {
      circle: "bg-blue-600 text-white ring-4 ring-blue-100",
      label: "text-gray-900 font-semibold",
      connector: "bg-gray-200",
    },
    upcoming: {
      circle: "bg-gray-100 text-gray-400",
      label: "text-gray-400",
      connector: "bg-gray-200",
    },
  },
  brutalist: {
    base: "flex items-center justify-center font-black border-4 border-black transition-all duration-100",
    completed: {
      circle: "bg-black text-yellow-300",
      label: "text-black font-black",
      connector: "bg-black",
    },
    active: {
      circle: "bg-yellow-300 text-black shadow-[4px_4px_0_0_#000]",
      label: "text-black font-black uppercase",
      connector: "bg-gray-300",
    },
    upcoming: {
      circle: "bg-white text-gray-400 border-gray-300",
      label: "text-gray-400 font-bold",
      connector: "bg-gray-200",
    },
  },
  minimal: {
    base: "rounded-full flex items-center justify-center font-medium transition-all duration-200",
    completed: {
      circle: "bg-gray-800 text-white",
      label: "text-gray-600",
      connector: "bg-gray-300",
    },
    active: {
      circle: "bg-gray-800 text-white",
      label: "text-gray-900 font-semibold",
      connector: "bg-gray-200",
    },
    upcoming: {
      circle: "bg-gray-100 text-gray-400",
      label: "text-gray-300",
      connector: "bg-gray-100",
    },
  },
};

const darkTokens: Record<YStepperVariant, StepTokens> = {
  simple: {
    base: "rounded-full flex items-center justify-center font-semibold transition-all duration-200",
    completed: {
      circle: "bg-indigo-500 text-white",
      label: "text-indigo-400 font-medium",
      connector: "bg-indigo-500",
    },
    active: {
      circle: "bg-indigo-500 text-white ring-4 ring-indigo-500/20",
      label: "text-slate-100 font-semibold",
      connector: "bg-slate-700",
    },
    upcoming: {
      circle: "bg-slate-800 text-slate-500",
      label: "text-slate-500",
      connector: "bg-slate-700",
    },
  },
  outlined: {
    base: "rounded-full flex items-center justify-center font-semibold border-2 transition-all duration-200",
    completed: {
      circle: "border-indigo-500 bg-indigo-500 text-white",
      label: "text-indigo-400 font-medium",
      connector: "bg-indigo-500",
    },
    active: {
      circle: "border-indigo-500 bg-slate-900 text-indigo-400 ring-4 ring-indigo-500/20",
      label: "text-slate-100 font-semibold",
      connector: "bg-slate-700",
    },
    upcoming: {
      circle: "border-slate-700 bg-slate-900 text-slate-500",
      label: "text-slate-500",
      connector: "bg-slate-700",
    },
  },
  filled: {
    base: "rounded-full flex items-center justify-center font-semibold transition-all duration-200",
    completed: { circle: "bg-indigo-500 text-white", label: "text-indigo-400 font-medium", connector: "bg-indigo-500" },
    active: { circle: "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20", label: "text-slate-100 font-semibold", connector: "bg-slate-700" },
    upcoming: { circle: "bg-slate-800 text-slate-500", label: "text-slate-500", connector: "bg-slate-800" },
  },
  pills: {
    base: "rounded-2xl flex items-center justify-center font-semibold transition-all duration-200 px-3",
    completed: { circle: "bg-indigo-500 text-white", label: "text-indigo-400 font-medium", connector: "bg-indigo-500" },
    active: { circle: "bg-indigo-500 text-white ring-4 ring-indigo-500/20", label: "text-slate-100 font-semibold", connector: "bg-slate-700" },
    upcoming: { circle: "bg-slate-800 text-slate-500", label: "text-slate-500", connector: "bg-slate-700" },
  },
  brutalist: {
    base: "flex items-center justify-center font-black border-4 border-black transition-all duration-100",
    completed: { circle: "bg-black text-yellow-300", label: "text-black font-black", connector: "bg-black" },
    active: { circle: "bg-yellow-300 text-black shadow-[4px_4px_0_0_#000]", label: "text-black font-black uppercase", connector: "bg-slate-600" },
    upcoming: { circle: "bg-slate-800 text-slate-500 border-slate-600", label: "text-slate-500 font-bold", connector: "bg-slate-700" },
  },
  minimal: {
    base: "rounded-full flex items-center justify-center font-medium transition-all duration-200",
    completed: { circle: "bg-slate-300 text-slate-900", label: "text-slate-400", connector: "bg-slate-700" },
    active: { circle: "bg-slate-100 text-slate-900", label: "text-slate-100 font-semibold", connector: "bg-slate-700" },
    upcoming: { circle: "bg-slate-800 text-slate-600", label: "text-slate-600", connector: "bg-slate-800" },
  },
};

const tok = computed(
  () => (dk.value ? darkTokens : lightTokens)[props.variant ?? "simple"],
);

function circleClass(i: number) {
  return [tok.value.base, sc.value.circle, tok.value[stepState(i)].circle];
}
function labelClass(i: number) {
  return [sc.value.label, tok.value[stepState(i)].label];
}
function connectorClass(i: number) {
  // color: completed if next step is completed or active
  return [sc.value.connector, i < current.value ? tok.value.completed.connector : tok.value.upcoming.connector];
}

const isHorizontal = computed(() => (props.orientation ?? "horizontal") === "horizontal");
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
  <nav aria-label="Steps">
    <!-- Horizontal -->
    <ol v-if="isHorizontal" class="flex items-start">
      <li
        v-for="(step, i) in steps"
        :key="i"
        class="flex-1 relative"
      >
        <!-- Left connector (all except first) -->
        <div
          v-if="i > 0"
          class="absolute left-0 right-1/2 top-0 flex items-center"
          :style="{ marginTop: props.size === 'sm' ? '14px' : props.size === 'lg' ? '22px' : '18px' }"
        >
          <div class="h-0.5 w-full transition-all duration-300" :class="connectorClass(i - 1)" />
        </div>
        <!-- Right connector (all except last) -->
        <div
          v-if="i < steps.length - 1"
          class="absolute left-1/2 right-0 flex items-center"
          :style="{ marginTop: props.size === 'sm' ? '14px' : props.size === 'lg' ? '22px' : '18px' }"
        >
          <div class="h-0.5 w-full transition-all duration-300" :class="connectorClass(i)" />
        </div>

        <!-- Step content -->
        <div class="relative flex flex-col items-center gap-2 px-1">
          <component
            :is="clickable && !disabled ? 'button' : 'span'"
            :type="clickable && !disabled ? 'button' : undefined"
            :disabled="disabled || undefined"
            :class="[circleClass(i), clickable && !disabled ? 'cursor-pointer' : 'cursor-default']"
            :aria-current="i === current ? 'step' : undefined"
            @click="go(i)"
          >
            <!-- Checkmark for completed -->
            <svg
              v-if="stepState(i) === 'completed'"
              class="w-4 h-4"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
            <span v-else>{{ i + 1 }}</span>
          </component>

          <div class="text-center min-w-0">
            <p :class="labelClass(i)" class="truncate leading-tight">{{ step.label }}</p>
            <p v-if="step.description" :class="[sc.desc, 'text-gray-400 mt-0.5 truncate']">
              {{ step.description }}
            </p>
          </div>
        </div>
      </li>
    </ol>

    <!-- Vertical -->
    <ol v-else class="flex flex-col">
      <li
        v-for="(step, i) in steps"
        :key="i"
        class="flex gap-4"
        :class="i < steps.length - 1 ? 'pb-6' : ''"
      >
        <!-- Circle + vertical connector -->
        <div class="flex flex-col items-center">
          <component
            :is="clickable && !disabled ? 'button' : 'span'"
            :type="clickable && !disabled ? 'button' : undefined"
            :disabled="disabled || undefined"
            :class="[circleClass(i), 'shrink-0', clickable && !disabled ? 'cursor-pointer' : 'cursor-default']"
            :aria-current="i === current ? 'step' : undefined"
            @click="go(i)"
          >
            <svg
              v-if="stepState(i) === 'completed'"
              class="w-4 h-4"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
            <span v-else>{{ i + 1 }}</span>
          </component>

          <!-- Vertical connector line -->
          <div
            v-if="i < steps.length - 1"
            class="flex-1 w-0.5 mt-2 transition-all duration-300"
            :class="connectorClass(i)"
          />
        </div>

        <!-- Label + description -->
        <div class="pt-1 pb-1 min-w-0">
          <p :class="labelClass(i)" class="leading-tight">{{ step.label }}</p>
          <p v-if="step.description" :class="[sc.desc, 'text-gray-400 mt-0.5']">
            {{ step.description }}
          </p>
        </div>
      </li>
    </ol>
  </nav>
  </Transition>
</template>
