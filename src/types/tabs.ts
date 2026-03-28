<script setup lang="ts">
import { computed, ref, nextTick } from "vue";
import type { YTabsProps } from "../../types/tabs";

const props = withDefaults(defineProps<YTabsProps>(), {
  tabs: () => ["Overview", "Billing", "Usage"],
  variant: "underline",
  align: "left",
});

const active = defineModel<string>({ default: "" });
const tabRefs = ref<HTMLButtonElement[]>([]);

const effectiveActive = computed(() => active.value || props.tabs?.[0] || "");

const alignMap: Record<string, string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
  stretch: "",
};

const wrapperClass = computed(() => {
  const a = alignMap[props.align];

  const variantMap: Record<string, string> = {
    underline:  `flex border-b border-gray-200 ${a}`,
    pills:      `flex bg-gray-100 p-1 rounded-xl gap-1 ${a}`,
    boxed:      `flex border border-gray-200 divide-x divide-gray-200 rounded-lg overflow-hidden ${a}`,
    highlight:  `flex gap-1 ${a}`,
    brutal:     `flex border-[3px] border-black ${a}`,
    glass:      `flex ytabs-glass-wrapper gap-1 p-1.5 rounded-2xl ${a}`,
    neon:       `flex ytabs-neon-wrapper gap-2 p-1.5 rounded-lg ${a}`,
    soft:       `flex gap-1.5 ${a}`,
    chip:       `flex flex-wrap gap-2 ${a}`,
    retro:      `flex ytabs-retro-wrapper ${a}`,
    minimal:    `flex gap-6 border-b border-gray-100 ${a}`,
    floating:   `flex gap-2 ${a}`,
    aurora:     `flex ytabs-aurora-wrapper gap-1 p-1.5 rounded-2xl ${a}`,
    terminal:   `flex ytabs-terminal-wrapper p-1 gap-1 rounded-md ${a}`,
    dot:        `flex gap-5 border-b border-gray-100 ${a}`,
    folder:     `flex items-end gap-0 border-b border-gray-200 ${a}`,
    gradient:   `flex ytabs-gradient-wrapper p-1 gap-1 rounded-2xl ${a}`,
    outline:    `flex gap-2 ${a}`,
    ticker:     `flex ytabs-ticker-wrapper ${a}`,
  };

  return variantMap[props.variant] ?? `flex ${a}`;
});

