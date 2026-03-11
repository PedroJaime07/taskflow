import { Response } from 'express'
import { z } from 'zod'
import { prisma } from '../utils/prisma'
import { AppError } from '../utils/AppError'
import { AuthRequest } from '../middlewares/auth.middleware'

const createProjectSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  description: z.string().optional(),
})

async function checkWorkspaceMember(workspaceId: string, userId: string) {
  const member = await prisma.workspaceMember.findUnique({
    where: { userId_workspaceId: { userId, workspaceId } },
  })

  if (!member) throw new AppError('Acesso negado', 403)
  return member
}

export async function createProject(req: AuthRequest, res: Response) {
  const { workspaceId } = req.params
  const body = createProjectSchema.parse(req.body)

  await checkWorkspaceMember(workspaceId, req.userId!)

  const project = await prisma.project.create({
    data: {
      name: body.name,
      description: body.description,
      workspaceId,
    },
  })

  return res.status(201).json(project)
}

export async function listProjects(req: AuthRequest, res: Response) {
  const { workspaceId } = req.params

  await checkWorkspaceMember(workspaceId, req.userId!)

  const projects = await prisma.project.findMany({
    where: { workspaceId },
    include: { _count: { select: { tasks: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return res.json(projects)
}

export async function getProject(req: AuthRequest, res: Response) {
  const { workspaceId, projectId } = req.params

  await checkWorkspaceMember(workspaceId, req.userId!)

  const project = await prisma.project.findFirst({
    where: { id: projectId, workspaceId },
    include: {
      tasks: {
        include: {
          assignee: { select: { id: true, name: true, email: true } },
          createdBy: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!project) throw new AppError('Projeto não encontrado', 404)

  return res.json(project)
}
