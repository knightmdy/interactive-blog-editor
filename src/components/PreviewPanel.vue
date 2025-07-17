<template>
  <div class="preview-panel h-full flex flex-col">
    <!-- 预览工具栏 -->
    <div class="preview-toolbar bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100">
          实时预览
        </h3>
        
        <div class="flex items-center space-x-1">
          <button
            @click="toggleScrollSync"
            :class="[
              'toolbar-btn',
              { 'text-blue-600 dark:text-blue-400': settingsStore.previewConfig.enableScrollSync }
            ]"
            title="同步滚动"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16Z" />
            </svg>
          </button>
          
          <button
            @click="toggleLineNumbers"
            :class="[
              'toolbar-btn',
              { 'text-blue-600 dark:text-blue-400': settingsStore.previewConfig.showLineNumbers }
            ]"
            title="显示行号"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2,17H4V19H2V17M2,13H4V15H2V13M6,15H22V17H6V15M6,11H22V13H6V11M2,9H4V11H2V9M6,7H22V9H6V7M2,5H4V7H2V5Z" />
            </svg>
          </button>
          
          <div class="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
          
          <button
            @click="refreshPreview"
            class="toolbar-btn"
            title="刷新预览"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" />
            </svg>
          </button>
        </div>
      </div>
      
      <div class="flex items-center space-x-2">
        <!-- 导出选项 -->
        <div class="relative" ref="exportDropdownRef">
          <button
            @click="toggleExportDropdown"
            class="toolbar-btn flex items-center space-x-1"
            title="导出选项"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
            </svg>
            <span class="text-xs">导出</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7,10L12,15L17,10H7Z" />
            </svg>
          </button>
          
          <div
            v-show="showExportDropdown"
            class="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10"
          >
            <div class="py-1">
              <button
                @click="exportAs('html')"
                class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,17.56L16.07,16.43L16.62,10.33H9.38L9.2,8.3H16.8L17,6.31H7L7.56,12.32H14.45L14.22,14.9L12,15.5L9.78,14.9L9.64,13.24H7.64L7.93,16.43L12,17.56M4.07,3H19.93L18.5,19.2L12,21L5.5,19.2L4.07,3Z" />
                </svg>
                <span>导出为 HTML</span>
              </button>
              
              <button
                @click="exportAs('zip')"
                class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
                <span>导出为静态站点</span>
              </button>
            </div>
          </div>
        </div>
        
        <!-- 主题切换 -->
        <button
          @click="settingsStore.toggleTheme"
          class="toolbar-btn"
          title="切换主题"
        >
          <svg
            v-if="settingsStore.isDarkMode"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12,18C11.11,18 10.26,17.8 9.5,17.45C11.56,16.5 13,14.42 13,12C13,9.58 11.56,7.5 9.5,6.55C10.26,6.2 11.11,6 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31L23.31,12L20,8.69Z" />
          </svg>
          <svg
            v-else
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8M12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31L23.31,12L20,8.69Z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 预览内容区域 -->
    <div class="preview-content flex-1 overflow-hidden flex">
      <!-- 主预览区域 -->
      <div
        ref="previewContainer"
        class="preview-main flex-1 overflow-y-auto bg-white dark:bg-gray-900 p-6"
        @scroll="handlePreviewScroll"
      >
        <div
          v-if="previewInstance?.isLoading.value"
          class="flex items-center justify-center h-32"
        >
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
        
        <div
          v-else-if="previewInstance?.error.value"
          class="error-message bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
        >
          <h4 class="text-red-800 dark:text-red-300 font-medium">预览错误</h4>
          <p class="text-red-600 dark:text-red-400 text-sm mt-1">
            {{ previewInstance.error.value }}
          </p>
        </div>
        
        <article
          v-else
          class="prose prose-gray dark:prose-invert max-w-none"
          :class="{ 'prose-lg': settingsStore.settings.fontSize > 16 }"
          v-html="previewInstance?.previewHtml.value"
        ></article>
      </div>
      
      <!-- 目录侧栏 -->
      <div
        v-if="showToc && tocItems.length > 0"
        class="toc-sidebar w-64 bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4 overflow-y-auto"
      >
        <h4 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
          目录
        </h4>
        <nav class="toc-nav space-y-1">
          <a
            v-for="item in tocItems"
            :key="item.id"
            :href="`#${item.id}`"
            :class="[
              'block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 py-1 border-l-2 border-transparent hover:border-blue-500 transition-colors duration-200',
              {
                'ml-0': item.level === 1,
                'ml-3': item.level === 2,
                'ml-6': item.level === 3,
                'ml-9': item.level === 4,
                'ml-12': item.level === 5,
                'ml-15': item.level === 6,
              }
            ]"
            @click.prevent="scrollToHeading(item.id)"
          >
            {{ item.text }}
          </a>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { usePreview } from '@/composables'
import { useEditorStore, useSettingsStore } from '@/stores'

// Store
const editorStore = useEditorStore()
const settingsStore = useSettingsStore()

// 模板和引用
const previewContainer = ref<HTMLElement>()
const exportDropdownRef = ref<HTMLElement>()
const showExportDropdown = ref(false)
const showToc = ref(true)

