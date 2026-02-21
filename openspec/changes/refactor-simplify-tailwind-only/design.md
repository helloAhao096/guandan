## Context

项目为 Vue 3 + Vite + TypeScript 的惯蛋计分器应用。当前引入 shadcn-vue 风格组件及 radix-vue、daisyui、lucide-vue-next 等依赖，Tailwind 采用 v3 + PostCSS 链路。用户要求**破坏式重构**：移除所有 UI 库，仅保留 Tailwind；升级至 v4；删除冗余代码与配置；不向后兼容。

## Goals / Non-Goals

**Goals:**

- 移除所有 UI 库（daisyui、radix-vue、lucide-vue-next 等）及未使用依赖
- 升级 Tailwind 至 v4，使用 @tailwindcss/vite
- 删除 postcss.config.js、tailwind.config.js、components/ui、layouts、lib/utils.ts、assets/index.css

**Non-Goals:**

- 不修改业务代码，不迁移样式

## Decisions

### 1. Tailwind v4 采用 Vite 插件而非 PostCSS

**选择**：使用 `@tailwindcss/vite`，移除 PostCSS 和 autoprefixer。

**原因**：Tailwind v4 官方推荐通过 Vite 插件集成，自动处理 CSS 与 autoprefixer，无需单独配置 PostCSS。

**备选**：继续使用 PostCSS 方式——需保留 postcss.config.js 及 tailwind.config.js，与 v4 简化配置的目标不符。

### 2. 主题变量迁移至 @theme

**选择**：将 tailwind.config.js 中的 theme.extend（colors、borderRadius、keyframes 等）迁移到 style.css 的 `@theme { }` 中。

**原因**：v4 采用 CSS-first 配置，`@theme` 与 `@import "tailwindcss"` 同文件即可生效。

**备选**：保留 tailwind.config.js——v4 仍支持，但官方推荐 @theme，且可一并删除 tailwind.config.js 简化项目。

### 3. 删除整个 components/ui 和 layouts

**选择**：直接删除，而非改为「保留但用 Tailwind 重写」。

**原因**：这些组件当前未被引用，App.vue 仅渲染 Scoreboard。若未来需要可重新按需引入或实现。

### 4. cn() 工具删除

**选择**：删除 lib/utils.ts。

**原因**：cn 仅被已删除的 UI 组件使用，Scoreboard 无此需求。

## Risks / Trade-offs

- **[Tailwind v4 破坏性变更]**：v4 与 v3 的 theme、部分工具类名有差异 → 迁移后需验证 Scoreboard 和全局样式在开发/生产构建下的表现
- **[删除 layouts 后无法快速恢复]**：若后续需要可拖拽面板等布局，需重新实现 → 可接受，当前无使用场景
- **[CSS 变量命名变化]**：v4 的 @theme 变量命名空间可能与 v3 不同 → 迁移时按 v4 文档调整 `--color-*`、`--radius-*` 等

## Migration Plan

1. 备份 package.json 和关键配置
2. 执行依赖变更：`npm uninstall` 所有多余包（含 daisyui），`npm install tailwindcss@latest @tailwindcss/vite`
3. 更新 vite.config.ts，删除 postcss 配置，添加 @tailwindcss/vite
4. 合并 style.css 与 assets/index.css，采用 v4 语法，更新 main.ts 导入
5. 删除 postcss.config.js、tailwind.config.js、components/ui、layouts、lib/utils.ts、assets/index.css
6. 运行 `npm run dev` 和 `npm run build` 验证
