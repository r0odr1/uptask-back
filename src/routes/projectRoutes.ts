import { Router } from 'express'
import { body, param } from 'express-validator'
import { ProjectController } from '../controllers/ProjectController'
import { handleInputErrors } from '../middleware/validation'
import { TaskController } from '../controllers/TaskController'
import { validateProjectExist } from '../middleware/project'

const router = Router()

/** Routes for projects */

router.post('/',
  body('projectName').notEmpty().withMessage('El Nombre del Proyecto es Obligatorio'),
  body('clientName').notEmpty().withMessage('El Nombre del Cliente es Obligatorio'),
  body('description').notEmpty().withMessage('La Descripcion del Proyecto es Obligatoria'),
  handleInputErrors,
  ProjectController.createProject
)

router.get('/', ProjectController.getAllProjects)

router.get('/:id',
  param('id').isMongoId().withMessage('ID no valido'),
  handleInputErrors,
  ProjectController.getProjectById)

router.put('/:id',
  param('id').isMongoId().withMessage('ID no valido'),
  body('projectName').notEmpty().withMessage('El Nombre del Proyecto es Obligatorio'),
  body('clientName').notEmpty().withMessage('El Nombre del Cliente es Obligatorio'),
  body('description').notEmpty().withMessage('La Descripcion del Proyecto es Obligatoria'),
  handleInputErrors,
  ProjectController.updateProject)

  router.delete('/:id',
  param('id').isMongoId().withMessage('ID no valido'),
  handleInputErrors,
  ProjectController.deleteProject)

/** Routes for tasks */

router.post('/:projectId/tasks',
  validateProjectExist,
  body('name').notEmpty().withMessage('El Nombre de la tarea es obligatorio'),
  body('description').notEmpty().withMessage('La Descripcion de la tarea es bligatoria'),
  handleInputErrors,
  TaskController.createTask
)

export default router