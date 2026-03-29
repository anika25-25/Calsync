require('dotenv').config();
const { sequelize } = require('./config/db');
const User = require('./models/User');
const EventType = require('./models/EventType');
const Availability = require('./models/Availability');
const Booking = require('./models/Booking');

async function seed() {
  await sequelize.sync({ force: true });
  console.log('Tables dropped and recreated.');

  const user = await User.create({
    name: 'Alex Johnson',
    email: 'alex@example.com',
    username: 'alex',
    timezone: 'Asia/Kolkata',
  });

  const et1 = await EventType.create({
    userId: user.id, name: '30 Minute Meeting', slug: '30min',
    duration: 30, description: 'A quick 30-minute chat.', color: '#0069ff',
  });
  const et2 = await EventType.create({
    userId: user.id, name: '1 Hour Meeting', slug: '1hour',
    duration: 60, description: 'An in-depth 1-hour session.', color: '#7c3aed',
  });
  await EventType.create({
    userId: user.id, name: '15 Minute Intro', slug: '15min',
    duration: 15, description: 'Quick intro call.', color: '#059669',
  });

  // Mon–Fri availability 9am–5pm
  for (let day = 1; day <= 5; day++) {
    await Availability.create({
      userId: user.id, dayOfWeek: day,
      isActive: true, startTime: '09:00', endTime: '17:00',
    });
  }

  // Tomorrow's meeting
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);
  const end1 = new Date(tomorrow);
  end1.setMinutes(end1.getMinutes() + 30);
  await Booking.create({
    eventTypeId: et1.id, hostId: user.id,
    inviteeName: 'Priya Sharma', inviteeEmail: 'priya@example.com',
    startTime: tomorrow, endTime: end1, status: 'confirmed',
  });

  // Past meeting
  const past = new Date();
  past.setDate(past.getDate() - 3);
  past.setHours(14, 0, 0, 0);
  const pastEnd = new Date(past);
  pastEnd.setHours(pastEnd.getHours() + 1);
  await Booking.create({
    eventTypeId: et2.id, hostId: user.id,
    inviteeName: 'Rahul Gupta', inviteeEmail: 'rahul@example.com',
    startTime: past, endTime: pastEnd, status: 'confirmed',
  });

  console.log('Database seeded successfully!');
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
