import { inject, computed, type Ref } from "vue";

export const YWF_DARK_MODE_KEY = Symbol("ywf-dark-mode") as InjectionKey<
  Ref<boolean>
>;

import type { InjectionKey } from "vue";

/**
 * Resolves the dark mode value for a component.
 * Priority: component-level `dark` prop > global provide/inject > false.
 */
export function useDarkMode(propDark: boolean | undefined) {
  const globalDark = inject(YWF_DARK_MODE_KEY, undefined);
  return computed(() => {
    if (propDark !== undefined) return propDark === true;
    return globalDark?.value ?? false;
  });
}
