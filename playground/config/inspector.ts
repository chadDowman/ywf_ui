import {
  buttonAnimationOptions,
  buttonEffectOptions,
  buttonIntensityOptions,
  buttonPresets,
  buttonRoundedOptions,
  buttonShadowOptions,
  buttonSizes,
  buttonVariants,
} from "./buttonInspect";
import { cardPresets } from "./cardInspect";
import {
  dropdownPlacements,
  dropdownSizes,
  dropdownVariants,
} from "./dropdownInspect";
import { navbarVariants } from "./navbarInspect";
import {
  avatarPresets,
  avatarRings,
  avatarShapes,
  avatarSizes,
  avatarStatuses,
} from "./avatarInspect";
import {
  alertTypes,
  alertVariants,
  alertSizes,
  alertIntensities,
  alertRadii,
} from "./alertInspect";
import {
  badgeVariants,
  badgeSizes,
  badgeColors,
  badgeRadii,
} from "./badgeInspect";
import {
  inputTypes,
  inputVariants,
  inputSizes,
  inputRadii,
  inputStates,
} from "./inputInspect";
import {
  textareaVariants,
  textareaSizes,
  textareaRadii,
  textareaStates,
  textareaResizes,
} from "./textareaInspect";
import {
  playgroundModalSizes,
  playgroundModalVariants,
  playgroundModalPositions,
  playgroundModalBackdrops,
  playgroundModalPaddings,
} from "./modalInspect";
import {
  sidebarVariants,
  sidebarPositions,
  sidebarSizes,
  sidebarBehaviors,
  sidebarCollapsedModes,
} from "./sidebarInspect";
import { tabsVariants, tabsAligns } from "./tabsInspect";
import { tooltipPlacements, tooltipVariants } from "./tooltipInspect";
import {
  checkboxSizes,
  checkboxVariants,
  checkboxRadii,
} from "./checkboxInspect";
import { radioSizes, radioVariants } from "./radioInspect";
import { switchSizes, switchVariants } from "./switchInspect";
import { selectSizes, selectVariants, selectRadii } from "./selectInspect";
import { spinnerSizes, spinnerVariants, spinnerSpeeds } from "./spinnerInspect";
import { skeletonVariants, skeletonRadii } from "./skeletonInspect";
import { tableVariants, tableSizes } from "./tableInspect";
import { paginationVariants, paginationSizes } from "./paginationInspect";
import { progressVariants, progressSizes } from "./progressInspect";
import { toastTypes, toastVariants, toastRadii } from "./toastInspect";
import { accordionVariants, accordionRadii } from "./accordionInspect";
import type { PlaygroundInspectorConfig } from "./types";

const navbarAlignOptions = ["left", "center", "right", "spread"] as const;
const cardNotificationTypes = ["info", "success", "warning", "error"] as const;
const cardPriorityOptions = ["low", "medium", "high"] as const;
const falseOrPresetOptions = [false, ...buttonPresets] as const;
const falseOrAnimationOptions = [false, ...buttonAnimationOptions] as const;
const falseOrEffectOptions = [false, ...buttonEffectOptions] as const;
const falseOrShadowOptions = [false, ...buttonShadowOptions.slice(1)] as const;
const falseOrRoundedOptions = [
  false,
  ...buttonRoundedOptions.slice(1),
] as const;

