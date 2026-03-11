import { Response } from 'express'
import { z } from 'zod'
import { prisma } from '../utils/prisma'
import { AppError } from '../utils/AppError'
import { AuthRequest } from '../middlewares/auth.middleware'

const createWorkspaceSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
})

export async function createWorkspace(req: AuthRequest, res: Response) {
  const body = createWorkspaceSchema.parse(req.body)

  const slugExists = await prisma.workspace.findUnique({
    where: { slug: body.slug },
  })

  if (slugExists) {
    throw new AppError('Slug já em uso', 409)
  }

  const workspace = await prisma.workspace.create({
    data: {
      name: body.name,
      slug: body.slug,
      members: {
        create: {
          userId: req.userId!,
          role: 'ADMIN',
        },
      },
    },
    include: {
      members: {
        include: { user: { select: { id: true, name: true, email: true } } },
      },
    },
  })

  return res.status(201).json(workspace)
}

export async function listWorkspaces(req: AuthRequest, res: Response) {
  const workspaces = await prisma.workspace.findMany({
    where: {
      members: { some: { userId: req.userId } },
    },
    include: {
      _count: { select: { projects: true, members: true } },
    },
  })

  return res.json(workspaces)
}

export async function getWorkspace(req: AuthRequest, res: Response) {
  const { slug } = req.params

  const workspace = await prisma.workspace.findUnique({
    where: { slug },
    include: {
      members: {
        include: { user: { select: { id: true, name: true, email: true } } },
      },
      projects: {
        include: { _count: { select: { tasks: true } } },
      },
    },
  })

  if (!workspace) {
    throw new AppError('Workspace não encontrado', 404)
  }

  const isMember = workspace.members.some((m) => m.userId === req.userId)

  if (!isMember) {
    throw new AppError('Acesso negado', 403)
  }

  return res.json(workspace)
}
