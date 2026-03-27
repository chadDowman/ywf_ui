<script setup lang="ts">
import { computed } from "vue";
import type { YCardProps, ComponentSize } from "@/types";

const props = withDefaults(defineProps<YCardProps>(), {
  preset: "basic",
  padding: "md",
  bgColor: "#ffffff",
  borderColor: "#dbe3ef",
  textColor: "#0f172a",
  shadow: "md",
  bordered: true,
  rounded: "lg",

  // Basic
  title: "Card Title",
  body: "This is the card body content.",
  footerLabel: "Action",

  // Profile
  profileName: "Alexandra Moore",
  profileRole: "Senior Designer",
  profileBio: "Creating delightful digital experiences for 8+ years.",
  profileAvatarColor: "#6366f1",

  // Stats
  stats: () => [
    { label: "Revenue", value: "$48,295", change: "+12.4%" },
    { label: "Users", value: "8,431", change: "+3.2%" },
    { label: "Orders", value: "2,048", change: "-1.8%" },
  ],

  // Pricing
  pricingPlan: "Pro",
  pricingPrice: "$29",
  pricingPeriod: "/month",
  pricingFeatures: () => [
    "Unlimited projects",
    "Priority support",
    "Analytics dashboard",
  ],
  pricingCta: "Get started",
  pricingHighlight: true,
  accentColor: "#6366f1",

  // Notification
  notifTitle: "New message",
  notifBody: "You have a reply from Jordan about the design review.",
  notifTime: "2 min ago",
  notifType: "info",

  // Product
  productName: "Wireless Headphones",
  productPrice: "$149.00",
  productRating: 4,
  productBadge: "New",
  productImageColor: "#818cf8",

  // Article
  articleTitle: "The Future of Design Systems",
  articleExcerpt:
    "How component libraries are evolving to meet modern frontend demands.",
  articleAuthor: "Sam Rivera",
  articleDate: "Mar 26, 2026",
  articleCategory: "Design",
  articleCategoryColor: "#10b981",

  // Testimonial
  testQuote:
    "This product completely changed how our team collaborates. Absolutely indispensable.",
  testName: "Jamie Chen",
  testRole: "Head of Product, Acme Corp",
  testRating: 5,

  // Glass
  glassTitle: "Glass Card",
  glassBody: "Frosted glass with backdrop blur and translucent layers.",
  glassBg1: "#6366f1",
  glassBg2: "#ec4899",
  glassBlur: 16,
  glassOpacity: 0.2,

  // Gradient
  gradTitle: "Gradient Card",
  gradBody: "A vibrant card with a full gradient background.",
  gradStart: "#6366f1",
  gradEnd: "#ec4899",
  gradDir: "135deg",
  gradTextColor: "#111111",

  // Neumorphism
  neuTitle: "Neumorphic Card",
  neuBody: "Soft extruded UI with inset shadows.",
  neuBg: "#e8eaf0",
  neuAccent: "#6366f1",

  // Brutalist
  brutTitle: "BRUTALIST CARD",
  brutBody: "Raw. Bold. Unfiltered. Design with conviction.",
  brutBg: "#f9f24b",
  brutBorderColor: "#111111",
  brutTextColor: "#111111",
  brutThickness: 4,

  // Timeline
  timelineTitle: "Project Launch",
  timelineItems: () => [
    { label: "Design", done: true },
    { label: "Development", done: true },
    { label: "Testing", done: false },
    { label: "Deploy", done: false },
  ],
  timelineAccent: "#6366f1",

  // Kanban
  kanTitle: "Build landing page",
  kanTag: "Frontend",
  kanTagColor: "#6366f1",
  kanAssignee: "AX",
  kanDue: "Apr 2",
  kanPriority: "medium",

  // Weather
  wxCity: "Cape Town",
  wxTemp: "22°C",
  wxDesc: "Partly Cloudy",
  wxHigh: "26°C",
  wxLow: "17°C",
  wxIcon: "⛅",
  wxBg1: "#0ea5e9",
  wxBg2: "#38bdf8",
});

