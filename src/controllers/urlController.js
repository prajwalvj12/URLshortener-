const shortid = require('shortid');
const Url = require('../models/url');
const winston = require('winston');
const redisClient = require('../config/redis');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Create short URL
exports.createShortUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;
    
    if (!originalUrl) {
      return res.status(400).json({ error: 'Original URL is required' });
    }

    // Generate short ID
    const shortId = shortid.generate();

    // Create new URL document
    const url = new Url({
      originalUrl,
      shortId
    });

    // Save to MongoDB
    await url.save();

    // Cache in Redis
    if (redisClient.isOpen) {
      await redisClient.set(shortId, originalUrl, {
        EX: 86400 // Cache for 24 hours
      });
    }

    res.json({
      shortId,
      shortUrl: `${req.protocol}://${req.get('host')}/${shortId}`,
      originalUrl
    });
  } catch (error) {
    logger.error('Error creating short URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Redirect to original URL
exports.redirectToUrl = async (req, res) => {
  try {
    const { shortId } = req.params;

    // Try to get URL from Redis cache
    let originalUrl = null;
    if (redisClient.isOpen) {
      originalUrl = await redisClient.get(shortId);
    }

    if (!originalUrl) {
      // If not in cache, get from MongoDB
      const url = await Url.findOne({ shortId });
      
      if (!url) {
        return res.status(404).json({ error: 'URL not found' });
      }

      originalUrl = url.originalUrl;

      // Update cache if Redis is available
      if (redisClient.isOpen) {
        await redisClient.set(shortId, originalUrl, {
          EX: 86400 // Cache for 24 hours
        });
      }
    }

    // Update analytics before redirecting
    try {
      await Url.findOneAndUpdate(
        { shortId },
        {
          $inc: { clicks: 1 },
          $push: {
            analytics: {
              timestamp: new Date(),
              referrer: req.get('referrer') || 'Direct',
              userAgent: req.get('user-agent'),
              ipAddress: req.ip
            }
          }
        },
        { new: true } // Return the updated document
      );
    } catch (analyticsError) {
      logger.error('Error updating analytics:', analyticsError);
      // Continue with redirect even if analytics update fails
    }

    res.redirect(originalUrl);
  } catch (error) {
    logger.error('Error redirecting to URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get URL analytics
exports.getUrlAnalytics = async (req, res) => {
  try {
    const { shortId } = req.params;
    
    const url = await Url.findOne({ shortId });
    
    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    res.json({
      clicks: url.clicks,
      analytics: url.analytics
    });
  } catch (error) {
    logger.error('Error getting URL analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};