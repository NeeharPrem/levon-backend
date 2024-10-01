const express = require('express');
const { check } = require('express-validator');
const { getWeather } = require('../controllers/weatherController');
const router = express.Router();

router.get('/:query', [
    check('query')
        .isLength({ min:1})
        .withMessage('Search cannot be empty.')
        .isAlpha()
        .withMessage('Search should only contain letters')
], getWeather);

module.exports = router;
