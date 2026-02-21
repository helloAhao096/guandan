## Why

项目当前引入大量 UI 库（radix-vue、daisyui、lucide-vue-next 等）及 shadcn-vue 风格组件，依赖臃肿、配置冗余。本次为**破坏式重构**：移除所有 UI 库，仅保留 Tailwind；升级至 v4；删除冗余代码与配置；不向后兼容。

## What Changes

- **BREAKING** 移除 daisyui、radix-vue、lucide-vue-next、class-variance-authority、clsx、tailwind-merge、tailwindcss-animate、autoprefixer、postcss
- **BREAKING** 删除 `components/ui/`、`layouts/`、`lib/utils.ts`、`assets/index.css`
- 不修改业务代码（含 Scoreboard），不迁移样式
- 升级 Tailwind 至 v4，使用 `@tailwindcss/vite` 替代 PostCSS 链路
- 删除 `postcss.config.js`、`tailwind.config.js`
- 统一样式入口为 `src/style.css`，采用 `@import "tailwindcss"` 及 `@theme` 主题变量

## Capabilities

### New Capabilities

- `tailwind-v4-setup`: Tailwind v4 的安装、Vite 插件配置及 CSS 入口与主题变量
- `dependency-cleanup`: 依赖精简策略与 package.json 变更
- `codebase-cleanup`: 删除未使用组件、布局、配置文件和冗余样式入口

### Modified Capabilities

<!-- 无现有 spec 被修改 -->

## Impact

- **package.json**：依赖变更，需执行 `npm install`
- **vite.config.ts**：移除 PostCSS 配置，添加 `@tailwindcss/vite`
- **src/style.css**：成为唯一样式入口，采用 v4 语法
- **删除**：postcss.config.js、tailwind.config.js、src/assets/、src/components/ui/、src/layouts/、src/lib/utils.ts
