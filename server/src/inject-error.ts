import { NextFunction, Request, Response } from 'express'
import './api/auth'
import { env } from './env'

// Time window (in ms) over which error probability increases from 0 to 100%
let probabilityWindow = env.ERROR_INJECTION_PROBABILITY_WINDOW

type Pool = {
  lastFailTime: number
}

// user_id -> pool
let error_pool: Record<number, Pool> = {}

export function injectError(req: Request, res: Response, next: NextFunction) {
  let key = req.user_id || 0

  let pool = error_pool[key]
  if (!pool) {
    pool = {
      lastFailTime: 0,
    }
    error_pool[key] = pool
  }

  let now = Date.now()
  let timePassed = now - pool.lastFailTime

  // Probability increases linearly with time passed, and guaranteed failure after probabilityWindow
  let failureProbability = timePassed / probabilityWindow
  let shouldFail = Math.random() < failureProbability

  if (shouldFail) {
    pool.lastFailTime = now
    res.status(500)
    res.json({
      error: 'Error injected for testing purposes',
      details:
        "This error has been intentionally triggered to evaluate your application's error handling capabilities",
      failureProbability,
      timePassed,
      probabilityWindow,
    })
    return
  }

  next()
}
