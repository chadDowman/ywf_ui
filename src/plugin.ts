import type { App, Plugin } from "vue";
import { ref } from "vue";
import { YWF_DARK_MODE_KEY } from "./composables/useDarkMode";
import { YWF_ANIMATION_KEY } from "./types/animation";
import type { YAnimationPreset } from "./types/animation";

type ComponentModule = { default: { name?: string } };

export interface YwfUIPluginOptions {
  dark?: boolean;
  /** Global default animation for all components. Per-component `animation` prop overrides this. */
  animation?: YAnimationPreset;
}

const componentModules = import.meta.glob("./components/*/Y*.vue", {
  eager: true,
}) as Record<string, ComponentModule>;

export const YwfUIPlugin: Plugin<[YwfUIPluginOptions?]> = {
  install(app: App, options?: YwfUIPluginOptions) {
    const darkMode = ref(options?.dark ?? false);
    app.provide(YWF_DARK_MODE_KEY, darkMode);

    const animation = ref<YAnimationPreset>(options?.animation ?? "auto");
    app.provide(YWF_ANIMATION_KEY, animation);

    for (const [path, module] of Object.entries(componentModules)) {
      const component = module.default;
      if (!component) continue;
      const fallbackName = path.split("/").pop()?.replace(".vue", "") ?? "";
      const name = component.name ?? fallbackName;
      if (name) {
        app.component(name, component);
      }
    }
  },
};