// ── Utility maps ──────────────────────────────────────────────────────
const paddingMap: Record<ComponentSize, string> = {
  xs: "p-2",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
  xl: "p-8",
};
const shadowMap: Record<string, string> = {
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
};
const roundedMap: Record<string, string> = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

// ── Base wrapper classes (for presets that use YCard shell) ───────────
const baseClasses = computed(() => [
  "overflow-hidden transition-all duration-200",
  paddingMap[props.padding],
  props.shadow !== false ? (shadowMap[String(props.shadow)] ?? "") : "",
  props.rounded !== false ? (roundedMap[String(props.rounded)] ?? "") : "",
  "ring-1 ring-slate-900/5 hover:-translate-y-0.5 hover:shadow-lg",
]);

const baseStyles = computed(() => ({
  backgroundColor: props.bgColor,
  borderColor: props.bordered ? props.borderColor : "transparent",
  borderWidth: props.bordered ? "1px" : "0",
  borderStyle: "solid",
  color: props.textColor,
  backdropFilter: "saturate(1.05)",
}));

// Shape helpers for non-YCard presets
const shapeClasses = computed(() => [
  "overflow-hidden",
  props.shadow !== false ? (shadowMap[String(props.shadow)] ?? "") : "",
  props.rounded !== false ? (roundedMap[String(props.rounded)] ?? "") : "",
]);

// ── Star helper ───────────────────────────────────────────────────────
function stars(n: number) {
  return (
    "★".repeat(Math.max(0, Math.min(5, n))) +
    "☆".repeat(5 - Math.max(0, Math.min(5, n)))
  );
}

// ── Notif colour ──────────────────────────────────────────────────────
const notifColors: Record<string, string> = {
  info: "#6366f1",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
};
const notifIcons: Record<string, string> = {
  info: "i",
  success: "✓",
  warning: "!",
  error: "✕",
};

// ── Profile initials ─────────────────────────────────────────────────
const profileInitials = computed(() =>
  (props.profileName ?? "")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2),
);

// ── Timeline progress ─────────────────────────────────────────────────
const tlProgress = computed(() => {
  const items = props.timelineItems ?? [];
  if (!items.length) return 0;
  return (items.filter((i) => i.done).length / items.length) * 100;
});

// ── Priority badge colours ────────────────────────────────────────────
const priorityBg: Record<string, string> = {
  low: "#dcfce7",
  medium: "#fef9c3",
  high: "#fee2e2",
};
const priorityText: Record<string, string> = {
  low: "#16a34a",
  medium: "#ca8a04",
  high: "#ef4444",
};
</script>

