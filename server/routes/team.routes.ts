import { Router } from 'express';
import { teamController } from '../api/team.controller';

const router = Router();

router.get('/', teamController.getAll.bind(teamController));
router.get('/:id', teamController.getById.bind(teamController));
router.post('/', teamController.createTeamMember.bind(teamController));
router.patch('/:id', teamController.updateTeamMember.bind(teamController));
router.delete('/:id', teamController.delete.bind(teamController));

export const teamsRouter = router;
