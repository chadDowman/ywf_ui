type PerformanceLike = Performance & {
  clearMarks?: (markName?: string) => void;
  clearMeasures?: (measureName?: string) => void;
  mark?: (markName: string) => void;
  measure?: (
    measureName: string,
    startOrMeasureOptions?: string | PerformanceMeasureOptions,
    endMark?: string,
  ) => void;
};

function noop(): void {}

function defineNoop(target: object, key: keyof PerformanceLike): void {
  const current = (target as Record<string, unknown>)[key as string];
  if (typeof current === "function") return;

  try {
    Object.defineProperty(target, key, {
      value: noop,
      configurable: true,
      writable: true,
    });
  } catch {
    // Ignore host objects that refuse redefinition.
  }
}

const perf = globalThis.performance as PerformanceLike | undefined;

if (perf) {
  defineNoop(perf, "clearMarks");
  defineNoop(perf, "clearMeasures");
  defineNoop(perf, "mark");
  defineNoop(perf, "measure");
}

if (typeof Performance !== "undefined") {
  defineNoop(Performance.prototype, "clearMarks");
  defineNoop(Performance.prototype, "clearMeasures");
  defineNoop(Performance.prototype, "mark");
  defineNoop(Performance.prototype, "measure");
}
