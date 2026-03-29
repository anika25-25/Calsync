require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { sequelize } = require('./src/config/db');

// Routes
const eventTypesRouter = require('./src/routes/eventTypes');
const availabilityRouter = require('./src/routes/availability');
const bookingsRouter = require('./src/routes/bookings');
const meetingsRouter = require('./src/routes/meetings');
const userRoutes = require('./src/routes/users');

// Middleware
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

// ✅ CORS (must be before routes)
const corsOptions = {
  origin: function(origin, callback) {
    if (!origin || 
        origin.includes('calsync-wn55.vercel.app') || 
        origin.includes('vercel.app') ||
        origin === 'http://localhost:5173') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
};

app.options('*', cors(corsOptions)); // ✅ preflight FIRST, with same config
app.use(cors(corsOptions));          // ✅ then apply to all routes

// ✅ Body parser
app.use(express.json());

// ✅ Routes (clean order)
app.use('/api/users', userRoutes);
app.use('/api/event-types', eventTypesRouter);
app.use('/api/availability', availabilityRouter);