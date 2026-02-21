# Spec: level-strip

## ADDED Requirements

### Requirement: 13 级灯条

- **WHEN** 渲染 LevelStrip
- **THEN** 显示 13 个级数标签：2 3 4 5 6 7 8 9 10 J Q K A（10 用数字，J/Q/K/A 用英文）

### Requirement: 空心圆环着色

- **WHEN** 某级非当前级
- **THEN** 该级上方空心灰环

- **WHEN** 当前级由红方在打
- **THEN** 当前级上方空心红环

- **WHEN** 当前级由蓝方在打
- **THEN** 当前级上方空心蓝环

- **WHEN** 红蓝双方当前级数相同
- **THEN** 当前级上方左半红右半蓝
