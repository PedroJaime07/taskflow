import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.middleware'
import { createTask, updateTask, deleteTask } from '../controllers/task.controller'

export const taskRouter = Router()

taskRouter.use(authMiddleware)

const wrap = (fn: Function) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res)).catch(next)

taskRouter.post('/projects/:projectId/tasks', wrap(createTask))
taskRouter.patch('/tasks/:taskId', wrap(updateTask))
taskRouter.delete('/tasks/:taskId', wrap(deleteTask))
