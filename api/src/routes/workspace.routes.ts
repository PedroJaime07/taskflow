import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.middleware'
import {
  createWorkspace,
  listWorkspaces,
  getWorkspace,
} from '../controllers/workspace.controller'
import {
  createProject,
  listProjects,
  getProject,
} from '../controllers/project.controller'

export const workspaceRouter = Router()

workspaceRouter.use(authMiddleware)

const wrap = (fn: Function) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res)).catch(next)

workspaceRouter.post('/', wrap(createWorkspace))
workspaceRouter.get('/', wrap(listWorkspaces))
workspaceRouter.get('/:slug', wrap(getWorkspace))

// Projects nested under workspace
workspaceRouter.post('/:workspaceId/projects', wrap(createProject))
workspaceRouter.get('/:workspaceId/projects', wrap(listProjects))
workspaceRouter.get('/:workspaceId/projects/:projectId', wrap(getProject))
