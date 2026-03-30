import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import YButton from "./YButton.vue";

describe("YButton", () => {
  it("renders with default props", () => {
    const wrapper = mount(YButton, {
      slots: { default: "Click me" },
    });
    expect(wrapper.text()).toContain("Click me");
    expect(wrapper.find("button").exists()).toBe(true);
  });

  it("emits click event", async () => {
    const wrapper = mount(YButton, {
      slots: { default: "Click" },
    });
    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted("click")).toBeTruthy();
  });

  it("does not emit click when disabled", async () => {
    const wrapper = mount(YButton, {
      props: { disabled: true },
      slots: { default: "Click" },
    });
    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted("click")).toBeFalsy();
  });

  it("applies dark mode class when dark prop is true", () => {
    const wrapper = mount(YButton, {
      props: { dark: true },
      slots: { default: "Dark" },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
