<script setup lang="ts">
import { computed, ref } from "vue";
import type { YButtonProps, ComponentSize, YButtonPreset } from "@/types";

const props = withDefaults(defineProps<YButtonProps>(), {
  size: "md",
  color: "#2563eb",
  textColor: "#f8fafc",
  variant: "solid",
  disabled: false,
  shadow: false,
  rounded: "md",
  padding: "md",
  animation: false,
  effect: false,
  animationIntensity: "moderate",
  effectIntensity: "moderate",
  preset: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const textSizeClasses: Record<ComponentSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg",
};

const paddingClasses: Record<ComponentSize, string> = {
  xs: "px-2 py-1",
  sm: "px-3 py-1.5",
  md: "px-4 py-2",
  lg: "px-5 py-2.5",
  xl: "px-6 py-3",
};

const roundedClasses: Record<string, string> = {
  false: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

const shadowClasses: Record<string, string> = {
  false: "",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
};

const textSizeValues: Record<ComponentSize, string> = {
  xs: "0.75rem",
  sm: "0.875rem",
  md: "0.875rem",
  lg: "1rem",
  xl: "1.125rem",
};

const paddingValues: Record<ComponentSize, string> = {
  xs: "0.25rem 0.5rem",
  sm: "0.375rem 0.75rem",
  md: "0.5rem 1rem",
  lg: "0.625rem 1.25rem",
  xl: "0.75rem 1.5rem",
};

const roundedValues: Record<string, string> = {
  false: "0",
  sm: "0.125rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  full: "9999px",
};

const shadowValues: Record<string, string> = {
  false: "none",
  sm: "0 1px 2px rgba(0, 0, 0, 0.1)",
  md: "0 4px 6px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 15px rgba(0, 0, 0, 0.15)",
  xl: "0 20px 25px rgba(0, 0, 0, 0.2)",
};

const animationClasses: Record<string, string> = {
  false: "",
  pulse: "y-btn-pulse",
  bounce: "y-btn-bounce",
  shake: "y-btn-shake",
  glow: "y-btn-glow",
  spin: "y-btn-spin",
  wobble: "y-btn-wobble",
  typewriter: "y-btn-typewriter",
  breathe: "y-btn-breathe",
  flicker: "y-btn-flicker",
  "slide-in": "y-btn-slide-in",
};

const effectClasses: Record<string, string> = {
  false: "",
  ripple: "y-btn-ripple",
  scale: "y-btn-scale",
  lift: "y-btn-lift",
  neon: "y-btn-neon",
  glassmorphism: "y-btn-glass",
  morph: "y-btn-morph",
  "magnetic-pull": "y-btn-magnetic-pull",
  spotlight: "y-btn-spotlight",
  emboss: "y-btn-emboss",
  hologram: "y-btn-hologram",
};

const presetClasses: Record<YButtonPreset, string> = {
  solid: "y-btn-preset-solid",
  outline: "y-btn-preset-outline",
  ghost: "y-btn-preset-ghost",
  gradient: "y-btn-preset-gradient",
  neon: "y-btn-preset-neon",
  pill: "y-btn-preset-pill",
  brutal: "y-btn-preset-brutal",
  glass: "y-btn-preset-glass",
  magnetic: "y-btn-preset-magnetic",
  underline: "y-btn-preset-underline",
  retro: "y-btn-preset-retro",
  cyber: "y-btn-preset-cyber",
  stitched: "y-btn-preset-stitched",
  liquid: "y-btn-preset-liquid",
  "3d": "y-btn-preset-3d",
};

const animIntensityVars: Record<string, Record<string, string>> = {
  subtle: {
    "--y-anim-speed": "1.4",
    "--y-pulse-min": "0.8",
    "--y-bounce-y": "8%",
    "--y-shake-x": "1.5px",
    "--y-glow-spread-lo": "8px",
    "--y-glow-spread-hi": "18px",
    "--y-glow-mix-lo": "25%",
    "--y-glow-mix-hi": "40%",
    "--y-wobble-deg": "2deg",
    "--y-breathe-scale-lo": "0.98",
    "--y-breathe-scale-hi": "1.02",
    "--y-flicker-min": "0.85",
    "--y-slide-x": "8px",
  },
  moderate: {
    "--y-anim-speed": "1",
    "--y-pulse-min": "0.6",
    "--y-bounce-y": "15%",
    "--y-shake-x": "3px",
    "--y-glow-spread-lo": "15px",
    "--y-glow-spread-hi": "35px",
    "--y-glow-mix-lo": "40%",
    "--y-glow-mix-hi": "60%",
    "--y-wobble-deg": "5deg",
    "--y-breathe-scale-lo": "0.95",
    "--y-breathe-scale-hi": "1.05",
    "--y-flicker-min": "0.6",
    "--y-slide-x": "20px",
  },
  strong: {
    "--y-anim-speed": "0.7",
    "--y-pulse-min": "0.35",
    "--y-bounce-y": "25%",
    "--y-shake-x": "6px",
    "--y-glow-spread-lo": "25px",
    "--y-glow-spread-hi": "55px",
    "--y-glow-mix-lo": "55%",
    "--y-glow-mix-hi": "80%",
    "--y-wobble-deg": "10deg",
    "--y-breathe-scale-lo": "0.90",
    "--y-breathe-scale-hi": "1.10",
    "--y-flicker-min": "0.3",
    "--y-slide-x": "40px",
  },
};

const effectIntensityVars: Record<string, Record<string, string>> = {
  subtle: {
    "--y-scale-factor": "1.03",
    "--y-lift-y": "1.5px",
    "--y-lift-shadow-1": "0 4px 12px -3px rgba(0,0,0,0.12)",
    "--y-lift-shadow-2": "0 3px 6px -4px rgba(0,0,0,0.1)",
    "--y-neon-spread-1": "3px",
    "--y-neon-spread-2": "10px",
    "--y-neon-mix": "30%",
    "--y-neon-hover-1": "5px",
    "--y-neon-hover-2": "18px",
    "--y-neon-hover-3": "35px",
    "--y-neon-hover-mix-2": "40%",
    "--y-neon-hover-mix-3": "18%",
    "--y-glass-bg": "15%",
    "--y-glass-border": "25%",
    "--y-glass-blur": "8px",
    "--y-ripple-scale": "2",
    "--y-ripple-opacity": "0.2",
    "--y-morph-radius": "40% 60% 60% 40% / 60% 40% 60% 40%",
    "--y-mag-pull-scale": "0.08",
    "--y-spotlight-size": "60px",
    "--y-emboss-depth": "1px",
    "--y-holo-shift": "1px",
  },
  moderate: {
    "--y-scale-factor": "1.07",
    "--y-lift-y": "3px",
    "--y-lift-shadow-1": "0 10px 25px -5px rgba(0,0,0,0.2)",
    "--y-lift-shadow-2": "0 8px 10px -6px rgba(0,0,0,0.15)",
    "--y-neon-spread-1": "5px",
    "--y-neon-spread-2": "20px",
    "--y-neon-mix": "50%",
    "--y-neon-hover-1": "10px",
    "--y-neon-hover-2": "30px",
    "--y-neon-hover-3": "60px",
    "--y-neon-hover-mix-2": "60%",
    "--y-neon-hover-mix-3": "30%",
    "--y-glass-bg": "25%",
    "--y-glass-border": "40%",
    "--y-glass-blur": "12px",
    "--y-ripple-scale": "2.5",
    "--y-ripple-opacity": "0.3",
    "--y-morph-radius": "30% 70% 70% 30% / 70% 30% 70% 30%",
    "--y-mag-pull-scale": "0.15",
    "--y-spotlight-size": "100px",
    "--y-emboss-depth": "2px",
    "--y-holo-shift": "2px",
  },
  strong: {
    "--y-scale-factor": "1.14",
    "--y-lift-y": "6px",
    "--y-lift-shadow-1": "0 18px 40px -8px rgba(0,0,0,0.3)",
    "--y-lift-shadow-2": "0 12px 18px -8px rgba(0,0,0,0.2)",
    "--y-neon-spread-1": "8px",
    "--y-neon-spread-2": "35px",
    "--y-neon-mix": "70%",
    "--y-neon-hover-1": "16px",
    "--y-neon-hover-2": "50px",
    "--y-neon-hover-3": "90px",
    "--y-neon-hover-mix-2": "80%",
    "--y-neon-hover-mix-3": "45%",
    "--y-glass-bg": "35%",
    "--y-glass-border": "55%",
    "--y-glass-blur": "18px",
    "--y-ripple-scale": "3.5",
    "--y-ripple-opacity": "0.45",
    "--y-morph-radius": "20% 80% 80% 20% / 80% 20% 80% 20%",
    "--y-mag-pull-scale": "0.25",
    "--y-spotlight-size": "150px",
    "--y-emboss-depth": "3px",
    "--y-holo-shift": "3px",
  },
};

// ── Computed styles ──────────────────────────────────────────────────
const colorStyles = computed(() => {
  const baseVars: Record<string, string> = {
    "--y-btn-focus-ring": props.color,
    "--y-btn-color": props.color,
    ...animIntensityVars[props.animationIntensity],
    ...effectIntensityVars[props.effectIntensity],
  };

  const propertyOverrides: Record<string, string> = {
    fontSize: textSizeValues[props.size],
    padding: paddingValues[props.padding],
    borderRadius: roundedValues[String(props.rounded)],
  };

  const shadowVal = shadowValues[String(props.shadow)];
  if (shadowVal !== "none") {
    propertyOverrides.boxShadow = shadowVal;
  }

  if (props.preset) {
    return {
      ...baseVars,
      ...propertyOverrides,
      "--x": "50%",
      "--y": "50%",
      "--y-preset-primary": props.color,
      "--y-preset-text": props.textColor,
    } as Record<string, string>;
  }

  const styles: Record<string, string> = {
    ...baseVars,
    ...propertyOverrides,
  };

  switch (props.variant) {
    case "outline":
      styles.color = props.color;
      styles.borderColor = props.color;
      styles.backgroundColor = "transparent";
      break;
    case "ghost":
      styles.color = props.color;
      styles.borderColor = "transparent";
      styles.backgroundColor = "transparent";
      break;
    default:
      styles.backgroundColor = props.color;
      styles.color = props.textColor;
      styles.borderColor = props.color;
  }

  return styles;
});

const buttonClasses = computed(() => {
  const base = [
    "y-button",
    "inline-flex items-center justify-center",
    "font-semibold tracking-[0.01em]",
    "transition-all duration-200 ease-out cursor-pointer",
    "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400/70",
    "disabled:opacity-50 disabled:pointer-events-none",
  ];

  if (props.preset) {
    return [
      ...base,
      "y-button-preset",
      presetClasses[props.preset],
      animationClasses[String(props.animation)],
      effectClasses[String(props.effect)],
    ];
  }

  return [
    ...base,
    "border",
    textSizeClasses[props.size],
    paddingClasses[props.padding],
    roundedClasses[String(props.rounded)],
    shadowClasses[String(props.shadow)],
    animationClasses[String(props.animation)],
    effectClasses[String(props.effect)],
  ];
});

function handleClick(event: MouseEvent) {
  if (!props.disabled) {
    if (props.effect === "ripple") {
      createRipple(event);
    }
    emit("click", event);
  }
}

function createRipple(event: MouseEvent) {
  const btn = event.currentTarget as HTMLElement;
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  const rippleOpacity =
    getComputedStyle(btn).getPropertyValue("--y-ripple-opacity").trim() ||
    "0.3";
  const ripple = document.createElement("span");
  ripple.style.cssText = `
    position: absolute; border-radius: 50%; pointer-events: none;
    width: ${size}px; height: ${size}px;
    left: ${x}px; top: ${y}px;
    background: currentColor; opacity: ${rippleOpacity};
    transform: scale(0); animation: y-ripple-expand 0.5s ease-out forwards;
  `;
  btn.appendChild(ripple);
  ripple.addEventListener("animationend", () => ripple.remove());
}

function handleMouseMove(event: MouseEvent) {
  const needsTracking =
    props.preset === "magnetic" ||
    props.effect === "spotlight" ||
    props.effect === "magnetic-pull";

  if (!needsTracking) return;

  const btn = event.currentTarget as HTMLElement;
  const rect = btn.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;
  btn.style.setProperty("--x", `${x}%`);
  btn.style.setProperty("--y", `${y}%`);

  if (props.effect === "magnetic-pull") {
    const pullX = (event.clientX - rect.left - rect.width / 2) * 0.15;
    const pullY = (event.clientY - rect.top - rect.height / 2) * 0.15;
    btn.style.transform = `translate(${pullX}px, ${pullY}px)`;
  }
}

function handleMouseLeave(event: MouseEvent) {
  if (props.effect === "magnetic-pull") {
    const btn = event.currentTarget as HTMLElement;
    btn.style.transform = "";
  }
}
</script>

<template>
  <button
    :class="buttonClasses"
    :style="colorStyles"
    :disabled="disabled"
    @click="handleClick"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <slot>{{ label }}</slot>
  </button>
</template>

<style scoped>
.y-button {
  position: relative;
  overflow: hidden;
}

.y-button-preset {
  border: none;
  outline: none;
  font-family: "Sora", "DM Sans", sans-serif;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.y-button-preset:focus-visible {
  outline: 2px solid #f5b731;
  outline-offset: 3px;
}

.y-button:not(:disabled):hover {
  filter: brightness(0.92);
}

.y-button:not(:disabled):active {
  filter: brightness(0.85);
}

.y-button:focus-visible {
  outline: 2px solid var(--y-btn-focus-ring);
  outline-offset: 2px;
}

/* ═══════════════════════════════════════════════════════════════════════
   PRESETS — Original 10
   ═══════════════════════════════════════════════════════════════════════ */

.y-btn-preset-solid {
  background: var(--y-preset-primary, #ff6b5a);
  color: var(--y-preset-text, #fff);
}
.y-btn-preset-solid:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px
    color-mix(in srgb, var(--y-preset-primary, #ff6b5a) 60%, transparent);
  background: color-mix(in srgb, var(--y-preset-primary, #ff6b5a) 85%, white);
}
.y-btn-preset-solid:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px
    color-mix(in srgb, var(--y-preset-primary, #ff6b5a) 45%, transparent);
}

.y-btn-preset-outline {
  background: transparent;
  color: var(--y-preset-primary, #4eeab0);
  border: 2px solid var(--y-preset-primary, #4eeab0);
}
.y-btn-preset-outline:hover {
  background: color-mix(
    in srgb,
    var(--y-preset-primary, #4eeab0) 12%,
    transparent
  );
  box-shadow: 0 0 24px
    color-mix(in srgb, var(--y-preset-primary, #4eeab0) 22%, transparent);
  transform: translateY(-2px);
}
.y-btn-preset-outline:active {
  transform: translateY(0);
}

.y-btn-preset-ghost {
  background: color-mix(
    in srgb,
    var(--y-preset-primary, #a78bfa) 10%,
    transparent
  );
  color: var(--y-preset-primary, #a78bfa);
  backdrop-filter: blur(8px);
}
.y-btn-preset-ghost:hover {
  background: color-mix(
    in srgb,
    var(--y-preset-primary, #a78bfa) 18%,
    transparent
  );
  box-shadow: inset 0 0 0 1px
    color-mix(in srgb, var(--y-preset-primary, #a78bfa) 28%, transparent);
}
.y-btn-preset-ghost:active {
  background: color-mix(
    in srgb,
    var(--y-preset-primary, #a78bfa) 24%,
    transparent
  );
}

.y-btn-preset-gradient {
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--y-preset-primary, #ff6b5a) 65%, #f5b731),
    var(--y-preset-primary, #ff6b5a)
  );
  color: var(--y-preset-text, #fff);
}
.y-btn-preset-gradient:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 30px
    color-mix(in srgb, var(--y-preset-primary, #ff6b5a) 50%, transparent);
}
.y-btn-preset-gradient:active {
  transform: translateY(0) scale(0.98);
}

.y-btn-preset-neon {
  background: transparent;
  color: var(--y-preset-primary, #38bdf8);
  border: 1.5px solid var(--y-preset-primary, #38bdf8);
  text-shadow: 0 0 12px
    color-mix(in srgb, var(--y-preset-primary, #38bdf8) 55%, transparent);
  box-shadow:
    0 0 12px
      color-mix(in srgb, var(--y-preset-primary, #38bdf8) 20%, transparent),
    inset 0 0 12px
      color-mix(in srgb, var(--y-preset-primary, #38bdf8) 10%, transparent);
}
.y-btn-preset-neon:hover {
  background: color-mix(
    in srgb,
    var(--y-preset-primary, #38bdf8) 10%,
    transparent
  );
  box-shadow:
    0 0 28px
      color-mix(in srgb, var(--y-preset-primary, #38bdf8) 35%, transparent),
    inset 0 0 16px
      color-mix(in srgb, var(--y-preset-primary, #38bdf8) 15%, transparent);
  text-shadow: 0 0 20px
    color-mix(in srgb, var(--y-preset-primary, #38bdf8) 75%, transparent);
  transform: translateY(-1px);
}

.y-btn-preset-pill {
  background: var(--y-preset-primary, #fb7185);
  color: var(--y-preset-text, #fff);
}
.y-btn-preset-pill:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px
    color-mix(in srgb, var(--y-preset-primary, #fb7185) 45%, transparent);
}

.y-btn-preset-brutal {
  background: var(--y-preset-primary, #a3e635);
  color: var(--y-preset-text, #111);
  border: 3px solid
    color-mix(in srgb, var(--y-preset-text, #111) 100%, transparent);
  box-shadow: 4px 4px 0
    color-mix(in srgb, var(--y-preset-text, #111) 100%, transparent);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.y-btn-preset-brutal:hover {
  box-shadow: 6px 6px 0
    color-mix(in srgb, var(--y-preset-text, #111) 100%, transparent);
  transform: translate(-2px, -2px);
}
.y-btn-preset-brutal:active {
  box-shadow: 1px 1px 0
    color-mix(in srgb, var(--y-preset-text, #111) 100%, transparent);
  transform: translate(2px, 2px);
}

.y-btn-preset-glass {
  background: color-mix(
    in srgb,
    var(--y-preset-primary, #e879f9) 12%,
    transparent
  );
  color: var(--y-preset-primary, #e879f9);
  border: 1px solid
    color-mix(in srgb, var(--y-preset-primary, #e879f9) 22%, transparent);
  backdrop-filter: blur(16px);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
}
.y-btn-preset-glass:hover {
  background: color-mix(
    in srgb,
    var(--y-preset-primary, #e879f9) 20%,
    transparent
  );
  border-color: color-mix(
    in srgb,
    var(--y-preset-primary, #e879f9) 38%,
    transparent
  );
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 8px 32px
      color-mix(in srgb, var(--y-preset-primary, #e879f9) 18%, transparent);
  transform: translateY(-2px);
}

.y-btn-preset-magnetic {
  background: color-mix(in srgb, var(--y-preset-primary, #22d3ee) 12%, #1b1d23);
  color: var(--y-preset-primary, #22d3ee);
  border: 1px solid
    color-mix(in srgb, var(--y-preset-primary, #22d3ee) 20%, #2a2a32);
}
.y-btn-preset-magnetic::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at var(--x, 50%) var(--y, 50%),
    color-mix(in srgb, var(--y-preset-primary, #22d3ee) 30%, transparent),
    transparent 60%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}
.y-btn-preset-magnetic:hover::before {
  opacity: 1;
}
.y-btn-preset-magnetic:hover {
  border-color: color-mix(
    in srgb,
    var(--y-preset-primary, #22d3ee) 35%,
    transparent
  );
  box-shadow: 0 0 20px
    color-mix(in srgb, var(--y-preset-primary, #22d3ee) 20%, transparent);
}

.y-btn-preset-underline {
  background: transparent;
  color: var(--y-preset-primary, #fb923c);
  letter-spacing: 0.04em;
}
.y-btn-preset-underline::after {
  content: "";
  position: absolute;
  bottom: 4px;
  left: 0;
  width: 0;
  height: 2.5px;
  background: var(--y-preset-primary, #fb923c);
  border-radius: 2px;
  transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.y-btn-preset-underline:hover::after {
  width: 100%;
}
.y-btn-preset-underline:hover {
  color: color-mix(in srgb, var(--y-preset-primary, #fb923c) 80%, white);
}

/* ═══════════════════════════════════════════════════════════════════════
   PRESETS — 5 New
   ═══════════════════════════════════════════════════════════════════════ */

/* ── 11. RETRO — 8-bit pressed button ── */
.y-btn-preset-retro {
  background: var(--y-preset-primary, #f472b6);
  color: var(--y-preset-text, #fff);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border: 3px solid
    color-mix(in srgb, var(--y-preset-primary, #f472b6) 60%, black);
  border-bottom-width: 5px;
  border-right-width: 5px;
}
.y-btn-preset-retro:hover {
  border-bottom-width: 3px;
  border-right-width: 3px;
  transform: translate(2px, 2px);
  background: color-mix(in srgb, var(--y-preset-primary, #f472b6) 85%, white);
}
.y-btn-preset-retro:active {
  border-bottom-width: 2px;
  border-right-width: 2px;
  transform: translate(3px, 3px);
}

/* ── 12. CYBER — Glitch / sliced shape ── */
.y-btn-preset-cyber {
  background: var(--y-preset-primary, #06ffa5);
  color: var(--y-preset-text, #0a0a0a);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
  border: none;
}
.y-btn-preset-cyber:hover {
  box-shadow:
    4px 0 0 color-mix(in srgb, var(--y-preset-primary, #06ffa5) 50%, #ff00ff),
    -4px 0 0 color-mix(in srgb, var(--y-preset-primary, #06ffa5) 50%, #00ffff);
  animation: y-cyber-glitch 0.3s ease;
}
.y-btn-preset-cyber:active {
  transform: scale(0.96);
}

/* ── 13. STITCHED — Fabric dashed inset border ── */
.y-btn-preset-stitched {
  background: var(--y-preset-primary, #d97706);
  color: var(--y-preset-text, #fff);
  font-weight: 600;
  outline: 2px dashed
    color-mix(in srgb, var(--y-preset-text, #fff) 60%, transparent);
  outline-offset: -6px;
}
.y-btn-preset-stitched:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px
    color-mix(in srgb, var(--y-preset-primary, #d97706) 35%, transparent);
  outline-offset: -8px;
}
.y-btn-preset-stitched:active {
  transform: translateY(0);
}

/* ── 14. LIQUID — Organic morphing blob ── */
.y-btn-preset-liquid {
  background: linear-gradient(
    135deg,
    var(--y-preset-primary, #8b5cf6),
    color-mix(in srgb, var(--y-preset-primary, #8b5cf6) 70%, #ec4899)
  );
  color: var(--y-preset-text, #fff);
  font-weight: 600;
  border-radius: 40% 60% 60% 40% / 60% 40% 60% 40% !important;
  transition:
    border-radius 0.6s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.3s ease,
    box-shadow 0.3s ease;
}
.y-btn-preset-liquid:hover {
  border-radius: 60% 40% 40% 60% / 40% 60% 40% 60% !important;
  transform: scale(1.04);
  box-shadow: 0 8px 30px
    color-mix(in srgb, var(--y-preset-primary, #8b5cf6) 40%, transparent);
}
.y-btn-preset-liquid:active {
  border-radius: 50% !important;
  transform: scale(0.96);
}

/* ── 15. 3D — Extruded raised button ── */
.y-btn-preset-3d {
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--y-preset-primary, #ef4444) 90%, white),
    var(--y-preset-primary, #ef4444)
  );
  color: var(--y-preset-text, #fff);
  font-weight: 700;
  border: none;
  border-bottom: 4px solid
    color-mix(in srgb, var(--y-preset-primary, #ef4444) 65%, black);
  box-shadow:
    0 4px 0 color-mix(in srgb, var(--y-preset-primary, #ef4444) 50%, black),
    0 6px 12px rgba(0, 0, 0, 0.2);
}
.y-btn-preset-3d:hover {
  transform: translateY(-1px);
  box-shadow:
    0 5px 0 color-mix(in srgb, var(--y-preset-primary, #ef4444) 50%, black),
    0 8px 16px rgba(0, 0, 0, 0.25);
}
.y-btn-preset-3d:active {
  transform: translateY(3px);
  border-bottom-width: 1px;
  box-shadow:
    0 1px 0 color-mix(in srgb, var(--y-preset-primary, #ef4444) 50%, black),
    0 2px 4px rgba(0, 0, 0, 0.15);
}

/* ═══════════════════════════════════════════════════════════════════════
   ANIMATIONS — Original 5
   ═══════════════════════════════════════════════════════════════════════ */

.y-btn-pulse {
  animation: y-pulse calc(2s * var(--y-anim-speed, 1))
    cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
.y-btn-bounce {
  animation: y-bounce calc(1s * var(--y-anim-speed, 1)) infinite;
}
.y-btn-shake:hover {
  animation: y-shake calc(0.4s * var(--y-anim-speed, 1)) ease-in-out;
}
.y-btn-glow {
  animation: y-glow calc(2s * var(--y-anim-speed, 1)) ease-in-out infinite;
}
.y-btn-spin:hover {
  animation: y-spin calc(0.6s * var(--y-anim-speed, 1)) ease-in-out;
}

/* ═══════════════════════════════════════════════════════════════════════
   ANIMATIONS — 5 New
   ═══════════════════════════════════════════════════════════════════════ */

/* ── 6. Wobble — playful tilt oscillation ── */
.y-btn-wobble:hover {
  animation: y-wobble calc(0.6s * var(--y-anim-speed, 1)) ease-in-out;
}

/* ── 7. Typewriter — blinking cursor ── */
.y-btn-typewriter::after {
  content: "▌";
  margin-left: 2px;
  animation: y-typewriter-blink calc(0.8s * var(--y-anim-speed, 1)) step-end
    infinite;
}

/* ── 8. Breathe — smooth scale in/out ── */
.y-btn-breathe {
  animation: y-breathe calc(3s * var(--y-anim-speed, 1)) ease-in-out infinite;
}

/* ── 9. Flicker — rapid neon-like stutter ── */
.y-btn-flicker {
  animation: y-flicker calc(2s * var(--y-anim-speed, 1)) linear infinite;
}

/* ── 10. Slide-in — enters from left on mount ── */
.y-btn-slide-in {
  animation: y-slide-in calc(0.5s * var(--y-anim-speed, 1))
    cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* ═══════════════════════════════════════════════════════════════════════
   EFFECTS — Original 5
   ═══════════════════════════════════════════════════════════════════════ */

.y-btn-scale:hover {
  transform: scale(var(--y-scale-factor, 1.07));
}

.y-btn-lift:hover {
  transform: translateY(calc(-1 * var(--y-lift-y, 3px)));
  box-shadow:
    var(--y-lift-shadow-1, 0 10px 25px -5px rgba(0, 0, 0, 0.2)),
    var(--y-lift-shadow-2, 0 8px 10px -6px rgba(0, 0, 0, 0.15));
}

.y-btn-neon {
  box-shadow:
    0 0 var(--y-neon-spread-1, 5px) var(--y-btn-color),
    0 0 var(--y-neon-spread-2, 20px)
      color-mix(in srgb, var(--y-btn-color) var(--y-neon-mix, 50%), transparent);
}
.y-btn-neon:hover {
  box-shadow:
    0 0 var(--y-neon-hover-1, 10px) var(--y-btn-color),
    0 0 var(--y-neon-hover-2, 30px)
      color-mix(
        in srgb,
        var(--y-btn-color) var(--y-neon-hover-mix-2, 60%),
        transparent
      ),
    0 0 var(--y-neon-hover-3, 60px)
      color-mix(
        in srgb,
        var(--y-btn-color) var(--y-neon-hover-mix-3, 30%),
        transparent
      );
}

.y-btn-glass {
  backdrop-filter: blur(var(--y-glass-blur, 12px));
  background: color-mix(
    in srgb,
    var(--y-btn-color) var(--y-glass-bg, 25%),
    transparent
  ) !important;
  border: 1px solid
    color-mix(
      in srgb,
      var(--y-btn-color) var(--y-glass-border, 40%),
      transparent
    ) !important;
}

/* ═══════════════════════════════════════════════════════════════════════
   EFFECTS — 5 New
   ═══════════════════════════════════════════════════════════════════════ */

/* ── 6. Morph — border-radius morphs on hover ── */
.y-btn-morph {
  transition:
    border-radius 0.5s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.25s ease;
}
.y-btn-morph:hover {
  border-radius: var(
    --y-morph-radius,
    30% 70% 70% 30% / 70% 30% 70% 30%
  ) !important;
  transform: scale(1.03);
}

/* ── 7. Magnetic-pull — follows cursor subtly ── */
.y-btn-magnetic-pull {
  transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* ── 8. Spotlight — radial light follows cursor ── */
.y-btn-spotlight::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle var(--y-spotlight-size, 100px) at var(--x, 50%) var(--y, 50%),
    rgba(255, 255, 255, 0.2),
    transparent
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}
.y-btn-spotlight:hover::before {
  opacity: 1;
}

/* ── 9. Emboss — raised text relief ── */
.y-btn-emboss {
  text-shadow:
    0 calc(-1 * var(--y-emboss-depth, 2px)) 0 rgba(0, 0, 0, 0.3),
    0 var(--y-emboss-depth, 2px) 0 rgba(255, 255, 255, 0.15);
}
.y-btn-emboss:hover {
  text-shadow:
    0 calc(-1 * var(--y-emboss-depth, 2px)) 0 rgba(0, 0, 0, 0.5),
    0 var(--y-emboss-depth, 2px) 0 rgba(255, 255, 255, 0.25);
}

/* ── 10. Hologram — chromatic aberration text ── */
.y-btn-hologram {
  text-shadow:
    calc(-1 * var(--y-holo-shift, 2px)) 0 rgba(255, 0, 0, 0.4),
    var(--y-holo-shift, 2px) 0 rgba(0, 255, 255, 0.4);
  transition: text-shadow 0.25s ease;
}
.y-btn-hologram:hover {
  text-shadow:
    calc(-2 * var(--y-holo-shift, 2px)) 0 rgba(255, 0, 0, 0.6),
    calc(2 * var(--y-holo-shift, 2px)) 0 rgba(0, 255, 255, 0.6),
    0 0 20px color-mix(in srgb, var(--y-btn-color) 40%, transparent);
}

/* ═══════════════════════════════════════════════════════════════════════
   KEYFRAMES
   ═══════════════════════════════════════════════════════════════════════ */

@keyframes y-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: var(--y-pulse-min, 0.6);
  }
}

@keyframes y-bounce {
  0%,
  100% {
    transform: translateY(calc(-1 * var(--y-bounce-y, 15%)));
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}

@keyframes y-shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(calc(-1 * var(--y-shake-x, 3px)));
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(var(--y-shake-x, 3px));
  }
}

@keyframes y-glow {
  0%,
  100% {
    box-shadow:
      0 0 5px var(--y-btn-color),
      0 0 var(--y-glow-spread-lo, 15px)
        color-mix(
          in srgb,
          var(--y-btn-color) var(--y-glow-mix-lo, 40%),
          transparent
        );
  }
  50% {
    box-shadow:
      0 0 15px var(--y-btn-color),
      0 0 var(--y-glow-spread-hi, 35px)
        color-mix(
          in srgb,
          var(--y-btn-color) var(--y-glow-mix-hi, 60%),
          transparent
        );
  }
}

@keyframes y-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes y-ripple-expand {
  to {
    transform: scale(var(--y-ripple-scale, 2.5));
    opacity: 0;
  }
}

@keyframes y-wobble {
  0% {
    transform: rotate(0deg);
  }
  15% {
    transform: rotate(var(--y-wobble-deg, 5deg));
  }
  30% {
    transform: rotate(calc(-0.8 * var(--y-wobble-deg, 5deg)));
  }
  45% {
    transform: rotate(calc(0.6 * var(--y-wobble-deg, 5deg)));
  }
  60% {
    transform: rotate(calc(-0.4 * var(--y-wobble-deg, 5deg)));
  }
  75% {
    transform: rotate(calc(0.2 * var(--y-wobble-deg, 5deg)));
  }
  100% {
    transform: rotate(0deg);
  }
}

@keyframes y-typewriter-blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

@keyframes y-breathe {
  0%,
  100% {
    transform: scale(var(--y-breathe-scale-lo, 0.95));
  }
  50% {
    transform: scale(var(--y-breathe-scale-hi, 1.05));
  }
}

@keyframes y-flicker {
  0%,
  100% {
    opacity: 1;
  }
  5% {
    opacity: var(--y-flicker-min, 0.6);
  }
  10% {
    opacity: 1;
  }
  15% {
    opacity: var(--y-flicker-min, 0.6);
  }
  20% {
    opacity: 1;
  }
  55% {
    opacity: 1;
  }
  57% {
    opacity: var(--y-flicker-min, 0.6);
  }
  60% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  82% {
    opacity: var(--y-flicker-min, 0.6);
  }
  85% {
    opacity: 1;
  }
}

@keyframes y-slide-in {
  from {
    opacity: 0;
    transform: translateX(calc(-1 * var(--y-slide-x, 20px)));
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes y-cyber-glitch {
  0% {
    transform: translate(0);
  }
  20% {
    transform: translate(-2px, 1px);
  }
  40% {
    transform: translate(2px, -1px);
  }
  60% {
    transform: translate(-1px, -1px);
  }
  80% {
    transform: translate(1px, 1px);
  }
  100% {
    transform: translate(0);
  }
}
</style>
