import express from 'express';
import {
  subscribeNewsletter,
  unsubscribeNewsletter,
  getAllSubscribers,
  getSubscriber,
  deleteSubscriber
} from '../controllers/newsletterController.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = express.Router();

// Subscribe (public)
router.post('/subscribe', subscribeNewsletter);

// Unsubscribe (public)
router.patch('/unsubscribe', unsubscribeNewsletter);

// Get all subscribers (admin)
router.get('/', protect, restrictTo('admin'), getAllSubscribers);

// Get one subscriber (admin)
router.get('/:id', protect, restrictTo('admin'), getSubscriber);

// Delete subscriber (admin)
router.delete('/:id', protect, restrictTo('admin'), deleteSubscriber);

export default router;