function tabClass(tab: string, index: number = 0): string {
  const isActive = effectiveActive.value === tab;
  const stretch = props.align === "stretch" ? "flex-1 text-center" : "";

  type TabStyle = { base: string; active: string; inactive: string };
  const variants: Record<string, TabStyle> = {
    underline: {
      base: `px-4 py-2 text-sm font-medium transition-colors rounded-t-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 ${stretch}`,
      active: "border-b-2 border-blue-500 text-blue-600 -mb-px",
      inactive: "border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
    },
    pills: {
      base: `px-4 py-1.5 text-sm font-medium transition-all rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 ${stretch}`,
      active: "bg-white text-gray-900 shadow-sm",
      inactive: "text-gray-500 hover:text-gray-700",
    },
    boxed: {
      base: `px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400/50 ${stretch}`,
      active: "bg-gray-50 text-gray-900",
      inactive: "text-gray-500 hover:bg-gray-50",
    },
    highlight: {
      base: `px-4 py-2 text-sm font-medium transition-all rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 ${stretch}`,
      active: "bg-blue-500 text-white",
      inactive: "text-gray-500 hover:bg-gray-100",
    },
    brutal: {
      base: `px-5 py-2.5 text-xs font-black uppercase tracking-[0.14em] transition-all focus-visible:outline-none ${stretch}`,
      active: "bg-black text-white",
      inactive: "bg-white text-black border-r-[3px] border-black last:border-r-0 hover:bg-black hover:text-white",
    },
    glass: {
      base: `px-4 py-2 text-sm font-medium transition-all rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${stretch}`,
      active: "ytabs-glass-active",
      inactive: "ytabs-glass-inactive",
    },
    neon: {
      base: `px-4 py-2 text-xs font-bold font-mono uppercase tracking-widest transition-all rounded-md focus-visible:outline-none ${stretch}`,
      active: "ytabs-neon-active",
      inactive: "ytabs-neon-inactive",
    },
    soft: {
      base: `px-5 py-2 text-sm font-semibold transition-all rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 ${stretch}`,
      active: "ytabs-soft-active",
      inactive: "text-gray-400 hover:text-gray-600 hover:bg-gray-100",
    },
    chip: {
      base: `inline-flex items-center px-4 py-1.5 text-xs font-semibold transition-all rounded-full border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 ${stretch}`,
      active: "ytabs-chip-active",
      inactive: "border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700 bg-white",
    },
    retro: {
      base: `px-5 py-2 text-xs font-black font-mono uppercase tracking-[0.15em] transition-all border-r-2 border-[#c8820a] last:border-r-0 focus-visible:outline-none ${stretch}`,
      active: "ytabs-retro-active",
      inactive: "ytabs-retro-inactive",
    },
    minimal: {
      base: `pb-3 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 ${stretch}`,
      active: "text-gray-900 border-b-[1.5px] border-gray-900 -mb-px",
      inactive: "text-gray-400 hover:text-gray-600",
    },
    floating: {
      base: `px-4 py-2 text-sm font-medium transition-all rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 ${stretch}`,
      active: "ytabs-floating-active",
      inactive: "text-gray-500 hover:bg-gray-50 hover:text-gray-700",
    },
    aurora: {
      base: `px-4 py-2 text-sm font-medium transition-all rounded-xl focus-visible:outline-none ${stretch}`,
      active: "ytabs-aurora-active",
      inactive: "ytabs-aurora-inactive",
    },
    terminal: {
      base: `px-3 py-1.5 text-xs font-mono tracking-wide transition-all rounded focus-visible:outline-none ${stretch}`,
      active: "ytabs-terminal-active",
      inactive: "ytabs-terminal-inactive",
    },
    dot: {
      base: `pb-3 flex flex-col items-center gap-1.5 text-sm font-medium transition-all focus-visible:outline-none ${stretch}`,
      active: "text-indigo-600",
      inactive: "text-gray-400 hover:text-gray-600",
    },
    folder: {
      base: `px-5 pt-3 pb-2.5 text-sm font-medium transition-all focus-visible:outline-none ${stretch}`,
      active: "ytabs-folder-active",
      inactive: "ytabs-folder-inactive",
    },
    gradient: {
      base: `px-4 py-2 text-sm font-semibold transition-all rounded-xl focus-visible:outline-none ${stretch}`,
      active: "ytabs-gradient-active",
      inactive: "text-white/50 hover:text-white/80",
    },
    outline: {
      base: `px-4 py-2 text-sm font-medium transition-all rounded-lg border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 ${stretch}`,
      active: "border-indigo-500 text-indigo-600 bg-indigo-50",
      inactive: "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700",
    },
    ticker: {
      base: `px-5 py-2.5 text-xs font-black uppercase tracking-[0.12em] transition-all focus-visible:outline-none ${stretch}`,
      active: "ytabs-ticker-active",
      inactive: "ytabs-ticker-inactive",
    },
  };

  const v = variants[props.variant];
  if (!v) return "";
  return `${v.base} ${isActive ? v.active : v.inactive}`;
}

function setTabRef(el: Element | { $el?: Element } | null, idx: number) {
  if (el) tabRefs.value[idx] = el as HTMLButtonElement;
}

function activateByIndex(index: number) {
  const tabs = props.tabs ?? [];
  if (!tabs.length) return;
  const normalized = (index + tabs.length) % tabs.length;
  active.value = tabs[normalized];
  nextTick(() => tabRefs.value[normalized]?.focus());
}

function onKeydown(event: KeyboardEvent, index: number) {
  if (!props.tabs?.length) return;
  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
    event.preventDefault();
    activateByIndex(index + 1);
  } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
    event.preventDefault();
    activateByIndex(index - 1);
  } else if (event.key === "Home") {
    event.preventDefault();
    activateByIndex(0);
  } else if (event.key === "End") {
    event.preventDefault();
    activateByIndex((props.tabs?.length ?? 1) - 1);
  }
}

const chipColors = [
  { active: "ytabs-chip-0", dot: "#818cf8" },
  { active: "ytabs-chip-1", dot: "#34d399" },
  { active: "ytabs-chip-2", dot: "#fb923c" },
  { active: "ytabs-chip-3", dot: "#f472b6" },
  { active: "ytabs-chip-4", dot: "#60a5fa" },
];
function chipActiveClass(index: number) {
  return chipColors[index % chipColors.length].active;
}

const dotColors = ["#818cf8", "#34d399", "#fb923c", "#f472b6", "#60a5fa"];
</script>