<template>
  <!-- ══════════════════════════════════════════════════════════════════
       1. BASIC
  ══════════════════════════════════════════════════════════════════ -->
  <div v-if="preset === 'basic'" :class="baseClasses" :style="baseStyles">
    <div v-if="$slots.header || title" class="mb-4">
      <slot name="header">
        <div class="font-bold text-base">{{ title }}</div>
      </slot>
    </div>
    <slot>
      <p class="text-sm leading-relaxed opacity-80">{{ body }}</p>
    </slot>
    <div
      v-if="$slots.footer || footerLabel"
      class="mt-4 pt-3"
      style="border-top: 1px solid rgba(0, 0, 0, 0.08)"
    >
      <slot name="footer">
        <button
          class="text-xs font-semibold px-3 py-1.5 rounded-md text-white"
          :style="{ background: accentColor ?? '#3b82f6' }"
        >
          {{ footerLabel }}
        </button>
      </slot>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════════════════════════
       2. PROFILE
  ══════════════════════════════════════════════════════════════════ -->
  <div
    v-else-if="preset === 'profile'"
    :class="baseClasses"
    :style="baseStyles"
    style="text-align: center"
  >
    <div
      class="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full text-white text-xl font-bold"
      :style="{ background: profileAvatarColor }"
    >
      {{ profileInitials }}
    </div>
    <div class="font-bold text-base">{{ profileName }}</div>
    <div class="text-xs mt-0.5 opacity-60 font-medium tracking-wide uppercase">
      {{ profileRole }}
    </div>
    <p class="text-sm mt-3 leading-relaxed opacity-70">{{ profileBio }}</p>
    <div class="mt-4 flex gap-2 justify-center">
      <button
        class="text-xs px-3 py-1.5 rounded-md font-medium text-white"
        :style="{ background: profileAvatarColor }"
      >
        Follow
      </button>
      <button
        class="text-xs px-3 py-1.5 rounded-md font-medium border"
        style="border-color: rgba(0, 0, 0, 0.12)"
      >
        Message
      </button>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════════════════════════
       3. STATS
  ══════════════════════════════════════════════════════════════════ -->
  <div v-else-if="preset === 'stats'" :class="baseClasses" :style="baseStyles">
    <div class="font-bold text-xs mb-4 opacity-50 uppercase tracking-wider">
      Performance
    </div>
    <div
      class="grid gap-4"
      :style="{ gridTemplateColumns: `repeat(${(stats ?? []).length}, 1fr)` }"
    >
      <div v-for="(s, i) in stats" :key="i" class="text-center">
        <div class="text-xl font-bold">{{ s.value }}</div>
        <div class="text-[10px] opacity-50 uppercase tracking-wide mt-0.5">
          {{ s.label }}
        </div>
        <div
          class="text-xs font-semibold mt-1"
          :style="{ color: s.change.startsWith('+') ? '#10b981' : '#ef4444' }"
        >
          {{ s.change }}
        </div>
      </div>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════════════════════════
       4. PRICING
  ══════════════════════════════════════════════════════════════════ -->
  <div
    v-else-if="preset === 'pricing'"
    :class="baseClasses"
    :style="{
      ...baseStyles,
      borderColor: pricingHighlight ? accentColor : baseStyles.borderColor,
      borderWidth: pricingHighlight ? '2px' : baseStyles.borderWidth,
      textAlign: 'center',
    }"
  >
    <div
      v-if="pricingHighlight"
      class="text-[10px] font-bold uppercase tracking-widest mb-3 px-2 py-1 rounded-full inline-block"
      :style="{ background: accentColor, color: '#fff' }"
    >
      Most Popular
    </div>
    <div class="font-bold text-lg">{{ pricingPlan }}</div>
    <div class="mt-2 mb-4">
      <span class="text-4xl font-black">{{ pricingPrice }}</span>
      <span class="text-sm opacity-50">{{ pricingPeriod }}</span>
    </div>
    <ul class="text-sm space-y-2 mb-5 text-left">
      <li
        v-for="(f, i) in pricingFeatures"
        :key="i"
        class="flex items-center gap-2"
      >
        <span :style="{ color: accentColor }">✓</span> {{ f }}
      </li>
    </ul>
    <button
      class="w-full py-2.5 rounded-lg text-sm font-bold text-white"
      :style="{ background: accentColor }"
    >
      {{ pricingCta }}
    </button>
  </div>

  <!-- ══════════════════════════════════════════════════════════════════
       5. NOTIFICATION
  ══════════════════════════════════════════════════════════════════ -->
  <div
    v-else-if="preset === 'notification'"
    :class="baseClasses"
    :style="baseStyles"
  >
    <div class="flex items-start gap-3">
      <div
        class="h-9 w-9 rounded-full flex items-center justify-center shrink-0 text-white text-sm font-bold"
        :style="{ background: notifColors[notifType ?? 'info'] }"
      >
        {{ notifIcons[notifType ?? "info"] }}
      </div>
      <div class="flex-1 min-w-0">
        <div class="font-semibold text-sm">{{ notifTitle }}</div>
        <div class="text-xs opacity-70 mt-0.5 leading-relaxed">
          {{ notifBody }}
        </div>
      </div>
      <div class="text-[10px] opacity-40 shrink-0 whitespace-nowrap">
        {{ notifTime }}
      </div>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════════════════════════
       6. PRODUCT
  ══════════════════════════════════════════════════════════════════ -->
  <div
    v-else-if="preset === 'product'"
    :class="[shapeClasses, 'overflow-hidden']"
    :style="{ ...baseStyles, padding: '0' }"
  >
    <div
      class="h-44 flex items-center justify-center text-6xl relative"
      :style="{ background: productImageColor }"
    >
      🎧
      <span
        v-if="productBadge"
        class="absolute top-3 left-3 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
        style="background: #111; color: #fff"
      >
        {{ productBadge }}
      </span>
    </div>
    <div
      :class="paddingMap[padding]"
      :style="{ background: bgColor, color: textColor }"
    >
      <div class="flex items-start justify-between gap-2">
        <div class="font-bold text-sm leading-tight">{{ productName }}</div>
        <div class="font-black text-base shrink-0">{{ productPrice }}</div>
      </div>
      <div class="text-amber-400 text-xs mt-1">
        {{ stars(productRating ?? 0) }}
      </div>
      <button
        class="mt-3 w-full py-2 rounded-lg text-xs font-bold text-white"
        style="background: #111"
      >
        Add to cart
      </button>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════════════════════════
       7. ARTICLE
  ══════════════════════════════════════════════════════════════════ -->
  <div
    v-else-if="preset === 'article'"
    :class="baseClasses"
    :style="baseStyles"
  >
    <div
      class="text-[10px] font-bold uppercase tracking-widest mb-2 px-2 py-0.5 rounded-full inline-block"
      :style="{ background: articleCategoryColor, color: '#fff' }"
    >
      {{ articleCategory }}
    </div>
    <h3 class="font-bold text-base leading-snug mt-2">{{ articleTitle }}</h3>
    <p class="text-sm opacity-60 mt-2 leading-relaxed">{{ articleExcerpt }}</p>
    <div class="mt-4 flex items-center gap-2">
      <div
        class="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
        :style="{ background: articleCategoryColor }"
      >
        {{ (articleAuthor ?? "?")[0] }}
      </div>
      <span class="text-xs font-medium opacity-70">{{ articleAuthor }}</span>
      <span class="text-xs opacity-40">· {{ articleDate }}</span>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════════════════════════
       8. TESTIMONIAL
  ══════════════════════════════════════════════════════════════════ -->
  <div
    v-else-if="preset === 'testimonial'"
    :class="baseClasses"
    :style="baseStyles"
  >
    <div class="text-3xl leading-none mb-3" :style="{ color: accentColor }">
      "
    </div>
    <p class="text-sm leading-relaxed italic opacity-80">{{ testQuote }}</p>
    <div class="mt-4 flex items-center justify-between">
      <div class="flex items-center gap-2.5">
        <div
          class="h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
          :style="{ background: accentColor }"
        >
          {{ (testName ?? "?")[0] }}
        </div>
        <div>
          <div class="text-xs font-semibold">{{ testName }}</div>
          <div class="text-[10px] opacity-50">{{ testRole }}</div>
        </div>
      </div>
      <div class="text-sm" :style="{ color: accentColor }">
        {{ stars(testRating ?? 5) }}
      </div>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════════════════════════
       9. GLASSMORPHISM
  ══════════════════════════════════════════════════════════════════ -->
  <div
    v-else-if="preset === 'glassmorphism'"
    :class="shapeClasses"
    style="position: relative; padding: 1px"
  >
    <div
      style="position: absolute; inset: 0; z-index: 0"
      :class="rounded !== false ? roundedMap[String(rounded)] : ''"
      :style="{
        background: `linear-gradient(135deg, ${glassBg1}, ${glassBg2})`,
      }"
    />
    <div
      class="relative z-10"
      :class="[
        rounded !== false ? roundedMap[String(rounded)] : '',
        paddingMap[padding],
      ]"
      :style="{
        background: `rgba(255,255,255,${glassOpacity})`,
        backdropFilter: `blur(${glassBlur}px)`,
        WebkitBackdropFilter: `blur(${glassBlur}px)`,
        border: '1px solid rgba(255,255,255,0.3)',
        color: textColor ?? '#111111',
      }"
    >
      <div class="font-bold text-base">{{ glassTitle }}</div>
      <p class="text-sm mt-2 leading-relaxed opacity-80">{{ glassBody }}</p>
      <button
        style="
          margin-top: 16px;
          background: rgba(255, 255, 255, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.4);
          color: #fff;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        "
      >
        Learn more
      </button>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════════════════════════
       10. GRADIENT
  ══════════════════════════════════════════════════════════════════ -->
  <div
    v-else-if="preset === 'gradient'"
    :class="[shapeClasses, paddingMap[padding]]"
    :style="{
      background: `linear-gradient(${gradDir}, ${gradStart}, ${gradEnd})`,
      color: gradTextColor,
    }"
  >
    <div class="font-black text-xl">{{ gradTitle }}</div>
    <p class="text-sm mt-2 leading-relaxed opacity-80">{{ gradBody }}</p>
    <button
      :style="{
        marginTop: '16px',
        background: 'rgba(255,255,255,0.2)',
        border: '1px solid rgba(255,255,255,0.3)',
        color: gradTextColor,
        padding: '8px 16px',
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: '600',
        cursor: 'pointer',
      }"
    >
      Explore →
    </button>
  </div>

  <!-- ══════════════════════════════════════════════════════════════════
       11. NEUMORPHISM
  ══════════════════════════════════════════════════════════════════ -->
  <div
    v-else-if="preset === 'neumorphism'"
    :class="[
      rounded !== false ? roundedMap[String(rounded)] : '',
      paddingMap[padding],
    ]"
    :style="{
      background: neuBg,
      boxShadow:
        '8px 8px 16px rgba(0,0,0,0.12), -8px -8px 16px rgba(255,255,255,0.8)',
    }"
  >
    <div class="font-bold text-base" :style="{ color: neuAccent }">
      {{ neuTitle }}
    </div>
    <p class="text-sm mt-2 leading-relaxed opacity-70">{{ neuBody }}</p>
    <div style="margin-top: 16px; display: flex; gap: 8px">
      <div
        :style="{
          background: neuBg,
          boxShadow:
            'inset 4px 4px 8px rgba(0,0,0,0.1),inset -4px -4px 8px rgba(255,255,255,0.7)',
          borderRadius: '8px',
          padding: '8px 14px',
          fontSize: '12px',
          fontWeight: '600',
          color: neuAccent,
          cursor: 'pointer',
        }"
      >
        Action
      </div>
      <div
        :style="{
          background: neuBg,
          boxShadow:
            'inset 4px 4px 8px rgba(0,0,0,0.1),inset -4px -4px 8px rgba(255,255,255,0.7)',
          borderRadius: '8px',
          padding: '8px 14px',
          fontSize: '12px',
          fontWeight: '600',
          opacity: '0.5',
          cursor: 'pointer',
        }"
      >
        Cancel
      </div>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════════════════════════
       12. BRUTALIST
  ══════════════════════════════════════════════════════════════════ -->
  <div
    v-else-if="preset === 'brutalist'"
    :style="{
      background: brutBg,
      border: `${brutThickness}px solid ${brutBorderColor}`,
      padding: '24px',
      color: brutTextColor,
      boxShadow: `${(brutThickness ?? 4) * 2}px ${(brutThickness ?? 4) * 2}px 0 ${brutBorderColor}`,
    }"
  >
    <div
      style="
        font-family: monospace;
        font-weight: 900;
        font-size: 18px;
        letter-spacing: -0.5px;
        text-transform: uppercase;
      "
    >
      {{ brutTitle }}
    </div>
    <div
      :style="{
        height: `${brutThickness}px`,
        background: brutBorderColor,
        margin: '12px 0',
      }"
    />
    <p style="font-size: 13px; line-height: 1.5; font-family: monospace">
      {{ brutBody }}
    </p>
    <button
      :style="{
        marginTop: '16px',
        background: brutBorderColor,
        color: brutBg,
        border: 'none',
        padding: '8px 16px',
        fontFamily: 'monospace',
        fontWeight: '900',
        fontSize: '12px',
        textTransform: 'uppercase',
        cursor: 'pointer',
      }"
    >
      DO IT →
    </button>
  </div>

  <!-- ══════════════════════════════════════════════════════════════════
       13. TIMELINE
  ══════════════════════════════════════════════════════════════════ -->
  <div
    v-else-if="preset === 'timeline'"
    :class="baseClasses"
    :style="baseStyles"
  >
    <div class="font-bold text-base mb-4">{{ timelineTitle }}</div>
    <div class="space-y-3">
      <div
        v-for="(item, i) in timelineItems"
        :key="i"
        class="flex items-center gap-3"
      >
        <div
          class="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 text-white"
          :style="{ background: item.done ? timelineAccent : '#d1d5db' }"
        >
          {{ item.done ? "✓" : i + 1 }}
        </div>
        <div
          class="text-sm transition-all"
          :style="{
            opacity: item.done ? '1' : '0.4',
            textDecoration: item.done ? 'line-through' : 'none',
          }"
        >
          {{ item.label }}
        </div>
      </div>
    </div>
    <div
      class="mt-4 h-1.5 rounded-full overflow-hidden"
      style="background: rgba(0, 0, 0, 0.08)"
    >
      <div
        class="h-full rounded-full transition-all duration-500"
        :style="{ width: tlProgress + '%', background: timelineAccent }"
      />
    </div>
  </div>

  <!-- ══════════════════════════════════════════════════════════════════
       14. KANBAN
  ══════════════════════════════════════════════════════════════════ -->
  <div v-else-if="preset === 'kanban'" :class="baseClasses" :style="baseStyles">
    <div class="flex items-center justify-between mb-2">
      <span
        class="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
        :style="{ background: kanTagColor, color: '#fff' }"
      >
        {{ kanTag }}
      </span>
      <span
        class="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
        :style="{
          background: priorityBg[kanPriority ?? 'medium'],
          color: priorityText[kanPriority ?? 'medium'],
        }"
      >
        {{ kanPriority }}
      </span>
    </div>
    <h3 class="font-semibold text-sm leading-snug mt-1">{{ kanTitle }}</h3>
    <div class="mt-3 flex items-center justify-between">
      <div
        class="h-6 w-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
        :style="{ background: kanTagColor }"
      >
        {{ kanAssignee }}
      </div>
      <span class="text-[10px] opacity-50">Due {{ kanDue }}</span>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════════════════════════
       15. WEATHER
  ══════════════════════════════════════════════════════════════════ -->
  <div
    v-else-if="preset === 'weather'"
    :class="[shapeClasses, paddingMap[padding]]"
    :style="{
      background: `linear-gradient(135deg, ${wxBg1}, ${wxBg2})`,
      color: textColor ?? '#111111',
    }"
  >
    <div class="flex items-start justify-between">
      <div>
        <div class="font-bold text-lg">{{ wxCity }}</div>
        <div class="text-sm opacity-70 mt-0.5">{{ wxDesc }}</div>
      </div>
      <span class="text-4xl">{{ wxIcon }}</span>
    </div>
    <div class="mt-6 text-6xl font-black tracking-tighter">{{ wxTemp }}</div>
    <div class="mt-4 flex gap-4 text-xs opacity-70">
      <span>↑ {{ wxHigh }}</span>
      <span>↓ {{ wxLow }}</span>
    </div>
  </div>
</template>

<style scoped></style>
