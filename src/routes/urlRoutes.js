const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');

// Create short URL
router.post('/shorten', urlController.createShortUrl);

// Get URL analytics
router.get('/analytics/:shortId', urlController.getUrlAnalytics);

// Redirect to original URL
router.get('/:shortId', urlController.redirectToUrl);

module.exports = router;