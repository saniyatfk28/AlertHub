const express = require('express');
const router = express.Router();
const { createSos } = require('../controllers/sosController');

router.post('/', createSos);

module.exports = router;
