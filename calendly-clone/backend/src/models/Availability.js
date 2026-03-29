const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Availability = sequelize.define('Availability', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: User, key: 'id' },
  },
  dayOfWeek: { type: DataTypes.INTEGER, allowNull: false }, // 0=Sun, 6=Sat
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  startTime: { type: DataTypes.STRING, allowNull: false }, // "09:00"
  endTime: { type: DataTypes.STRING, allowNull: false },   // "17:00"
});

User.hasMany(Availability, { foreignKey: 'userId' });
Availability.belongsTo(User, { foreignKey: 'userId' });

module.exports = Availability;
