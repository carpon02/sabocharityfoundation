import express from 'express';
import {
  submitContactForm,
  getAllContacts,
  getContact,
  markAsRead,
  replyToContact,
  deleteContact
} from '../controllers/contactController.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public: Submit a contact form
router.post('/submit-form', submitContactForm);

// Admin: Get all messages
router.get('/', protect, restrictTo('admin'), getAllContacts);

// Admin: Get a single message by ID
router.get('/:id', protect, restrictTo('admin'), getContact);

// Admin: Mark as read
router.patch('/:id/read', protect, restrictTo('admin'), markAsRead);

// Admin: Mark as replied
router.patch('/:id/reply', protect, restrictTo('admin'), replyToContact);

// Admin: Delete a contact message
router.delete('/:id', protect, restrictTo('admin'), deleteContact);

export default router;
