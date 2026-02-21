# 掼蛋计分器 — 项目结构与代码设计

## 一、技术栈

- Vue 3 + TypeScript + Vite
- Pinia（状态管理）
- Tailwind CSS v4

## 二、Goals / Non-Goals

**Goals:**
- 重写 Scoreboard 为三段式、左右对称布局
- 实现级数灯条、中央数字卡片、进贡图示（TributeDiagram）
- 实现左右对称结果按钮、回退/确认（始终显示）
- 实现 gameStore：计分、升级、贡牌、回退历史
- 设备适配、动画

**Non-Goals:**
- 不实现进贡、抗贡的牌面操作（计分器仅展示进贡关系）
- 过 A 复杂规则（连续三局不过回 2）可后续迭代
- 开局先打方由线下摸牌决定，计分器不设计

## 三、项目目录结构

```
src/
├── main.ts
├── App.vue
├── style.css
├── pages/
│   └── Scoreboard.vue          # 主页面
├── components/
│   ├── RotatePrompt.vue        # 横屏提示（小型手机竖屏时）
│   ├── LevelStrip.vue          # 顶部级数灯条
│   ├── ScoreCard.vue           # 中央数字卡片
│   ├── TributeDiagram.vue      # 进贡图示（四方块 + 连接线 + X）
│   ├── SidePanel.vue           # 左右侧边栏（箭头 + 按钮列）
│   ├── ResultButtons.vue       # 三个结果按钮
│   └── ConfirmActions.vue      # 回退 + 确认
├── store/
│   └── gameStore.ts            # 游戏状态（替代 ScoreStore）
├── types/
│   └── game.ts                 # 类型定义
└── composables/
    └── useDeviceAdapt.ts       # 设备适配、横屏检测
```

## 四、组件职责与拆分

### 4.1 页面层

| 组件 | 职责 |
|------|------|
| **Scoreboard.vue** | 主页面，组合各区域；检测设备、条件渲染 RotatePrompt；三段式布局 |

### 4.2 区域组件

| 组件 | 职责 |
|------|------|
| **RotatePrompt.vue** | 竖屏/窄屏时全屏遮罩，提示「请横置手机使用」 |
| **LevelStrip.vue** | 13 级灯条，空心圆环；非当前级灰，当前级红/蓝/半红半蓝 |
| **ScoreCard.vue** | 中央数字卡片，大号级数，红/蓝底色 |
| **TributeDiagram.vue** | 进贡图示：左右两列各 2 块，共 4 块；开局仅颜色，确认后数字 1–4 与连接线 |
| **SidePanel.vue** | 左右侧边栏：箭头 + ResultButtons + ConfirmActions |

### 4.3 原子 / 操作组件

| 组件 | 职责 |
|------|------|
| **ResultButtons.vue** | 三个结果按钮，高亮选中；emit 选择事件（含 winner：左红右蓝） |
| **ConfirmActions.vue** | 回退、确认始终显示；确认未选择时禁用；emit 回退/确认 |

### 4.4 组件层级关系

```
Scoreboard
├── RotatePrompt (条件渲染，showRotatePrompt 时)
└── 主内容
    ├── LevelStrip
    └── 中部 flex 容器
        ├── SidePanel (left)
        │   ├── 红方箭头
        │   ├── ResultButtons
        │   └── ConfirmActions
        ├── 中央区域（卡片 + 进贡区）
        │   ├── ScoreCard
        │   └── TributeDiagram
        └── SidePanel (right)
            ├── 蓝方箭头
            ├── ResultButtons
            └── ConfirmActions
```

## 五、状态设计（Pinia gameStore）

```ts
const LEVELS = ['2','3','4','5','6','7','8','9','10','J','Q','K','A']  // 索引 0–12

interface GameState {
  redLevelIndex: number
  blueLevelIndex: number
  attacker: 'red' | 'blue'
  pendingResult: 3 | 2 | 1 | null
  pendingWinner: 'red' | 'blue' | null   // 单侧选择：点击哪侧即该方获胜
  history: GameSnapshot[]
}

interface GameSnapshot {
  redLevelIndex: number
  blueLevelIndex: number
  attacker: string
  lastTribute: TributeRelation | null   // 上局产生的进贡关系
}

interface TributeRelation {
  type: 'single' | 'double'   // 单贡 / 双贡
  positions: [number, number, number, number]  // 左上下、右上下 对应的排名 1–4
}

// actions
- selectResult(winner: 'red' | 'blue', result: 3 | 2 | 1)   // 单侧选择：点击哪侧传哪方
- confirm()   // 按 pendingWinner 升级、切换 attacker、追加 history、计算 lastTribute
- undo()      // 从 history 弹出恢复
- reset()
```

### 5.1 derived 数据

- `currentLevel`: attacker 方当前级数字符串
- `currentLevelIndex`: 0–12
- `isTie`: 红蓝同级（仅 LevelStrip 用，当前级圆环半红半蓝；ScoreCard 始终按 attacker 着色）
- `lastTribute`: 最近一局进贡关系，用于 TributeDiagram；history 为空则为 null（开局仅颜色）

### 5.2 升级与贡牌逻辑

- 单侧选择：selectResult(winner, result)；pendingWinner 确定胜方，另一方名次自动互补
- 升级：confirm 时 pendingWinner 方 `+pendingResult`；attacker 切换为 pendingWinner（谁赢谁打）
- 贡牌：根据 pendingWinner + pendingResult 计算 rankings，写入 lastTribute；头游+二游 → double，其余 → single

## 六、数据流与事件

```
选择结果 → store.selectResult(winner, result) → pendingResult、pendingWinner 有值 → 确认按钮亮起
确认     → store.confirm() → pendingWinner 方升级、attacker 切换、history 追加、lastTribute 更新 → 清空 pending
回退     → store.undo() → 从 history 恢复 → lastTribute 同步（回退到开局则 null）
```

- ConfirmActions 始终显示；确认按钮 disabled = (pendingResult === null)

## 七、设备适配（useDeviceAdapt）

```ts
- isPortrait: Ref<boolean>
- isSmallPhone: Ref<boolean>   // 短边 < 500
- showRotatePrompt: computed   // isSmallPhone && isPortrait
```

- 监听 `resize`、`orientationchange`

## 八、样式与 Tailwind

- 色系：红 `#9e0000`、蓝 `#0C359E`、灰环 `#9B9B9B`
- 级数灯条：空心圆环用 `border` 或 SVG；半红半蓝用 `conic-gradient` 或 SVG
- 动画：200–300ms，ease-out / ease-in-out

## 九、Risks / Trade-offs

- 旧 ScoreStore 不兼容，需删除或废弃
- 过 A 规则未细化，可后续迭代
- 横屏阈值 500px 为经验值，折叠屏等边缘情况可配置化

## 十、文件清单（实现顺序）

1. `types/game.ts`
2. `store/gameStore.ts`
3. `composables/useDeviceAdapt.ts`
4. `components/RotatePrompt.vue`
5. `components/LevelStrip.vue`
6. `components/ScoreCard.vue`
7. `components/TributeDiagram.vue`
8. `components/ResultButtons.vue`
9. `components/ConfirmActions.vue`
10. `components/SidePanel.vue`
11. `pages/Scoreboard.vue`
12. 更新 `App.vue`
