<template>
  <div
    id="app"
    class="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
  >
    <!-- 顶部导航栏 -->
    <header class="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div class="h-14 px-4 flex items-center justify-between">
        <!-- 左侧标题和控制 -->
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
            </div>
            <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100">
              Interactive Blog Editor
            </h1>
          </div>
          
          <div class="hidden md:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <span>|</span>
            <span>{{ currentDocumentTitle }}</span>
            <div
              v-if="editorStore.hasUnsavedChanges"
              class="w-2 h-2 bg-orange-500 rounded-full"
              title="有未保存的更改"
            ></div>
          </div>
        </div>

        <!-- 右侧操作区 -->
        <div class="flex items-center space-x-2">
          <!-- 文档操作 -->
          <div class="hidden md:flex items-center space-x-1">
            <button
              @click="editorStore.createNewDocument"
              class="btn-ghost text-sm px-3 py-1.5"
              title="新建文档 (Ctrl+N)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="mr-1">
                <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
              </svg>
              新建
            </button>
            
            <button
              @click="editorStore.saveDocument"
              :disabled="editorStore.isLoading || !editorStore.hasUnsavedChanges"
              class="btn-ghost text-sm px-3 py-1.5"
              title="保存文档 (Ctrl+S)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="mr-1">
                <path d="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z" />
              </svg>
              保存
            </button>
          </div>

          <div class="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

          <!-- 视图控制 -->
          <div class="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              @click="setLayoutMode('edit')"
              :class="[
                'px-3 py-1 text-sm rounded transition-colors duration-200',
                layoutMode === 'edit'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              ]"
              title="编辑模式"
            >
              编辑
            </button>
            <button
              @click="setLayoutMode('split')"
              :class="[
                'px-3 py-1 text-sm rounded transition-colors duration-200',
                layoutMode === 'split'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              ]"
              title="分屏模式"
            >
              分屏
            </button>
            <button
              @click="setLayoutMode('preview')"
              :class="[
                'px-3 py-1 text-sm rounded transition-colors duration-200',
                layoutMode === 'preview'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              ]"
              title="预览模式"
            >
              预览
            </button>
          </div>

          <div class="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

          <!-- 主题切换 -->
          <button
            @click="settingsStore.toggleTheme"
            class="btn-ghost p-2"
            title="切换主题"
          >
            <svg
              v-if="settingsStore.isDarkMode"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8M12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31L23.31,12L20,8.69Z" />
            </svg>
            <svg
              v-else
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12,18C11.11,18 10.26,17.8 9.5,17.45C11.56,16.5 13,14.42 13,12C13,9.58 11.56,7.5 9.5,6.55C10.26,6.2 11.11,6 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31L23.31,12L20,8.69Z" />
            </svg>
          </button>

          <!-- 设置菜单 -->
          <div class="relative" ref="settingsDropdownRef">
            <button
              @click="toggleSettingsDropdown"
              class="btn-ghost p-2"
              title="设置"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
              </svg>
            </button>

            <div
              v-show="showSettingsDropdown"
              class="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10"
            >
              <div class="py-1">
                <div class="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                  编辑器设置
                </div>
                <label class="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  <input
                    v-model="settingsStore.settings.autoSave"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  >
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">自动保存</span>
                </label>
                <label class="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  <input
                    v-model="settingsStore.settings.showMinimap"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  >
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">显示小地图</span>
                </label>
                <label class="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  <input
                    v-model="settingsStore.settings.wordWrap"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  >
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">自动换行</span>
                </label>
                <div class="border-t border-gray-200 dark:border-gray-700"></div>
                <button
                  @click="showAbout"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  关于
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 主内容区域 -->
    <main class="flex-1 overflow-hidden">
      <div class="h-full flex">
        <!-- 编辑器面板 -->
        <div
          v-show="layoutMode === 'edit' || layoutMode === 'split'"
          :class="[
            'bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700',
            layoutMode === 'split' ? 'w-1/2' : 'w-full'
          ]"
        >
          <EditorPanel />
        </div>

        <!-- 分割线 -->
        <div
          v-if="layoutMode === 'split'"
          class="w-1 bg-gray-200 dark:bg-gray-700 cursor-col-resize hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          @mousedown="startResize"
        ></div>

        <!-- 预览面板 -->
        <div
          v-show="layoutMode === 'preview' || layoutMode === 'split'"
          :class="[
            'bg-white dark:bg-gray-900',
            layoutMode === 'split' ? 'w-1/2' : 'w-full'
          ]"
        >
          <PreviewPanel />
        </div>
      </div>
    </main>

    <!-- 状态栏 -->
    <footer class="flex-shrink-0 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-1">
      <div class="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
        <div class="flex items-center space-x-4">
          <span v-if="editorStore.isLoading" class="flex items-center space-x-1">
            <div class="loading-spinner"></div>
            <span>保存中...</span>
          </span>
          <span v-else-if="editorStore.editorState.lastSaved">
            最后保存: {{ formatLastSaved(editorStore.editorState.lastSaved) }}
          </span>
          <span v-if="editorStore.error" class="text-red-600 dark:text-red-400">
            {{ editorStore.error }}
          </span>
        </div>
        
        <div class="flex items-center space-x-4">
          <span>{{ layoutMode === 'split' ? '分屏' : layoutMode === 'edit' ? '编辑' : '预览' }}</span>
          <span>{{ settingsStore.isDarkMode ? '暗黑' : '亮色' }}</span>
          <span>Ready</span>
        </div>
      </div>
    </footer>

    <!-- 全局错误提示 -->
    <div
      v-if="editorStore.error"
      class="fixed top-4 right-4 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-200 px-4 py-2 rounded-lg shadow-lg z-50 animate-slide-down"
    >
      <div class="flex items-center space-x-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
        </svg>
        <span>{{ editorStore.error }}</span>
        <button
          @click="editorStore.clearError"
          class="ml-2 text-red-600 hover:text-red-800 dark:text-red-300 dark:hover:text-red-100"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { EditorPanel, PreviewPanel } from '@/components'
