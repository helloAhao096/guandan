## ADDED Requirements

### Requirement: Tailwind v4 通过 Vite 插件集成

项目 MUST 使用 Tailwind CSS v4 官方 Vite 插件 `@tailwindcss/vite` 进行构建，不得使用 PostCSS 方式。

#### Scenario: Vite 构建时加载 Tailwind

- **WHEN** 执行 `npm run dev` 或 `npm run build`
- **THEN** Vite 通过 `@tailwindcss/vite` 插件处理 Tailwind，无需 postcss.config.js

#### Scenario: 插件正确注册

- **WHEN** 查看 vite.config.ts
- **THEN** plugins 数组包含 tailwindcss() 且不再包含 PostCSS 相关配置

### Requirement: 唯一样式入口使用 v4 语法

项目 MUST 通过 `src/style.css` 作为唯一样式入口，并采用 Tailwind v4 的 `@import "tailwindcss"` 语法。

#### Scenario: CSS 导入 Tailwind

- **WHEN** 查看 style.css
- **THEN** 文件包含 `@import "tailwindcss"` 且 main.ts 仅导入该文件

#### Scenario: 主题变量通过 @theme 定义

- **WHEN** 需要自定义颜色、圆角等设计令牌
- **THEN** 在 style.css 中使用 `@theme { ... }` 定义，而非 tailwind.config.js
