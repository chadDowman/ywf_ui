<script setup lang="ts">
import { computed } from "vue";
import { useDarkMode } from "@/composables/useDarkMode";
import type { YBreadcrumbProps, YBreadcrumbVariant } from "@/types/breadcrumb";
import { useAnimation } from '@/composables/useAnimation';
import { getAppearAnimationClasses } from '@/types/animation';

defineOptions({ name: "YBreadcrumb" });

const props = withDefaults(defineProps<YBreadcrumbProps>(), {
  variant: "simple",
  size: "md",
  separator: "/",
  maxItems: 0,
  animation: undefined,
});

const dk = useDarkMode(props.dark);
const anim = useAnimation(() => props.animation);
const appearTx = computed(() => getAppearAnimationClasses(anim.value));

type DisplayItem = { label: string; href?: string } | null;

const displayedItems = computed((): DisplayItem[] => {
  const items = props.items;
  const max = props.maxItems ?? 0;
  if (!max || items.length <= max) return [...items];
  const keep = max - 1;
  return [items[0], null, ...items.slice(items.length - keep)];
});

const sizeMap = {
  sm: { text: "text-xs", gap: "gap-1" },
  md: { text: "text-sm", gap: "gap-1.5" },
  lg: { text: "text-base", gap: "gap-2" },
};
const sc = computed(() => sizeMap[props.size ?? "md"]);

type Tokens = {
  separator: string;
  link: string;
  current: string;
};

const lightTokens: Record<YBreadcrumbVariant, Tokens> = {
  simple: {
    separator: "text-gray-400 select-none mx-1",
    link: "text-gray-500 hover:text-gray-900 transition-colors duration-150",
    current: "text-gray-900 font-medium",
  },
  outlined: {
    separator: "text-gray-300 select-none mx-1",
    link: "text-gray-500 hover:text-gray-800 px-2 py-0.5 rounded border border-transparent hover:border-gray-200 transition-all duration-150",
    current:
      "text-gray-800 font-medium px-2 py-0.5 rounded border border-gray-200 bg-gray-50",
  },
  pills: {
    separator: "text-gray-300 select-none mx-1",
    link: "text-gray-500 hover:text-gray-800 px-2.5 py-0.5 rounded-full hover:bg-gray-100 transition-all duration-150",
    current:
      "text-gray-800 font-medium px-2.5 py-0.5 rounded-full bg-gray-100",
  },
  ghost: {
    separator: "text-gray-200 select-none mx-1",
    link: "text-gray-400 hover:text-gray-700 transition-colors duration-150",
    current: "text-gray-700 font-medium",
  },
  underline: {
    separator: "text-gray-300 select-none mx-1",
    link: "text-gray-500 hover:text-gray-900 underline underline-offset-2 decoration-transparent hover:decoration-gray-400 transition-all duration-150",
    current:
      "text-gray-900 font-medium underline underline-offset-2 decoration-gray-400",
  },
  brutalist: {
    separator: "text-black font-black select-none mx-1",
    link: "text-black font-bold px-1 py-0.5 border-2 border-transparent hover:border-black hover:bg-yellow-300 transition-all duration-100",
    current: "text-black font-black px-1 py-0.5 border-2 border-black bg-yellow-300",
  },
  minimal: {
    separator: "text-gray-200 select-none mx-1",
    link: "text-gray-400 hover:text-gray-600 transition-colors duration-150",
    current: "text-gray-600",
  },
};

const darkTokens: Record<YBreadcrumbVariant, Tokens> = {
  simple: {
    separator: "text-slate-600 select-none mx-1",
    link: "text-slate-400 hover:text-slate-100 transition-colors duration-150",
    current: "text-slate-100 font-medium",
  },
  outlined: {
    separator: "text-slate-600 select-none mx-1",
    link: "text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded border border-transparent hover:border-slate-600 transition-all duration-150",
    current:
      "text-slate-200 font-medium px-2 py-0.5 rounded border border-slate-600 bg-slate-800",
  },
  pills: {
    separator: "text-slate-600 select-none mx-1",
    link: "text-slate-400 hover:text-slate-200 px-2.5 py-0.5 rounded-full hover:bg-slate-700 transition-all duration-150",
    current:
      "text-slate-200 font-medium px-2.5 py-0.5 rounded-full bg-slate-700",
  },
  ghost: {
    separator: "text-slate-700 select-none mx-1",
    link: "text-slate-500 hover:text-slate-200 transition-colors duration-150",
    current: "text-slate-200 font-medium",
  },
  underline: {
    separator: "text-slate-600 select-none mx-1",
    link: "text-slate-400 hover:text-slate-100 underline underline-offset-2 decoration-transparent hover:decoration-slate-500 transition-all duration-150",
    current:
      "text-slate-100 font-medium underline underline-offset-2 decoration-slate-500",
  },
  brutalist: {
    separator: "text-black font-black select-none mx-1",
    link: "text-black font-bold px-1 py-0.5 border-2 border-transparent hover:border-black hover:bg-yellow-300 transition-all duration-100",
    current: "text-black font-black px-1 py-0.5 border-2 border-black bg-yellow-300",
  },
  minimal: {
    separator: "text-slate-700 select-none mx-1",
    link: "text-slate-500 hover:text-slate-300 transition-colors duration-150",
    current: "text-slate-300",
  },
};

const tok = computed(
  () => (dk.value ? darkTokens : lightTokens)[props.variant ?? "simple"],
);
</script>

<template>
  <Transition
    appear
    :enter-active-class="appearTx.enterActive"
    :enter-from-class="appearTx.enterFrom"
    :enter-to-class="appearTx.enterTo"
    :leave-active-class="appearTx.leaveActive"
    :leave-from-class="appearTx.leaveFrom"
    :leave-to-class="appearTx.leaveTo"
  >
  <nav aria-label="Breadcrumb">
    <ol :class="['flex items-center flex-wrap', sc.gap]">
      <li
        v-for="(item, i) in displayedItems"
        :key="i"
        class="flex items-center"
      >
        <!-- Separator before every item except first -->
        <span
          v-if="i > 0"
          :class="[sc.text, tok.separator]"
          aria-hidden="true"
          >{{ separator }}</span
        >

        <!-- Ellipsis placeholder -->
        <span v-if="item === null" :class="[sc.text, 'text-gray-400 select-none']" aria-hidden="true"
          >&hellip;</span
        >

        <!-- Current page (last item) -->
        <span
          v-else-if="i === displayedItems.length - 1"
          :class="[sc.text, tok.current]"
          aria-current="page"
          >{{ item.label }}</span
        >

        <!-- Link item -->
        <template v-else>
          <a
            v-if="item.href"
            :href="item.href"
            :class="[sc.text, tok.link]"
            >{{ item.label }}</a
          >
          <span v-else :class="[sc.text, tok.link, 'cursor-default']">{{
            item.label
          }}</span>
        </template>
      </li>
    </ol>
  </nav>
  </Transition>
</template>
