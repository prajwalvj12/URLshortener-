const redis = require('redis');
const winston = require('winston');

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Initialize Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URI || 'redis://127.0.0.1:6379',
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        logger.error('Redis connection failed after 10 retries');
        return new Error('Redis connection failed');
      }
      return Math.min(retries * 100, 3000);
    },
    connectTimeout: 10000,
    keepAlive: 30000
  }
});

redisClient.on('error', (err) => {
  logger.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  logger.info('Connected to Redis');
});

redisClient.on('ready', () => {
  logger.info('Redis client is ready');
});

redisClient.on('reconnecting', () => {
  logger.info('Redis client is reconnecting');
});

redisClient.on('end', () => {
  logger.info('Redis client connection ended');
  // Attempt to reconnect
  setTimeout(connectRedis, 5000);
});

// Connect to Redis with retry
const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (err) {
    logger.error('Failed to connect to Redis:', err);
    // Retry connection after 5 seconds
    setTimeout(connectRedis, 5000);
  }
};

// Initial connection
connectRedis();

// Keep the connection alive
setInterval(async () => {
  try {
    if (!redisClient.isOpen) {
      await connectRedis();
    }
  } catch (err) {
    logger.error('Failed to maintain Redis connection:', err);
  }
}, 30000); // Check every 30 seconds

module.exports = redisClient; 