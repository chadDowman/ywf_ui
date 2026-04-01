import type { PlaygroundQuickConfig } from "./types";

export const playgroundQuickConfig: PlaygroundQuickConfig = {
  componentId: "YForm",
  propKey: "disabled",
  options: ["false", "true"],
  init(next) {
    if (next.disabled === undefined) next.disabled = false;
    if (next.loading === undefined) next.loading = false;
    if (next.novalidate === undefined) next.novalidate = true;
  },
  applyOption(next, option) {
    next.disabled = option === "true";
  },
};
