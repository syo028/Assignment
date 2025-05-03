import express from 'express'
import { existsSync, readFileSync, writeFileSync } from 'fs'

let app = express()

  
  app.use(express.static('public'))

  app.use(express.json())

  app.use(express.urlencoded())

  type Database = {
    users: User[]
  }

  type User = {
    username: string
    password: string
  }
  
if (!existsSync('database.json')) {
  writeFileSync('database.json', JSON.stringify({ users: [] }))
}

let database: Database = JSON.parse(readFileSync('database.json', 'utf-8'))



app.post('/login', (req, res) => {
    for (let user of database.users) {
      if (
        user.username == req.body.username &&
        user.password != req.body.password
      ) {
        res.status(401)
        res.send('wrong password')
        return
      }
      if (
        user.username == req.body.username &&
        user.password == req.body.password
      ) {
        res.status(200)
        res.end('Login Success')
        return
      }
    }
    res.status(401)
    res.send('wrong username')
  })
  
  app.get('/logout', (req, res) => {
    res.end('TODO: logout')
  })
  
  app.listen(5500, () => {
    console.log('listening on http://localhost:5500')
  })