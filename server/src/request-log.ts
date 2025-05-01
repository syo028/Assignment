import { Request } from 'express'
import { proxy } from './proxy'
import { seedRow } from 'better-sqlite3-proxy'

let method_cache = new Map<string, number>()
function getMethodId(method: string) {
  let id = method_cache.get(method)
  if (!id) {
    id = seedRow(proxy.method, { method })
    method_cache.set(method, id)
  }
  return id
}

let url_cache = new Map<string, number>()
function getUrlId(url: string) {
  let id = url_cache.get(url)
  if (!id) {
    id = seedRow(proxy.url, { url })
    url_cache.set(url, id)
  }
  return id
}

let user_agent_cache = new Map<string, number>()
function getUserAgentId(user_agent: string) {
  let id = user_agent_cache.get(user_agent)
  if (!id) {
    id = seedRow(proxy.user_agent, { user_agent })
    user_agent_cache.set(user_agent, id)
  }
  return id
}

export function storeRequestLog(req: Request) {
  let user_agent = req.headers['user-agent'] || null
  proxy.request_log.push({
    method_id: getMethodId(req.method),
    url_id: getUrlId(req.url),
    user_id: req.user_id || null,
    user_agent_id: user_agent ? getUserAgentId(user_agent) : null,
    timestamp: Date.now(),
  })
}
