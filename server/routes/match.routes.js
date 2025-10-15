const express = require('express');
const router = express.Router();
const matchController = require('../controllers/match.controller');
const authenticateToken = require('../middleware/auth'); // JWT 认证


router.post('/matches', authenticateToken, matchController.createMatch);


router.patch('/matches/:id/status',  authenticateToken, matchController.updateMatchStatus);


router.get('/matches', authenticateToken, matchController.getMatchesByUser);


router.get('/matches/:id', authenticateToken, matchController.getMatchById);


router.get('/matches/all', authenticateToken, matchController.getAllMatches);

module.exports = router;