import express from 'express'
import { existsSync, readFileSync, writeFileSync } from 'fs'

let app = express()
app.use(express.json())
app.use(express.static('public', {
  extensions: ['html', 'js', 'css'],
  index: 'assignment2 test.html'
}));

// Database types and initialization
type User = {
  username: string
  password: string
  token?: string
}

type Database = {
  users: User[]
  courses: Course[]
  bookmarks: Record<string, number[]>
}

type Course = {
  id: number
  title: string
  description: string
  category: string
  level: string
  duration: number
}

// Initialize database
if (!existsSync('database.json')) {
  writeFileSync('database.json', JSON.stringify({ 
    users: [],
    courses: [],
    bookmarks: {}
  }))
}

let database: Database = JSON.parse(readFileSync('database.json', 'utf-8'))

// Auth endpoints
app.post('/auth/signup', (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ error: 'Missing credentials' })
  }
  if (database.users.some(u => u.username === username)) {
    return res.status(409).json({ error: 'Username exists' })
  }
  
  const user = { username, password }
  database.users.push(user)
  writeFileSync('database.json', JSON.stringify(database))
  res.status(201).json({ message: 'User created' })
})

app.post('/auth/login', (req, res) => {
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
        user.password === req.body.password
      ) {
        const token = `mock-token-${Date.now()}`;
        user.token = token;
        writeFileSync('database.json', JSON.stringify(database));
        res.json({ 
          user_id: user.username,
          token: token
        });
      }
    }
    res.status(401)
    res.send('wrong username')
  })
  
  // Courses endpoint
  app.get('/api/courses', (req, res) => {
    const { page = 1, limit = 10, search, category } = req.query
    let filtered = database.courses
    
    if (search) {
      filtered = filtered.filter(c => 
        c.title.includes(search.toString()) || 
        c.description.includes(search.toString())
      )
    }
    
    if (category) {
      filtered = filtered.filter(c => c.category === category)
    }
    
    const start = (Number(page) - 1) * Number(limit)
    const end = start + Number(limit)
    
    res.json({
      items: filtered.slice(start, end),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: filtered.length
      }
    })
  })
  
  // Bookmark endpoints
  app.post('/bookmarks/:item_id', (req, res) => {
    const auth = req.headers.authorization
    if (!auth) return res.status(401).send('Unauthorized')
    
    const itemId = Number(req.params.item_id)
    const user = database.users.find(u => u.token === auth.split(' ')[1])
    
    if (!user) return res.status(401).send('Unauthorized')
    
    database.bookmarks[user.username] = [
      ...(database.bookmarks[user.username] || []),
      itemId
    ]
    writeFileSync('database.json', JSON.stringify(database))
    res.json({ message: 'Bookmark added' })
  })
  
  app.get('/bookmarks', (req, res) => {
    const auth = req.headers.authorization
    if (!auth) return res.status(401).send('Unauthorized')
    
    const user = database.users.find(u => u.token === auth.split(' ')[1])
    if (!user) return res.status(401).send('Unauthorized')
    
    res.json({ items: database.bookmarks[user.username] || [] })
  })
  
  app.get('/logout', (req, res) => {
    res.end('TODO: logout')
  })
  
  //app.listen(5500, () => {
   // console.log('Server running on http://localhost:5500')
  })
  export const environment = {
  production: false,
  //apiUrl: 'http://localhost:5500'
};

// Add at end of server.ts
//app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});