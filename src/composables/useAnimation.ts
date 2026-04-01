import { inject, computed, type ComputedRef } from "vue";
import { YWF_ANIMATION_KEY } from "@/types/animation";
import type { YAnimationPreset } from "@/types/animation";

/**
 * Resolves the animation preset for a component.
 * Priority: component-level `animation` prop > global provide/inject > fallback.
 *
 * @param getProp - getter for the component's `animation` prop
 * @param fallback - used when neither prop nor global is set (default: 'auto')
 */
export function useAnimation(
  getProp: () => YAnimationPreset | undefined,
  fallback: YAnimationPreset = "auto",
): ComputedRef<YAnimationPreset> {
  const global = inject(YWF_ANIMATION_KEY, null);
  return computed(() => {
    const prop = getProp();
    if (prop !== undefined) return prop;
    return global?.value ?? fallback;
  });
}
