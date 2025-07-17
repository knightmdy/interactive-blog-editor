import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as monaco from 'monaco-editor'
import { useEditorStore, useSettingsStore } from '@/stores'

// 配置Monaco Editor的worker
self.MonacoEnvironment = {
  getWorkerUrl: function (moduleId, label) {
    if (label === 'json') {
      return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
        importScripts('https://unpkg.com/monaco-editor@0.44.0/min/vs/language/json/json.worker.js');
      `)}`
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
        importScripts('https://unpkg.com/monaco-editor@0.44.0/min/vs/language/css/css.worker.js');
      `)}`
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
        importScripts('https://unpkg.com/monaco-editor@0.44.0/min/vs/language/html/html.worker.js');
      `)}`
    }
    if (label === 'typescript' || label === 'javascript') {
      return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
        importScripts('https://unpkg.com/monaco-editor@0.44.0/min/vs/language/typescript/ts.worker.js');
      `)}`
    }
    return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
      importScripts('https://unpkg.com/monaco-editor@0.44.0/min/vs/editor/editor.worker.js');
    `)}`
  }
}

// Monaco Editor 组合式函数
export function useEditor(container: HTMLElement) {
  const editorStore = useEditorStore()
  const settingsStore = useSettingsStore()
  
  const editor = ref<monaco.editor.IStandaloneCodeEditor | null>(null)
  const isReady = ref(false)

  // 初始化编辑器
  const initEditor = () => {
    if (!container || editor.value) return

    try {
      // 创建Monaco编辑器实例
      editor.value = monaco.editor.create(container, {
        value: editorStore.editorState.content,
        language: 'markdown',
        theme: settingsStore.isDarkMode ? 'vs-dark' : 'vs',
        fontSize: settingsStore.settings.fontSize,
        fontFamily: settingsStore.settings.fontFamily,
        tabSize: settingsStore.settings.tabSize,
        wordWrap: settingsStore.settings.wordWrap ? 'on' : 'off',
        minimap: {
          enabled: settingsStore.settings.showMinimap,
        },
        automaticLayout: true,
        scrollBeyondLastLine: false,
        lineNumbers: 'on',
        renderWhitespace: 'selection',
        formatOnPaste: true,
        formatOnType: true,
        // 确保编辑器可编辑
        readOnly: false,
        // 禁用不必要的功能以提高性能
        quickSuggestions: false,
        parameterHints: {
          enabled: false
        },
        suggestOnTriggerCharacters: false,
        acceptSuggestionOnEnter: 'off',
        tabCompletion: 'off',
        wordBasedSuggestions: false
      })

      // 监听内容变化
      editor.value.onDidChangeModelContent(() => {
        if (editor.value) {
          const content = editor.value.getValue()
          editorStore.updateContent(content)
        }
      })

      // 确保编辑器获得焦点
      setTimeout(() => {
        if (editor.value) {
          editor.value.focus()
        }
      }, 100)

      isReady.value = true
      console.log('Monaco Editor initialized successfully')
    } catch (error) {
      console.error('Failed to initialize Monaco Editor:', error)
    }
  }

  // 设置编辑器内容
  const setContent = (content: string) => {
    if (editor.value) {
      editor.value.setValue(content)
    }
  }

  // 获取编辑器内容
  const getContent = () => {
    return editor.value?.getValue() || ''
  }

  // 插入文本
  const insertText = (text: string) => {
    if (editor.value) {
      const selection = editor.value.getSelection()
      if (selection) {
        editor.value.executeEdits('insert', [{
          range: selection,
          text,
          forceMoveMarkers: true,
        }])
        editor.value.focus()
      }
    }
  }

  // 格式化文档
  const formatDocument = async () => {
    if (editor.value) {
      await editor.value.getAction('editor.action.formatDocument')?.run()
    }
  }

  // 查找替换
  const findAndReplace = (findText: string, replaceText: string) => {
    if (editor.value) {
      const model = editor.value.getModel()
      if (model) {
        const matches = model.findMatches(findText, false, false, false, null, false)
        const edits = matches.map(match => ({
          range: match.range,
          text: replaceText,
        }))
        editor.value.executeEdits('replace', edits)
      }
    }
  }

  // 监听设置变化，更新编辑器配置
  watch(() => settingsStore.settings, (newSettings) => {
    if (editor.value) {
      editor.value.updateOptions({
        fontSize: newSettings.fontSize,
        fontFamily: newSettings.fontFamily,
        tabSize: newSettings.tabSize,
        wordWrap: newSettings.wordWrap ? 'on' : 'off',
        minimap: {
          enabled: newSettings.showMinimap,
        },
      })
    }
  }, { deep: true })

  // 监听主题变化
  watch(() => settingsStore.isDarkMode, (isDark) => {
    if (editor.value) {
      monaco.editor.setTheme(isDark ? 'vs-dark' : 'vs')
    }
  })

  // 监听编辑器状态内容变化
  watch(() => editorStore.editorState.content, (newContent) => {
    if (editor.value && editor.value.getValue() !== newContent) {
      setContent(newContent)
    }
  })

  // 清理资源
  const dispose = () => {
    if (editor.value) {
      editor.value.dispose()
      editor.value = null
      isReady.value = false
    }
  }

  // 初始化编辑器（延迟执行以确保DOM已渲染）
  setTimeout(() => {
    initEditor()
  }, 100)

  onUnmounted(() => {
    dispose()
  })

  return {
    editor,
    isReady,
    setContent,
    getContent,
    insertText,
    formatDocument,
    findAndReplace,
    dispose,
  }
}