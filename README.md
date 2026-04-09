# 工单管理系统 Demo

基于 Vue 3 + TypeScript + Element Plus 构建的工单管理前端 Demo，采用苹果风格设计语言。

## 技术栈

- **Vue 3** (Composition API + `<script setup>`)
- **TypeScript** — 严格模式，全量类型覆盖
- **Element Plus** — 表格、表单、分页、弹框等 UI 组件
- **ECharts** — 工单统计图表
- **Pinia** — 状态管理（认证、主题）
- **Vue Router** — 路由守卫实现登录鉴权
- **Vite** + **SCSS** — 构建与样式

---

## 使用了哪些 AI 工具？

本项目全程使用 **Claude Code（claude.ai/code）** 辅助开发，具体包括：

- **代码生成**：组件骨架、Pinia Store、Composable、类型定义
- **设计系统落地**：将 `DESIGN.md` 中的苹果设计规范转化为实际 CSS 变量和 SCSS 样式
- **调试与迭代**：修复 Element Plus 深色模式下的 CSS 变量覆盖问题、ECharts 响应式布局问题
- **架构决策**：讨论数据流设计（`filtered` 同时驱动表格和图表）、路由守卫方案

---

## 哪些代码是 AI 辅助生成的？你做了哪些修改？

### AI 辅助生成的部分

| 文件 | 说明 |
|------|------|
| `src/types/workOrder.ts` | `WorkOrder` 类型定义与 `WorkOrderStatus` 联合类型 |
| `src/composables/useWorkOrders.ts` | 全部逻辑，包括 mock 数据、`add / update / remove` CRUD、`STATUS_LABELS` 映射 |
| `src/stores/auth.ts` | Pinia Setup Store，sessionStorage 持久化登录态、角色计算属性 |
| `src/stores/theme.ts` | 暗色/亮色主题切换，`data-theme` 属性驱动 CSS 变量 |
| `src/router/index.ts` | 路由配置与 `beforeEach` 登录守卫 |
| `src/views/DashboardView.vue` | 导航栏（玻璃拟态效果）、主题切换按钮、角色徽章 |
| `src/views/LoginView.vue` | 登录表单、Element Plus 表单验证、测试账号提示区 |
| `src/components/WorkOrderList.vue` | 过滤/搜索/分页逻辑、表格列定义、与图表联动的 `filtered` computed |
| `src/components/WorkOrderChart.vue` | ECharts 柱状图，按项目聚合工时，响应滚动容器高度 |
| `src/components/WorkOrderForm.vue` | 新建/编辑工单弹框，表单验证规则 |
| `src/styles/_variables.scss` | CSS 变量体系（亮/暗双主题，包含 `--bg-*`、`--text-*`、`--border-*`、`--shadow-*`） |

### 人工修改与调整的部分

- **图表与表格的高度联动**：AI 最初将图表放在独立卡片中，手动重构为 `body-wrap` flex 布局，让图表列高度随表格内容自适应，并通过 `:deep(.chart-body) { flex: 1 1 0; height: 0 }` 修复 ECharts 在 flex 子项中无法自动计算高度的问题。
- **深色模式 Element Plus 穿透**：Element Plus 内部使用 `--el-table-bg-color` 等变量，AI 生成的方案只改了外层容器背景，手动补充了 `:deep(.el-table)` 内的全部 CSS 变量覆盖，确保表头、条纹行、悬停行都跟随主题变化。
- **`DESIGN.md` 到实际样式的映射**：AI 参考文档生成了初版样式，但苹果导航的 `backdrop-filter: saturate(180%) blur(20px)`、980px pill 圆角、字号/字重/字距细节等，逐一对照文档手动校准。
- **登录页主题按钮颜色**：登录页背景为白色时主题按钮用深色图标才可见，调整了 `btn-theme` 在不同页面背景下的颜色逻辑。

---

## 项目中最满意或最难处理的点

### 最满意：数据流设计

`filtered` computed 既驱动表格（分页后的 `paginated`），又直接传给图表组件。筛选条件变化时，表格和图表同步响应，无需额外事件或状态同步。这个设计简洁且正确，是整个项目数据层最干净的地方。

```
workOrders (ref)
    ↓
filtered (computed：按状态+关键字过滤)
    ├── paginated (computed：分页切片) → el-table
    └── :workOrders="filtered"        → WorkOrderChart
```

### 最难处理：ECharts 在 flex 布局中的高度问题

ECharts 初始化时需要容器有明确的像素高度，但图表列是一个 `flex: 1` 的子项，高度由父容器决定，`height: 100%` 在这种情况下失效。

解法是给 flex 子项显式设置 `height: 0`，让 flex 算法接管实际高度分配，再配合 `ResizeObserver` 监听容器尺寸变化后调用 `chart.resize()`。这个组合在不同浏览器、不同内容高度下都能稳定工作。

---

## 本地运行

```bash
npm install
npm run dev      # http://localhost:5173
```

**测试账号**

| 角色 | 用户名 | 密码 | 权限 |
|------|--------|------|------|
| 管理员 | `admin` | `admin123` | 新建 / 编辑 / 删除 |
| 普通用户 | `user` | `user123` | 只读 |
