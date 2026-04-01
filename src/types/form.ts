import type { InjectionKey, Ref } from "vue";

export type YFormRule = (value: unknown) => string | true;

export interface YFormField {
  name: string;
  getValue: () => unknown;
  rules: YFormRule[];
  setError: (error: string | undefined) => void;
}

export interface YFormContext {
  disabled: Ref<boolean>;
  loading: Ref<boolean>;
  register: (field: YFormField) => void;
  unregister: (name: string) => void;
}

export const Y_FORM_KEY: InjectionKey<YFormContext> = Symbol("YForm");

export interface YFormValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export interface YFormProps {
  disabled?: boolean;
  loading?: boolean;
  novalidate?: boolean;
  animation?: import("./animation").YAnimationPreset;
}

export interface YFormExposed {
  validate: () => YFormValidationResult;
  reset: () => void;
}
