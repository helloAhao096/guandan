## ADDED Requirements

### Requirement: 移除所有 UI 库及未使用依赖

项目 MUST 从 package.json 中移除 daisyui、radix-vue、lucide-vue-next、class-variance-authority、clsx、tailwind-merge、tailwindcss-animate、autoprefixer、postcss。不得保留任何 UI 组件库。

#### Scenario: dependencies 不含上述包

- **WHEN** 执行 `npm ls`
- **THEN** 上述包均不在依赖树中

#### Scenario: 添加 Tailwind v4 所需包

- **WHEN** 查看 package.json 的 dependencies 和 devDependencies
- **THEN** 包含 tailwindcss 和 @tailwindcss/vite，不包含 autoprefixer 和 postcss

### Requirement: 保留核心技术栈

项目 MUST 保留 Vue、Pinia、Vite、TypeScript 及相关构建工具依赖。

#### Scenario: 核心依赖存在

- **WHEN** 查看 package.json
- **THEN** vue、pinia、@vitejs/plugin-vue、vite、typescript、vue-tsc、@types/node 仍然存在
