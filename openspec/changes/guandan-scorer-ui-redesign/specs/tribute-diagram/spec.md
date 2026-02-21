# Spec: tribute-diagram

## ADDED Requirements

### Requirement: 进贡图示布局

- **WHEN** 渲染 TributeDiagram
- **THEN** 左右两列，每列上下各 2 块，共 4 块；红/蓝底色

### Requirement: 开局仅颜色，确认后数字+连接线

- **WHEN** 尚未确认任何一局
- **THEN** 4 块仅显示颜色，无数字 1–4，无连接线

- **WHEN** 已确认至少一局
- **THEN** 4 块显示 1–4（头游–末游）；单贡 4→1 一条线；双贡 4→1、3→2 两条线，中间 X 交叉
