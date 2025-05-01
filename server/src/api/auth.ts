import { NextFunction, Request, Response, Router } from 'express'
import { proxy } from '../proxy'
import { HttpError } from '../error'
import { count, find } from 'better-sqlite3-proxy'
import { comparePassword, hashPassword } from '../hash'
import { randomUUID } from 'crypto'

declare global {
  namespace Express {
    interface Request {
      user_id?: number
    }
  }
}

export let authRouter: Router = Router()

authRouter.post('/signup', async (req, res) => {
  try {
    // 1. validate request body
    let { username, password } = req.body
    if (!username || typeof username !== 'string') {
      throw new HttpError(400, 'Invalid username')
    }
    if (!password || typeof password !== 'string') {
      throw new HttpError(400, 'Invalid password')
    }

    // 2. check if user already exists
    let user = find(proxy.user, { username })
    if (user) {
      throw new HttpError(409, 'The username is already registered')
    }

    // 3. create new user
    let user_id = proxy.user.push({
      username,
      password_hash: await hashPassword(password),
    })

    // 4. generate session token
    let token = nextToken()
    proxy.session.push({
      token,
      user_id,
    })

    // 5. return response
    res.json({
      user_id,
      token,
    })
  } catch (error) {
    res.status((error as HttpError).statusCode || 500)
    res.json({ error: String(error) })
  }
})

authRouter.post('/login', async (req, res) => {
  try {
    // 1. validate request body
    let { username, password } = req.body
    if (!username || typeof username !== 'string') {
      throw new HttpError(400, 'Invalid username')
    }
    if (!password || typeof password !== 'string') {
      throw new HttpError(400, 'Invalid password')
    }

    // 2. check if user exists
    let user = find(proxy.user, { username })
    if (!user) {
      throw new HttpError(401, 'The username is not registered')
    }
    let user_id = user.id!

    // 3. check if password is matched
    if (
      !(await comparePassword({
        password,
        password_hash: user.password_hash,
      }))
    ) {
      throw new HttpError(401, 'Wrong username or password')
    }

    // 4. generate session token
    let token = nextToken()
    proxy.session.push({
      token,
      user_id,
    })

    // 5. return response
    res.json({
      user_id,
      token,
    })
  } catch (error) {
    res.status((error as HttpError).statusCode || 500)
    res.json({ error: String(error) })
  }
})

authRouter.get('/check', (req, res) => {
  res.json({
    user_id: req.user_id || null,
  })
})

export function checkAuth(req: Request, res: Response, next: NextFunction) {
  let value = req.headers['authorization']
  if (value?.startsWith('Bearer ')) {
    let token = value.slice('Bearer '.length)
    let session = find(proxy.session, { token })
    if (session) {
      req.user_id = session.user_id!
    }
  }
  next()
}

function nextToken() {
  for (;;) {
    let token = randomUUID()
    let is_used = count(proxy.session, { token })
    if (!is_used) {
      return token
    }
  }
}
