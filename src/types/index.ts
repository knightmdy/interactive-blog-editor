// 主题类型
export type Theme = 'light' | 'dark'

// 编辑器状态
export interface EditorState {
  content: string
  language: string
  isModified: boolean
  lastSaved: Date | null
}

// 预览配置
export interface PreviewConfig {
  theme: Theme
  showLineNumbers: boolean
  enableScrollSync: boolean
  customCSS: string
}

// 文档类型
export interface Document {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  tags: string[]
  isPublic: boolean
}

// 导出配置
export interface ExportConfig {
  format: 'html' | 'pdf' | 'zip'
  includeCSS: boolean
  customTheme?: string
  minify: boolean
}

// 图表配置
export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'scatter'
  data: any[]
  options: Record<string, any>
}

// 代码块配置
export interface CodeBlockConfig {
  language: string
  theme: string
  showLineNumbers: boolean
  wrapLongLines: boolean
  executable: boolean
}

// 应用设置
export interface AppSettings {
  theme: Theme
  autoSave: boolean
  autoSaveInterval: number
  showMinimap: boolean
  fontSize: number
  fontFamily: string
  tabSize: number
  wordWrap: boolean
}

// Markdown 解析选项
export interface MarkdownOptions {
  breaks: boolean
  linkify: boolean
  typographer: boolean
  highlight: boolean
  html: boolean
}

// 搜索结果
export interface SearchResult {
  id: string
  title: string
  content: string
  matches: Array<{
    line: number
    text: string
    highlight: string
  }>
}

// 错误类型
export interface AppError {
  code: string
  message: string
  stack?: string
  timestamp: Date
}