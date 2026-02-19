import type { Request, Response } from 'express'
import User from '../models/User'

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {

    try {
      const user = new User(req.body)
      await user.save()

      res.send('Cuenta creada, revisa tu correo para confirmarla')
    } catch (error) {
      res.status(500).json.apply({error: 'Hubo un error'})
    }
  }
}