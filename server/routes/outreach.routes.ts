import { Router } from 'express';
import { outreachController } from '../api/outreach.controller';

const router = Router();

router.get('/', outreachController.getAll.bind(outreachController));
router.get('/:id', outreachController.getById.bind(outreachController));
router.post('/', outreachController.createOutreach.bind(outreachController));
router.patch('/:id', outreachController.updateOutreach.bind(outreachController));
router.delete('/:id', outreachController.delete.bind(outreachController));

export const outreachRouter = router;
