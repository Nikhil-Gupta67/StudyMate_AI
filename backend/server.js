import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomUUID } from 'node:crypto'

const app = express()
const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || 'local-prototype-change-this-secret'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(__dirname, 'data')
const usersFile = path.join(dataDir, 'users.json')
const tasksFile = path.join(dataDir, 'tasks.json')

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

async function readJson(file, fallback) {
  try { return JSON.parse(await fs.readFile(file, 'utf8')) }
  catch { return fallback }
}
async function writeJson(file, data) {
  await fs.mkdir(dataDir, { recursive: true })
  await fs.writeFile(file, JSON.stringify(data, null, 2))
}
function createToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' })
}
function auth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  try {
    if (!token) throw new Error('Missing token')
    req.auth = jwt.verify(token, JWT_SECRET)
    next()
  } catch { res.status(401).json({ error: 'Please sign in again.' }) }
}

app.get('/api/health', (_req, res) => res.json({ ok: true, message: 'StudyMate API is running' }))

app.post('/api/auth/register', async (req, res) => {
  const name = String(req.body.name || '').trim()
  const email = String(req.body.email || '').trim().toLowerCase()
  const password = String(req.body.password || '')
  if (!name || !email || password.length < 6) return res.status(400).json({ error: 'Enter your name, a valid email, and a password of at least 6 characters.' })
  const users = await readJson(usersFile, [])
  if (users.some(u => u.email === email)) return res.status(409).json({ error: 'An account with this email already exists. Please sign in.' })
  const user = { id: randomUUID(), name, email, passwordHash: await bcrypt.hash(password, 10) }
  users.push(user)
  await writeJson(usersFile, users)
  res.status(201).json({ token: createToken(user), user: { id: user.id, name: user.name, email: user.email } })
})

app.post('/api/auth/login', async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase()
  const password = String(req.body.password || '')
  const users = await readJson(usersFile, [])
  const user = users.find(u => u.email === email)
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ error: 'Incorrect email or password.' })
  res.json({ token: createToken(user), user: { id: user.id, name: user.name, email: user.email } })
})

app.get('/api/tasks', auth, async (req, res) => {
  const all = await readJson(tasksFile, [])
  res.json({ tasks: all.filter(t => t.userId === req.auth.id).sort((a,b) => b.createdAt.localeCompare(a.createdAt)) })
})

app.post('/api/tasks', auth, async (req, res) => {
  const title = String(req.body.title || '').trim()
  if (!title) return res.status(400).json({ error: 'Assignment name is required.' })
  if (title.length > 240) return res.status(400).json({ error: 'Assignment name must be 240 characters or fewer.' })
  const task = { id: randomUUID(), userId: req.auth.id, title, dueDate: String(req.body.dueDate || ''), completed: false, createdAt: new Date().toISOString() }
  const all = await readJson(tasksFile, [])
  all.push(task)
  await writeJson(tasksFile, all)
  res.status(201).json({ task })
})

app.patch('/api/tasks/:id', auth, async (req, res) => {
  const all = await readJson(tasksFile, [])
  const index = all.findIndex(t => t.id === req.params.id && t.userId === req.auth.id)
  if (index < 0) return res.status(404).json({ error: 'Assignment not found.' })
  all[index] = { ...all[index], completed: Boolean(req.body.completed) }
  await writeJson(tasksFile, all)
  res.json({ task: all[index] })
})

app.delete('/api/tasks/:id', auth, async (req, res) => {
  const all = await readJson(tasksFile, [])
  const next = all.filter(t => !(t.id === req.params.id && t.userId === req.auth.id))
  if (next.length === all.length) return res.status(404).json({ error: 'Assignment not found.' })
  await writeJson(tasksFile, next)
  res.json({ ok: true })
})

app.listen(PORT, () => console.log(`StudyMate API running at http://localhost:${PORT}`))
