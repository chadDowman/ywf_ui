export type PlaygroundQuickConfig = {
  componentId: string;
  propKey: string;
  options: readonly string[];
  init?: (next: Record<string, unknown>) => void;
  applyOption?: (next: Record<string, unknown>, option: string) => void;
};

export type PlaygroundInspectorEditor =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "color"
  | "json"
  | "select";

export type PlaygroundInspectorOption = {
  label: string;
  value: unknown;
};

export type PlaygroundVisibilityRule = {
  key: string;
  equals?: unknown;
  notEquals?: unknown;
  in?: readonly unknown[];
  truthy?: boolean;
  falsy?: boolean;
};

export type PlaygroundInspectorControl = {
  key: string;
  label?: string;
  section?: string;
  editor?: PlaygroundInspectorEditor;
  options?: readonly unknown[] | readonly PlaygroundInspectorOption[];
  rows?: number;
  description?: string;
  visibleWhen?: PlaygroundVisibilityRule | readonly PlaygroundVisibilityRule[];
};

export type PlaygroundInspectorSection = {
  id: string;
  title: string;
  description?: string;
};

export type PlaygroundInspectorConfig = {
  componentId: string;
  sections?: readonly PlaygroundInspectorSection[];
  controls: readonly PlaygroundInspectorControl[];
  init?: (next: Record<string, unknown>) => void;
  strict?: boolean;
};
