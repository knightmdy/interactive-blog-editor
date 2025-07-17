import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Theme, AppSettings, PreviewConfig } from '@/types'

// 应用设置管理
export const useSettingsStore = defineStore('settings', () => {
  // 默认设置
  const defaultSettings: AppSettings = {
    theme: 'light',
    autoSave: true,
    autoSaveInterval: 5000,
    showMinimap: true,
    fontSize: 14,
    fontFamily: 'JetBrains Mono',
    tabSize: 2,
    wordWrap: true,
  }

  const defaultPreviewConfig: PreviewConfig = {
    theme: 'light',
    showLineNumbers: true,
    enableScrollSync: true,
    customCSS: '',
  }

  // 状态
  const settings = ref<AppSettings>({ ...defaultSettings })
  const previewConfig = ref<PreviewConfig>({ ...defaultPreviewConfig })
  const isInitialized = ref(false)

  // 主题相关
  const isDarkMode = ref(false)

  // 初始化设置（从localStorage读取）
  const initSettings = () => {
    try {
      const savedSettings = localStorage.getItem('editor-settings')
      const savedPreviewConfig = localStorage.getItem('preview-config')
      
      if (savedSettings) {
        settings.value = { ...defaultSettings, ...JSON.parse(savedSettings) }
      }
      
      if (savedPreviewConfig) {
        previewConfig.value = { ...defaultPreviewConfig, ...JSON.parse(savedPreviewConfig) }
      }

      // 设置主题
      setTheme(settings.value.theme)
      isInitialized.value = true
    } catch (error) {
      console.warn('Failed to load settings from localStorage:', error)
      isInitialized.value = true
    }
  }

  // 保存设置到localStorage
  const saveSettings = () => {
    try {
      localStorage.setItem('editor-settings', JSON.stringify(settings.value))
      localStorage.setItem('preview-config', JSON.stringify(previewConfig.value))
    } catch (error) {
      console.warn('Failed to save settings to localStorage:', error)
    }
  }

  // 设置主题
  const setTheme = (theme: Theme) => {
    settings.value.theme = theme
    previewConfig.value.theme = theme
    isDarkMode.value = theme === 'dark'
    
    // 更新HTML类名
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // 切换主题
  const toggleTheme = () => {
    const newTheme = settings.value.theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  // 更新设置
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    settings.value = { ...settings.value, ...newSettings }
    
    // 如果主题改变，需要特殊处理
    if (newSettings.theme) {
      setTheme(newSettings.theme)
    }
  }

  // 更新预览配置
  const updatePreviewConfig = (newConfig: Partial<PreviewConfig>) => {
    previewConfig.value = { ...previewConfig.value, ...newConfig }
  }

  // 重置设置
  const resetSettings = () => {
    settings.value = { ...defaultSettings }
    previewConfig.value = { ...defaultPreviewConfig }
    setTheme(defaultSettings.theme)
  }

  // 监听设置变化，自动保存
  watch([settings, previewConfig], saveSettings, { deep: true })

  return {
    // 状态
    settings,
    previewConfig,
    isDarkMode,
    isInitialized,
    
    // 方法
    initSettings,
    saveSettings,
    setTheme,
    toggleTheme,
    updateSettings,
    updatePreviewConfig,
    resetSettings,
  }
})