const express = require('express');
const router = express.Router();
const rideController = require('../controllers/ride.controller');
const authenticateToken = require('../middleware/auth'); // JWT认证中间件



router.post('/rides', authenticateToken, rideController.createRide);


router.get('/rides', rideController.getAllRides);


router.get('/rides/:id', rideController.getRideById);


router.put('/rides/:id', authenticateToken, rideController.updateRide);


router.delete('/rides/:id', authenticateToken, rideController.deleteRide);

module.exports = router;