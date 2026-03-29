require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { sequelize } = require('./src/config/db');

const eventTypesRouter = require('./src/routes/eventTypes');
const availabilityRouter = require('./src/routes/availability');
const bookingsRouter = require('./src/routes/bookings');
const meetingsRouter = require('./src/routes/meetings');
const userRoutes = require('./src/routes/users');

const errorHandler = require('./src/middleware/errorHandler');

const app = express();

const corsOptions = {
  origin: function(origin, callback) {
    if (!origin || 
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

app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/event-types', eventTypesRouter);
app.use('/api/availability', availabilityRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/meetings', meetingsRouter);

app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

app.use(errorHandler);

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