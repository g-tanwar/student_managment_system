require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Initialize Server
const startServer = async () => {
  try {
    // Connect to Database
    await connectDB();

    // Start Express Server
    app.listen(PORT, () => {
      console.log(`[Server] running on http://localhost:${PORT} in ${process.env.NODE_ENV} mode`);
    });
  } catch (error) {
    console.error(`[Server] initialization failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();
