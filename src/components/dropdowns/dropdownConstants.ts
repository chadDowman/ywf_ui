import type { YDropdownSize, YDropdownVariant } from "@/types/dropdown";

export const sizeClasses: Record<YDropdownSize, string> = {
  xs: "px-2 py-1 text-xs",
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
};

export const variantBtnClasses: Record<YDropdownVariant, string> = {
  basic: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
  outline:
    "border-2 border-indigo-500 text-indigo-600 bg-transparent hover:bg-indigo-50",
  ghost: "border-none bg-transparent text-gray-600 hover:bg-gray-100",
  glass:
    "border border-white/30 bg-white/20 backdrop-blur-md text-gray-800 hover:bg-white/30 shadow-sm",
  split: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
  searchable: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
  "multi-select":
    "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
  nested: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
  "command-palette":
    "border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 font-mono",
  compact:
    "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 !px-2 !py-1 text-xs",
  aurora: "ydropdown-aurora-btn border-0 text-white font-medium tracking-wide",
  brutalist:
    "ydropdown-brutalist-btn border-[3px] border-black bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-black hover:text-white",
  pill: "ydropdown-pill-btn border-0 text-gray-700 font-medium",
  terminal:
    "ydropdown-terminal-btn border border-green-500/40 bg-black text-green-400 font-mono text-xs tracking-wide hover:border-green-400/70 hover:bg-gray-950",
  floating:
    "ydropdown-floating-btn border border-gray-200/80 bg-white text-gray-800 font-medium shadow-md hover:shadow-lg hover:-translate-y-px",
};
