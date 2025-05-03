const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
    trim: true
  },
  shortId: {
    type: String,
    required: true,
    unique: true
  },
  clicks: {
    type: Number,
    default: 0
  },
  analytics: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    referrer: String,
    userAgent: String,
    ipAddress: String
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 2592000 // URLs expire after 30 days
  }
});

module.exports = mongoose.model('Url', urlSchema);