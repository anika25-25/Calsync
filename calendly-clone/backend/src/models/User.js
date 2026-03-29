const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: true },     // ← no unique
  username: { type: DataTypes.STRING, allowNull: true },  // ← no unique
  timezone: { type: DataTypes.STRING, defaultValue: 'Asia/Kolkata' },
});

module.exports = User;