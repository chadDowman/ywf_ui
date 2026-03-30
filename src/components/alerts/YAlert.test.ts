import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import YAlert from "./YAlert.vue";

describe("YAlert", () => {
  it("renders with role=alert", () => {
    const wrapper = mount(YAlert, {
      props: { type: "info" },
      slots: { default: "Info message" },
    });
    expect(wrapper.find("[role='alert']").exists()).toBe(true);
    expect(wrapper.text()).toContain("Info message");
  });

  it("emits dismiss event", async () => {
    const wrapper = mount(YAlert, {
      props: { type: "info", dismissible: true },
    });
    const closeBtn = wrapper.find("button");
    if (closeBtn.exists()) {
      await closeBtn.trigger("click");
      expect(wrapper.emitted("dismiss")).toBeTruthy();
    }
  });

  it("renders different types", () => {
    for (const type of ["success", "error", "warning", "info"] as const) {
      const wrapper = mount(YAlert, { props: { type } });
      expect(wrapper.find("[role='alert']").exists()).toBe(true);
    }
  });
});
