<template>
  <div class="export-test-panel p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
    <h3 class="text-lg font-semibold mb-4">导出功能测试</h3>
    
    <div class="test-info mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-700">
      <h4 class="font-medium text-blue-900 dark:text-blue-100">当前文档状态:</h4>
      <p class="text-sm text-blue-700 dark:text-blue-300">
        标题: {{ currentDoc?.title || '未知' }}<br>
        内容长度: {{ currentDoc?.content?.length || 0 }} 字符<br>
        创建时间: {{ currentDoc?.createdAt ? formatDate(currentDoc.createdAt) : '未知' }}
      </p>
    </div>
    
    <div class="test-buttons space-y-2">
      <button
        @click="testHTMLExport"
        :disabled="isExporting"
        class="w-full btn btn-primary"
      >
        {{ isExporting ? '导出中...' : '测试 HTML 导出' }}
      </button>
      
      <button
        @click="testPDFExport"
        :disabled="isExporting"
        class="w-full btn btn-secondary"
      >
        {{ isExporting ? '导出中...' : '测试 PDF 导出' }}
      </button>
      
      <button
        @click="testZIPExport"
        :disabled="isExporting"
        class="w-full btn btn-secondary"
      >
        {{ isExporting ? '导出中...' : '测试 ZIP 导出' }}
      </button>
    </div>
    
    <div v-if="testResults.length > 0" class="test-results mt-4 space-y-2">
      <h4 class="font-medium">测试结果:</h4>
      <div
        v-for="(result, index) in testResults"
        :key="index"
        :class="[
          'p-2 rounded text-sm',
          result.success 
            ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-700'
            : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-700'
        ]"
      >
        <strong>{{ result.type }}:</strong> {{ result.message }}
        <div v-if="result.error" class="text-xs mt-1 font-mono">
          {{ result.error }}
        </div>
      </div>
    </div>
    
    <div class="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-700">
      <p class="text-sm text-yellow-800 dark:text-yellow-200">
        💡 <strong>调试提示:</strong> 请打开浏览器控制台查看详细的导出日志信息
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useEditorStore } from '@/stores'

const editorStore = useEditorStore()

const isExporting = ref(false)
const testResults = ref<Array<{
  type: string
  success: boolean
  message: string
  error?: string
}>>([])

const currentDoc = computed(() => editorStore.currentDocument)

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const addTestResult = (type: string, success: boolean, message: string, error?: string) => {
  testResults.value.unshift({
    type,
    success,
    message,
    error
  })
  
  // 保留最近5条结果
  if (testResults.value.length > 5) {
    testResults.value = testResults.value.slice(0, 5)
  }
}

const testHTMLExport = async () => {
  console.log('🧪 开始测试HTML导出...')
  
  if (!currentDoc.value) {
    addTestResult('HTML', false, '没有可导出的文档')
    return
  }
  
  try {
    isExporting.value = true
    console.log('📄 当前文档:', currentDoc.value)
    
    await editorStore.exportDocument('html')
    addTestResult('HTML', true, '导出成功！应该已开始下载HTML文件')
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : '未知错误'
    console.error('HTML导出测试失败:', error)
    addTestResult('HTML', false, `导出失败: ${errorMsg}`, error instanceof Error ? error.stack : undefined)
  } finally {
    isExporting.value = false
  }
}

const testPDFExport = async () => {
  console.log('🧪 开始测试PDF导出...')
  
  if (!currentDoc.value) {
    addTestResult('PDF', false, '没有可导出的文档')
    return
  }
  
  try {
    isExporting.value = true
    
    await editorStore.exportDocument('pdf')
    addTestResult('PDF', true, '导出成功！应该已打开打印对话框')
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : '未知错误'
    console.error('PDF导出测试失败:', error)
    addTestResult('PDF', false, `导出失败: ${errorMsg}`, error instanceof Error ? error.stack : undefined)
  } finally {
    isExporting.value = false
  }
}

const testZIPExport = async () => {
  console.log('🧪 开始测试ZIP导出...')
  
  if (!currentDoc.value) {
    addTestResult('ZIP', false, '没有可导出的文档')
    return
  }
  
  try {
    isExporting.value = true
    
    await editorStore.exportDocument('zip')
    addTestResult('ZIP', true, '导出成功！应该已开始下载ZIP文件')
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : '未知错误'
    console.error('ZIP导出测试失败:', error)
    addTestResult('ZIP', false, `导出失败: ${errorMsg}`, error instanceof Error ? error.stack : undefined)
  } finally {
    isExporting.value = false
  }
}
</script>

<style scoped>
.btn {
  @apply px-4 py-2 rounded font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700 disabled:hover:bg-blue-600;
}

.btn-secondary {
  @apply bg-gray-600 text-white hover:bg-gray-700 disabled:hover:bg-gray-600;
}
</style>