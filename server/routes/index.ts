import { Router } from 'express';
import { leadsRouter } from './leads.routes';
import { teamsRouter } from './team.routes';
import { tasksRouter } from './tasks.routes';
import { bidsRouter } from './bids.routes';
import { outreachRouter } from './outreach.routes';

const router = Router();

// Mount all routes under /api prefix
router.use('/api/leads', leadsRouter);
router.use('/api/team-members', teamsRouter);
router.use('/api/tasks', tasksRouter);
router.use('/api/bids', bidsRouter);
router.use('/api/outreach', outreachRouter);

export default router;
