# Tasks

## 1. 类型与状态

- [ ] 1.1 新建 `src/types/game.ts`，定义级数、attacker、pendingResult、贡牌关系等类型
- [ ] 1.2 新建 `src/store/gameStore.ts`，实现 redLevel、blueLevel、attacker、pendingResult、history（回退用）
- [ ] 1.3 实现 selectResult、confirm、undo、reset；confirm 时升级、切换打级方、追加 history
- [ ] 1.4 实现贡牌逻辑：根据本局结果计算进贡关系（单贡/双贡）

## 2. 设备适配

- [ ] 2.1 新建 `src/composables/useDeviceAdapt.ts`，监听 resize、orientationchange
- [ ] 2.2 实现 isPortrait、isSmallPhone、showRotatePrompt
- [ ] 2.3 新建 `src/components/RotatePrompt.vue`，竖屏时全屏提示「请横置手机使用」

## 3. 级数灯条（level-strip）

- [ ] 3.1 新建 `src/components/LevelStrip.vue`
- [ ] 3.2 渲染 13 级（2–A），每级上方空心圆环
- [ ] 3.3 非当前级灰环；当前级红/蓝/半红半蓝

## 4. 中央数字卡片与进贡区

- [ ] 4.1 新建 `src/components/ScoreCard.vue`，大号数字，红/蓝底
- [ ] 4.2 新建 `src/components/TributeDiagram.vue`：左右两列、上下各 2 块，共 4 块
- [ ] 4.3 进贡区：开局仅颜色；确认后显示 1–4 与连接线（单贡 4→1，双贡 4→1、3→2，中间 X 交叉）
- [ ] 4.4 将 ScoreCard 与 TributeDiagram 整合为中部中央区域（卡片在上，进贡区在下）

## 5. 操作按钮（action-buttons）

- [ ] 5.1 新建 `src/components/ResultButtons.vue`，三个结果按钮，段落式
- [ ] 5.2 新建 `src/components/ConfirmActions.vue`，回退、确认始终显示；确认未选择时禁用
- [ ] 5.3 新建 `src/components/SidePanel.vue`，整合箭头、ResultButtons、ConfirmActions，支持 left/right

## 6. 主页面整合

- [ ] 6.1 重写 `src/pages/Scoreboard.vue`，三段式布局，条件渲染 RotatePrompt
- [ ] 6.2 接入 gameStore、useDeviceAdapt，组合 LevelStrip、中部（ScoreCard+TributeDiagram）、SidePanel
- [ ] 6.3 确保 App.vue 正确引用 Scoreboard

## 7. 动画

- [ ] 7.1 为级数切换、卡片底色、按钮反馈添加 Tailwind transition（200–300ms）
- [ ] 7.2 必要时使用 Vue Transition 处理显隐

## 8. 收尾

- [ ] 8.1 移除对 ScoreStore 的引用，删除 `src/store/ScoreStore.ts`
- [ ] 8.2 验证 `npm run dev`、`npm run build`
- [ ] 8.3 在电脑、平板、手机横竖屏下验证 UI 与交互
