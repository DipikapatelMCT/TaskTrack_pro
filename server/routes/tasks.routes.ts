import { Router } from 'express';
import { tasksController } from '../api/tasks.controller';

const router = Router();

router.get('/', tasksController.getAll.bind(tasksController));
router.get('/:id', tasksController.getById.bind(tasksController));
router.post('/', tasksController.createTask.bind(tasksController));
router.patch('/:id', tasksController.updateTask.bind(tasksController));
router.delete('/:id', tasksController.delete.bind(tasksController));

export const tasksRouter = router;
