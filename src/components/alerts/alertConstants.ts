import type {
  AlertType,
  AlertVariant,
  AlertSize,
  AlertIntensity,
  AlertRadius,
} from "@/types/alert";

export const defaultIcons: Record<AlertType, string> = {
  info: "ℹ",
  success: "✓",
  warning: "⚠",
  error: "✕",
  neutral: "●",
};

export const radiusMap: Record<AlertRadius, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

export const sizeClasses: Record<AlertSize, string> = {
  sm: "px-3 py-2 text-xs gap-2",
  md: "px-4 py-3 text-sm gap-3",
  lg: "px-5 py-4 text-base gap-4",
};

export const iconSizeClasses: Record<AlertSize, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

export const closeSizeClasses: Record<AlertSize, string> = {
  sm: "text-base w-5 h-5",
  md: "text-lg w-6 h-6",
  lg: "text-xl w-7 h-7",
};

export const titleSizeClasses: Record<AlertSize, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

export const actionBtnSizeClasses: Record<AlertSize, string> = {
  sm: "text-xs px-2 py-0.5",
  md: "text-xs px-3 py-1",
  lg: "text-sm px-4 py-1.5",
};

export const intensitySoftBg: Record<
  AlertIntensity,
  Record<AlertType, string>
> = {
  low: {
    info: "bg-blue-50/60",
    success: "bg-green-50/60",
    warning: "bg-amber-50/60",
    error: "bg-red-50/60",
    neutral: "bg-gray-50/60",
  },
  medium: {
    info: "bg-blue-50",
    success: "bg-green-50",
    warning: "bg-amber-50",
    error: "bg-red-50",
    neutral: "bg-gray-100",
  },
  high: {
    info: "bg-blue-100",
    success: "bg-green-100",
    warning: "bg-amber-100",
    error: "bg-red-100",
    neutral: "bg-gray-200",
  },
};

type ColorMatrix = Record<AlertType, Record<AlertVariant, string>>;

export const buildColorMap = (intensity: AlertIntensity, dark = false): ColorMatrix => {
  const softBg = intensitySoftBg[intensity];

  if (dark) {
    return {
      info: {
        solid: "bg-blue-600 text-white border border-blue-600",
        outline: "bg-transparent text-blue-300 border border-blue-500",
        soft: `bg-blue-950 text-blue-200 border border-blue-700`,
        "left-accent": `bg-blue-950 text-blue-200 border-l-4 border-blue-500`,
        ghost: "bg-transparent text-blue-300",
      },
      success: {
        solid: "bg-green-600 text-white border border-green-600",
        outline: "bg-transparent text-green-300 border border-green-500",
        soft: `bg-green-950 text-green-200 border border-green-700`,
        "left-accent": `bg-green-950 text-green-200 border-l-4 border-green-500`,
        ghost: "bg-transparent text-green-300",
      },
      warning: {
        solid: "bg-amber-500 text-white border border-amber-500",
        outline: "bg-transparent text-amber-300 border border-amber-500",
        soft: `bg-amber-950 text-amber-200 border border-amber-700`,
        "left-accent": `bg-amber-950 text-amber-200 border-l-4 border-amber-500`,
        ghost: "bg-transparent text-amber-300",
      },
      error: {
        solid: "bg-red-600 text-white border border-red-600",
        outline: "bg-transparent text-red-300 border border-red-500",
        soft: `bg-red-950 text-red-200 border border-red-700`,
        "left-accent": `bg-red-950 text-red-200 border-l-4 border-red-500`,
        ghost: "bg-transparent text-red-300",
      },
      neutral: {
        solid: "bg-gray-700 text-white border border-gray-700",
        outline: "bg-transparent text-gray-300 border border-gray-500",
        soft: `bg-gray-900 text-gray-200 border border-gray-600`,
        "left-accent": `bg-gray-900 text-gray-200 border-l-4 border-gray-500`,
        ghost: "bg-transparent text-gray-300",
      },
    };
  }

  return {
    info: {
      solid: "bg-blue-600 text-white border border-blue-600",
      outline:
        "bg-transparent text-blue-700 border border-blue-400",
      soft: `${softBg.info} text-blue-800 border border-blue-200`,
      "left-accent": `${softBg.info} text-blue-800 border-l-4 border-blue-500`,
      ghost: "bg-transparent text-blue-700",
    },
    success: {
      solid: "bg-green-600 text-white border border-green-600",
      outline:
        "bg-transparent text-green-700 border border-green-400",
      soft: `${softBg.success} text-green-800 border border-green-200`,
      "left-accent": `${softBg.success} text-green-800 border-l-4 border-green-500`,
      ghost: "bg-transparent text-green-700",
    },
    warning: {
      solid: "bg-amber-500 text-white border border-amber-500",
      outline:
        "bg-transparent text-amber-700 border border-amber-400",
      soft: `${softBg.warning} text-amber-800 border border-amber-200`,
      "left-accent": `${softBg.warning} text-amber-800 border-l-4 border-amber-500`,
      ghost: "bg-transparent text-amber-700",
    },
    error: {
      solid: "bg-red-600 text-white border border-red-600",
      outline:
        "bg-transparent text-red-700 border border-red-400",
      soft: `${softBg.error} text-red-800 border border-red-200`,
      "left-accent": `${softBg.error} text-red-800 border-l-4 border-red-500`,
      ghost: "bg-transparent text-red-700",
    },
    neutral: {
      solid: "bg-gray-700 text-white border border-gray-700",
      outline:
        "bg-transparent text-gray-700 border border-gray-400",
      soft: `${softBg.neutral} text-gray-800 border border-gray-200`,
      "left-accent": `${softBg.neutral} text-gray-800 border-l-4 border-gray-500`,
      ghost: "bg-transparent text-gray-700",
    },
  };
};