// 预览实例
let previewInstance: ReturnType<typeof usePreview> | null = null

// 计算属性
const tocItems = computed(() => {
  return previewInstance?.getToc.value || []
})

// 方法
const toggleScrollSync = () => {
  settingsStore.updatePreviewConfig({
    enableScrollSync: !settingsStore.previewConfig.enableScrollSync,
  })
}

const toggleLineNumbers = () => {
  settingsStore.updatePreviewConfig({
    showLineNumbers: !settingsStore.previewConfig.showLineNumbers,
  })
}

const refreshPreview = () => {
  if (previewInstance) {
    previewInstance.updateContent(editorStore.editorState.content)
  }
}

const toggleExportDropdown = () => {
  showExportDropdown.value = !showExportDropdown.value
}

const exportAs = async (format: 'html' | 'zip') => {
  showExportDropdown.value = false
  await editorStore.exportDocument(format)
}

const scrollToHeading = (id: string) => {
  const element = previewContainer.value?.querySelector(`#${id}`)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const handlePreviewScroll = () => {
  // 预览区域滚动同步到编辑器的逻辑
  if (settingsStore.previewConfig.enableScrollSync) {
    // TODO: 实现滚动同步
    console.log('Preview scroll sync')
  }
}

// 监听编辑器内容变化
watch(
  () => editorStore.editorState.content,
  (newContent) => {
    if (previewInstance) {
      previewInstance.updateContent(newContent)
    }
  },
  { immediate: true }
)

// 点击外部关闭下拉菜单
const handleClickOutside = (event: Event) => {
  if (exportDropdownRef.value && !exportDropdownRef.value.contains(event.target as Node)) {
    showExportDropdown.value = false
  }
}

// 初始化预览
const initPreview = async () => {
  previewInstance = usePreview()
  await previewInstance.init()
  
  // 设置初始内容
  previewInstance.updateContent(editorStore.editorState.content)
}

// 生命周期
onMounted(async () => {
  await initPreview()
  document.addEventListener('click', handleClickOutside)
  
  // 添加全局样式和脚本
  addGlobalStyles()
  addGlobalScripts()
})

// 添加全局样式
const addGlobalStyles = () => {
  const style = document.createElement('style')
  style.textContent = `
    /* 预览样式增强 */
    .code-block-container {
      position: relative;
      margin: 1rem 0;
    }
    
    .code-block-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f3f4f6;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem 0.5rem 0 0;
      font-size: 0.875rem;
      color: #6b7280;
    }
    
    .dark .code-block-header {
      background: #374151;
      color: #9ca3af;
    }
    
    .run-code-btn {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.5rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .run-code-btn:hover {
      background: #2563eb;
    }
    
    .table-container {
      overflow-x: auto;
      margin: 1rem 0;
    }
    
    .sortable-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .sortable-table th {
      position: relative;
      cursor: pointer;
      user-select: none;
    }
    
    .sortable-table th:hover {
      background: #f3f4f6;
    }
    
    .dark .sortable-table th:hover {
      background: #374151;
    }
    
    .image-container {
      text-align: center;
      margin: 1rem 0;
    }
    
    .zoomable-image {
      cursor: zoom-in;
      transition: transform 0.2s;
    }
    
    .zoomable-image:hover {
      transform: scale(1.02);
    }
    
    .image-caption {
      font-style: italic;
      color: #6b7280;
      font-size: 0.875rem;
      margin-top: 0.5rem;
    }
    
    .dark .image-caption {
      color: #9ca3af;
    }
    
    .external-link-icon {
      display: inline;
      margin-left: 0.25rem;
      opacity: 0.6;
    }
    
    .chart-container {
      margin: 1rem 0;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      overflow: hidden;
    }
    
    .dark .chart-container {
      border-color: #374151;
    }
    
    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f9fafb;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .dark .chart-header {
      background: #1f2937;
      border-color: #374151;
    }
    
    .chart-canvas {
      height: 300px;
      padding: 1rem;
    }
    
    .edit-chart-btn {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.5rem;
      background: #10b981;
      color: white;
      border: none;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .edit-chart-btn:hover {
      background: #059669;
    }
  `
  document.head.appendChild(style)
}

// 添加全局脚本
const addGlobalScripts = () => {
  // 代码运行功能
  ;(window as any).runCode = (language: string, code: string) => {
    console.log(`Running ${language} code:`, code)
    // TODO: 实现代码运行逻辑
  }
  
  // 图片缩放功能
  ;(window as any).zoomImage = (img: HTMLImageElement) => {
    // TODO: 实现图片缩放逻辑
    console.log('Zooming image:', img.src)
  }
  
  // 图表编辑功能
  ;(window as any).editChart = (chartId: string) => {
    // TODO: 实现图表编辑逻辑
    console.log('Editing chart:', chartId)
  }
}
</script>

<style scoped>
.toolbar-btn {
  @apply inline-flex items-center justify-center px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors duration-200;
}

.preview-content {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.toc-nav a {
  @apply pl-2;
}

.toc-nav a:hover {
  @apply pl-1;
}
</style>