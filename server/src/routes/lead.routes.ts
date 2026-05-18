import { Router } from 'express';
import { 
  createLead, 
  getLeads, 
  getLeadById, 
  updateLead, 
  deleteLead, 
  exportLeadsCSV 
} from '../controllers/lead.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

export const router = Router();

// Apply the authentication protection middleware to ALL leads routes below
router.use(protect);

// Dashboards Endpoint routing matrix
router.post('/', createLead);
router.get('/', getLeads);
router.get('/export', exportLeadsCSV);
router.get('/:id', getLeadById);
router.put('/:id', updateLead);

// Assignment Requirement: Restrict Delete route to Admin users only
router.delete('/:id', authorize('Admin'), deleteLead);