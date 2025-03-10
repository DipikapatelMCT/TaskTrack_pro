import { Router } from 'express';
import { bidsController } from '../api/bids.controller';

const router = Router();

router.get('/', bidsController.getAll.bind(bidsController));
router.get('/:id', bidsController.getById.bind(bidsController));
router.post('/', bidsController.createBid.bind(bidsController));
router.patch('/:id', bidsController.updateBid.bind(bidsController));
router.delete('/:id', bidsController.delete.bind(bidsController));

export const bidsRouter = router;
