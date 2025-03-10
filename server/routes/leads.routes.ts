import { Router } from 'express';
import { LeadsController } from '../api/leads.controller';

const router = Router();
const controller = new LeadsController();

router.get('/', controller.getAll.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.post('/', controller.create.bind(controller));
router.patch('/:id', controller.update.bind(controller));
router.delete('/:id', controller.delete.bind(controller));

export const leadsRouter = router;