import { useEditorStore, useSettingsStore } from '@/stores'
import { useStorage } from '@/composables'
import { utils } from '@/utils'

// Store
const editorStore = useEditorStore()
const settingsStore = useSettingsStore()

// 响应式状态
const layoutMode = ref<'edit' | 'split' | 'preview'>('split')
const showSettingsDropdown = ref(false)
const settingsDropdownRef = ref<HTMLElement>()

// 存储实例
const storage = useStorage()

// 计算属性
const currentDocumentTitle = computed(() => {
  return editorStore.documentTitle || 'Untitled'
})

// 方法
const setLayoutMode = (mode: typeof layoutMode.value) => {
  layoutMode.value = mode
}

const toggleSettingsDropdown = () => {
  showSettingsDropdown.value = !showSettingsDropdown.value
}

const formatLastSaved = (date: Date) => {
  return utils.formatTimeAgo(date)
}

const showAbout = () => {
  showSettingsDropdown.value = false
  alert(`Interactive Blog Editor v1.0.0
  
一个基于 Vue 3 + TypeScript 的现代化 Markdown 编辑器

特性:
• 实时预览
• 语法高亮
• 暗黑模式
• 本地存储
• 多种导出格式
• 图表支持

技术栈:
• Vue 3.4 + TypeScript
• Vite 5
• Pinia
• TailwindCSS
• Monaco Editor
• Marked + Shiki

开发者: Interactive Blog Editor Team`)
}

// 面板大小调整
const startResize = (e: MouseEvent) => {
  e.preventDefault()
  
  const container = (e.currentTarget as HTMLElement)?.parentElement
  if (!container) return
  
  const startX = e.clientX
  const containerRect = container.getBoundingClientRect()
  const leftPanel = container.querySelector('div:first-child') as HTMLElement
  const rightPanel = container.querySelector('div:last-child') as HTMLElement
  
  const onMouseMove = (e: MouseEvent) => {
    const deltaX = e.clientX - startX
    const containerWidth = containerRect.width
    const newLeftWidth = Math.max(200, Math.min(containerWidth - 200, containerWidth / 2 + deltaX))
    const leftPercentage = (newLeftWidth / containerWidth) * 100
    const rightPercentage = 100 - leftPercentage
    
    leftPanel.style.width = `${leftPercentage}%`
    rightPanel.style.width = `${rightPercentage}%`
  }
  
  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }
  
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
}

// 全局键盘快捷键
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.ctrlKey || event.metaKey) {
    switch (event.key) {
      case 'n':
        event.preventDefault()
        editorStore.createNewDocument()
        break
      case 's':
        event.preventDefault()
        editorStore.saveDocument()
        break
      case '1':
        event.preventDefault()
        setLayoutMode('edit')
        break
      case '2':
        event.preventDefault()
        setLayoutMode('split')
        break
      case '3':
        event.preventDefault()
        setLayoutMode('preview')
        break
      case ',':
        event.preventDefault()
        toggleSettingsDropdown()
        break
    }
  }
  
  // ESC 关闭下拉菜单
  if (event.key === 'Escape') {
    showSettingsDropdown.value = false
  }
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event: Event) => {
  if (settingsDropdownRef.value && !settingsDropdownRef.value.contains(event.target as Node)) {
    showSettingsDropdown.value = false
  }
}

// 自动保存功能
const autoSave = utils.debounce(() => {
  if (settingsStore.settings.autoSave && editorStore.hasUnsavedChanges) {
    editorStore.saveDocument()
  }
}, settingsStore.settings.autoSaveInterval)

// 初始化应用
const initApp = async () => {
  try {
    // 初始化设置
    settingsStore.initSettings()
    
    // 初始化存储
    await storage.initDB()
    
    // 加载最近的草稿
    const recentDraft = await storage.getRecentDraft()
    if (recentDraft) {
      editorStore.setCurrentDocument(recentDraft)
    } else {
      editorStore.createNewDocument()
    }
    
    // 启动自动保存
    if (settingsStore.settings.autoSave) {
      setInterval(autoSave, settingsStore.settings.autoSaveInterval)
    }
  } catch (error) {
    console.error('App initialization failed:', error)
  }
}

// 生命周期
onMounted(() => {
  initApp()
  document.addEventListener('keydown', handleKeyDown)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* 组件特定样式 */
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* 确保分割线可见 */
.cursor-col-resize {
  cursor: col-resize !important;
}

/* 下拉菜单动画 */
.settings-dropdown-enter-active,
.settings-dropdown-leave-active {
  transition: all 0.2s ease;
}

.settings-dropdown-enter-from,
.settings-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>