const DANGEROUS_TAGS = new Set([
  "script",
  "iframe",
  "object",
  "embed",
  "form",
  "link",
  "meta",
  "base",
]);

const DANGEROUS_URI_ATTRS = new Set([
  "href",
  "xlink:href",
  "src",
  "action",
  "formaction",
]);

const DANGEROUS_URI_SCHEMES = ["javascript:", "data:text/html", "vbscript:"];

/**
 * Lightweight HTML/SVG sanitizer that strips dangerous elements
 * and attributes to prevent XSS when rendering user-provided
 * icon strings via v-html.
 *
 * Uses DOMParser (no external dependencies).
 */
export function sanitizeSvg(raw: string): string {
  if (!raw) return "";
  if (typeof DOMParser === "undefined") return "";

  const doc = new DOMParser().parseFromString(raw, "text/html");

  for (const tag of DANGEROUS_TAGS) {
    doc.querySelectorAll(tag).forEach((el) => el.remove());
  }

  for (const el of doc.body.querySelectorAll("*")) {
    for (const attr of Array.from(el.attributes)) {
      const name = attr.name.toLowerCase();

      if (name.startsWith("on") || name === "style") {
        el.removeAttribute(attr.name);
        continue;
      }

      if (DANGEROUS_URI_ATTRS.has(name)) {
        const cleaned = attr.value
          .replace(/[\s\u0000-\u001F]/g, "")
          .toLowerCase();
        if (DANGEROUS_URI_SCHEMES.some((s) => cleaned.startsWith(s))) {
          el.removeAttribute(attr.name);
        }
      }
    }
  }

  return doc.body.innerHTML;
}
