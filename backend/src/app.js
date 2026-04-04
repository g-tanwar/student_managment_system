const express = require('express');
const cors = require('cors');
const { notFoundHandler, globalErrorHandler } = require('./middlewares/error.middleware');
const routes = require('./routes/index');

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check & Base Routes
app.use('/api/v1', routes);

// 404 Route Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(globalErrorHandler);

module.exports = app;
