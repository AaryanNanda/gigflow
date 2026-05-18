import { Router } from 'express';
import { getLeads, createLead, updateLead, deleteLead } from '../controllers/lead.controller';
import { authenticateJWT, requireAdmin } from '../middlewares/auth.middleware';

const leadRouter = Router();

// Protect all lead pipeline processing routes behind token authentication
leadRouter.use(authenticateJWT);

leadRouter.get('/', getLeads);
leadRouter.post('/', createLead);
leadRouter.put('/:id', updateLead);
leadRouter.delete('/:id', requireAdmin, deleteLead);

export { leadRouter };