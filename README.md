# Bitly Clone – URL Shortener Service

A modern, full-stack URL shortener service inspired by Bitly. Shorten long URLs, track analytics, and manage your links with a beautiful UI and robust backend.

---

## Features

- **Shorten long URLs** with a single click
- **Real-time analytics**: track clicks, referrers, user agents, and IP addresses
- **Responsive frontend** built with React and Chakra UI
- **High-performance backend** using Node.js, Express, MongoDB, and Redis
- **Caching** for fast redirects and analytics
- **Automatic URL expiration** (30 days)
- **Dockerized** for easy deployment

---

## Tech Stack

- **Frontend:** React, Chakra UI, Vite
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Cache:** Redis
- **ORM:** Mongoose
- **Logging:** Winston
- **Containerization:** Docker, Docker Compose

---

## Getting Started

### Prerequisites
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

### Quick Start (Recommended)

```bash
git clone <this-repo-url>
cd bitly_clone
docker-compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- MongoDB: localhost:27017
- Redis: localhost:6379

### Manual Setup (Development)

#### Backend
```bash
cd bitly_clone
npm install
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## Usage

1. Open the frontend in your browser: [http://localhost:5173](http://localhost:5173)
2. Enter a long URL and click "Shorten URL"
3. Copy the generated short URL and share it
4. View analytics for each short URL (clicks, referrers, user agents, IPs)

---

## API Endpoints

### Create Short URL
- **POST** `/shorten`
- **Body:** `{ "originalUrl": "https://example.com" }`
- **Response:** `{ "shortId": "abc123", "shortUrl": "http://localhost:3000/abc123", "originalUrl": "..." }`

### Redirect to Original URL
- **GET** `/:shortId`
- **Redirects** to the original URL

### Get Analytics
- **GET** `/analytics/:shortId`
- **Response:** `{ "clicks": 5, "analytics": [ { "timestamp": "...", "referrer": "...", "userAgent": "...", "ipAddress": "..." }, ... ] }`

### Health Check
- **GET** `/health`
- **Response:** `{ "status": "OK" }`

