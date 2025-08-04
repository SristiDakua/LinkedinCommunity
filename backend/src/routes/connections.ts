import express from 'express';
import {
  sendConnectionRequest,
  respondToConnectionRequest,
  getMyConnections,
  getPendingRequests,
  removeConnection
} from '../controllers/connectionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Routes
router.post('/request/:userId', sendConnectionRequest);
router.put('/respond/:connectionId', respondToConnectionRequest);
router.get('/my-connections', getMyConnections);
router.get('/requests', getPendingRequests);
router.delete('/:connectionId', removeConnection);

export default router;
