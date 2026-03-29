const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const EventType = sequelize.define('EventType', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: User, key: 'id' },
  },
  name: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, allowNull: false },
  duration: { type: DataTypes.INTEGER, allowNull: false },
  description: { type: DataTypes.TEXT },
  color: { type: DataTypes.STRING, defaultValue: '#0069ff' },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
});

User.hasMany(EventType, { foreignKey: 'userId' });
EventType.belongsTo(User, { foreignKey: 'userId' });

module.exports = EventType;
