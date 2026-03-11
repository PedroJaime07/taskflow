import { Response } from 'express'
import { z } from 'zod'
import { prisma } from '../utils/prisma'
import { AppError } from '../utils/AppError'
import { AuthRequest } from '../middlewares/auth.middleware'
import { Priority, TaskStatus } from '@prisma/client'

const createTaskSchema = z.object({
  title: z.string().min(2, 'Título deve ter pelo menos 2 caracteres'),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(Priority).optional(),
  dueDate: z.string().datetime().optional(),
  assigneeId: z.string().uuid().optional(),
})

const updateTaskSchema = createTaskSchema.partial()

export async function createTask(req: AuthRequest, res: Response) {
  const { projectId } = req.params
  const body = createTaskSchema.parse(req.body)

  const project = await prisma.project.findUnique({ where: { id: projectId } })
  if (!project) throw new AppError('Projeto não encontrado', 404)

  const task = await prisma.task.create({
    data: {
      ...body,
      dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
      projectId,
      createdById: req.userId!,
    },
    include: {
      assignee: { select: { id: true, name: true, email: true } },
      createdBy: { select: { id: true, name: true, email: true } },
    },
  })

  return res.status(201).json(task)
}

export async function updateTask(req: AuthRequest, res: Response) {
  const { taskId } = req.params
  const body = updateTaskSchema.parse(req.body)

  const task = await prisma.task.findUnique({ where: { id: taskId } })
  if (!task) throw new AppError('Tarefa não encontrada', 404)

  const updated = await prisma.task.update({
    where: { id: taskId },
    data: {
      ...body,
      dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
    },
    include: {
      assignee: { select: { id: true, name: true, email: true } },
      createdBy: { select: { id: true, name: true, email: true } },
    },
  })

  return res.json(updated)
}

export async function deleteTask(req: AuthRequest, res: Response) {
  const { taskId } = req.params

  const task = await prisma.task.findUnique({ where: { id: taskId } })
  if (!task) throw new AppError('Tarefa não encontrada', 404)

  await prisma.task.delete({ where: { id: taskId } })

  return res.status(204).send()
}
