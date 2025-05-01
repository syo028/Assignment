import { Router } from 'express'
import { HttpError } from '../error'
import { count, del, toSqliteTimestamp } from 'better-sqlite3-proxy'
import { proxy } from '../proxy'
import { db } from '../db'
import './auth'

export let bookmarkRouter: Router = Router()

bookmarkRouter.post('/:item_id', (req, res) => {
  try {
    if (!req.user_id) {
      throw new HttpError(401, 'Unauthorized')
    }

    let item_id = +req.params.item_id
    if (!item_id) {
      throw new HttpError(400, 'Invalid item id')
    }

    if (!(item_id in proxy.item)) {
      throw new HttpError(404, 'Item not found')
    }

    let is_bookmarked = count(proxy.bookmark, {
      user_id: req.user_id,
      item_id,
    })

    if (!is_bookmarked) {
      proxy.bookmark.push({
        user_id: req.user_id,
        item_id,
        created_at: toSqliteTimestamp(new Date()),
      })
    }

    res.json({
      message: is_bookmarked ? 'already bookmarked' : 'newly bookmarked',
    })
  } catch (error) {
    res.status((error as HttpError).statusCode || 500)
    res.json({ error: String(error) })
  }
})

bookmarkRouter.delete('/:item_id', (req, res) => {
  try {
    if (!req.user_id) {
      throw new HttpError(401, 'Unauthorized')
    }

    let item_id = +req.params.item_id
    if (!item_id) {
      throw new HttpError(400, 'Invalid item id')
    }

    if (!(item_id in proxy.item)) {
      throw new HttpError(404, 'Item not found')
    }

    let newly_deleted = del(proxy.bookmark, {
      user_id: req.user_id,
      item_id,
    })

    res.json({
      message: newly_deleted ? 'newly deleted' : 'already deleted',
    })
  } catch (error) {
    res.status((error as HttpError).statusCode || 500)
    res.json({ error: String(error) })
  }
})

let select_item_ids = db
  .prepare<{ user_id: number }, number[]>(
    /* sql */ `
select item_id
from bookmark
where user_id = :user_id
`,
  )
  .pluck()

bookmarkRouter.get('/', (req, res) => {
  try {
    if (!req.user_id) {
      throw new HttpError(401, 'Unauthorized')
    }

    let item_ids = select_item_ids.all({ user_id: req.user_id })

    res.json({
      item_ids,
    })
  } catch (error) {
    res.status((error as HttpError).statusCode || 500)
    res.json({ error: String(error) })
  }
})
