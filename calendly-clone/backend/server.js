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
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://calsync-wn55.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.options('*', cors());

// ✅ Body parser
app.use(express.json());

// ✅ Routes (clean order)
app.use('/api/users', userRoutes);
app.use('/api/event-types', eventTypesRouter);
app.use('/api/availability', availabilityRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/meetings', meetingsRouter);

// ✅ Test route
app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

// ✅ Error handler (ALWAYS LAST)
app.use(errorHandler);

// ✅ Server start
const PORT = process.env.PORT || 5000;

sequelize.sync({ force: false })
  .then(() => {
    console.log('DB synced successfully');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('DB sync failed:', err);
  });