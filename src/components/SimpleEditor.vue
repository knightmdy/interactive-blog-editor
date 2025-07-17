<template>
  <div class="simple-editor h-full flex flex-col">
    <!-- 简单编辑器工具栏 -->
    <div class="editor-toolbar bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-600 dark:text-gray-400">
          简单编辑器模式
        </span>
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

    <!-- 简单文本编辑器 -->
    <textarea
      ref="textareaRef"
      v-model="content"
      class="flex-1 w-full p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-none outline-none resize-none font-mono"
      :style="{ fontSize: settingsStore.settings.fontSize + 'px' }"
      placeholder="在此输入Markdown内容..."
      @input="handleInput"
      @keydown="handleKeyDown"
    ></textarea>
    
    <!-- 状态栏 -->
    <div class="status-bar bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
      <div class="flex items-center space-x-4">
        <span>行 {{ cursorPosition.line }}，列 {{ cursorPosition.column }}</span>
        <span>{{ wordCount }} 字</span>
        <span>{{ characterCount }} 字符</span>
      </div>
      
      <div class="flex items-center space-x-2">
        <span>Markdown</span>
        <span>简单模式</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useEditorStore, useSettingsStore } from '@/stores'

// Store
const editorStore = useEditorStore()
const settingsStore = useSettingsStore()

// 引用
const textareaRef = ref<HTMLTextAreaElement>()
const content = ref('')
const cursorPosition = ref({ line: 1, column: 1 })

// 计算属性
const wordCount = computed(() => {
  return content.value.replace(/\s+/g, ' ').trim().split(' ').filter(word => word.length > 0).length
})

const characterCount = computed(() => {
  return content.value.length
})

// 处理输入
const handleInput = () => {
  editorStore.updateContent(content.value)
  updateCursorPosition()
}

// 更新光标位置
const updateCursorPosition = () => {
  if (!textareaRef.value) return
  
  const textarea = textareaRef.value
  const text = textarea.value
  const cursorPos = textarea.selectionStart
  
  const lines = text.substring(0, cursorPos).split('\n')
  const line = lines.length
  const column = lines[lines.length - 1].length + 1
  
  cursorPosition.value = { line, column }
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
  
  // 更新光标位置
  nextTick(() => {
    updateCursorPosition()
  })
}

// 监听编辑器状态变化
watch(() => editorStore.editorState.content, (newContent) => {
  if (content.value !== newContent) {
    content.value = newContent
  }
}, { immediate: true })

// 监听焦点事件
onMounted(() => {
  if (textareaRef.value) {
    textareaRef.value.addEventListener('click', updateCursorPosition)
    textareaRef.value.addEventListener('keyup', updateCursorPosition)
    
    // 自动获得焦点
    setTimeout(() => {
      textareaRef.value?.focus()
    }, 100)
  }
})

// 对外暴露插入文本的方法
const insertText = (text: string) => {
  if (!textareaRef.value) return
  
  const textarea = textareaRef.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const before = content.value.substring(0, start)
  const after = content.value.substring(end)
  
  content.value = before + text + after
  editorStore.updateContent(content.value)
  
  nextTick(() => {
    const newPos = start + text.length
    textarea.setSelectionRange(newPos, newPos)
    textarea.focus()
    updateCursorPosition()
  })
}

defineExpose({
  insertText,
})
</script>

<style scoped>
.toolbar-btn {
  @apply inline-flex items-center justify-center w-8 h-8 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors duration-200;
}

.toolbar-btn:disabled {
  @apply opacity-50 cursor-not-allowed hover:bg-transparent dark:hover:bg-transparent;
}

textarea {
  font-family: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', monospace;
  line-height: 1.5;
  tab-size: 2;
}
</style>