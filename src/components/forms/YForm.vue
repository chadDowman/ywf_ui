<script setup lang="ts">
import { computed, provide, ref } from "vue";
import { useAnimation } from "@/composables/useAnimation";
import { getAppearAnimationClasses } from "@/types/animation";
import { Y_FORM_KEY } from "@/types/form";
import type {
  YFormProps,
  YFormField,
  YFormContext,
  YFormValidationResult,
} from "@/types/form";

defineOptions({ name: "YForm" });

const props = withDefaults(defineProps<YFormProps>(), {
  disabled: false,
  loading: false,
  novalidate: true,
  animation: undefined,
});

const emit = defineEmits<{
  submit: [result: YFormValidationResult];
}>();

const anim = useAnimation(() => props.animation);
const appearTx = computed(() => getAppearAnimationClasses(anim.value));

/* ── Field registry ── */
const fields = ref<Map<string, YFormField>>(new Map());

function register(field: YFormField) {
  fields.value.set(field.name, field);
}

function unregister(name: string) {
  fields.value.delete(name);
}

/* ── Validation ── */
function validate(): YFormValidationResult {
  const errors: Record<string, string> = {};

  for (const [name, field] of fields.value.entries()) {
    const value = field.getValue();
    for (const rule of field.rules) {
      const result = rule(value);
      if (result !== true) {
        errors[name] = result;
        field.setError(result);
        break;
      }
    }
    if (!errors[name]) {
      field.setError(undefined);
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

/* ── Reset ── */
function reset() {
  for (const field of fields.value.values()) {
    field.setError(undefined);
  }
}

defineExpose({ validate, reset });

/* ── Provide context ── */
const disabledRef = computed(() => props.disabled);
const loadingRef = computed(() => props.loading);

const context: YFormContext = {
  disabled: disabledRef,
  loading: loadingRef,
  register,
  unregister,
};

provide(Y_FORM_KEY, context);

/* ── Submit handler ── */
function onSubmit(e: Event) {
  e.preventDefault();
  const result = validate();
  emit("submit", result);
}
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
  <form
    :novalidate="novalidate"
    class="relative"
    @submit="onSubmit"
  >
    <slot />

    <!-- Loading overlay -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="loading"
        class="absolute inset-0 z-10 flex items-center justify-center bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-inherit"
        aria-label="Loading"
        role="status"
      >
        <span
          class="w-6 h-6 rounded-full border-[3px] border-gray-200 border-t-blue-500 animate-spin block"
        />
      </div>
    </Transition>
  </form>
  </Transition>
</template>
