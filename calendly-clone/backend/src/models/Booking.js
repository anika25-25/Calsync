const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const EventType = require('./EventType');
const User = require('./User');

const Booking = sequelize.define('Booking', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  eventTypeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: EventType, key: 'id' },
  },
  hostId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: User, key: 'id' },
  },
  inviteeName: { type: DataTypes.STRING, allowNull: false },
  inviteeEmail: { type: DataTypes.STRING, allowNull: false },
  startTime: { type: DataTypes.DATE, allowNull: false },
  endTime: { type: DataTypes.DATE, allowNull: false },
  status: {
    type: DataTypes.ENUM('confirmed', 'cancelled'),
    defaultValue: 'confirmed',
  },
  notes: { type: DataTypes.TEXT },
});

EventType.hasMany(Booking, { foreignKey: 'eventTypeId' });
Booking.belongsTo(EventType, { foreignKey: 'eventTypeId' });
User.hasMany(Booking, { foreignKey: 'hostId' });
Booking.belongsTo(User, { foreignKey: 'hostId' });

module.exports = Booking;
