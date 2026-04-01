import type { InjectionKey, Ref } from "vue";

export type YAnimationPreset =
  | "auto"
  | "none"
  | "fade"
  | "scale"
  | "slide"
  | "zoom"
  | "bounce";

export const YWF_ANIMATION_KEY: InjectionKey<Ref<YAnimationPreset>> =
  Symbol("ywf-animation");

export interface AnimationClasses {
  enterActive: string;
  enterFrom: string;
  enterTo: string;
  leaveActive: string;
  leaveFrom: string;
  leaveTo: string;
}

const NONE: AnimationClasses = {
  enterActive: "",
  enterFrom: "",
  enterTo: "",
  leaveActive: "",
  leaveFrom: "",
  leaveTo: "",
};

type SlideDirection = "up" | "down" | "left" | "right";

/**
 * Returns Transition class objects for overlay-type components
 * (Modal, Drawer). Pass `direction` to make `slide` direction-aware.
 */
export function getOverlayAnimationClasses(
  preset: YAnimationPreset,
  direction?: SlideDirection,
): AnimationClasses {
  switch (preset) {
    case "none":
      return NONE;

    case "fade":
      return {
        enterActive: "transition duration-200 ease-out",
        enterFrom: "opacity-0",
        enterTo: "opacity-100",
        leaveActive: "transition duration-150 ease-in",
        leaveFrom: "opacity-100",
        leaveTo: "opacity-0",
      };

    case "scale":
      return {
        enterActive: "transition duration-250 ease-out",
        enterFrom: "opacity-0 scale-95",
        enterTo: "opacity-100 scale-100",
        leaveActive: "transition duration-180 ease-in",
        leaveFrom: "opacity-100 scale-100",
        leaveTo: "opacity-0 scale-95",
      };

    case "zoom":
      return {
        enterActive: "transition duration-200 ease-out",
        enterFrom: "opacity-0 scale-50",
        enterTo: "opacity-100 scale-100",
        leaveActive: "transition duration-150 ease-in",
        leaveFrom: "opacity-100 scale-100",
        leaveTo: "opacity-0 scale-50",
      };

    case "bounce":
      return {
        enterActive: "transition duration-500 ywf-ease-spring",
        enterFrom: "opacity-0 scale-90",
        enterTo: "opacity-100 scale-100",
        leaveActive: "transition duration-200 ease-in",
        leaveFrom: "opacity-100 scale-100",
        leaveTo: "opacity-0 scale-90",
      };

    case "slide": {
      const map: Record<SlideDirection, [string, string]> = {
        right: ["translate-x-full", "translate-x-0"],
        left: ["-translate-x-full", "translate-x-0"],
        down: ["translate-y-full", "translate-y-0"],
        up: ["-translate-y-full", "translate-y-0"],
      };
      const [from, to] = map[direction ?? "right"];
      return {
        enterActive: "transition duration-300 ease-out",
        enterFrom: `opacity-0 ${from}`,
        enterTo: `opacity-100 ${to}`,
        leaveActive: "transition duration-200 ease-in",
        leaveFrom: `opacity-100 ${to}`,
        leaveTo: `opacity-0 ${from}`,
      };
    }

    default:
      return getOverlayAnimationClasses("scale");
  }
}

/**
 * Returns Transition class objects for components that appear on mount
 * (appear-only transitions for static components like Button, Card, etc.).
 * `auto` resolves to `none` — appear animations are opt-in only.
 */
export function getAppearAnimationClasses(
  preset: YAnimationPreset,
): AnimationClasses {
  // auto = no appear animation; user must opt-in explicitly
  if (preset === "auto" || preset === "none") return NONE;
  switch (preset) {
    case "fade":
      return {
        enterActive: "transition duration-300 ease-out",
        enterFrom: "opacity-0",
        enterTo: "opacity-100",
        leaveActive: "transition duration-200 ease-in",
        leaveFrom: "opacity-100",
        leaveTo: "opacity-0",
      };
    case "scale":
      return {
        enterActive: "transition duration-300 ease-out",
        enterFrom: "opacity-0 scale-95",
        enterTo: "opacity-100 scale-100",
        leaveActive: "transition duration-200 ease-in",
        leaveFrom: "opacity-100 scale-100",
        leaveTo: "opacity-0 scale-95",
      };
    case "zoom":
      return {
        enterActive: "transition duration-250 ease-out",
        enterFrom: "opacity-0 scale-50",
        enterTo: "opacity-100 scale-100",
        leaveActive: "transition duration-200 ease-in",
        leaveFrom: "opacity-100 scale-100",
        leaveTo: "opacity-0 scale-50",
      };
    case "bounce":
      return {
        enterActive: "transition duration-500 ywf-ease-spring",
        enterFrom: "opacity-0 scale-90",
        enterTo: "opacity-100 scale-100",
        leaveActive: "transition duration-200 ease-in",
        leaveFrom: "opacity-100 scale-100",
        leaveTo: "opacity-0 scale-90",
      };
    case "slide":
      return {
        enterActive: "transition duration-300 ease-out",
        enterFrom: "opacity-0 translate-y-2",
        enterTo: "opacity-100 translate-y-0",
        leaveActive: "transition duration-200 ease-in",
        leaveFrom: "opacity-100 translate-y-0",
        leaveTo: "opacity-0 translate-y-2",
      };
    default:
      return NONE;
  }
}

/**
 * Returns Transition class objects for smaller popup elements
 * (Dropdown, Tooltip).
 */
export function getPopupAnimationClasses(
  preset: YAnimationPreset,
): AnimationClasses {
  switch (preset) {
    case "none":
      return NONE;
    case "fade":
      return {
        enterActive: "transition duration-150 ease-out",
        enterFrom: "opacity-0",
        enterTo: "opacity-100",
        leaveActive: "transition duration-100 ease-in",
        leaveFrom: "opacity-100",
        leaveTo: "opacity-0",
      };
    default:
      return {
        enterActive: "transition duration-150 ease-out",
        enterFrom: "opacity-0 translate-y-1 scale-95",
        enterTo: "opacity-100 translate-y-0 scale-100",
        leaveActive: "transition duration-100 ease-in",
        leaveFrom: "opacity-100 translate-y-0 scale-100",
        leaveTo: "opacity-0 translate-y-1 scale-95",
      };
  }
}
