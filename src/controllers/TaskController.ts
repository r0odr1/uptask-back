import type { Request, Response} from 'express'

export class TaskController {

  static createProject = async (req: Request, res: Response) => {

      const { projectId } = req.params
      console.log(projectId)

      try {
        // await project.save()
        // res.send('Proyecto Creado Correctamente')

      } catch (error) {
        console.log(error)
      }
    }

}