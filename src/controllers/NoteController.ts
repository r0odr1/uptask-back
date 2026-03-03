import type { Request, Response } from 'express'
import Node, { INote} from '../models/Node'

export class NotedController {
  static createNote = async (req: Request<{}, {}, INote>, res: Response) => {
    const { content } = req.body
  }
}