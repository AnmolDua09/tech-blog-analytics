const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const PageVisit = sequelize.define('PageVisit', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  pageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'page_visits',
  timestamps: false,
});

module.exports = PageVisit;
