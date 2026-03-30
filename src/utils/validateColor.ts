const CSS_COLOR_RE =
  /^(#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})|rgb|rgba|hsl|hsla|var|color-mix)\b/i;

export function isValidCSSColor(value: string): boolean {
  return CSS_COLOR_RE.test(value.trim());
}

export function warnInvalidColor(
  component: string,
  prop: string,
  value: string | undefined,
): void {
  if (
    import.meta.env.DEV &&
    value !== undefined &&
    !isValidCSSColor(value)
  ) {
    console.warn(
      `[ywf-ui ${component}] Invalid "${prop}" value: "${value}". ` +
        `Expected a CSS color (hex, rgb(), hsl(), var(), color-mix()).`,
    );
  }
}
