const express = require('express');
const router = express.Router();

const {sendChatMessage} = require('../controllers/geminiController');

const {verifyToken, requireRole} = require('../middleware/authMiddleware');

router.use(verifyToken);

router.post('/', requireRole('Employee'), sendChatMessage);

module.exports = router;