import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AppError } from '../utils/AppError'

export interface AuthRequest extends Request {
  userId?: string
}

interface JwtPayload {
  sub: string
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Token não fornecido', 401)
  }

  const token = authHeader.split(' ')[1]

  try {
    const secret = process.env.JWT_SECRET as string
    const payload = jwt.verify(token, secret) as JwtPayload
    req.userId = payload.sub
    next()
  } catch {
    throw new AppError('Token inválido ou expirado', 401)
  }
}