<template>
  <div>

    <!-- NEON: needs dark outer shell -->
    <div v-if="variant === 'neon'" class="ytabs-neon-outer">
      <div :class="wrapperClass" role="tablist" aria-label="Tabs">
        <button
          v-for="(tab, index) in tabs" :key="tab"
          :ref="(el) => setTabRef(el, index)"
          :class="tabClass(tab, index)"
          role="tab" :aria-selected="effectiveActive === tab"
          :tabindex="effectiveActive === tab ? 0 : -1"
          :aria-controls="`panel-${index}`"
          @click="active = tab" @keydown="onKeydown($event, index)"
        >{{ tab }}</button>
      </div>
    </div>

    <!-- TERMINAL: macOS window chrome -->
    <div v-else-if="variant === 'terminal'" class="ytabs-terminal-outer">
      <div class="ytabs-terminal-titlebar">
        <span class="ytabs-terminal-dot ytabs-dot-red" />
        <span class="ytabs-terminal-dot ytabs-dot-yellow" />
        <span class="ytabs-terminal-dot ytabs-dot-green" />
      </div>
      <div :class="wrapperClass" role="tablist" aria-label="Tabs">
        <button
          v-for="(tab, index) in tabs" :key="tab"
          :ref="(el) => setTabRef(el, index)"
          :class="tabClass(tab, index)"
          role="tab" :aria-selected="effectiveActive === tab"
          :tabindex="effectiveActive === tab ? 0 : -1"
          :aria-controls="`panel-${index}`"
          @click="active = tab" @keydown="onKeydown($event, index)"
        >
          <span class="ytabs-terminal-prompt">$</span> {{ tab.toLowerCase() }}
        </button>
      </div>
    </div>

    <!-- GRADIENT: needs dark animated outer -->
    <div v-else-if="variant === 'gradient'" class="ytabs-gradient-outer">
      <div :class="wrapperClass" role="tablist" aria-label="Tabs">
        <button
          v-for="(tab, index) in tabs" :key="tab"
          :ref="(el) => setTabRef(el, index)"
          :class="tabClass(tab, index)"
          role="tab" :aria-selected="effectiveActive === tab"
          :tabindex="effectiveActive === tab ? 0 : -1"
          :aria-controls="`panel-${index}`"
          @click="active = tab" @keydown="onKeydown($event, index)"
        >{{ tab }}</button>
      </div>
    </div>

    <!-- TICKER: bold newspaper stock-ticker style -->
    <div v-else-if="variant === 'ticker'" class="ytabs-ticker-outer">
      <div :class="wrapperClass" role="tablist" aria-label="Tabs">
        <button
          v-for="(tab, index) in tabs" :key="tab"
          :ref="(el) => setTabRef(el, index)"
          :class="tabClass(tab, index)"
          role="tab" :aria-selected="effectiveActive === tab"
          :tabindex="effectiveActive === tab ? 0 : -1"
          :aria-controls="`panel-${index}`"
          @click="active = tab" @keydown="onKeydown($event, index)"
        >{{ tab }}</button>
      </div>
    </div>

    <!-- CHIP: per-tab colour dots -->
    <div v-else-if="variant === 'chip'" :class="wrapperClass" role="tablist" aria-label="Tabs">
      <button
        v-for="(tab, index) in tabs" :key="tab"
        :ref="(el) => setTabRef(el, index)"
        :class="[tabClass(tab, index), effectiveActive === tab ? chipActiveClass(index) : '']"
        role="tab" :aria-selected="effectiveActive === tab"
        :tabindex="effectiveActive === tab ? 0 : -1"
        :aria-controls="`panel-${index}`"
        @click="active = tab" @keydown="onKeydown($event, index)"
      >
        <span
          class="ytabs-chip-dot"
          :style="{
            background: chipColors[index % chipColors.length].dot,
            opacity: effectiveActive === tab ? 1 : 0.35,
          }"
        />
        {{ tab }}
      </button>
    </div>

    <!-- DOT: colour pip above label -->
    <div v-else-if="variant === 'dot'" :class="wrapperClass" role="tablist" aria-label="Tabs">
      <button
        v-for="(tab, index) in tabs" :key="tab"
        :ref="(el) => setTabRef(el, index)"
        :class="tabClass(tab, index)"
        role="tab" :aria-selected="effectiveActive === tab"
        :tabindex="effectiveActive === tab ? 0 : -1"
        :aria-controls="`panel-${index}`"
        @click="active = tab" @keydown="onKeydown($event, index)"
      >
        <span
          class="ytabs-dot-pip"
          :style="{
            background: dotColors[index % dotColors.length],
            opacity: effectiveActive === tab ? 1 : 0,
            transform: effectiveActive === tab ? 'scale(1)' : 'scale(0.4)',
          }"
        />
        {{ tab }}
      </button>
    </div>

    <!-- ALL OTHER VARIANTS -->
    <div v-else :class="wrapperClass" role="tablist" aria-label="Tabs">
      <button
        v-for="(tab, index) in tabs" :key="tab"
        :ref="(el) => setTabRef(el, index)"
        :class="tabClass(tab, index)"
        role="tab" :aria-selected="effectiveActive === tab"
        :tabindex="effectiveActive === tab ? 0 : -1"
        :aria-controls="`panel-${index}`"
        @click="active = tab" @keydown="onKeydown($event, index)"
      >{{ tab }}</button>
    </div>

    <slot />
  </div>
