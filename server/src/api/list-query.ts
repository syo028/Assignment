import { Request } from 'express'
import { HttpError } from '../error'

export type ListQuery = {
  search: string
  sort: string
  order: 'asc' | 'desc'
  page: number
  limit: number
  category: string | null
}

let limit_default = 3
let limit_max = 5

export function parseListQuery(req: Request): ListQuery {
  let query = req.query

  let search = query.search || ''
  if (typeof search !== 'string') {
    throw new HttpError(400, 'Invalid search, expected string')
  }

  let category = query.category || null
  if (category && typeof category !== 'string') {
    throw new HttpError(400, 'Invalid category, expected string')
  }

  let page = +query.page! || 1

  let limit = +query.limit! || limit_default
  if (!(limit <= limit_max)) {
    limit = limit_max
  }

  let sort = query.sort || 'published_at'
  if (typeof sort !== 'string') {
    throw new HttpError(400, 'Invalid sort, expected string')
  }

  let order = query.order || 'desc'
  if (order !== 'asc' && order !== 'desc') {
    throw new HttpError(400, 'Invalid order, expected asc or desc')
  }

  return {
    search,
    category,
    page,
    limit,
    sort,
    order,
  }
}
