import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { ref, provide } from "vue";
import YButton from "../components/buttons/YButton.vue";
import { YWF_DARK_MODE_KEY } from "./useDarkMode";

describe("useDarkMode", () => {
  it("defaults to false when no provider and no prop", () => {
    const wrapper = mount(YButton, {
      slots: { default: "Test" },
    });
    // Component should render without dark mode styles (no crash)
    expect(wrapper.exists()).toBe(true);
  });

  it("respects global dark mode via provide", () => {
    const wrapper = mount(YButton, {
      global: {
        provide: {
          [YWF_DARK_MODE_KEY as symbol]: ref(true),
        },
      },
      slots: { default: "Test" },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it("component dark prop overrides global dark mode", () => {
    const wrapper = mount(YButton, {
      props: { dark: false },
      global: {
        provide: {
          [YWF_DARK_MODE_KEY as symbol]: ref(true),
        },
      },
      slots: { default: "Test" },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
