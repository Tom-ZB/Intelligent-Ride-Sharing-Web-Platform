const express = require('express');
const router = express.Router();

router.get('/chats/:userId', (req, res) => {
    res.send ("good")
});

module.exports = router;