export const playgroundInspectorConfigs: readonly PlaygroundInspectorConfig[] =
  [
    {
      componentId: "YButton",
      strict: true,
      sections: [
        { id: "content", title: "Content" },
        { id: "appearance", title: "Appearance" },
        { id: "colors", title: "Colors" },
        { id: "motion", title: "Motion" },
        { id: "state", title: "State" },
      ],
      controls: [
        { key: "label", label: "Button Label", section: "content" },
        {
          key: "preset",
          section: "appearance",
          editor: "select",
          options: falseOrPresetOptions,
        },
        {
          key: "variant",
          section: "appearance",
          editor: "select",
          options: buttonVariants,
        },
        {
          key: "size",
          section: "appearance",
          editor: "select",
          options: buttonSizes,
        },
        {
          key: "padding",
          section: "appearance",
          editor: "select",
          options: buttonSizes,
        },
        {
          key: "shadow",
          section: "appearance",
          editor: "select",
          options: falseOrShadowOptions,
        },
        {
          key: "rounded",
          section: "appearance",
          editor: "select",
          options: falseOrRoundedOptions,
        },
        {
          key: "color",
          label: "Background Color",
          section: "colors",
          editor: "color",
        },
        {
          key: "textColor",
          label: "Text Color",
          section: "colors",
          editor: "color",
        },
        {
          key: "animation",
          section: "motion",
          editor: "select",
          options: falseOrAnimationOptions,
        },
        {
          key: "animationIntensity",
          label: "Animation Intensity",
          section: "motion",
          editor: "select",
          options: buttonIntensityOptions,
          visibleWhen: { key: "animation", notEquals: false },
        },
        {
          key: "effect",
          section: "motion",
          editor: "select",
          options: falseOrEffectOptions,
        },
        {
          key: "effectIntensity",
          label: "Effect Intensity",
          section: "motion",
          editor: "select",
          options: buttonIntensityOptions,
          visibleWhen: { key: "effect", notEquals: false },
        },
        { key: "disabled", section: "state", editor: "boolean" },
      ],
      init(next) {
        if (next.label === undefined) next.label = "Click Me";
      },
    },
    {
      componentId: "YCard",
      strict: true,
      sections: [
        { id: "preset", title: "Preset" },
        { id: "layout", title: "Layout" },
        { id: "content", title: "Content" },
        { id: "colors", title: "Colors" },
        { id: "data", title: "Data" },
        { id: "state", title: "State" },
      ],
      controls: [
        {
          key: "preset",
          section: "preset",
          editor: "select",
          options: cardPresets,
        },
        {
          key: "padding",
          section: "layout",
          editor: "select",
          options: buttonSizes,
        },
        {
          key: "shadow",
          section: "layout",
          editor: "select",
          options: falseOrShadowOptions,
        },
        {
          key: "rounded",
          section: "layout",
          editor: "select",
          options: falseOrRoundedOptions,
        },
        { key: "bordered", section: "layout", editor: "boolean" },
        {
          key: "bgColor",
          label: "Background Color",
          section: "colors",
          editor: "color",
        },
        {
          key: "borderColor",
          label: "Border Color",
          section: "colors",
          editor: "color",
        },
        {
          key: "textColor",
          label: "Text Color",
          section: "colors",
          editor: "color",
        },

        {
          key: "title",
          section: "content",
          visibleWhen: { key: "preset", equals: "basic" },
        },
        {
          key: "body",
          section: "content",
          editor: "textarea",
          rows: 4,
          visibleWhen: { key: "preset", equals: "basic" },
        },
        {
          key: "footerLabel",
          label: "Footer Label",
          section: "content",
          visibleWhen: { key: "preset", equals: "basic" },
        },

        {
          key: "profileName",
          label: "Name",
          section: "content",
          visibleWhen: { key: "preset", equals: "profile" },
        },
        {
          key: "profileRole",
          label: "Role",
          section: "content",
          visibleWhen: { key: "preset", equals: "profile" },
        },
        {
          key: "profileBio",
          label: "Bio",
          section: "content",
          editor: "textarea",
          rows: 4,
          visibleWhen: { key: "preset", equals: "profile" },
        },
        {
          key: "profileAvatarColor",
          label: "Avatar Color",
          section: "colors",
          editor: "color",
          visibleWhen: { key: "preset", equals: "profile" },
        },

        {
          key: "stats",
          section: "data",
          editor: "json",
          rows: 5,
          visibleWhen: { key: "preset", equals: "stats" },
        },

        {
          key: "pricingPlan",
          label: "Plan",
          section: "content",
          visibleWhen: { key: "preset", equals: "pricing" },
        },
        {
          key: "pricingPrice",
          label: "Price",
          section: "content",
          visibleWhen: { key: "preset", equals: "pricing" },
        },
        {
          key: "pricingPeriod",
          label: "Period",
          section: "content",
          visibleWhen: { key: "preset", equals: "pricing" },
        },
        {
          key: "pricingFeatures",
          label: "Features",
          section: "data",
          editor: "json",
          rows: 5,
          visibleWhen: { key: "preset", equals: "pricing" },
        },
        {
          key: "pricingCta",
          label: "CTA Label",
          section: "content",
          visibleWhen: { key: "preset", equals: "pricing" },
        },
        {
          key: "pricingHighlight",
          label: "Highlight Plan",
          section: "state",
          editor: "boolean",
          visibleWhen: { key: "preset", equals: "pricing" },
        },
        {
          key: "accentColor",
          label: "Accent Color",
          section: "colors",
          editor: "color",
          visibleWhen: { key: "preset", in: ["pricing", "testimonial"] },
        },

        {
          key: "notifTitle",
          label: "Title",
          section: "content",
          visibleWhen: { key: "preset", equals: "notification" },
        },
        {
          key: "notifBody",
          label: "Body",
          section: "content",
          editor: "textarea",
          rows: 4,
          visibleWhen: { key: "preset", equals: "notification" },
        },
        {
          key: "notifTime",
          label: "Time",
          section: "content",
          visibleWhen: { key: "preset", equals: "notification" },
        },
        {
          key: "notifType",
          label: "Notification Type",
          section: "state",
          editor: "select",
          options: cardNotificationTypes,
          visibleWhen: { key: "preset", equals: "notification" },
        },

        {
          key: "productName",
          label: "Product Name",
          section: "content",
          visibleWhen: { key: "preset", equals: "product" },
        },
        {
          key: "productPrice",
          label: "Price",
          section: "content",
          visibleWhen: { key: "preset", equals: "product" },
        },
        {
          key: "productRating",
          label: "Rating",
          section: "data",
          editor: "number",
          visibleWhen: { key: "preset", equals: "product" },
        },
        {
          key: "productBadge",
          label: "Badge",
          section: "content",
          visibleWhen: { key: "preset", equals: "product" },
        },
        {
          key: "productImageColor",
          label: "Image Color",
          section: "colors",
          editor: "color",
          visibleWhen: { key: "preset", equals: "product" },
        },

        {
          key: "articleTitle",
          label: "Title",
          section: "content",
          visibleWhen: { key: "preset", equals: "article" },
        },
        {
          key: "articleExcerpt",
          label: "Excerpt",
          section: "content",
          editor: "textarea",
          rows: 4,
          visibleWhen: { key: "preset", equals: "article" },
        },
        {
          key: "articleAuthor",
          label: "Author",
          section: "content",
          visibleWhen: { key: "preset", equals: "article" },
        },
        {
          key: "articleDate",
          label: "Date",
          section: "content",
          visibleWhen: { key: "preset", equals: "article" },
        },
        {
          key: "articleCategory",
          label: "Category",
          section: "content",
          visibleWhen: { key: "preset", equals: "article" },
        },
        {
          key: "articleCategoryColor",
          label: "Category Color",
          section: "colors",
          editor: "color",
          visibleWhen: { key: "preset", equals: "article" },
        },

        {
          key: "testQuote",
          label: "Quote",
          section: "content",
          editor: "textarea",
          rows: 4,
          visibleWhen: { key: "preset", equals: "testimonial" },
        },
        {
          key: "testName",
          label: "Name",
          section: "content",
          visibleWhen: { key: "preset", equals: "testimonial" },
        },
        {
          key: "testRole",
          label: "Role",
          section: "content",
          visibleWhen: { key: "preset", equals: "testimonial" },
        },
        {
          key: "testRating",
          label: "Rating",
          section: "data",
          editor: "number",
          visibleWhen: { key: "preset", equals: "testimonial" },
        },

        {
          key: "glassTitle",
          label: "Title",
          section: "content",
          visibleWhen: { key: "preset", equals: "glassmorphism" },
        },
        {
          key: "glassBody",
          label: "Body",
          section: "content",
          editor: "textarea",
          rows: 4,
          visibleWhen: { key: "preset", equals: "glassmorphism" },
        },
        {
          key: "glassBg1",
          label: "Gradient Start",
          section: "colors",
          editor: "color",
          visibleWhen: { key: "preset", equals: "glassmorphism" },
        },
        {
          key: "glassBg2",
          label: "Gradient End",
          section: "colors",
          editor: "color",
          visibleWhen: { key: "preset", equals: "glassmorphism" },
        },
        {
          key: "glassBlur",
          label: "Blur",
          section: "data",
          editor: "number",
          visibleWhen: { key: "preset", equals: "glassmorphism" },
        },
        {
          key: "glassOpacity",
          label: "Opacity",
          section: "data",
          editor: "number",
          visibleWhen: { key: "preset", equals: "glassmorphism" },
        },

        {
          key: "gradTitle",
          label: "Title",
          section: "content",
          visibleWhen: { key: "preset", equals: "gradient" },
        },
        {
          key: "gradBody",
          label: "Body",
          section: "content",
          editor: "textarea",
          rows: 4,
          visibleWhen: { key: "preset", equals: "gradient" },
        },
        {
          key: "gradStart",
          label: "Gradient Start",
          section: "colors",
          editor: "color",
          visibleWhen: { key: "preset", equals: "gradient" },
        },
        {
          key: "gradEnd",
          label: "Gradient End",
          section: "colors",
          editor: "color",
          visibleWhen: { key: "preset", equals: "gradient" },
        },
        {
          key: "gradDir",
          label: "Gradient Direction",
          section: "content",
          visibleWhen: { key: "preset", equals: "gradient" },
        },
        {
          key: "gradTextColor",
          label: "Text Color",
          section: "colors",
          editor: "color",
          visibleWhen: { key: "preset", equals: "gradient" },
        },

        {
          key: "neuTitle",
          label: "Title",
          section: "content",
          visibleWhen: { key: "preset", equals: "neumorphism" },
        },
        {
          key: "neuBody",
          label: "Body",
          section: "content",
          editor: "textarea",
          rows: 4,
          visibleWhen: { key: "preset", equals: "neumorphism" },
        },
        {
          key: "neuBg",
          label: "Background Color",
          section: "colors",
          editor: "color",
          visibleWhen: { key: "preset", equals: "neumorphism" },
        },
        {
          key: "neuAccent",
          label: "Accent Color",
          section: "colors",
          editor: "color",
          visibleWhen: { key: "preset", equals: "neumorphism" },
        },

        {
          key: "brutTitle",
          label: "Title",
          section: "content",
          visibleWhen: { key: "preset", equals: "brutalist" },
        },
        {
          key: "brutBody",
          label: "Body",
          section: "content",
          editor: "textarea",
          rows: 4,
          visibleWhen: { key: "preset", equals: "brutalist" },
        },
        {
          key: "brutBg",
          label: "Background Color",
          section: "colors",
          editor: "color",
          visibleWhen: { key: "preset", equals: "brutalist" },
        },
        {
          key: "brutBorderColor",
          label: "Border Color",
          section: "colors",
          editor: "color",
          visibleWhen: { key: "preset", equals: "brutalist" },
        },
        {
          key: "brutTextColor",
          label: "Text Color",
          section: "colors",
          editor: "color",
          visibleWhen: { key: "preset", equals: "brutalist" },
        },
        {
          key: "brutThickness",
          label: "Border Thickness",
          section: "data",
          editor: "number",
          visibleWhen: { key: "preset", equals: "brutalist" },
        },

        {
          key: "timelineTitle",
          label: "Title",
          section: "content",
          visibleWhen: { key: "preset", equals: "timeline" },
        },
        {
          key: "timelineItems",
          label: "Timeline Items",
          section: "data",
          editor: "json",
          rows: 5,
          visibleWhen: { key: "preset", equals: "timeline" },
        },
        {
          key: "timelineAccent",
          label: "Accent Color",
          section: "colors",
          editor: "color",
          visibleWhen: { key: "preset", equals: "timeline" },
        },

        {
          key: "kanTitle",
          label: "Task Title",
          section: "content",
          visibleWhen: { key: "preset", equals: "kanban" },
        },
        {
          key: "kanTag",
          label: "Tag",
          section: "content",
          visibleWhen: { key: "preset", equals: "kanban" },
        },
        {
          key: "kanTagColor",
          label: "Tag Color",
          section: "colors",
          editor: "color",
          visibleWhen: { key: "preset", equals: "kanban" },
        },
        {
          key: "kanAssignee",
          label: "Assignee",
          section: "content",
          visibleWhen: { key: "preset", equals: "kanban" },
        },
        {
          key: "kanDue",
          label: "Due Date",
          section: "content",
          visibleWhen: { key: "preset", equals: "kanban" },
        },
        {
          key: "kanPriority",
          label: "Priority",
          section: "state",
          editor: "select",
          options: cardPriorityOptions,
          visibleWhen: { key: "preset", equals: "kanban" },
        },

        {
          key: "wxCity",
          label: "City",
          section: "content",
          visibleWhen: { key: "preset", equals: "weather" },
        },
        {
          key: "wxTemp",
          label: "Temperature",
          section: "content",
          visibleWhen: { key: "preset", equals: "weather" },
        },
        {
          key: "wxDesc",
          label: "Description",
          section: "content",
          visibleWhen: { key: "preset", equals: "weather" },
        },
        {
          key: "wxHigh",
          label: "High",
          section: "content",
          visibleWhen: { key: "preset", equals: "weather" },
        },
        {
          key: "wxLow",
          label: "Low",
          section: "content",
          visibleWhen: { key: "preset", equals: "weather" },
        },
        {
          key: "wxIcon",
          label: "Icon",
          section: "content",
          visibleWhen: { key: "preset", equals: "weather" },
        },
        {
          key: "wxBg1",
          label: "Gradient Start",
          section: "colors",
          editor: "color",
          visibleWhen: { key: "preset", equals: "weather" },
        },
        {
          key: "wxBg2",
          label: "Gradient End",
          section: "colors",
          editor: "color",
          visibleWhen: { key: "preset", equals: "weather" },
        },
      ],
    },
    {
      componentId: "YDropdown",
      strict: true,
      sections: [
        { id: "trigger", title: "Trigger" },
        { id: "menu", title: "Menu" },
        { id: "behavior", title: "Behavior" },
        { id: "data", title: "Data" },
      ],
      controls: [
        { key: "label", section: "trigger" },
        {
          key: "variant",
          section: "trigger",
          editor: "select",
          options: dropdownVariants,
        },
        {
          key: "size",
          section: "trigger",
          editor: "select",
          options: dropdownSizes,
        },
        { key: "disabled", section: "behavior", editor: "boolean" },
        {
          key: "splitLabel",
          label: "Split Button Label",
          section: "trigger",
          visibleWhen: { key: "variant", equals: "split" },
        },
        {
          key: "placeholder",
          section: "menu",
          visibleWhen: {
            key: "variant",
            in: ["searchable", "command-palette"],
          },
        },
        {
          key: "placement",
          section: "menu",
          editor: "select",
          options: dropdownPlacements,
        },
        { key: "maxHeight", label: "Max Height", section: "menu" },
        { key: "items", section: "data", editor: "json", rows: 6 },
        {
          key: "modelValue",
          label: "Selected Value",
          section: "data",
          editor: "json",
          rows: 3,
        },
        {
          key: "closeOnSelect",
          label: "Close On Select",
          section: "behavior",
          editor: "boolean",
        },
        {
          key: "keyboardNavigation",
          label: "Keyboard Navigation",
          section: "behavior",
          editor: "boolean",
        },
        { key: "searchable", section: "behavior", editor: "boolean" },
        {
          key: "multiSelect",
          label: "Multi Select",
          section: "behavior",
          editor: "boolean",
        },
      ],
    },
    {
      componentId: "YNavbar",
      strict: true,
      sections: [
        { id: "content", title: "Content" },
        { id: "appearance", title: "Appearance" },
        { id: "cta", title: "CTA" },
        { id: "search", title: "Search" },
        { id: "data", title: "Data" },
        { id: "mobile", title: "Mobile" },
      ],
      controls: [
        { key: "brand", section: "content" },
        {
          key: "subtitle",
          label: "Subtitle / Tagline",
          section: "content",
        },
        { key: "links", section: "data", editor: "json", rows: 6 },
        {
          key: "secondaryLinks",
          label: "Secondary Links",
          section: "data",
          editor: "json",
          rows: 5,
        },
        {
          key: "actions",
          label: "Icon Actions",
          section: "data",
          editor: "json",
          rows: 4,
        },
        {
          key: "variant",
          section: "appearance",
          editor: "select",
          options: navbarVariants,
        },
        {
          key: "align",
          section: "appearance",
          editor: "select",
          options: navbarAlignOptions,
        },
        { key: "sticky", section: "appearance", editor: "boolean" },
        { key: "elevated", section: "appearance", editor: "boolean" },
        { key: "transparent", section: "appearance", editor: "boolean" },
        {
          key: "showCta",
          label: "Show CTA",
          section: "cta",
          editor: "boolean",
        },
        {
          key: "ctaLabel",
          label: "CTA Label",
          section: "cta",
          visibleWhen: { key: "showCta", truthy: true },
        },
        {
          key: "showSearch",
          label: "Show Search",
          section: "search",
          editor: "boolean",
        },
        {
          key: "searchPlaceholder",
          label: "Search Placeholder",
          section: "search",
          visibleWhen: { key: "showSearch", truthy: true },
        },
        {
          key: "mobileMenu",
          label: "Mobile Menu",
          section: "mobile",
          editor: "boolean",
        },
      ],
    },
    {
      componentId: "YAlert",
      strict: true,
      sections: [
        { id: "content", title: "Content" },
        { id: "appearance", title: "Appearance" },
        { id: "actions", title: "Actions" },
        { id: "state", title: "State" },
      ],
      controls: [
        { key: "message", section: "content" },
        { key: "title", section: "content" },
        { key: "icon", section: "content" },
        {
          key: "type",
          section: "appearance",
          editor: "select",
          options: alertTypes,
        },
        {
          key: "variant",
          section: "appearance",
          editor: "select",
          options: alertVariants,
        },
        {
          key: "size",
          section: "appearance",
          editor: "select",
          options: alertSizes,
        },
        {
          key: "intensity",
          section: "appearance",
          editor: "select",
          options: alertIntensities,
        },
        {
          key: "radius",
          section: "appearance",
          editor: "select",
          options: alertRadii,
        },
        {
          key: "fullWidth",
          label: "Full Width",
          section: "appearance",
          editor: "boolean",
        },
        {
          key: "showIcon",
          label: "Show Icon",
          section: "appearance",
          editor: "boolean",
        },
        {
          key: "action",
          label: "Primary Action",
          section: "actions",
          editor: "json",
          rows: 3,
        },
        {
          key: "secondaryAction",
          label: "Secondary Action",
          section: "actions",
          editor: "json",
          rows: 3,
        },
        { key: "dismissible", section: "state", editor: "boolean" },
        { key: "loading", section: "state", editor: "boolean" },
        { key: "disabled", section: "state", editor: "boolean" },
      ],
      init(next) {
        if (next.message === undefined)
          next.message = "Your action was completed successfully.";
        if (next.type === undefined) next.type = "info";
        if (next.variant === undefined) next.variant = "soft";
        if (next.intensity === undefined) next.intensity = "medium";
        if (next.radius === undefined) next.radius = "md";
        if (next.fullWidth === undefined) next.fullWidth = false;
        if (next.showIcon === undefined) next.showIcon = true;
      },
    },
    {
      componentId: "YInput",
      strict: true,
      sections: [
        { id: "content", title: "Content" },
        { id: "appearance", title: "Appearance" },
        { id: "state", title: "State" },
      ],
      controls: [
        { key: "modelValue", label: "Value", section: "content" },
        { key: "label", section: "content" },
        { key: "placeholder", section: "content" },
        { key: "hint", section: "content" },
        { key: "error", section: "content" },
        { key: "warning", section: "content" },
        { key: "success", section: "content" },
        { key: "prefix", section: "content" },
        { key: "suffix", section: "content" },
        { key: "leadingIcon", label: "Leading Icon", section: "content" },
        {
          key: "trailingIcon",
          label: "Trailing Icon",
          section: "content",
        },
        {
          key: "type",
          section: "appearance",
          editor: "select",
          options: inputTypes,
        },
        {
          key: "variant",
          section: "appearance",
          editor: "select",
          options: inputVariants,
        },
        {
          key: "size",
          section: "appearance",
          editor: "select",
          options: inputSizes,
        },
        {
          key: "radius",
          section: "appearance",
          editor: "select",
          options: inputRadii,
        },
        {
          key: "state",
          section: "appearance",
          editor: "select",
          options: inputStates,
        },
        {
          key: "fullWidth",
          label: "Full Width",
          section: "appearance",
          editor: "boolean",
        },
        {
          key: "showCount",
          label: "Show Count",
          section: "appearance",
          editor: "boolean",
        },
        {
          key: "maxLength",
          label: "Max Length",
          section: "appearance",
          editor: "number",
          visibleWhen: { key: "showCount", truthy: true },
        },
        { key: "disabled", section: "state", editor: "boolean" },
        { key: "readonly", section: "state", editor: "boolean" },
        { key: "loading", section: "state", editor: "boolean" },
        { key: "clearable", section: "state", editor: "boolean" },
        { key: "required", section: "state", editor: "boolean" },
      ],
      init(next) {
        if (next.placeholder === undefined)
          next.placeholder = "Enter something...";
        if (next.type === undefined) next.type = "text";
        if (next.variant === undefined) next.variant = "outlined";
        if (next.size === undefined) next.size = "md";
        if (next.radius === undefined) next.radius = "md";
        if (next.state === undefined) next.state = "default";
        if (next.fullWidth === undefined) next.fullWidth = true;
      },
    },
    {
      componentId: "YTextarea",
      strict: true,
      sections: [
        { id: "content", title: "Content" },
        { id: "appearance", title: "Appearance" },
        { id: "state", title: "State" },
      ],
      controls: [
        {
          key: "modelValue",
          label: "Value",
          section: "content",
          editor: "textarea",
          rows: 4,
        },
        { key: "label", section: "content" },
        { key: "placeholder", section: "content" },
        { key: "hint", section: "content" },
        { key: "error", section: "content" },
        { key: "warning", section: "content" },
        { key: "success", section: "content" },
        {
          key: "variant",
          section: "appearance",
          editor: "select",
          options: textareaVariants,
        },
        {
          key: "size",
          section: "appearance",
          editor: "select",
          options: textareaSizes,
        },
        {
          key: "radius",
          section: "appearance",
          editor: "select",
          options: textareaRadii,
        },
        {
          key: "state",
          section: "appearance",
          editor: "select",
          options: textareaStates,
        },
        {
          key: "resize",
          section: "appearance",
          editor: "select",
          options: textareaResizes,
        },
        { key: "rows", section: "appearance", editor: "number" },
        {
          key: "fullWidth",
          label: "Full Width",
          section: "appearance",
          editor: "boolean",
        },
        {
          key: "showCount",
          label: "Show Count",
          section: "appearance",
          editor: "boolean",
        },
        {
          key: "maxLength",
          label: "Max Length",
          section: "appearance",
          editor: "number",
          visibleWhen: { key: "showCount", truthy: true },
        },
        { key: "autoResize", section: "state", editor: "boolean" },
        { key: "disabled", section: "state", editor: "boolean" },
        { key: "readonly", section: "state", editor: "boolean" },
      ],
      init(next) {
        if (next.placeholder === undefined)
          next.placeholder = "Write your message...";
        if (next.variant === undefined) next.variant = "outlined";
        if (next.size === undefined) next.size = "md";
        if (next.radius === undefined) next.radius = "md";
        if (next.state === undefined) next.state = "default";
        if (next.rows === undefined) next.rows = 4;
        if (next.resize === undefined) next.resize = "vertical";
        if (next.fullWidth === undefined) next.fullWidth = true;
      },
    },
    {
      componentId: "YModal",
      strict: true,
      sections: [
        { id: "state", title: "State" },
        { id: "content", title: "Content" },
        { id: "appearance", title: "Appearance" },
        { id: "layout", title: "Layout" },
      ],
      controls: [
        { key: "open", section: "state", editor: "boolean" },
        { key: "persistent", section: "state", editor: "boolean" },
        { key: "loading", section: "state", editor: "boolean" },
        { key: "danger", section: "state", editor: "boolean" },
        { key: "title", section: "content" },
        { key: "description", section: "content" },
        {
          key: "showClose",
          label: "Show Close",
          section: "content",
          editor: "boolean",
        },
        {
          key: "size",
          section: "appearance",
          editor: "select",
          options: playgroundModalSizes,
        },
        {
          key: "variant",
          section: "appearance",
          editor: "select",
          options: playgroundModalVariants,
        },
        {
          key: "backdrop",
          section: "appearance",
          editor: "select",
          options: playgroundModalBackdrops,
        },
        { key: "rounded", section: "appearance", editor: "boolean" },
        {
          key: "padding",
          section: "appearance",
          editor: "select",
          options: playgroundModalPaddings,
        },
        {
          key: "position",
          section: "layout",
          editor: "select",
          options: playgroundModalPositions,
        },
        { key: "fullHeight", section: "layout", editor: "boolean" },
        { key: "scrollable", section: "layout", editor: "boolean" },
      ],
      init(next) {
        if (next.open === undefined) next.open = true;
        next.teleportTo = false;
        if (next.title === undefined) next.title = "Dialog Title";
        if (next.description === undefined)
          next.description = "This is a modal dialog.";
        if (next.size === undefined) next.size = "md";
        if (next.variant === undefined) next.variant = "clean";
        if (next.position === undefined) next.position = "center";
        if (next.backdrop === undefined) next.backdrop = "blur";
        if (next.padding === undefined) next.padding = "md";
        if (next.rounded === undefined) next.rounded = true;
        if (next.scrollable === undefined) next.scrollable = true;
        if (next.showClose === undefined) next.showClose = true;
      },
    },
    {
      componentId: "YBadge",
      strict: true,
      sections: [
        { id: "content", title: "Content" },
        { id: "appearance", title: "Appearance" },
        { id: "state", title: "State" },
      ],
      controls: [
        { key: "label", section: "content" },
        { key: "icon", section: "content" },
        { key: "trailingIcon", label: "Trailing Icon", section: "content" },
        { key: "dot", section: "content", editor: "boolean" },
        { key: "count", section: "content", editor: "number" },
        {
          key: "countMax",
          label: "Count Max",
          section: "content",
          editor: "number",
        },
        {
          key: "variant",
          section: "appearance",
          editor: "select",
          options: badgeVariants,
        },
        {
          key: "size",
          section: "appearance",
          editor: "select",
          options: badgeSizes,
        },
        {
          key: "color",
          section: "appearance",
          editor: "select",
          options: badgeColors,
        },
        {
          key: "radius",
          section: "appearance",
          editor: "select",
          options: badgeRadii,
        },
        { key: "pulse", section: "appearance", editor: "boolean" },
        { key: "rounded", section: "appearance", editor: "boolean" },
        { key: "uppercase", section: "appearance", editor: "boolean" },
        {
          key: "maxWidth",
          label: "Max Width (px)",
          section: "appearance",
          editor: "number",
        },
        { key: "clickable", section: "state", editor: "boolean" },
        { key: "dismissible", section: "state", editor: "boolean" },
        { key: "disabled", section: "state", editor: "boolean" },
      ],
      init(next) {
        if (next.label === undefined) next.label = "New";
        if (next.variant === undefined) next.variant = "solid";
        if (next.size === undefined) next.size = "md";
        if (next.color === undefined) next.color = "blue";
        if (next.countMax === undefined) next.countMax = 99;
      },
    },
    {
      componentId: "YAvatar",
      strict: true,
      sections: [
        { id: "content", title: "Content" },
        { id: "appearance", title: "Appearance" },
        { id: "colors", title: "Colors" },
        { id: "decoration", title: "Decoration" },
      ],
      controls: [
        { key: "src", label: "Image URL", section: "content" },
        { key: "name", section: "content" },
        {
          key: "initialsFallback",
          label: "Initials Fallback",
          section: "content",
          editor: "boolean",
        },
        {
          key: "preset",
          section: "appearance",
          editor: "select",
          options: avatarPresets,
        },
        {
          key: "sizeScale",
          label: "Size Scale",
          section: "appearance",
          editor: "select",
          options: avatarSizes,
        },
        {
          key: "size",
          label: "Custom Size (px)",
          section: "appearance",
          editor: "number",
        },
        {
          key: "shape",
          section: "appearance",
          editor: "select",
          options: avatarShapes,
        },
        {
          key: "bgColor",
          label: "Background Color",
          section: "colors",
          editor: "color",
        },
        {
          key: "textColor",
          label: "Text Color",
          section: "colors",
          editor: "color",
        },
        {
          key: "accentColor",
          label: "Accent Color",
          section: "colors",
          editor: "color",
          visibleWhen: {
            key: "preset",
            in: ["neon", "gradient-ring", "sticker"],
          },
        },
        {
          key: "ring",
          section: "decoration",
          editor: "select",
          options: avatarRings,
        },
        {
          key: "ringColor",
          label: "Ring Color",
          section: "decoration",
          editor: "color",
          visibleWhen: { key: "ring", notEquals: "none" },
        },
        {
          key: "status",
          section: "decoration",
          editor: "select",
          options: [false, ...avatarStatuses],
        },
        {
          key: "badge",
          label: "Badge Count",
          section: "decoration",
          editor: "number",
        },
      ],
      init(next) {
        if (next.name === undefined) next.name = "Ada Lovelace";
        if (next.sizeScale === undefined) next.sizeScale = "lg";
        if (next.preset === undefined) next.preset = "default";
        if (next.shape === undefined) next.shape = "circle";
        if (next.ring === undefined) next.ring = "none";
      },
    },
    {
      componentId: "YSidebar",
      strict: true,
      sections: [
        { id: "content", title: "Content" },
        { id: "layout", title: "Layout" },
        { id: "appearance", title: "Appearance" },
        { id: "state", title: "State" },
      ],
      controls: [
        { key: "logoText", label: "Logo Text", section: "content" },
        { key: "logoIcon", label: "Logo Icon", section: "content" },
        {
          key: "activeItemId",
          label: "Active Item ID",
          section: "content",
        },
        { key: "items", section: "content", editor: "json", rows: 4 },
        { key: "groups", section: "content", editor: "json", rows: 6 },
        { key: "width", section: "layout" },
        {
          key: "collapsedWidth",
          label: "Collapsed Width",
          section: "layout",
        },
        {
          key: "zIndex",
          label: "Z Index",
          section: "layout",
          editor: "number",
        },
        {
          key: "position",
          section: "layout",
          editor: "select",
          options: sidebarPositions,
        },
        {
          key: "behavior",
          section: "layout",
          editor: "select",
          options: sidebarBehaviors,
        },
        {
          key: "collapsedMode",
          label: "Collapsed Mode",
          section: "layout",
          editor: "select",
          options: sidebarCollapsedModes,
        },
        {
          key: "variant",
          section: "appearance",
          editor: "select",
          options: sidebarVariants,
        },
        {
          key: "size",
          section: "appearance",
          editor: "select",
          options: sidebarSizes,
        },
        {
          key: "elevation",
          section: "appearance",
          editor: "select",
          options: [0, 1, 2, 3],
        },
        { key: "rounded", section: "appearance", editor: "boolean" },
        { key: "sticky", section: "appearance", editor: "boolean" },
        { key: "open", section: "state", editor: "boolean" },
        { key: "collapsible", section: "state", editor: "boolean" },
        {
          key: "showToggleButton",
          label: "Show Toggle",
          section: "state",
          editor: "boolean",
        },
      ],
      init(next) {
        if (next.open === undefined) next.open = true;
        if (next.variant === undefined) next.variant = "clean";
        if (next.size === undefined) next.size = "md";
        if (next.position === undefined) next.position = "left";
        if (next.behavior === undefined) next.behavior = "static";
        if (next.collapsedMode === undefined) next.collapsedMode = "icons";
        if (next.width === undefined) next.width = "240px";
        if (next.collapsedWidth === undefined) next.collapsedWidth = "52px";
        if (next.zIndex === undefined) next.zIndex = 40;
        if (next.collapsible === undefined) next.collapsible = true;
        if (next.showToggleButton === undefined) next.showToggleButton = true;
        if (next.logoText === undefined) next.logoText = "MyApp";
        if (next.activeItemId === undefined) next.activeItemId = "dashboard";
        if (!Array.isArray(next.items)) next.items = [];
        if (!Array.isArray(next.groups) || next.groups.length === 0)
          next.groups = [
            {
              id: "main",
              label: "Main",
              collapsible: false,
              items: [
                { id: "dashboard", label: "Dashboard" },
                { id: "projects", label: "Projects" },
                { id: "team", label: "Team", badge: 3 },
              ],
            },
            {
              id: "settings",
              label: "Settings",
              collapsible: true,
              items: [
                { id: "account", label: "Account" },
                { id: "billing", label: "Billing", badge: "Pro" },
              ],
            },
          ];
      },
    },
    {
      componentId: "YTabs",
      strict: true,
      sections: [
        { id: "content", title: "Content" },
        { id: "appearance", title: "Appearance" },
      ],
      controls: [
        { key: "tabs", section: "content", editor: "json", rows: 3 },
        {
          key: "variant",
          section: "appearance",
          editor: "select",
          options: tabsVariants,
        },
        {
          key: "align",
          section: "appearance",
          editor: "select",
          options: tabsAligns,
        },
      ],
      init(next) {
        if (next.tabs === undefined)
          next.tabs = ["Overview", "Billing", "Usage"];
        if (next.variant === undefined) next.variant = "underline";
        if (next.align === undefined) next.align = "left";
      },
    },
    {
      componentId: "YTooltip",
      strict: true,
      sections: [
        { id: "content", title: "Content" },
        { id: "appearance", title: "Appearance" },
      ],
      controls: [
        { key: "text", section: "content" },
        {
          key: "placement",
          section: "appearance",
          editor: "select",
          options: tooltipPlacements,
        },
        {
          key: "variant",
          section: "appearance",
          editor: "select",
          options: tooltipVariants,
        },
        { key: "maxWidth", label: "Max Width", section: "appearance" },
      ],
      init(next) {
        if (next.text === undefined) next.text = "Helpful tooltip text";
        if (next.placement === undefined) next.placement = "top";
        if (next.variant === undefined) next.variant = "dark";
      },
    },
    {
      componentId: "YCheckbox",
      strict: true,
      sections: [
        { id: "content", title: "Content" },
        { id: "appearance", title: "Appearance" },
        { id: "state", title: "State" },
      ],
      controls: [
        { key: "label", section: "content" },
        { key: "description", section: "content" },
        {
          key: "size",
          section: "appearance",
          editor: "select",
          options: checkboxSizes,
        },
        {
          key: "variant",
          section: "appearance",
          editor: "select",
          options: checkboxVariants,
        },
        {
          key: "radius",
          section: "appearance",
          editor: "select",
          options: checkboxRadii,
        },
        { key: "color", section: "appearance", editor: "color" },
        {
          key: "textColor",
          label: "Text Color",
          section: "appearance",
          editor: "color",
        },
        { key: "disabled", section: "state", editor: "boolean" },
        { key: "indeterminate", section: "state", editor: "boolean" },
        {
          key: "modelValue",
          label: "Checked",
          section: "state",
          editor: "boolean",
        },
      ],
      init(next) {
        if (next.label === undefined)
          next.label = "Accept terms and conditions";
        if (next.size === undefined) next.size = "md";
        if (next.radius === undefined) next.radius = "md";
        if (next.variant === undefined) next.variant = "default";
        if (next.color === undefined) next.color = "#2563eb";
        if (next.modelValue === undefined) next.modelValue = false;
      },
    },
    {
      componentId: "YRadio",
      strict: true,
      sections: [
        { id: "content", title: "Content" },
        { id: "appearance", title: "Appearance" },
        { id: "state", title: "State" },
      ],
      controls: [
        { key: "label", section: "content" },
        { key: "description", section: "content" },
        { key: "value", section: "content" },
        { key: "modelValue", label: "Selected Value", section: "content" },
        {
          key: "size",
          section: "appearance",
          editor: "select",
          options: radioSizes,
        },
        {
          key: "variant",
          section: "appearance",
          editor: "select",
          options: radioVariants,
        },
        { key: "color", section: "appearance", editor: "color" },
        {
          key: "textColor",
          label: "Text Color",
          section: "appearance",
          editor: "color",
        },
        { key: "disabled", section: "state", editor: "boolean" },
      ],
      init(next) {
        if (next.label === undefined) next.label = "Option A";
        if (next.value === undefined) next.value = "a";
        if (next.modelValue === undefined) next.modelValue = "a";
        if (next.size === undefined) next.size = "md";
        if (next.color === undefined) next.color = "#2563eb";
      },
    },
    {
      componentId: "YSwitch",
      strict: true,
      sections: [
        { id: "content", title: "Content" },
        { id: "appearance", title: "Appearance" },
        { id: "state", title: "State" },
      ],
      controls: [
        { key: "label", section: "content" },
        { key: "description", section: "content" },
        {
          key: "size",
          section: "appearance",
          editor: "select",
          options: switchSizes,
        },
        {
          key: "variant",
          section: "appearance",
          editor: "select",
          options: switchVariants,
        },
        { key: "color", section: "appearance", editor: "color" },
        {
          key: "textColor",
          label: "Text Color",
          section: "appearance",
          editor: "color",
        },
        { key: "modelValue", label: "On", section: "state", editor: "boolean" },
        { key: "disabled", section: "state", editor: "boolean" },
        { key: "loading", section: "state", editor: "boolean" },
      ],
      init(next) {
        if (next.label === undefined) next.label = "Enable notifications";
        if (next.modelValue === undefined) next.modelValue = true;
        if (next.size === undefined) next.size = "md";
        if (next.color === undefined) next.color = "#2563eb";
      },
    },
    {
      componentId: "YSelect",
      strict: true,
      sections: [
        { id: "content", title: "Content" },
        { id: "appearance", title: "Appearance" },
        { id: "behavior", title: "Behavior" },
        { id: "state", title: "State" },
      ],
      controls: [
        { key: "label", section: "content" },
        { key: "placeholder", section: "content" },
        { key: "hint", section: "content" },
        { key: "error", section: "content" },
        { key: "options", section: "content", editor: "json", rows: 5 },
        {
          key: "size",
          section: "appearance",
          editor: "select",
          options: selectSizes,
        },
        {
          key: "variant",
          section: "appearance",
          editor: "select",
          options: selectVariants,
        },
        {
          key: "radius",
          section: "appearance",
          editor: "select",
          options: selectRadii,
        },
        {
          key: "textColor",
          label: "Text Color",
          section: "appearance",
          editor: "color",
        },
        {
          key: "fullWidth",
          label: "Full Width",
          section: "appearance",
          editor: "boolean",
        },
        { key: "clearable", section: "behavior", editor: "boolean" },
        { key: "searchable", section: "behavior", editor: "boolean" },
        { key: "multiple", section: "behavior", editor: "boolean" },
        { key: "disabled", section: "state", editor: "boolean" },
        { key: "loading", section: "state", editor: "boolean" },
      ],
      init(next) {
        if (next.placeholder === undefined)
          next.placeholder = "Select an option";
        if (next.size === undefined) next.size = "md";
        if (next.variant === undefined) next.variant = "outlined";
        if (next.radius === undefined) next.radius = "md";
        if (next.fullWidth === undefined) next.fullWidth = true;
        if (!Array.isArray(next.options))
          next.options = [
            { label: "Option A", value: "a" },
            { label: "Option B", value: "b" },
            { label: "Option C", value: "c" },
            { label: "Disabled Option", value: "d", disabled: true },
          ];
      },
    },
    {
      componentId: "YSpinner",
      strict: true,
      sections: [
        { id: "appearance", title: "Appearance" },
        { id: "state", title: "State" },
      ],
      controls: [
        {
          key: "variant",
          section: "appearance",
          editor: "select",
          options: spinnerVariants,
        },
        {
          key: "size",
          section: "appearance",
          editor: "select",
          options: spinnerSizes,
        },
        {
          key: "color",
          label: "Color",
          section: "appearance",
          editor: "color",
        },
        {
          key: "textColor",
          label: "Text Color",
          section: "appearance",
          editor: "color",
        },
        {
          key: "speed",
          section: "appearance",
          editor: "select",
          options: spinnerSpeeds,
        },
        { key: "label", section: "appearance" },
        { key: "visible", section: "state", editor: "boolean" },
      ],
      init(next) {
        if (next.variant === undefined) next.variant = "ring";
        if (next.size === undefined) next.size = "md";
        if (next.speed === undefined) next.speed = "normal";
        if (next.color === undefined) next.color = "#2563eb";
        if (next.visible === undefined) next.visible = true;
      },
    },
    {
      componentId: "YSkeleton",
      strict: true,
      sections: [
        { id: "appearance", title: "Appearance" },
        { id: "dimensions", title: "Dimensions" },
        { id: "state", title: "State" },
      ],
      controls: [
        {
          key: "variant",
          section: "appearance",
          editor: "select",
          options: skeletonVariants,
        },
        {
          key: "radius",
          section: "appearance",
          editor: "select",
          options: skeletonRadii,
        },
        {
          key: "textColor",
          label: "Text Color",
          section: "appearance",
          editor: "color",
        },
        { key: "width", section: "dimensions" },
        { key: "height", section: "dimensions" },
        {
          key: "count",
          section: "dimensions",
          editor: "number",
        },
        { key: "animated", section: "state", editor: "boolean" },
      ],
      init(next) {
        if (next.variant === undefined) next.variant = "rect";
        if (next.radius === undefined) next.radius = "md";
        if (next.animated === undefined) next.animated = true;
        if (next.count === undefined) next.count = 1;
        if (next.width === undefined) next.width = "100%";
        if (next.height === undefined) next.height = "80px";
      },
    },
    {
      componentId: "YTable",
      strict: true,
      sections: [
        { id: "data", title: "Data" },
        { id: "appearance", title: "Appearance" },
        { id: "state", title: "State" },
      ],
      controls: [
        { key: "columns", section: "data", editor: "json", rows: 5 },
        { key: "rows", section: "data", editor: "json", rows: 6 },
        { key: "caption", section: "data" },
        {
          key: "variant",
          section: "appearance",
          editor: "select",
          options: tableVariants,
        },
        {
          key: "size",
          section: "appearance",
          editor: "select",
          options: tableSizes,
        },
        {
          key: "textColor",
          label: "Text Color",
          section: "appearance",
          editor: "color",
        },
        { key: "hoverable", section: "appearance", editor: "boolean" },
        {
          key: "fullWidth",
          label: "Full Width",
          section: "appearance",
          editor: "boolean",
        },
        { key: "loading", section: "state", editor: "boolean" },
      ],
      init(next) {
        if (next.variant === undefined) next.variant = "simple";
        if (next.size === undefined) next.size = "md";
        if (next.hoverable === undefined) next.hoverable = true;
        if (next.fullWidth === undefined) next.fullWidth = true;
        if (!Array.isArray(next.columns) || next.columns.length === 0)
          next.columns = [
            { key: "name", label: "Name", sortable: true },
            { key: "role", label: "Role", sortable: true },
            { key: "status", label: "Status" },
          ];
        if (!Array.isArray(next.rows) || next.rows.length === 0)
          next.rows = [
            { name: "Alice Chen", role: "Designer", status: "Active" },
            { name: "Bob Smith", role: "Engineer", status: "Active" },
            { name: "Carol White", role: "Manager", status: "On leave" },
          ];
      },
    },
    {
      componentId: "YPagination",
      strict: true,
      sections: [
        { id: "appearance", title: "Appearance" },
        { id: "behavior", title: "Behavior" },
        { id: "state", title: "State" },
      ],
      controls: [
        {
          key: "variant",
          section: "appearance",
          editor: "select",
          options: paginationVariants,
        },
        {
          key: "size",
          section: "appearance",
          editor: "select",
          options: paginationSizes,
        },
        {
          key: "modelValue",
          label: "Current Page",
          section: "behavior",
          editor: "number",
        },
        {
          key: "totalPages",
          label: "Total Pages",
          section: "behavior",
          editor: "number",
        },
        {
          key: "sibling",
          label: "Sibling Count",
          section: "behavior",
          editor: "number",
        },
        {
          key: "showPrevNext",
          label: "Show Prev/Next",
          section: "behavior",
          editor: "boolean",
        },
        {
          key: "showFirstLast",
          label: "Show First/Last",
          section: "behavior",
          editor: "boolean",
        },
        { key: "disabled", section: "state", editor: "boolean" },
      ],
      init(next) {
        if (next.variant === undefined) next.variant = "simple";
        if (next.size === undefined) next.size = "md";
        if (next.modelValue === undefined) next.modelValue = 4;
        if (next.totalPages === undefined) next.totalPages = 12;
        if (next.sibling === undefined) next.sibling = 1;
        if (next.showPrevNext === undefined) next.showPrevNext = true;
        if (next.showFirstLast === undefined) next.showFirstLast = false;
      },
    },
    {
      componentId: "YProgress",
      strict: true,
      sections: [
        { id: "value", title: "Value" },
        { id: "appearance", title: "Appearance" },
        { id: "state", title: "State" },
      ],
      controls: [
        { key: "label", section: "value" },
        {
          key: "modelValue",
          label: "Value",
          section: "value",
          editor: "number",
        },
        { key: "max", section: "value", editor: "number" },
        {
          key: "variant",
          section: "appearance",
          editor: "select",
          options: progressVariants,
        },
        {
          key: "size",
          section: "appearance",
          editor: "select",
          options: progressSizes,
        },
        { key: "rounded", section: "appearance", editor: "boolean" },
        {
          key: "showLabel",
          label: "Show Label",
          section: "appearance",
          editor: "boolean",
        },
        { key: "striped", section: "state", editor: "boolean" },
        { key: "animated", section: "state", editor: "boolean" },
        { key: "indeterminate", section: "state", editor: "boolean" },
      ],
      init(next) {
        if (next.variant === undefined) next.variant = "solid";
        if (next.size === undefined) next.size = "md";
        if (next.modelValue === undefined) next.modelValue = 64;
        if (next.max === undefined) next.max = 100;
        if (next.rounded === undefined) next.rounded = true;
        if (next.showLabel === undefined) next.showLabel = true;
        if (next.striped === undefined) next.striped = false;
        if (next.animated === undefined) next.animated = true;
        if (next.indeterminate === undefined) next.indeterminate = false;
      },
    },
    {
      componentId: "YToast",
      strict: true,
      sections: [
        { id: "content", title: "Content" },
        { id: "appearance", title: "Appearance" },
        { id: "state", title: "State" },
      ],
      controls: [
        { key: "title", section: "content" },
        { key: "message", section: "content" },
        {
          key: "type",
          section: "appearance",
          editor: "select",
          options: toastTypes,
        },
        {
          key: "variant",
          section: "appearance",
          editor: "select",
          options: toastVariants,
        },
        {
          key: "radius",
          section: "appearance",
          editor: "select",
          options: toastRadii,
        },
        {
          key: "textColor",
          label: "Text Color",
          section: "appearance",
          editor: "color",
        },
        {
          key: "showIcon",
          label: "Show Icon",
          section: "appearance",
          editor: "boolean",
        },
        { key: "dismissible", section: "state", editor: "boolean" },
        { key: "visible", section: "state", editor: "boolean" },
      ],
      init(next) {
        if (next.title === undefined) next.title = "Operation successful";
        if (next.message === undefined)
          next.message = "Your changes have been saved.";
        if (next.type === undefined) next.type = "success";
        if (next.variant === undefined) next.variant = "solid";
        if (next.radius === undefined) next.radius = "md";
        if (next.showIcon === undefined) next.showIcon = true;
        if (next.dismissible === undefined) next.dismissible = true;
        if (next.visible === undefined) next.visible = true;
      },
    },
    {
      componentId: "YAccordion",
      strict: true,
      sections: [
        { id: "data", title: "Data" },
        { id: "appearance", title: "Appearance" },
        { id: "behavior", title: "Behavior" },
      ],
      controls: [
        { key: "items", section: "data", editor: "json", rows: 6 },
        {
          key: "variant",
          section: "appearance",
          editor: "select",
          options: accordionVariants,
        },
        {
          key: "radius",
          section: "appearance",
          editor: "select",
          options: accordionRadii,
        },
        {
          key: "textColor",
          label: "Text Color",
          section: "appearance",
          editor: "color",
        },
        { key: "bordered", section: "appearance", editor: "boolean" },
        { key: "separated", section: "appearance", editor: "boolean" },
        { key: "multiple", section: "behavior", editor: "boolean" },
      ],
      init(next) {
        if (next.variant === undefined) next.variant = "default";
        if (next.radius === undefined) next.radius = "md";
        if (next.bordered === undefined) next.bordered = true;
        if (next.multiple === undefined) next.multiple = false;
        if (!Array.isArray(next.items) || next.items.length === 0)
          next.items = [
            {
              id: "what",
              title: "What is this component?",
              content:
                "An accordion allows users to toggle the visibility of sections of content. It keeps information organized and reduces cognitive load.",
            },
            {
              id: "usage",
              title: "When should I use it?",
              content:
                "Use accordions for FAQs, settings panels, or any place where you want to show a lot of content in a compact space.",
              icon: "💡",
            },
            {
              id: "a11y",
              title: "Accessibility",
              content:
                "All items are keyboard navigable and use proper aria-expanded attributes.",
              icon: "♿",
            },
          ];
        if (!Array.isArray(next.defaultOpen)) next.defaultOpen = ["what"];
      },
    },
  ];
