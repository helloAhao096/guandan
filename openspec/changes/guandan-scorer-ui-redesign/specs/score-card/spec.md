# Spec: score-card

## ADDED Requirements

### Requirement: 中央数字卡片显示当前级数

- **WHEN** 渲染 ScoreCard
- **THEN** 显示当前级数（大号），底色由打级方（attacker）决定，始终为红或蓝

#### Scenario: 红方打时红底

- **WHEN** 当前打级方（attacker）为红方
- **THEN** 卡片背景为红色

#### Scenario: 蓝方打时蓝底

- **WHEN** 当前打级方（attacker）为蓝方
- **THEN** 卡片背景为蓝色

#### Scenario: 双方同级时仍按 attacker 着色

- **WHEN** 红蓝双方级数相同
- **THEN** 卡片仍按 attacker 显示红或蓝，不显示半红半蓝（仅 LevelStrip 有半红半蓝）
