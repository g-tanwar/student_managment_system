require('dotenv').config({ override: true });
const app = require('./app');
const connectDB = require('./config/db');


const PORT = process.env.PORT || 5001;

// Initialize Server
const startServer = async () => {
  try {
    // Connect to MongoDB (existing models)
    await connectDB();
    // Start Express Server
    const server = app.listen(PORT, () => {
      console.log(`[Server] running on http://localhost:${PORT} in ${process.env.NODE_ENV} mode`);
    });

    // ── Graceful Shutdown ──
    const shutdown = async (signal) => {
      console.log(`\n[Server] ${signal} received — shutting down gracefully...`);
      server.close(async () => {
        console.log('[Server] Shutdown complete');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error(`[Server] initialization failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();
