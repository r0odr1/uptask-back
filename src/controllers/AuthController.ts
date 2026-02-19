import type { Request, Response } from 'express'
import User from '../models/User'
import { hashPassword } from '../utils/auth'
import Token from '../models/Token'
import { generateToken } from '../utils/token'
import { transporter } from '../config/nodemailer'

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {

    try {
      const { password, email } = req.body

      // Evitar duplicados
      const userExists = await User.findOne({email})

      if(userExists) {
        const error = new Error('El usuario ingresado ya esta registrado')
        return res.status(409).json({error: error.message})
      }

      // Crean un usuario
      const user = new User(req.body)

      // Hash password
      user.password = await hashPassword(password)

      // Generar el token
      const token = new Token
      token.token = generateToken()
      token.user = user._id

      // Enviar el email
      await transporter.sendMail({
        from: 'UpTask <admin@uptask.com>',
        to: user.email,
        subject: 'UpTask - Confirma tu cuenta',
        text: 'UpTask - Confirma tu cuenta',
        html: `<p>Probando Email</p>`
      })

      await Promise.allSettled([user.save(), token.save()])
      res.send('Cuenta creada, revisa tu correo para confirmarla')
    } catch (error) {
      res.status(500).json.apply({error: 'Hubo un error'})
    }
  }
}