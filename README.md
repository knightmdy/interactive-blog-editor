# Interactive Blog Editor

一个基于 Vue 3 + TypeScript 的现代化 Markdown 博客编辑器，专为实习/校招作品展示而设计。

## 🚀 项目特性

### 核心功能
- **实时预览**: 左侧Monaco编辑器，右侧实时Markdown预览
- **语法高亮**: 基于Shiki的代码语法高亮
- **暗黑模式**: 支持亮色/暗黑主题切换
- **本地存储**: 使用IndexedDB存储文档草稿，浏览器刷新不丢失
- **一键导出**: 支持导出为HTML、静态站点ZIP包

### 增强功能
- **可执行代码块**: JavaScript/TypeScript代码可在沙盒内运行
- **动态表格**: 支持表格排序和筛选
- **图表支持**: 集成ECharts，支持JSON配置实时编辑
- **滚动同步**: 编辑器与预览区域滚动联动
- **自动保存**: 可配置的自动保存机制

## 🛠 技术栈

### 前端框架
- **Vue 3.4**: 使用 `<script setup>` + TypeScript
- **Vite 5**: 快速构建工具
- **TypeScript**: 类型安全

### 状态管理
- **Pinia**: 现代化状态管理

### UI/样式
- **TailwindCSS**: 原子化CSS框架
- **自定义组件**: 手写UI组件，无第三方UI库依赖

### 编辑器/预览
- **Monaco Editor**: VS Code同款编辑器
- **Marked**: Markdown解析
- **Shiki**: 语法高亮

### 数据存储
- **Dexie**: IndexedDB封装库
- **localStorage**: 设置存储

### 工具库
- **VueUse**: Vue组合式工具库
- **ECharts**: 图表库
- **file-saver**: 文件下载
- **JSZip**: ZIP文件生成

## 📁 项目结构

```
src/
├── components/          # 可复用Vue组件
│   ├── EditorPanel.vue  # Monaco编辑器面板
│   ├── PreviewPanel.vue # Markdown预览面板
│   └── index.ts         # 组件导出
├── composables/         # Vue组合式函数
│   ├── useEditor.ts     # 编辑器逻辑
│   ├── usePreview.ts    # 预览逻辑
│   ├── useStorage.ts    # 本地存储
│   └── index.ts         # 导出
├── stores/              # Pinia状态管理
│   ├── editor.ts        # 编辑器状态
│   ├── settings.ts      # 应用设置
│   └── index.ts         # 导出
├── styles/              # 样式文件
│   └── index.css        # 主样式文件
├── utils/               # 工具函数
│   ├── export.ts        # 导出功能
│   ├── markdown.ts      # Markdown处理
│   └── index.ts         # 通用工具
├── types/               # TypeScript类型定义
│   └── index.ts         # 类型声明
├── App.vue              # 根组件
└── main.ts              # 应用入口
```

## 🚀 快速开始

### 环境要求
- Node.js >= 18.0.0
- pnpm >= 8.0.0 (推荐)

### 安装依赖
```bash
pnpm install
```

### 开发模式
```bash
pnpm dev
```
打开 http://localhost:3000

### 构建生产版本
```bash
pnpm build:site
```

### 代码检查
```bash
pnpm lint
```

## 📝 使用说明

### 编辑器功能
1. **工具栏**: 快速插入标题、粗体、斜体、代码块、链接、图片、表格、图表
2. **快捷键**: 
   - `Ctrl+S`: 保存文档
   - `Ctrl+N`: 新建文档
   - `Ctrl+1/2/3`: 切换编辑/分屏/预览模式
3. **自动补全**: Monaco编辑器提供智能代码补全

### 预览功能
1. **实时渲染**: 编辑器内容实时转换为HTML预览
2. **代码高亮**: 支持多种编程语言语法高亮
3. **图表渲染**: `chart` 代码块自动渲染为ECharts图表
4. **表格增强**: 表格支持点击表头排序

### 存储与导出
1. **自动存储**: 内容自动保存到浏览器IndexedDB
2. **导出选项**:
   - HTML: 单个HTML文件，包含所有样式
   - 静态站点: 完整的可部署网站ZIP包

## 🎨 自定义配置

### 主题配置
在 `src/styles/index.css` 中自定义颜色主题：

```css
:root {
  --primary-color: #3b82f6;
  --background-color: #ffffff;
  --text-color: #1f2937;
}
```

### 编辑器配置
在 `src/composables/useEditor.ts` 中调整Monaco编辑器选项：

```typescript
const editorOptions = {
  fontSize: 14,
  fontFamily: 'JetBrains Mono',
  tabSize: 2,
  wordWrap: 'on',
  minimap: { enabled: true }
}
```

## 🔧 扩展功能

### 添加新的Markdown插件
在 `src/utils/markdown.ts` 中扩展Marked渲染器：

```typescript
renderer.custom = (token) => {
  // 自定义渲染逻辑
  return `<div class="custom">${token.text}</div>`
}
```

### 添加新的导出格式
在 `src/utils/export.ts` 中添加导出方法：

```typescript
static async exportAsCustomFormat(document: Document) {
  // 自定义导出逻辑
}
```

## 📊 面试要点

### 技术亮点
1. **现代化技术栈**: Vue 3 Composition API + TypeScript
2. **性能优化**: 虚拟滚动、代码分割、懒加载
3. **用户体验**: 实时预览、暗黑模式、响应式设计
4. **工程化**: ESLint + Prettier + TypeScript + Vite

### 可扩展性
1. **插件系统**: 可扩展的Markdown插件架构
2. **主题系统**: 可定制的主题配置
3. **存储抽象**: 可切换的存储后端（IndexedDB/Server）
4. **导出扩展**: 可添加更多导出格式

### 深度功能
1. **Web Worker**: 可扩展大文件处理到Worker线程
2. **Service Worker**: 离线缓存和PWA支持
3. **SSR支持**: 可扩展为支持服务端渲染
4. **协同编辑**: 可扩展为多人实时协作

## 🚀 部署

### GitHub Pages
1. 运行 `pnpm build:site`
2. 将 `dist/` 目录推送到 `gh-pages` 分支

### Netlify
1. 连接GitHub仓库
2. 设置构建命令: `pnpm build:site`
3. 设置发布目录: `dist`

### Vercel
1. 导入GitHub仓库
2. 自动检测框架设置
3. 一键部署

## 📄 开源协议

MIT License

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进项目！

---

*这是一个面向实习/校招的技术作品展示项目，展示了现代前端开发的最佳实践和技术栈运用。*