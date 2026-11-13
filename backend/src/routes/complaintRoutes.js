const express = require('express');
const router = express.Router();
const {
  getComplaints,
  getComplaintById,
  createComplaint,
  updateComplaintStatus,
  deleteComplaint,
} = require('../controllers/complaintController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/', getComplaints);
router.get('/:id', getComplaintById);
router.post('/', requireRole('Employee'), createComplaint);
router.patch('/:id/status', requireRole('Admin'), updateComplaintStatus);
router.delete('/:id', deleteComplaint);

module.exports = router;