  require('dotenv').config();
  const express = require('express');
  const cors = require('cors');
  const connectDB = require('./config/db');
  const taskRoutes = require('./routes/taskRoutes');
  const { errorHandler, notFound } = require('./middleware/errorHandler');

  const app = express();

  connectDB();

  app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: '✅ To-Do List API is running',
      version: '1.0.0',
      docs: '/api/tasks',
    });
  });

  app.use('/api/tasks', taskRoutes); //routes

  app.use(notFound);
  app.use(errorHandler);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
