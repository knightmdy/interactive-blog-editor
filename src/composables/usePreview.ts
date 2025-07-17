import { ref, computed } from 'vue'
import { marked } from 'marked'
import { useSettingsStore } from '@/stores'

// Markdown预览组合式函数
export function usePreview() {
  const settingsStore = useSettingsStore()
  
  const rawContent = ref('')
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 配置marked选项
  const configureMarked = () => {
    marked.setOptions({
      breaks: true,
      gfm: true,
    })

    // 自定义渲染器
    const renderer = new marked.Renderer()
    
    // 自定义代码块渲染
    renderer.code = (code: string, language?: string) => {
      const lang = language || 'text'
      
      // 特殊处理图表代码块
      if (lang === 'chart') {
        try {
          const config = JSON.parse(code)
          const chartId = `chart-${Math.random().toString(36).substr(2, 9)}`
          
          return `
            <div class="chart-container" data-chart-id="${chartId}">
              <div class="chart-header">
                <span class="chart-type">${config.type || 'Chart'}</span>
                <button class="chart-edit-btn" onclick="editChart('${chartId}', ${JSON.stringify(config).replace(/"/g, '&quot;')})" title="编辑图表">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
                  </svg>
                </button>
              </div>
              <div id="${chartId}" class="chart-canvas" data-config='${JSON.stringify(config)}'></div>
            </div>
          `
        } catch (err) {
          return `<div class="error-block">图表配置解析错误: ${(err as Error).message}</div>`
        }
      }
      
      // 特殊处理可执行代码块
      if (['javascript', 'js', 'typescript', 'ts', 'html', 'css'].includes(lang)) {
        const codeId = `code-${Math.random().toString(36).substr(2, 9)}`
        
        return `
          <div class="code-block-container">
            <div class="code-block-header">
              <span class="language-label">${lang}</span>
              <div class="code-block-actions">
                <button class="code-copy-btn" onclick="copyCode('${codeId}')" title="复制代码">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" />
                  </svg>
                </button>
                <button class="code-run-btn" onclick="runCode('${codeId}', '${lang}')" title="运行代码">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                  </svg>
                </button>
              </div>
            </div>
            <pre><code id="${codeId}" class="language-${lang}">${escapeHtml(code)}</code></pre>
          </div>
        `
      }
      
      return `<pre><code class="language-${lang}">${escapeHtml(code)}</code></pre>`
    }

    // 自定义表格渲染
    renderer.table = (header: string, body: string) => {
      return `
        <div class="table-wrapper">
          <table class="markdown-table">
            <thead>${header}</thead>
            <tbody>${body}</tbody>
          </table>
        </div>
      `
    }

    // 自定义标题渲染（添加锚点）
    renderer.heading = (text: string, level: number) => {
      const anchor = generateAnchor(text)
      return `
        <h${level} id="${anchor}" class="heading-${level}">
          <a href="#${anchor}" class="heading-anchor" aria-hidden="true">#</a>
          ${text}
        </h${level}>
      `
    }

    // 自定义链接渲染
    renderer.link = (href: string, title: string | null, text: string) => {
      const isExternal = isExternalLink(href)
      const titleAttr = title ? ` title="${title}"` : ''
      const targetAttr = isExternal ? ' target="_blank" rel="noopener noreferrer"' : ''
      const externalIcon = isExternal ? ' <span class="external-link-icon">↗</span>' : ''
      
      return `<a href="${href}"${titleAttr}${targetAttr}>${text}${externalIcon}</a>`
    }

    marked.use({ renderer })
  }

  // 计算预览HTML
  const previewHtml = computed(() => {
    if (!rawContent.value) {
      return '<div class="preview-placeholder">在左侧编辑器中输入Markdown内容开始预览...</div>'
    }

    try {
      const html = marked(rawContent.value) as string
      return processSpecialBlocks(html)
    } catch (err) {
      error.value = (err as Error).message
      return `<div class="error-block">Markdown解析错误: ${error.value}</div>`
    }
  })

  // 处理特殊块
  const processSpecialBlocks = (html: string): string => {
    return html
  }

  // 更新内容
  const updateContent = (content: string) => {
    rawContent.value = content
    error.value = null
  }

  // 获取目录结构
  const getToc = computed(() => {
    const headings: Array<{ level: number; text: string; id: string }> = []
    const tokens = marked.lexer(rawContent.value)
    
    tokens.forEach((token) => {
      if (token.type === 'heading') {
        const id = generateAnchor(token.text)
        
        headings.push({
          level: token.depth,
          text: token.text,
          id,
        })
      }
    })
    
    return headings
  })

  // 初始化
  const init = async () => {
    isLoading.value = true
    try {
      configureMarked()
    } finally {
      isLoading.value = false
    }
  }

  return {
    rawContent,
    previewHtml,
    isLoading,
    error,
    updateContent,
    getToc,
    init,
  }
}

// 工具函数
function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

function generateAnchor(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function isExternalLink(href: string): boolean {
  try {
    const url = new URL(href, window.location.href)
    return url.hostname !== window.location.hostname
  } catch {
    return false
  }
}