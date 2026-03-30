import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import YToast from "./YToast.vue";

describe("YToast", () => {
  it("renders when visible", () => {
    const wrapper = mount(YToast, {
      props: { visible: true, message: "Hello" },
    });
    expect(wrapper.text()).toContain("Hello");
  });

  it("does not render when not visible", () => {
    const wrapper = mount(YToast, {
      props: { visible: false, message: "Hidden" },
    });
    expect(wrapper.find("[role='alert']").exists()).toBe(false);
  });

  it("has role=alert and aria-live", () => {
    const wrapper = mount(YToast, {
      props: { visible: true, type: "error" },
    });
    const alert = wrapper.find("[role='alert']");
    expect(alert.exists()).toBe(true);
    expect(alert.attributes("aria-live")).toBe("assertive");
  });

  it("uses polite aria-live for info type", () => {
    const wrapper = mount(YToast, {
      props: { visible: true, type: "info" },
    });
    const alert = wrapper.find("[role='alert']");
    expect(alert.attributes("aria-live")).toBe("polite");
  });

  it("auto-dismisses after duration", async () => {
    vi.useFakeTimers();
    const wrapper = mount(YToast, {
      props: { visible: true, duration: 1000 },
    });
    vi.advanceTimersByTime(999);
    expect(wrapper.emitted("dismiss")).toBeFalsy();
    vi.advanceTimersByTime(1);
    expect(wrapper.emitted("dismiss")).toBeTruthy();
    vi.useRealTimers();
  });

  it("emits dismiss on close button click", async () => {
    const wrapper = mount(YToast, {
      props: { visible: true, dismissible: true },
    });
    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted("dismiss")).toBeTruthy();
  });
});
