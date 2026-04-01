import { inject } from "vue";
import { Y_FORM_KEY } from "@/types/form";
import type { YFormContext } from "@/types/form";

/**
 * Used by form field components (YInput, YTextarea, etc.) to opt into
 * a parent YForm's disabled/loading state and validation.
 */
export function useFormContext(): YFormContext | null {
  return inject(Y_FORM_KEY, null);
}
