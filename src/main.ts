import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// 导入样式
import './styles/index.css'

// 创建应用实例
const app = createApp(App)

// 创建Pinia实例
const pinia = createPinia()

// 注册插件
app.use(pinia)

// 挂载应用
app.mount('#app')

// 开发环境下启用性能监控
if (import.meta.env.DEV) {
  app.config.performance = true
}

// 全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('Global error:', err)
  console.error('Component info:', info)
  
  // 在生产环境中，这里可以发送错误到监控服务
  if (import.meta.env.PROD) {
    // 发送错误报告
    console.log('Error reported to monitoring service')
  }
}

// 全局警告处理
app.config.warnHandler = (msg, vm, trace) => {
  console.warn('Global warning:', msg)
  console.warn('Component trace:', trace)
}

// 注册全局属性
app.config.globalProperties.$appVersion = '1.0.0'
app.config.globalProperties.$appName = 'Interactive Blog Editor'

// 性能标记
if (import.meta.env.DEV) {
  console.log('🚀 Interactive Blog Editor is starting...')
  console.log('📦 Vue version:', app.version)
  console.log('⚡ Vite mode:', import.meta.env.MODE)
  console.log('🎯 Environment:', import.meta.env.DEV ? 'Development' : 'Production')
}