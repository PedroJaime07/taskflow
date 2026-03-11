import { Router } from 'express'
import { register, login, me } from '../controllers/auth.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

export const authRouter = Router()

authRouter.post('/register', (req, res, next) => {
  Promise.resolve(register(req, res)).catch(next)
})

authRouter.post('/login', (req, res, next) => {
  Promise.resolve(login(req, res)).catch(next)
})

authRouter.get('/me', authMiddleware, (req, res, next) => {
  Promise.resolve(me(req as any, res)).catch(next)
})
