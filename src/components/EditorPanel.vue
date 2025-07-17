<template>
  <div class="editor-panel h-full flex flex-col">
    <!-- 编辑器工具栏 -->
    <div class="editor-toolbar bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <button
          @click="insertTemplate('heading')"
          class="toolbar-btn"
          title="插入标题"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5,4V7H10.5V19H13.5V7H19V4H5Z" />
          </svg>
        </button>
        
        <button
          @click="insertTemplate('bold')"
          class="toolbar-btn"
          title="粗体"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.5,15.5H10V12.5H13.5A1.5,1.5 0 0,1 13.5,15.5M10,6.5H13A1.5,1.5 0 0,1 13,9.5H10M15.6,10.79C16.57,10.11 17.25,9.02 17.25,8C17.25,5.74 15.5,4 13.25,4H7V18H14.04C16.14,18 17.75,16.3 17.75,14.21C17.75,12.69 16.89,11.39 15.6,10.79Z" />
          </svg>
        </button>
        
        <button
          @click="insertTemplate('italic')"
          class="toolbar-btn"
          title="斜体"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10,4V7H12.21L8.79,15H6V18H14V15H11.79L15.21,7H18V4H10Z" />
          </svg>
        </button>
        
        <div class="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
        
        <button
          @click="insertTemplate('code')"
          class="toolbar-btn"
          title="代码块"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14.6,16.6L19.2,12L14.6,7.4L16,6L22,12L16,18L14.6,16.6M9.4,16.6L4.8,12L9.4,7.4L8,6L2,12L8,18L9.4,16.6Z" />
          </svg>
        </button>
        
        <button
          @click="insertTemplate('link')"
          class="toolbar-btn"
          title="链接"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3.9,12C3.9,10.29 5.29,8.9 7,8.9H11V7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H11V15.1H7C5.29,15.1 3.9,13.71 3.9,12M8,13H16V11H8V13M17,7H13V8.9H17C18.71,8.9 20.1,10.29 20.1,12C20.1,13.71 18.71,15.1 17,15.1H13V17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7Z" />
          </svg>
        </button>
        
        <button
          @click="insertTemplate('image')"
          class="toolbar-btn"
          title="图片"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z" />
          </svg>
        </button>
        
        <div class="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
        
        <button
          @click="insertTemplate('table')"
          class="toolbar-btn"
          title="表格"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5,4H19A2,2 0 0,1 21,6V18A2,2 0 0,1 19,20H5A2,2 0 0,1 3,18V6A2,2 0 0,1 5,4M5,8V12H11V8H5M13,8V12H19V8H13M5,14V18H11V14H5M13,14V18H19V14H13Z" />
          </svg>
        </button>
        
        <button
          @click="insertTemplate('chart')"
          class="toolbar-btn"
          title="图表"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22,21H2V3H4V19H6V17H10V19H12V16H16V19H18V17H22V21Z" />
          </svg>
        </button>
      </div>
      
      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-500 dark:text-gray-400">
          {{ editorStore.documentTitle }}
        </span>
        
        <div class="flex items-center space-x-1">
          <div
            v-if="editorStore.hasUnsavedChanges"
            class="w-2 h-2 bg-orange-500 rounded-full"
            title="有未保存的更改"
          ></div>
          
          <button
            @click="editorStore.saveDocument"
            :disabled="editorStore.isLoading || !editorStore.hasUnsavedChanges"
            class="toolbar-btn"
            title="保存文档 (Ctrl+S)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Monaco 编辑器容器 -->
    <div
      v-if="!useSimpleEditor"
      ref="editorContainer"
      class="editor-container flex-1 bg-white dark:bg-gray-900"
    ></div>
    
    <!-- 简单编辑器fallback -->
    <div
      v-else
      class="flex-1 bg-white dark:bg-gray-900"
    >
      <textarea
        ref="simpleEditorRef"
        v-model="simpleContent"
        class="w-full h-full p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-none outline-none resize-none font-mono"
        :style="{ fontSize: settingsStore.settings.fontSize + 'px' }"
        placeholder="在此输入Markdown内容..."
        @input="handleSimpleInput"
        @keydown="handleKeyDown"
      ></textarea>
    </div>
    
    <!-- 状态栏 -->
    <div class="status-bar bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
      <div class="flex items-center space-x-4">
        <span>行 {{ cursorPosition.line }}，列 {{ cursorPosition.column }}</span>
        <span>{{ wordCount }} 字</span>
        <span>{{ characterCount }} 字符</span>
      </div>
      
      <div class="flex items-center space-x-2">
        <span>Markdown</span>
        <span>UTF-8</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { useEditor } from '@/composables'
import { useEditorStore, useSettingsStore } from '@/stores'

// Store
const editorStore = useEditorStore()
const settingsStore = useSettingsStore()

// 模板和引用
const editorContainer = ref<HTMLElement>()
const simpleEditorRef = ref<HTMLTextAreaElement>()
const cursorPosition = ref({ line: 1, column: 1 })
const useSimpleEditor = ref(false)
const simpleContent = ref('')

// 编辑器实例
let editorInstance: ReturnType<typeof useEditor> | null = null

// 计算属性
const wordCount = computed(() => {
  const content = editorStore.editorState.content
  return content.replace(/\s+/g, ' ').trim().split(' ').filter(word => word.length > 0).length
})

const characterCount = computed(() => {
  return editorStore.editorState.content.length
})

