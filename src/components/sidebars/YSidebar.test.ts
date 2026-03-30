import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import YSidebar from "./YSidebar.vue";

describe("YSidebar", () => {
  it("renders as nav element", () => {
    const wrapper = mount(YSidebar, {
      props: {
        open: true,
        items: [{ id: "home", label: "Home" }],
      },
    });
    expect(wrapper.find("nav").exists()).toBe(true);
  });

  it("has aria-label", () => {
    const wrapper = mount(YSidebar, {
      props: {
        open: true,
        items: [{ id: "home", label: "Home" }],
      },
    });
    expect(wrapper.find("nav").attributes("aria-label")).toBe("Sidebar navigation");
  });

  it("renders menu items", () => {
    const wrapper = mount(YSidebar, {
      props: {
        open: true,
        items: [
          { id: "home", label: "Home" },
          { id: "settings", label: "Settings" },
        ],
      },
    });
    expect(wrapper.text()).toContain("Home");
    expect(wrapper.text()).toContain("Settings");
  });
});
