import type { Request, Response} from 'express'

import Task from '../models/Task'

export class TaskController {

  static createTask = async (req: Request, res: Response) => {

    try {
      const task = new Task(req.body)
      task.project = req.project._id
      req.project.tasks.push(task._id)
      await Promise.allSettled([task.save(), req.project.save()])
      res.send('Tarea Creada Correctamente')

    } catch (error) {
      res.status(500).json({error: 'Hubo un error'})
    }
  }

  static getProjectTasks = async (req: Request, res: Response) => {

    try {
      const tasks = await Task.find({project: req.project._id}).populate('project')
      res.json(tasks)

    } catch (error) {
      res.status(500).json({error: 'Hubo un error'})
    }
  }

  static getTaskById = async (req: Request, res: Response) => {

    try {
      const { taskId } = req.params
      const task = await Task.findById(taskId)

      if(!task) {
        const error = new Error('Tarea no encontrada')
        return res.status(404).json({ error: error.message })
      }

      if(!task.project.equals(req.project._id)) {
        const error = new Error('Accion no valida')
        return res.status(400).json({ error: error.message })
      }

      const response = {
      ...task.toJSON(),
      _id: task._id.toString(),
      project: task.project.toString()
      }

      res.json(response)

    } catch (error) {
      res.status(500).json({error: 'Hubo un error'})
    }
  }

  static updateTask = async (req: Request, res: Response) => {

    try {
      const { taskId } = req.params
      const task = await Task.findById(taskId)

      if(!task) {
        const error = new Error('Tarea no encontrada')
        return res.status(404).json({ error: error.message })
      }

      if(!task.project.equals(req.project._id)) {
        const error = new Error('Accion no valida')
        return res.status(400).json({ error: error.message })
      }

      task.name = req.body.name
      task.description = req.body.description
      await task.save()

      const response = {
        message: 'Tarea actualizada correctamente',
        task: {
          ...task.toJSON(),
          _id: task._id.toString(),
          project: task.project.toString()
        }
      }

      res.send(response)

    } catch (error) {
      res.status(500).json({error: 'Hubo un error'})
    }
  }

  static deleteTask = async (req: Request, res: Response) => {

    try {
      const { taskId } = req.params
      const task = await Task.findById(taskId)

      if(!task) {
        const error = new Error('Tarea no encontrada')
        return res.status(404).json({ error: error.message })
      }

      req.project.tasks = req.project.tasks.filter(projectTask => projectTask.toString() !== taskId.toString())
      await Promise.allSettled([task.deleteOne(), req.project.save()])

      const response = {
        message: 'Tarea eliminada correctamente',
        task: {
          ...task.toJSON(),
          _id: task._id.toString(),
          project: task.project.toString()
        }
      }

      res.json(response)

    } catch (error) {
      res.status(500).json({error: 'Hubo un error'})
    }
  }
}
