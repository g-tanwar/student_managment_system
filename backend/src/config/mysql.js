const mysql = require('mysql2/promise');

/**
 * MySQL Connection Pool Configuration
 * 
 * Uses a connection pool to avoid the overhead of creating/destroying
 * connections on every query. Prepared statements are used throughout
 * for both security (SQL injection prevention) and performance
 * (server-side statement caching).
 */
let pool;

const createPool = () => {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT, 10) || 3306,
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'student_management',

      // ── Pool Tuning ──
      waitForConnections: true,
      connectionLimit: 20,        // Max simultaneous connections
      queueLimit: 0,              // Unlimited queue (waits until a conn is free)
      maxIdle: 10,                // Keep 10 idle connections ready
      idleTimeout: 60000,         // Close idle connections after 60s
      enableKeepAlive: true,      // TCP keep-alive to prevent stale connections
      keepAliveInitialDelay: 10000,

      // ── Performance ──
      namedPlaceholders: false,   // Use positional ? placeholders (faster)
      decimalNumbers: true,       // Return DECIMAL as JS numbers
      timezone: '+00:00',         // UTC timezone
    });

    console.log('[MySQL] Connection pool created successfully');
  }
  return pool;
};

/**
 * Execute a prepared statement query.
 * Uses pool.execute() which leverages server-side prepared statements
 * for better performance on repeated queries.
 *
 * @param {string} sql - The SQL query with ? placeholders
 * @param {Array}  params - Values to bind
 * @returns {Promise<Array>} [rows, fields]
 */
const query = async (sql, params = []) => {
  const db = createPool();
  return db.execute(sql, params);
};

/**
 * Get a single connection from the pool for transactions.
 * Caller MUST release the connection after use.
 *
 * @returns {Promise<mysql.PoolConnection>}
 */
const getConnection = async () => {
  const db = createPool();
  return db.getConnection();
};

/**
 * Initialize the database - create tables if they don't exist.
 * Uses IF NOT EXISTS so it's safe to run on every server start.
 */
const initDatabase = async () => {
  const db = createPool();

  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id          INT UNSIGNED   NOT NULL AUTO_INCREMENT,
      email       VARCHAR(255)   NOT NULL,
      password    CHAR(60)       NOT NULL COMMENT 'bcrypt hash is always 60 chars',
      role        ENUM('ADMIN','TEACHER','STUDENT') NOT NULL DEFAULT 'STUDENT',
      is_active   TINYINT(1)     NOT NULL DEFAULT 1,
      created_at  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

      PRIMARY KEY (id),
      UNIQUE KEY  idx_users_email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  console.log('[MySQL] Database tables verified / created');
};

/**
 * Gracefully close all pool connections (for shutdown hooks).
 */
const closePool = async () => {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('[MySQL] Connection pool closed');
  }
};

module.exports = { query, getConnection, initDatabase, closePool, createPool };
