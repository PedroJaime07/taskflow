import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { prisma } from '../utils/prisma'
import { AppError } from '../utils/AppError'

const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
})

export async function register(req: Request, res: Response) {
  const body = registerSchema.parse(req.body)

  const userExists = await prisma.user.findUnique({
    where: { email: body.email },
  })

  if (userExists) {
    throw new AppError('Email já cadastrado', 409)
  }

  const hashedPassword = await bcrypt.hash(body.password, 10)

  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  })

  const token = jwt.sign(
    { sub: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN as string }
  )

  return res.status(201).json({ user, token })
}

export async function login(req: Request, res: Response) {
  const body = loginSchema.parse(req.body)

  const user = await prisma.user.findUnique({
    where: { email: body.email },
  })

  if (!user) {
    throw new AppError('Credenciais inválidas', 401)
  }

  const passwordMatch = await bcrypt.compare(body.password, user.password)

  if (!passwordMatch) {
    throw new AppError('Credenciais inválidas', 401)
  }

  const token = jwt.sign(
    { sub: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN as string }
  )

  return res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
    token,
  })
}

export async function me(req: Request & { userId?: string }, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  })

  if (!user) {
    throw new AppError('Usuário não encontrado', 404)
  }

  return res.json(user)
}
