import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { EditorState, Document } from '@/types'

// 编辑器状态管理
export const useEditorStore = defineStore('editor', () => {
  // 状态
  const currentDocument = ref<Document | null>(null)
  const editorState = ref<EditorState>({
    content: '# Welcome to Interactive Blog Editor\n\n开始编写你的Markdown内容...\n\n```javascript\nconsole.log("Hello World!");\n```\n\n## 功能特性\n\n- ✨ 实时预览\n- 🎨 语法高亮\n- 📊 图表支持\n- 💾 本地存储\n- 🌙 暗黑模式',
    language: 'markdown',
    isModified: false,
    lastSaved: null,
  })
  
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const autoSaveEnabled = ref(true)
  const autoSaveInterval = ref(5000) // 5秒自动保存

  // 计算属性
  const hasUnsavedChanges = computed(() => editorState.value.isModified)
  const documentTitle = computed(() => {
    if (!currentDocument.value) return 'Untitled'
    return currentDocument.value.title
  })

  // 方法
  const updateContent = (content: string) => {
    editorState.value.content = content
    editorState.value.isModified = true
    error.value = null
  }

  const setCurrentDocument = (doc: Document) => {
    currentDocument.value = doc
    editorState.value.content = doc.content
    editorState.value.isModified = false
    editorState.value.lastSaved = doc.updatedAt
  }

  const createNewDocument = () => {
    const newDoc: Document = {
      id: generateId(),
      title: 'Untitled Document',
      content: '# New Document\n\n开始编写...',
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
      isPublic: false,
    }
    setCurrentDocument(newDoc)
  }

  const saveDocument = async () => {
    if (!currentDocument.value) return

    try {
      isLoading.value = true
      
      // 更新文档内容
      currentDocument.value.content = editorState.value.content
      currentDocument.value.updatedAt = new Date()
      
      // 保存到IndexedDB (通过composable实现)
      // await saveToStorage(currentDocument.value)
      
      editorState.value.isModified = false
      editorState.value.lastSaved = new Date()
      error.value = null
    } catch (err) {
      error.value = err instanceof Error ? err.message : '保存失败'
    } finally {
      isLoading.value = false
    }
  }

  const exportDocument = async (format: 'html' | 'pdf' | 'zip') => {
    console.log(`🚀 开始导出 ${format} 格式...`)
    
    if (!currentDocument.value) {
      console.error('❌ 没有当前文档可导出')
      error.value = '没有文档可导出'
      return
    }

    try {
      isLoading.value = true
      console.log('📄 当前文档:', currentDocument.value.title)
      console.log('📝 内容长度:', currentDocument.value.content.length)
      
      // 动态导入ExportUtils
      console.log('📦 导入导出工具...')
      const { ExportUtils } = await import('@/utils')
      console.log('✅ 导出工具导入成功')
      
      switch (format) {
        case 'html':
          console.log('🌐 开始HTML导出...')
          await ExportUtils.exportAsHTML(currentDocument.value)
          console.log('✅ HTML导出完成')
          break
        case 'zip':
          console.log('📦 开始静态站点导出...')
          await ExportUtils.exportAsStaticSite(currentDocument.value)
          console.log('✅ 静态站点导出完成')
          break
        default:
          throw new Error(`不支持的导出格式: ${format}`)
      }
      
      console.log(`🎉 ${format.toUpperCase()} 导出成功！`)
      error.value = null
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '导出失败'
      error.value = errorMessage
      console.error('❌ 导出失败:', err)
      console.error('错误详情:', {
        message: errorMessage,
        stack: err instanceof Error ? err.stack : undefined,
        format,
        document: currentDocument.value?.title
      })
    } finally {
      isLoading.value = false
      console.log('🏁 导出操作结束')
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // 状态
    currentDocument,
    editorState,
    isLoading,
    error,
    autoSaveEnabled,
    autoSaveInterval,
    
    // 计算属性
    hasUnsavedChanges,
    documentTitle,
    
    // 方法
    updateContent,
    setCurrentDocument,
    createNewDocument,
    saveDocument,
    exportDocument,
    clearError,
  }
})

// 工具函数
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}