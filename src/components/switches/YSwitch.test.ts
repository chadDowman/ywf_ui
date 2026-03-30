import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import YSwitch from "./YSwitch.vue";

describe("YSwitch", () => {
  it("renders with default variant", () => {
    const wrapper = mount(YSwitch, {
      props: { modelValue: false },
    });
    expect(wrapper.find("[role='switch']").exists()).toBe(true);
  });

  it("toggles value on click", async () => {
    const wrapper = mount(YSwitch, {
      props: { modelValue: false },
    });
    await wrapper.find("[role='switch']").trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([true]);
  });

  it("does not toggle when disabled", async () => {
    const wrapper = mount(YSwitch, {
      props: { modelValue: false, disabled: true },
    });
    await wrapper.find("[role='switch']").trigger("click");
    expect(wrapper.emitted("update:modelValue")).toBeFalsy();
  });

  it("renders ios variant", () => {
    const wrapper = mount(YSwitch, {
      props: { modelValue: false, variant: "ios" },
    });
    expect(wrapper.find("[role='switch']").exists()).toBe(true);
  });

  it("renders slim variant", () => {
    const wrapper = mount(YSwitch, {
      props: { modelValue: false, variant: "slim" },
    });
    expect(wrapper.find("[role='switch']").exists()).toBe(true);
  });

  it("renders pill variant", () => {
    const wrapper = mount(YSwitch, {
      props: { modelValue: false, variant: "pill" },
    });
    expect(wrapper.find("[role='switch']").exists()).toBe(true);
  });

  it("has correct aria-checked", () => {
    const wrapper = mount(YSwitch, {
      props: { modelValue: true },
    });
    expect(wrapper.find("[role='switch']").attributes("aria-checked")).toBe(
      "true",
    );
  });

  it("shows label text", () => {
    const wrapper = mount(YSwitch, {
      props: { modelValue: false, label: "Dark Mode" },
    });
    expect(wrapper.text()).toContain("Dark Mode");
  });
});
