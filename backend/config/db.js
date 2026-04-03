const mongoose = require('mongoose');
const { Sequelize } = require('sequelize');
require('dotenv').config();

// 🍃 MongoDB connection
const connectMongoDB = async () => {
  try {
    // Railway will use the MONGODB_URI variable you set in the dashboard
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// 🐘 PostgreSQL / Sequelize connection
// We check if POSTGRES_URL exists (Cloud); otherwise, we fallback to individual params (Local)
const isProduction = process.env.NODE_ENV === 'production';

const sequelize = process.env.POSTGRES_URL
  ? new Sequelize(process.env.POSTGRES_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: isProduction ? {
      ssl: {
        require: true,
        rejectUnauthorized: false // 🛡️ Mandatory for Neon/Railway
      }
    } : {}
  })
  : new Sequelize(
    process.env.POSTGRES_DB,
    process.env.POSTGRES_USER,
    process.env.POSTGRES_PASSWORD,
    {
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      dialect: 'postgres',
      logging: false,
    }
  );

const connectPostgres = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected successfully');
  } catch (error) {
    console.error('❌ PostgreSQL connection error:', error);
    process.exit(1);
  }
};

module.exports = {
  connectMongoDB,
  sequelize,
  connectPostgres,
};