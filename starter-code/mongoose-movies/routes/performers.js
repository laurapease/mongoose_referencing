const express = require('express');
const router = express.Router();
const performersCtrl = require('../controllers/performers');

router.post('/movies/:id/performers', performersCtrl.addToCast);

module.exports = router;