</template>

<style scoped>
/* ═══════════════════════════════ GLASS ════════════════════════════════ */
.ytabs-glass-wrapper {
  background: rgba(255,255,255,0.25);
  backdrop-filter: blur(16px) saturate(160%);
  -webkit-backdrop-filter: blur(16px) saturate(160%);
  border: 1px solid rgba(255,255,255,0.45);
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
}
.ytabs-glass-active {
  background: rgba(255,255,255,0.85);
  color: #1e293b;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
}
.ytabs-glass-inactive { color: rgba(100,116,139,0.9); }
.ytabs-glass-inactive:hover { background: rgba(255,255,255,0.45); color: #334155; }

/* ═══════════════════════════════ NEON ═════════════════════════════════ */
.ytabs-neon-outer { display: inline-block; }
.ytabs-neon-wrapper {
  background: #070a0f;
  border: 1px solid rgba(74,222,128,0.2);
  box-shadow: 0 0 20px rgba(74,222,128,0.06);
}
.ytabs-neon-active {
  background: rgba(74,222,128,0.1);
  color: #4ade80;
  box-shadow: 0 0 12px rgba(74,222,128,0.25), inset 0 0 8px rgba(74,222,128,0.08);
  text-shadow: 0 0 10px rgba(74,222,128,0.6);
  border: 1px solid rgba(74,222,128,0.35);
}
.ytabs-neon-inactive { color: rgba(74,222,128,0.35); border: 1px solid transparent; }
.ytabs-neon-inactive:hover { color: rgba(74,222,128,0.65); border-color: rgba(74,222,128,0.15); background: rgba(74,222,128,0.04); }

/* ═══════════════════════════════ SOFT ═════════════════════════════════ */
.ytabs-soft-active {
  background: linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%);
  color: #4338ca;
  box-shadow: 0 2px 8px rgba(99,102,241,0.18);
}

