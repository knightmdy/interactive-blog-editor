import { ref } from 'vue'
import Dexie, { type Table } from 'dexie'
import type { Document } from '@/types'

// IndexedDB 数据库接口
interface BlogEditorDB extends Dexie {
  documents: Table<Document>
  drafts: Table<Document>
}

// 本地存储组合式函数
export function useStorage() {
  const isReady = ref(false)
  const error = ref<string | null>(null)
  
  // 初始化数据库
  const db = new Dexie('BlogEditorDB') as BlogEditorDB
  
  db.version(1).stores({
    documents: '++id, title, createdAt, updatedAt, tags, isPublic',
    drafts: '++id, title, createdAt, updatedAt',
  })

  // 初始化数据库连接
  const initDB = async () => {
    try {
      await db.open()
      isReady.value = true
      error.value = null
    } catch (err) {
      error.value = err instanceof Error ? err.message : '数据库初始化失败'
      console.error('Database initialization failed:', err)
    }
  }

  // 保存文档
  const saveDocument = async (document: Document): Promise<string> => {
    try {
      if (!isReady.value) {
        throw new Error('数据库未就绪')
      }

      const id = await db.documents.put(document)
      return typeof id === 'string' ? id : document.id
    } catch (err) {
      const message = err instanceof Error ? err.message : '保存文档失败'
      error.value = message
      throw new Error(message)
    }
  }

  // 获取文档
  const getDocument = async (id: string): Promise<Document | undefined> => {
    try {
      if (!isReady.value) {
        throw new Error('数据库未就绪')
      }

      return await db.documents.get(id)
    } catch (err) {
      const message = err instanceof Error ? err.message : '获取文档失败'
      error.value = message
      throw new Error(message)
    }
  }

  // 获取所有文档
  const getAllDocuments = async (): Promise<Document[]> => {
    try {
      if (!isReady.value) {
        throw new Error('数据库未就绪')
      }

      return await db.documents.orderBy('updatedAt').reverse().toArray()
    } catch (err) {
      const message = err instanceof Error ? err.message : '获取文档列表失败'
      error.value = message
      throw new Error(message)
    }
  }

  // 删除文档
  const deleteDocument = async (id: string): Promise<void> => {
    try {
      if (!isReady.value) {
        throw new Error('数据库未就绪')
      }

      await db.documents.delete(id)
    } catch (err) {
      const message = err instanceof Error ? err.message : '删除文档失败'
      error.value = message
      throw new Error(message)
    }
  }

  // 搜索文档
  const searchDocuments = async (query: string): Promise<Document[]> => {
    try {
      if (!isReady.value) {
        throw new Error('数据库未就绪')
      }

      const searchTerm = query.toLowerCase()
      
      return await db.documents
        .filter(doc => 
          doc.title.toLowerCase().includes(searchTerm) ||
          doc.content.toLowerCase().includes(searchTerm) ||
          doc.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        )
        .toArray()
    } catch (err) {
      const message = err instanceof Error ? err.message : '搜索文档失败'
      error.value = message
      throw new Error(message)
    }
  }

  // 保存草稿
  const saveDraft = async (document: Document): Promise<string> => {
    try {
      if (!isReady.value) {
        throw new Error('数据库未就绪')
      }

      const draftId = `draft-${document.id || Date.now()}`
      const draft = { ...document, id: draftId }
      
      await db.drafts.put(draft)
      return draftId
    } catch (err) {
      const message = err instanceof Error ? err.message : '保存草稿失败'
      error.value = message
      throw new Error(message)
    }
  }

  // 获取最近的草稿
  const getRecentDraft = async (): Promise<Document | undefined> => {
    try {
      if (!isReady.value) {
        throw new Error('数据库未就绪')
      }

      const drafts = await db.drafts.orderBy('updatedAt').reverse().limit(1).toArray()
      return drafts.length > 0 ? drafts[0] : undefined
    } catch (err) {
      const message = err instanceof Error ? err.message : '获取草稿失败'
      error.value = message
      throw new Error(message)
    }
  }

  // 清理旧草稿（保留最近10个）
  const cleanupDrafts = async (): Promise<void> => {
    try {
      if (!isReady.value) {
        throw new Error('数据库未就绪')
      }

      const drafts = await db.drafts.orderBy('updatedAt').reverse().toArray()
      if (drafts.length > 10) {
        const oldDrafts = drafts.slice(10)
        await db.drafts.bulkDelete(oldDrafts.map(d => d.id))
      }
    } catch (err) {
      console.warn('草稿清理失败:', err)
    }
  }

  // 导出数据
  const exportData = async (): Promise<{ documents: Document[], drafts: Document[] }> => {
    try {
      if (!isReady.value) {
        throw new Error('数据库未就绪')
      }

      const [documents, drafts] = await Promise.all([
        db.documents.toArray(),
        db.drafts.toArray(),
      ])

      return { documents, drafts }
    } catch (err) {
      const message = err instanceof Error ? err.message : '导出数据失败'
      error.value = message
      throw new Error(message)
    }
  }

  // 导入数据
  const importData = async (data: { documents: Document[], drafts: Document[] }): Promise<void> => {
    try {
      if (!isReady.value) {
        throw new Error('数据库未就绪')
      }

      await db.transaction('rw', db.documents, db.drafts, async () => {
        if (data.documents?.length > 0) {
          await db.documents.bulkPut(data.documents)
        }
        if (data.drafts?.length > 0) {
          await db.drafts.bulkPut(data.drafts)
        }
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : '导入数据失败'
      error.value = message
      throw new Error(message)
    }
  }

  // 清空数据库
  const clearDatabase = async (): Promise<void> => {
    try {
      if (!isReady.value) {
        throw new Error('数据库未就绪')
      }

      await db.transaction('rw', db.documents, db.drafts, async () => {
        await db.documents.clear()
        await db.drafts.clear()
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : '清空数据库失败'
      error.value = message
      throw new Error(message)
    }
  }

  return {
    isReady,
    error,
    initDB,
    saveDocument,
    getDocument,
    getAllDocuments,
    deleteDocument,
    searchDocuments,
    saveDraft,
    getRecentDraft,
    cleanupDrafts,
    exportData,
    importData,
    clearDatabase,
  }
}