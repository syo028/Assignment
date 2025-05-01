import express from 'express'
import cors from 'cors'
import { print } from 'listening-on'
import { listRouter } from './api/list'
import { env } from './env'
import { storeRequestLog } from './request-log'
import { authRouter, checkAuth } from './api/auth'
import { bookmarkRouter } from './api/bookmark'
import { injectError } from './inject-error'

let app = express()

// 設定所有請求的中介軟體 (setup middleware for all requests)
{
  // 允許從外部域調用
  app.use(cors())

  // 檢查是否已登入
  app.use(checkAuth)

  // 記錄所有請求
  app.use((req, res, next) => {
    storeRequestLog(req)
    next()
  })

  // 設定靜態檔案
  app.use(express.static('public'))

  // 引起隨機錯誤以測試錯誤處理
  app.use(injectError)

  // 解析 JSON 請求體
  app.use(express.json())

  // 解析 URL-encoded 請求體
  app.use(express.urlencoded({ extended: false }))

  // 確保 req.body 被定義，以便 API 方法使用
  app.use((req, res, next) => {
    req.body ??= {}
    next()
  })
}

// 註冊 API 路由
app.use('/api/auth', authRouter)
app.use('/api/bookmarks', bookmarkRouter)
app.use('/api', listRouter)

// 啟動伺服器
app.listen(env.PORT, () => {
  print(env.PORT)
})
