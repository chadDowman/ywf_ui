import { describe, it, expect } from "vitest";
import { isValidCSSColor, warnInvalidColor } from "./validateColor";

describe("isValidCSSColor", () => {
  it("accepts hex colors", () => {
    expect(isValidCSSColor("#fff")).toBe(true);
    expect(isValidCSSColor("#ffffff")).toBe(true);
    expect(isValidCSSColor("#ff000080")).toBe(true);
  });

  it("accepts rgb/rgba", () => {
    expect(isValidCSSColor("rgb(0,0,0)")).toBe(true);
    expect(isValidCSSColor("rgba(0,0,0,0.5)")).toBe(true);
  });

  it("accepts hsl/hsla", () => {
    expect(isValidCSSColor("hsl(120,100%,50%)")).toBe(true);
    expect(isValidCSSColor("hsla(120,100%,50%,0.5)")).toBe(true);
  });

  it("accepts CSS variables", () => {
    expect(isValidCSSColor("var(--my-color)")).toBe(true);
  });

  it("accepts color-mix", () => {
    expect(isValidCSSColor("color-mix(in srgb, red 50%, blue)")).toBe(true);
  });

  it("rejects plain strings", () => {
    expect(isValidCSSColor("alert(1)")).toBe(false);
    expect(isValidCSSColor("notacolor")).toBe(false);
  });
});

describe("warnInvalidColor", () => {
  it("does not throw for valid color", () => {
    expect(() => warnInvalidColor("Test", "color", "#fff")).not.toThrow();
  });

  it("does not throw for undefined value", () => {
    expect(() => warnInvalidColor("Test", "color", undefined)).not.toThrow();
  });
});