// 简单编辑器处理
const handleSimpleInput = () => {
  editorStore.updateContent(simpleContent.value)
  updateSimpleCursorPosition()
}

const updateSimpleCursorPosition = () => {
  if (!simpleEditorRef.value) return
  
  const textarea = simpleEditorRef.value
  const text = textarea.value
  const cursorPos = textarea.selectionStart
  
  const lines = text.substring(0, cursorPos).split('\n')
  const line = lines.length
  const column = lines[lines.length - 1].length + 1
  
  cursorPosition.value = { line, column }
}

const insertSimpleText = (text: string) => {
  if (!simpleEditorRef.value) return
  
  const textarea = simpleEditorRef.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const before = simpleContent.value.substring(0, start)
  const after = simpleContent.value.substring(end)
  
  simpleContent.value = before + text + after
  editorStore.updateContent(simpleContent.value)
  
  nextTick(() => {
    const newPos = start + text.length
    textarea.setSelectionRange(newPos, newPos)
    textarea.focus()
    updateSimpleCursorPosition()
  })
}

// 插入模板
const insertTemplate = (type: string) => {
  const templates = {
    heading: '## 标题\n\n',
    bold: '**粗体文本**',
    italic: '*斜体文本*',
    code: '```javascript\n// 代码块\nconsole.log("Hello World!");\n```\n\n',
    link: '[链接文本](https://example.com)',
    image: '![图片描述](https://example.com/image.jpg)',
    table: `| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 数据1 | 数据2 | 数据3 |
| 数据4 | 数据5 | 数据6 |

`,
    chart: `\`\`\`chart
{
  "type": "line",
  "data": {
    "labels": ["1月", "2月", "3月", "4月", "5月"],
    "datasets": [{
      "label": "销售额",
      "data": [65, 59, 80, 81, 56],
      "borderColor": "rgb(75, 192, 192)",
      "backgroundColor": "rgba(75, 192, 192, 0.2)"
    }]
  },
  "options": {
    "responsive": true,
    "plugins": {
      "title": {
        "display": true,
        "text": "月度销售额趋势"
      }
    }
  }
}
\`\`\`

`,
  }

  const templateText = templates[type as keyof typeof templates] || ''
  
  if (useSimpleEditor.value) {
    insertSimpleText(templateText)
  } else if (editorInstance) {
    editorInstance.insertText(templateText)
  }
}

// 监听光标位置变化
const updateCursorPosition = () => {
  if (editorInstance?.editor.value) {
    const position = editorInstance.editor.value.getPosition()
    if (position) {
      cursorPosition.value = {
        line: position.lineNumber,
        column: position.column,
      }
    }
  }
}

// 键盘快捷键
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.ctrlKey || event.metaKey) {
    switch (event.key) {
      case 's':
        event.preventDefault()
        editorStore.saveDocument()
        break
      case 'n':
        event.preventDefault()
        editorStore.createNewDocument()
        break
    }
  }
}

// 初始化编辑器
const initEditor = async () => {
  // 首先尝试使用简单编辑器
  useSimpleEditor.value = true
  simpleContent.value = editorStore.editorState.content
  
  await nextTick()
  
  if (simpleEditorRef.value) {
    simpleEditorRef.value.addEventListener('click', updateSimpleCursorPosition)
    simpleEditorRef.value.addEventListener('keyup', updateSimpleCursorPosition)
    
    setTimeout(() => {
      simpleEditorRef.value?.focus()
      console.log('Simple editor initialized successfully')
    }, 100)
  }
  
  // 可选：尝试初始化Monaco编辑器作为升级
  // tryInitMonaco()
}

// 尝试初始化Monaco编辑器（可选）
const tryInitMonaco = async () => {
  if (!editorContainer.value) return

  try {
    await nextTick()
    
    // 确保容器有尺寸
    if (editorContainer.value.offsetHeight === 0) {
      setTimeout(() => {
        tryInitMonaco()
      }, 100)
      return
    }
    
    editorInstance = useEditor(editorContainer.value)
    
    // 监听编辑器就绪
    watch(() => editorInstance?.isReady.value, (isReady) => {
      if (isReady && editorInstance?.editor.value) {
        // 切换到Monaco编辑器
        useSimpleEditor.value = false
        
        // 监听光标位置变化
        editorInstance.editor.value.onDidChangeCursorPosition(() => {
          updateCursorPosition()
        })
        
        // 初始光标位置
        updateCursorPosition()
        
        console.log('Monaco editor initialized successfully')
      }
    }, { immediate: true })
  } catch (error) {
    console.warn('Monaco editor failed to initialize, using simple editor:', error)
  }
}

// 监听编辑器状态变化
watch(() => editorStore.editorState.content, (newContent) => {
  if (useSimpleEditor.value && simpleContent.value !== newContent) {
    simpleContent.value = newContent
  }
}, { immediate: true })

// 生命周期
onMounted(() => {
  initEditor()
  document.addEventListener('keydown', handleKeyDown)
})

// 清理
defineExpose({
  insertTemplate,
})
</script>

<style scoped>
.toolbar-btn {
  @apply inline-flex items-center justify-center w-8 h-8 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors duration-200;
}

.toolbar-btn:disabled {
  @apply opacity-50 cursor-not-allowed hover:bg-transparent dark:hover:bg-transparent;
}

.editor-container {
  font-family: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', monospace;
}
</style>