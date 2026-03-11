import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import { authRouter } from './routes/auth.routes'
import { workspaceRouter } from './routes/workspace.routes'
import { taskRouter } from './routes/task.routes'
import { errorHandler } from './middlewares/errorHandler.middleware'

export const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/auth', authRouter)
app.use('/api/workspaces', workspaceRouter)
app.use('/api', taskRouter)

app.use(errorHandler)
