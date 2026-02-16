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

      const response = {
      ...req.task.toJSON(),
      _id: req.task._id.toString(),
      project: req.task.project.toString()
      }

      res.json(response)

    } catch (error) {
      res.status(500).json({error: 'Hubo un error'})
    }
  }

  static updateTask = async (req: Request, res: Response) => {

    try {

      req.task.name = req.body.name
      req.task.description = req.body.description
      await req.task.save()

      const response = {
        message: 'Tarea actualizada correctamente',
        task: {
          ...req.task.toJSON(),
          _id: req.task._id.toString(),
          project: req.task.project.toString()
        }
      }

      res.send(response)

    } catch (error) {
      res.status(500).json({error: 'Hubo un error'})
    }
  }

  static deleteTask = async (req: Request, res: Response) => {

    try {

      req.project.tasks = req.project.tasks.filter(projectTask => projectTask.toString() !== req.task._id.toString())
      await Promise.allSettled([req.task.deleteOne(), req.project.save()])

      const response = {
        message: 'Tarea eliminada correctamente',
        task: {
          ...req.task.toJSON(),
          _id: req.task._id.toString(),
          project: req.task.project.toString()
        }
      }

      res.json(response)

    } catch (error) {
      res.status(500).json({error: 'Hubo un error'})
    }
  }

  static updateStatus = async (req: Request, res: Response) => {

    try {

      const { status } = req.body
      req.task.status = status
      await req.task.save()
      res.send('Tarea Actualizada Correctamente')

    } catch (error) {
      res.status(500).json({error: 'Hubo un error'})
    }
  }
}
