require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectMongoDB, sequelize, connectPostgres } = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/analytics', require('./routes/analytics'));

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectMongoDB();
  await connectPostgres();

  // Sync Postgres models (create tables if not exists)

  await sequelize.sync({ alter: true });
  console.log('PostgreSQL models synced (Altered to match schema)');

  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
};

startServer();
