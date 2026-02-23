import { Request, Response, NextFunction } from 'express'

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {

  console.log()
  const bearer = req.headers.authorization

  if(!bearer) {
    const error = new Error('Usuario No Autorizado')
    return res.status(401).json({error: error.message})
  }

  const [, token] = bearer.split(' ')

  next()
}