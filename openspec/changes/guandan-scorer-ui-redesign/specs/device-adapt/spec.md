# Spec: device-adapt

## ADDED Requirements

### Requirement: 小型手机竖屏提示

- **WHEN** 视口竖屏且短边 < 500px
- **THEN** 全屏遮罩，显示「请横置手机使用」

- **WHEN** 横屏
- **THEN** 遮罩隐藏，计分器正常显示
