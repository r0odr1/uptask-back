import { Router } from 'express'
import { body, param } from 'express-validator'
import { ProjectController } from '../controllers/ProjectController'
import { handleInputErrors } from '../middleware/validation'
import { TaskController } from '../controllers/TaskController'
import { projectExist } from '../middleware/project'
import { hasAuthorization, taskBelongsToProject, taskExist } from '../middleware/task'
import { authenticate } from '../middleware/auth'
import { TeamMemberControlle } from '../controllers/TeamController'
import { NotedController } from '../controllers/NoteController'

const router = Router()
router.use(authenticate)

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
  ProjectController.getProjectById
)

router.put('/:id',
  param('id').isMongoId().withMessage('ID no valido'),
  body('projectName').notEmpty().withMessage('El Nombre del Proyecto es Obligatorio'),
  body('clientName').notEmpty().withMessage('El Nombre del Cliente es Obligatorio'),
  body('description').notEmpty().withMessage('La Descripcion del Proyecto es Obligatoria'),
  handleInputErrors,
  ProjectController.updateProject
)

  router.delete('/:id',
  param('id').isMongoId().withMessage('ID no valido'),
  handleInputErrors,
  ProjectController.deleteProject
)

/** Routes for tasks */

router.param('projectId', projectExist)

router.post('/:projectId/tasks',
  hasAuthorization,
  body('name').notEmpty().withMessage('El Nombre de la tarea es obligatorio'),
  body('description').notEmpty().withMessage('La Descripcion de la tarea es bligatoria'),
  handleInputErrors,
  TaskController.createTask
)

router.get('/:projectId/tasks',
  TaskController.getProjectTasks
)

router.param('taskId', taskExist)
router.param('taskId', taskBelongsToProject)

router.get('/:projectId/tasks/:taskId',
  param('taskId').isMongoId().withMessage('ID no valido'),
  handleInputErrors,
  TaskController.getTaskById
)

router.put('/:projectId/tasks/:taskId',
  hasAuthorization,
  param('taskId').isMongoId().withMessage('ID no valido'),
  body('name').notEmpty().withMessage('El Nombre de la tarea es obligatorio'),
  body('description').notEmpty().withMessage('La Descripcion de la tarea es bligatoria'),
  handleInputErrors,
  TaskController.updateTask
)

router.delete('/:projectId/tasks/:taskId',
  hasAuthorization,
  param('taskId').isMongoId().withMessage('ID no valido'),
  handleInputErrors,
  TaskController.deleteTask
)

router.post('/:projectId/tasks/:taskId/status',
  param('taskId').isMongoId().withMessage('ID no valido'),
  body('status').notEmpty().withMessage('El estado es obligatorio'),
  handleInputErrors,
  TaskController.updateStatus
)

/** Routes for team */

router.post('/:projectId/team/find',
  body('email').isEmail().toLowerCase().withMessage('Correo no válido'),
  handleInputErrors,
  TeamMemberControlle.findMemberByEmail
)

router.get('/:projectId/team',
  TeamMemberControlle.getProjectTeam
)

router.post('/:projectId/team',
  body('id').isMongoId().withMessage('ID no válido'),
  handleInputErrors,
  TeamMemberControlle.addMemberById
)

router.delete('/:projectId/team/:userId',
  param('userId').isMongoId().withMessage('ID no válido'),
  handleInputErrors,
  TeamMemberControlle.removeMemberById
)

/** Routes for Notes */
router.post('/:projectId/tasks/:taskId/notes',
  body('content').notEmpty().withMessage('El contenido de la nota es obligatoria'),
  handleInputErrors,
  NotedController.createNote
)

router.get('/:projectId/tasks/:taskId/notes',
  NotedController.getTaskNote
)

router.delete('/:projectId/tasks/:taskId/notes/:noteId',
  param('notesId').isMongoId().withMessage('ID no válido'),
  NotedController.deleteNote
)

export default router