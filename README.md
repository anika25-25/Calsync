## 🌐 Live Demo
- Frontend: https://your-vercel-link.vercel.app
- Backend: https://your-render-link.onrender.com

# Calendly Clone

A full-stack scheduling/booking web application that replicates Calendly's core design and functionality.

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18 + Vite + React Router v6   |
| Styling   | Plain CSS (no UI library)           |
| Date util | date-fns                            |
| HTTP      | Axios                               |
| Backend   | Node.js + Express.js                |
| ORM       | Sequelize v6                        |
| Database  | MySQL                               |

---

## Prerequisites

- Node.js v18+
- MySQL running locally (or any MySQL-compatible server)

---

## Setup Instructions

### 1. Create the MySQL database

```sql
CREATE DATABASE calendly_clone;
```

### 2. Backend

```bash
cd backend
npm install
```

Edit `.env` with your MySQL credentials:

```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=calendly_clone
DB_USER=root
DB_PASSWORD=yourpassword
PORT=5000
```

Seed the database with sample data:

```bash
npm run seed
```

Start the backend server:

```bash
npm run dev
```

Backend runs at: http://localhost:5000

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

---

## Usage

### Admin side (no login required — default user is pre-seeded)
- Dashboard: http://localhost:5173/dashboard
- Event Types: http://localhost:5173/event-types
- Availability: http://localhost:5173/availability
- Meetings: http://localhost:5173/meetings

### Public booking page
- http://localhost:5173/alex/30min
- http://localhost:5173/alex/1hour
- http://localhost:5173/alex/15min

---

## Database Schema

### users
| Column   | Type    | Notes            |
|----------|---------|------------------|
| id       | INT PK  | auto increment   |
| name     | VARCHAR |                  |
| email    | VARCHAR | unique           |
| username | VARCHAR | unique           |
| timezone | VARCHAR | e.g. Asia/Kolkata |

### event_types
| Column      | Type    | Notes            |
|-------------|---------|------------------|
| id          | INT PK  |                  |
| userId      | INT FK  | → users.id       |
| name        | VARCHAR |                  |
| slug        | VARCHAR | URL-safe name    |
| duration    | INT     | minutes          |
| description | TEXT    |                  |
| color       | VARCHAR | hex color        |
| isActive    | BOOLEAN |                  |

### availabilities
| Column    | Type    | Notes                   |
|-----------|---------|-------------------------|
| id        | INT PK  |                         |
| userId    | INT FK  | → users.id              |
| dayOfWeek | INT     | 0=Sun, 1=Mon … 6=Sat    |
| isActive  | BOOLEAN |                         |
| startTime | VARCHAR | "09:00"                 |
| endTime   | VARCHAR | "17:00"                 |

### bookings
| Column       | Type     | Notes               |
|--------------|----------|---------------------|
| id           | INT PK   |                     |
| eventTypeId  | INT FK   | → event_types.id    |
| hostId       | INT FK   | → users.id          |
| inviteeName  | VARCHAR  |                     |
| inviteeEmail | VARCHAR  |                     |
| startTime    | DATETIME |                     |
| endTime      | DATETIME |                     |
| status       | ENUM     | confirmed/cancelled |
| notes        | TEXT     |                     |

---

## Core Features Implemented

- Event Types: create, edit, delete, list with color coding
- Availability: set weekly recurring schedule per day
- Public booking page: month calendar, time slot grid, booking form
- Double-booking prevention via SQL overlap check
- Booking confirmation page
- Meetings page: upcoming / past tabs, cancel meeting
- Seeded sample data (3 event types, Mon–Fri availability, 2 bookings)

## Assumptions

- A single default user (id=1 "Alex Johnson") is always the logged-in admin — no auth required.
- Public booking URL format: `/:username/:slug` where username is hardcoded to "alex".
- Availability is recurring weekly (same hours every week), not date-specific.
- Slots are generated dynamically at query time from availability windows + event duration.
- All datetimes stored in UTC for consistency.
