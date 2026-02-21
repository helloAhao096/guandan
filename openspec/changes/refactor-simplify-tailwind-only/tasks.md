## 1. 依赖变更

- [x] 1.1 卸载所有 UI 及多余依赖：daisyui、radix-vue、lucide-vue-next、class-variance-authority、clsx、tailwind-merge、tailwindcss-animate、autoprefixer、postcss
- [x] 1.2 安装 Tailwind v4 及 Vite 插件：tailwindcss、@tailwindcss/vite
- [x] 1.3 验证 package.json 中仅保留必要依赖，运行 npm install 无报错

## 2. Vite 与 Tailwind 配置

- [x] 2.1 修改 vite.config.ts：移除 css.postcss 配置，添加 @tailwindcss/vite 插件
- [x] 2.2 删除 postcss.config.js
- [x] 2.3 删除 tailwind.config.js

## 3. 样式入口统一

- [x] 3.1 合并 src/assets/index.css 中的 :root 变量及主题到 src/style.css
- [x] 3.2 将 style.css 改为使用 @import "tailwindcss" 及 @theme 语法
- [x] 3.3 确保 main.ts 仅导入 style.css
- [x] 3.4 删除 src/assets/index.css，若 assets 目录为空则删除

## 4. 代码清理

- [x] 4.1 删除 src/components/ui/ 整个目录
- [x] 4.2 删除 src/layouts/ 整个目录
- [x] 4.3 删除 src/lib/utils.ts
- [x] 4.4 修复所有对已删除组件或 utils 的 import（如有）