export const actionColorMap: Record<
  AlertType,
  { link: string; outline: string; solid: string }
> = {
  info: {
    link: "text-blue-700 hover:underline",
    outline:
      "border border-blue-500 text-blue-700 hover:bg-blue-100",
    solid: "bg-blue-600 text-white hover:bg-blue-700",
  },
  success: {
    link: "text-green-700 hover:underline",
    outline:
      "border border-green-500 text-green-700 hover:bg-green-100",
    solid: "bg-green-600 text-white hover:bg-green-700",
  },
  warning: {
    link: "text-amber-700 hover:underline",
    outline:
      "border border-amber-500 text-amber-700 hover:bg-amber-100",
    solid: "bg-amber-600 text-white hover:bg-amber-700",
  },
  error: {
    link: "text-red-700 hover:underline",
    outline:
      "border border-red-500 text-red-700 hover:bg-red-100",
    solid: "bg-red-600 text-white hover:bg-red-700",
  },
  neutral: {
    link: "text-gray-700 hover:underline",
    outline:
      "border border-gray-500 text-gray-700 hover:bg-gray-100",
    solid: "bg-gray-700 text-white hover:bg-gray-800",
  },
};

export const darkActionColorMap: Record<
  AlertType,
  { link: string; outline: string; solid: string }
> = {
  info: {
    link: "text-blue-300 hover:underline",
    outline:
      "border border-blue-500 text-blue-300 hover:bg-blue-900",
    solid: "bg-blue-600 text-white hover:bg-blue-700",
  },
  success: {
    link: "text-green-300 hover:underline",
    outline:
      "border border-green-500 text-green-300 hover:bg-green-900",
    solid: "bg-green-600 text-white hover:bg-green-700",
  },
  warning: {
    link: "text-amber-300 hover:underline",
    outline:
      "border border-amber-500 text-amber-300 hover:bg-amber-900",
    solid: "bg-amber-600 text-white hover:bg-amber-700",
  },
  error: {
    link: "text-red-300 hover:underline",
    outline:
      "border border-red-500 text-red-300 hover:bg-red-900",
    solid: "bg-red-600 text-white hover:bg-red-700",
  },
  neutral: {
    link: "text-gray-300 hover:underline",
    outline:
      "border border-gray-500 text-gray-300 hover:bg-gray-800",
    solid: "bg-gray-700 text-white hover:bg-gray-800",
  },
};

export const solidActionOverride: Record<string, string> = {
  link: "text-white/90 hover:text-white hover:underline",
  outline: "border border-white/50 text-white hover:bg-white/20",
  solid: "bg-white/20 text-white hover:bg-white/30",
};
