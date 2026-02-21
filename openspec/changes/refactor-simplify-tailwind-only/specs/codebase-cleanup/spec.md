## ADDED Requirements

### Requirement: 删除未使用的 UI 组件与布局

项目 MUST 删除 `src/components/ui/`  entire 目录（button、card、resizable）及 `src/layouts/`  entire 目录（DashboardLayout、ScorekeeperLayout、MainLayout）。

#### Scenario: UI 组件目录不存在

- **WHEN** 列出 src/components/
- **THEN** 不存在 ui 子目录

#### Scenario: layouts 目录不存在

- **WHEN** 列出 src/
- **THEN** 不存在 layouts 目录

### Requirement: 删除 cn 工具与冗余样式文件

项目 MUST 删除 `src/lib/utils.ts` 和 `src/assets/index.css`，不得存在重复的 Tailwind 指令入口。

#### Scenario: utils.ts 已删除

- **WHEN** 查看 src/lib/ 或 src/
- **THEN** 不存在 utils.ts 文件

#### Scenario: assets/index.css 已删除

- **WHEN** 查看 src/assets/
- **THEN** 不存在 index.css，或 assets 目录为空/不存在

### Requirement: 删除冗余配置文件

项目 MUST 删除 postcss.config.js 和 tailwind.config.js。

#### Scenario: PostCSS 配置已删除

- **WHEN** 列出项目根目录
- **THEN** 不存在 postcss.config.js

#### Scenario: Tailwind v3 配置已删除

- **WHEN** 列出项目根目录
- **THEN** 不存在 tailwind.config.js
