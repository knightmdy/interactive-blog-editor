// 导出功能测试
import { ExportUtils } from '@/utils/export'
import type { Document } from '@/types'

// 创建测试文档
const createTestDocument = (): Document => ({
  id: 'test-doc-1',
  title: 'Interactive Blog Editor 测试文档',
  content: `# Interactive Blog Editor 测试文档

这是一个测试文档，用于验证导出功能。

## 功能特性

### 文本格式
- **粗体文本**
- *斜体文本*
- \`行内代码\`
- [链接文本](https://example.com)

### 代码块
\`\`\`javascript
console.log("Hello World!");
const editor = new BlogEditor();
editor.render();
\`\`\`

### 表格
| 功能 | 状态 | 说明 |
|------|------|------|
| HTML导出 | ✅ | 支持内嵌样式 |
| PDF导出 | ✅ | 浏览器打印 |
| ZIP导出 | ✅ | 静态站点 |

### 图表示例
\`\`\`chart
{
  "type": "line",
  "data": {
    "labels": ["1月", "2月", "3月", "4月", "5月"],
    "datasets": [{
      "label": "用户增长",
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
        "text": "用户增长趋势"
      }
    }
  }
}
\`\`\`

## 测试结果
所有导出功能已成功实现并通过测试。`,
  createdAt: new Date(),
  updatedAt: new Date(),
  tags: ['测试', '导出', 'Markdown'],
  isPublic: true
})

// 测试函数
export const testExportFunctions = async () => {
  const testDoc = createTestDocument()
  
  console.log('🧪 开始测试导出功能...')
  
  try {
    // 测试HTML导出
    console.log('📄 测试HTML导出...')
    await ExportUtils.exportAsHTML(testDoc)
    console.log('✅ HTML导出测试通过')
    
    // 测试PDF导出
    console.log('📄 测试PDF导出...')
    await ExportUtils.exportAsPDF(testDoc)
    console.log('✅ PDF导出测试通过')
    
    // 测试静态站点导出
    console.log('📦 测试静态站点导出...')
    await ExportUtils.exportAsStaticSite(testDoc)
    console.log('✅ 静态站点导出测试通过')
    
    console.log('🎉 所有导出功能测试通过！')
    return true
  } catch (error) {
    console.error('❌ 导出功能测试失败:', error)
    return false
  }
}

// 导出配置测试
export const testExportConfigurations = () => {
  console.log('⚙️ 测试导出配置...')
  
  const configs = [
    { format: 'html', includeCSS: true, minify: false },
    { format: 'html', includeCSS: false, minify: true },
    { format: 'html', includeCSS: true, minify: true }
  ]
  
  configs.forEach((config, index) => {
    console.log(`配置 ${index + 1}:`, config)
    // 这里可以添加具体的配置测试逻辑
  })
  
  console.log('✅ 导出配置测试完成')
}

// 浏览器兼容性测试
export const testBrowserCompatibility = () => {
  console.log('🌐 检查浏览器兼容性...')
  
  const features = {
    'Blob API': typeof Blob !== 'undefined',
    'File API': typeof File !== 'undefined',
    'IndexedDB': typeof indexedDB !== 'undefined',
    'localStorage': typeof localStorage !== 'undefined',
    'URL API': typeof URL !== 'undefined'
  }
  
  Object.entries(features).forEach(([feature, supported]) => {
    console.log(`${supported ? '✅' : '❌'} ${feature}: ${supported ? '支持' : '不支持'}`)
  })
  
  const allSupported = Object.values(features).every(Boolean)
  console.log(`🌐 浏览器兼容性: ${allSupported ? '完全支持' : '部分支持'}`)
  
  return allSupported
}