/* ═══════════════════════════════ CHIP ═════════════════════════════════ */
.ytabs-chip-dot {
  display: inline-block; width: 6px; height: 6px;
  border-radius: 9999px; margin-right: 5px; flex-shrink: 0;
  transition: opacity 150ms ease;
}
.ytabs-chip-active { border-color: transparent; box-shadow: 0 1px 4px rgba(0,0,0,0.12); }
.ytabs-chip-0 { background: #eef2ff; color: #4338ca; border-color: #c7d2fe; }
.ytabs-chip-1 { background: #ecfdf5; color: #065f46; border-color: #a7f3d0; }
.ytabs-chip-2 { background: #fff7ed; color: #9a3412; border-color: #fed7aa; }
.ytabs-chip-3 { background: #fdf2f8; color: #9d174d; border-color: #fbcfe8; }
.ytabs-chip-4 { background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe; }

/* ═══════════════════════════════ RETRO ════════════════════════════════ */
.ytabs-retro-wrapper {
  background: #0d0a00;
  border: 2px solid #c8820a;
  box-shadow: 4px 4px 0 #c8820a;
  background-image: repeating-linear-gradient(
    0deg, transparent, transparent 3px,
    rgba(255,180,0,0.018) 3px, rgba(255,180,0,0.018) 4px
  );
}
.ytabs-retro-active {
  background: rgba(255,180,0,0.12);
  color: #ffdd66;
  text-shadow: 0 0 10px rgba(255,200,0,0.5);
}
.ytabs-retro-inactive { color: #a06810; }
.ytabs-retro-inactive:hover { background: rgba(255,180,0,0.06); color: #d4a040; }

/* ═════════════════════════════ FLOATING ══════════════════════════════ */
.ytabs-floating-active {
  background: white;
  color: #6d28d9;
  box-shadow:
    0 4px 16px rgba(109,40,217,0.14),
    0 1px 4px rgba(109,40,217,0.08);
  transform: translateY(-1px);
}

/* ══════════════════════════════ AURORA ════════════════════════════════ */
.ytabs-aurora-wrapper {
  background: linear-gradient(135deg, #0f0f2e 0%, #1a0a3d 50%, #0a1a2e 100%);
  border: 1px solid rgba(139,92,246,0.25);
  box-shadow: 0 0 30px rgba(99,102,241,0.1);
  position: relative;
  overflow: hidden;
}
.ytabs-aurora-wrapper::before {
  content: '';
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.15) 0%, transparent 70%);
  pointer-events: none;
}
.ytabs-aurora-active {
  background: linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3));
  color: #e0d7ff;
  box-shadow: 0 0 16px rgba(139,92,246,0.2);
  border: 1px solid rgba(139,92,246,0.3);
}
.ytabs-aurora-inactive { color: rgba(167,139,250,0.45); border: 1px solid transparent; }
.ytabs-aurora-inactive:hover { color: rgba(196,181,253,0.8); background: rgba(139,92,246,0.08); }

/* ════════════════════════════ TERMINAL ════════════════════════════════ */
.ytabs-terminal-outer {
  background: #0e1117;
  border: 1px solid #30363d;
  border-radius: 8px;
  overflow: hidden;
  display: inline-block;
}
.ytabs-terminal-titlebar {
  display: flex; gap: 6px; align-items: center;
  padding: 8px 12px;
  background: #161b22;
  border-bottom: 1px solid #30363d;
}
.ytabs-terminal-dot { width: 10px; height: 10px; border-radius: 9999px; }
.ytabs-dot-red    { background: #ff5f57; }
.ytabs-dot-yellow { background: #ffbd2e; }
.ytabs-dot-green  { background: #28c840; }
.ytabs-terminal-wrapper { background: #0e1117; }
.ytabs-terminal-prompt { color: #238636; margin-right: 4px; font-weight: 700; }
.ytabs-terminal-active {
  background: rgba(35,134,54,0.15);
  color: #3fb950;
  border: 1px solid rgba(35,134,54,0.3);
}
.ytabs-terminal-inactive { color: #484f58; border: 1px solid transparent; }
.ytabs-terminal-inactive:hover { color: #8b949e; background: rgba(48,54,61,0.5); }

/* ══════════════════════════════ DOT ═══════════════════════════════════ */
.ytabs-dot-pip {
  display: block; width: 6px; height: 6px; border-radius: 9999px;
  transition: opacity 200ms ease, transform 200ms cubic-bezier(0.34,1.56,0.64,1);
}

/* ════════════════════════════ FOLDER ══════════════════════════════════ */
.ytabs-folder-active {
  background: white;
  color: #1e293b;
  border: 1px solid #e2e8f0;
  border-bottom: 2px solid white;
  border-radius: 8px 8px 0 0;
  font-weight: 600;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.04);
  position: relative; z-index: 1;
  margin-bottom: -1px;
}
.ytabs-folder-inactive {
  background: #f8fafc;
  color: #94a3b8;
  border: 1px solid #e2e8f0;
  border-bottom: none;
  border-radius: 8px 8px 0 0;
}
.ytabs-folder-inactive:hover { background: #f1f5f9; color: #64748b; }

/* ════════════════════════════ GRADIENT ════════════════════════════════ */
.ytabs-gradient-outer { display: inline-block; }
.ytabs-gradient-wrapper {
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%);
  background-size: 200% 200%;
  animation: ytabs-gradient-shift 6s ease infinite;
  border: 1px solid rgba(165,180,252,0.15);
  box-shadow: 0 4px 24px rgba(99,102,241,0.2);
}
@keyframes ytabs-gradient-shift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.ytabs-gradient-active {
  background: rgba(255,255,255,0.15);
  color: white;
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2);
}

/* ════════════════════════════ TICKER ══════════════════════════════════ */
.ytabs-ticker-outer { display: inline-block; }
.ytabs-ticker-wrapper {
  border: 3px solid #000;
  box-shadow: 5px 5px 0 #000;
  overflow: hidden;
}
.ytabs-ticker-active { background: #000; color: #fff; }
.ytabs-ticker-inactive { background: #fff; color: #000; border-right: 3px solid #000; }
.ytabs-ticker-inactive:last-child { border-right: none; }
.ytabs-ticker-inactive:hover { background: #f0f0f0; }
</style>