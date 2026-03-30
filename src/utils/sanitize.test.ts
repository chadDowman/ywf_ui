import { describe, it, expect } from "vitest";
import { sanitizeSvg } from "./sanitize";

describe("sanitizeSvg", () => {
  it("returns empty string for empty input", () => {
    expect(sanitizeSvg("")).toBe("");
  });

  it("passes through clean SVG", () => {
    const svg = '<svg viewBox="0 0 24 24"><path d="M12 2L2 22h20z"/></svg>';
    expect(sanitizeSvg(svg)).toContain("<svg");
    expect(sanitizeSvg(svg)).toContain("<path");
  });

  it("strips <script> tags", () => {
    const input = '<svg><script>alert("xss")</script><circle r="10"/></svg>';
    const result = sanitizeSvg(input);
    expect(result).not.toContain("<script");
    expect(result).toContain("<circle");
  });

  it("strips <iframe> tags", () => {
    const input = '<svg><iframe src="evil.com"></iframe><circle r="10"/></svg>';
    const result = sanitizeSvg(input);
    expect(result).not.toContain("<iframe");
  });

  it("strips on* event attributes", () => {
    const input =
      '<svg><circle r="10" onclick="alert(1)" onload="alert(2)"/></svg>';
    const result = sanitizeSvg(input);
    expect(result).not.toContain("onclick");
    expect(result).not.toContain("onload");
  });

  it("strips javascript: URIs from href", () => {
    const input =
      '<svg><a href="javascript:alert(1)"><text>click</text></a></svg>';
    const result = sanitizeSvg(input);
    expect(result).not.toContain("javascript:");
  });

  it("strips style attributes to prevent CSS injection", () => {
    const input = '<svg><rect style="background:url(evil.com)"/></svg>';
    const result = sanitizeSvg(input);
    expect(result).not.toContain("style=");
  });

  it("strips <object> and <embed> tags", () => {
    const input = '<svg><object data="evil.swf"/><embed src="evil.swf"/></svg>';
    const result = sanitizeSvg(input);
    expect(result).not.toContain("<object");
    expect(result).not.toContain("<embed");
  });
});
