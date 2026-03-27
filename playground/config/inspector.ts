import {
  buttonAnimationOptions,
  buttonEffectOptions,
  buttonIntensityOptions,
  buttonPresets,
  buttonRoundedOptions,
  buttonShadowOptions,
  buttonSizes,
  buttonVariants,
} from "./button";
import { cardPresets } from "./card";
import {
  dropdownPlacements,
  dropdownSizes,
  dropdownVariants,
} from "./dropdown";
import { navbarVariants } from "./navbar";
import {
  avatarPresets,
  avatarRings,
  avatarShapes,
  avatarSizes,
  avatarStatuses,
} from "./avatar";
import {
  alertTypes,
  alertVariants,
  alertSizes,
  alertIntensities,
  alertRadii,
} from "./alert";
import { badgeVariants, badgeSizes, badgeColors, badgeRadii } from "./badge";
import {
  inputTypes,
  inputVariants,
  inputSizes,
  inputRadii,
  inputStates,
} from "./input";
import {
  modalSizes,
  modalVariants,
  modalPositions,
  modalBackdrops,
  modalPaddings,
} from "./modal";
import {
  sidebarVariants,
  sidebarPositions,
  sidebarSizes,
  sidebarBehaviors,
  sidebarCollapsedModes,
} from "./sidebar";
import { tabsVariants, tabsAligns } from "./tabs";
import { tooltipPlacements, tooltipVariants } from "./tooltip";
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
          options: modalSizes,
        },
        {
          key: "variant",
          section: "appearance",
          editor: "select",
          options: modalVariants,
        },
        {
          key: "backdrop",
          section: "appearance",
          editor: "select",
          options: modalBackdrops,
        },
        { key: "rounded", section: "appearance", editor: "boolean" },
        {
          key: "padding",
          section: "appearance",
          editor: "select",
          options: modalPaddings,
        },
        {
          key: "position",
          section: "layout",
          editor: "select",
          options: modalPositions,
        },
        { key: "fullHeight", section: "layout", editor: "boolean" },
        { key: "scrollable", section: "layout", editor: "boolean" },
      ],
      init(next) {
        if (next.open === undefined) next.open = true;
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
        if (next.items === undefined) next.items = [];
        if (next.groups === undefined)
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
  ];
