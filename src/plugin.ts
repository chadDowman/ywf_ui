import type { App, Plugin } from "vue";

type ComponentModule = { default: { name?: string } };

const componentModules = import.meta.glob("./components/*/Y*.vue", {
  eager: true,
}) as Record<string, ComponentModule>;

export const YwfUIPlugin: Plugin = {
  install(app: App) {
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
