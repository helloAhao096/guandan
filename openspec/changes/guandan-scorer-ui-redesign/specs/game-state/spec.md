# Spec: game-state

## ADDED Requirements

### Requirement: 升级规则

- **WHEN** 确认头游+二游/三游/末游
- **THEN** 打级方分别 +3/+2/+1 级；打级方轮换（谁赢谁继续打）

### Requirement: 待确认与回退

- **WHEN** 选择结果（selectResult(winner, result)，点击哪侧传哪方）
- **THEN** 进入待确认，确认按钮亮起

- **WHEN** 点击确认
- **THEN** 执行升级，清空选择，追加 history，计算 lastTribute（贡牌关系）

- **WHEN** 点击回退且 history 非空
- **THEN** 恢复到上一局状态，lastTribute 同步；可多级回退；回退到开局则 lastTribute 为 null

### Requirement: 贡牌逻辑

- **WHEN** 确认头游+二游
- **THEN** lastTribute 为 double（4→1、3→2）

- **WHEN** 确认头游+三游或头游+末游
- **THEN** lastTribute 为 single（4→1）
