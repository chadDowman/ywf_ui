# YWF UI

A customizable Vue 3 component library built with Tailwind CSS 4 and TypeScript.

## Development

```bash
# Install dependencies
pnpm install

# Run the playground (dev server on port 3000)
pnpm dev

# Build the library
pnpm build

# Type-check
pnpm typecheck
```

## Publishing (Private GitHub Packages)

This package is published to **GitHub Packages** under the `@yourdevforge` scope.

### First-Time Setup (Publisher)

1. Create a GitHub **Personal Access Token (classic)** at <https://github.com/settings/tokens>  
   Required scopes: `write:packages`, `read:packages`
2. Log in to the GitHub npm registry:
   ```bash
   npm login --registry=https://npm.pkg.github.com
   # Username: your GitHub username
   # Password: paste your token
   # Email: your GitHub email
   ```
3. Build and publish:
   ```bash
   pnpm build
   npm publish
   ```
4. To publish a new version, bump the version first:
   ```bash
   npm version patch   # or minor / major
   pnpm build
   npm publish
   ```

## Usage in a Nuxt 4 App

### 1. Install

Create an `.npmrc` file in the **root of your consuming project**:

```
@yourdevforge:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

> **For collaborators:** Create a Personal Access Token with `read:packages` scope.
> Never commit your token — add `.npmrc` to `.gitignore` or use an environment variable:
>
> ```
> //npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
> ```

Then install:

```bash
pnpm add @yourdevforge/ywf-ui
```

### 2. Create a Nuxt Plugin

Create `plugins/ywf-ui.ts` in your Nuxt app:

```ts
import { YwfUIPlugin } from "@yourdevforge/ywf-ui";
import "@yourdevforge/ywf-ui/style.css";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vApp.use(YwfUIPlugin);
});
```

This registers all components globally and imports the required CSS.

### 3. Use Components

```vue
<template>
  <YButton color="#ef4444" size="lg" label="Delete" />

  <YCard bg-color="#1e293b" text-color="#f8fafc" padding="lg" shadow="xl">
    <template #header>
      <h3>Card Title</h3>
    </template>
    Content goes here
    <template #footer>
      <YButton size="sm" label="Save" />
    </template>
  </YCard>
</template>
```

### Alternative: Import Components Individually

Instead of the global plugin, import only what you need:

```vue
<script setup lang="ts">
import { YButton, YCard } from "@yourdevforge/ywf-ui";
import "@yourdevforge/ywf-ui/style.css"; // import once globally in your app entry
</script>
```

## Components

### YButton

| Prop                 | Type                                                                  | Default      | Description                             |
| -------------------- | --------------------------------------------------------------------- | ------------ | --------------------------------------- |
| `size`               | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                                | `'md'`       | Button size                             |
| `color`              | `string`                                                              | `'#3b82f6'`  | Background/accent color (any CSS color) |
| `textColor`          | `string`                                                              | `'#ffffff'`  | Text color (any CSS color)              |
| `variant`            | `'solid' \| 'outline' \| 'ghost'`                                     | `'solid'`    | Visual style variant                    |
| `disabled`           | `boolean`                                                             | `false`      | Disabled state                          |
| `label`              | `string`                                                              | —            | Button text (alternative to slot)       |
| `shadow`             | `false \| 'sm' \| 'md' \| 'lg' \| 'xl'`                               | `false`      | Shadow depth                            |
| `rounded`            | `false \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'`                     | `'md'`       | Border radius                           |
| `padding`            | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                                | —            | Override default size-based padding     |
| `animation`          | `false \| 'pulse' \| 'bounce' \| 'shake' \| 'glow' \| 'spin'`         | `false`      | Continuous CSS animation                |
| `animationIntensity` | `'subtle' \| 'moderate' \| 'strong'`                                  | `'moderate'` | Controls animation speed & magnitude    |
| `effect`             | `false \| 'ripple' \| 'scale' \| 'lift' \| 'neon' \| 'glassmorphism'` | `false`      | Interactive effect on hover/click       |
| `effectIntensity`    | `'subtle' \| 'moderate' \| 'strong'`                                  | `'moderate'` | Controls effect magnitude               |

**Slots:** `default`

**Events:** `click`

### YCard

| Prop          | Type                                              | Default     | Description                      |
| ------------- | ------------------------------------------------- | ----------- | -------------------------------- |
| `padding`     | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`            | `'md'`      | Inner padding size               |
| `bgColor`     | `string`                                          | `'#ffffff'` | Background color (any CSS color) |
| `borderColor` | `string`                                          | `'#e5e7eb'` | Border color (any CSS color)     |
| `textColor`   | `string`                                          | —           | Text color (any CSS color)       |
| `shadow`      | `false \| 'sm' \| 'md' \| 'lg' \| 'xl'`           | `'md'`      | Shadow depth                     |
| `bordered`    | `boolean`                                         | `true`      | Show border                      |
| `rounded`     | `false \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'lg'`      | Border radius                    |

**Slots:** `header`, `default`, `footer`

## Adding More Components

1. Create your component in one of these folders:

- `src/components/buttons/` for button-like components
- `src/components/cards/` for card/layout components
- or create a new folder under `src/components/` for a new category

2. Export it from `src/index.ts`.
3. Register it in `src/plugin.ts` if you want global component usage.
4. Add it to the playground navigation list in `playground/App.vue` (the `components` array in `<script setup>`).
5. Add preview markup in the center panel in `playground/App.vue`.
6. Add editable controls in the right `Properties` panel in `playground/App.vue`.

Tip: each component in the playground needs three pieces in `playground/App.vue`: state refs, preview template, and Properties panel controls.

## Project Structure

```
src/
├── index.ts              Main entry — exports all components
├── plugin.ts             Vue plugin for global registration
├── types.ts              Shared TypeScript types
└── components/
  ├── buttons/
  │   └── YButton.vue   Button component
  └── cards/
    └── YCard.vue     Card component
playground/
├── index.html            Dev server entry
├── vite.config.ts        Playground Vite config
├── main.ts               Playground app entry
├── style.css             Playground Tailwind entry
└── App.vue               Interactive component showcase
```
