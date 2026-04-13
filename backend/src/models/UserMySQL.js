const { query } = require('../config/mysql');

/**
 * User Model — MySQL
 *
 * Thin data-access layer using prepared statements.
 * Each method maps to a single optimized query.
 * No ORM overhead; raw SQL for maximum speed.
 */
const UserModel = {
  /**
   * Find a user by email.
   * Uses the UNIQUE index on `email` → O(1) lookup.
   *
   * @param {string} email
   * @param {boolean} includePassword - Whether to include the password hash
   * @returns {Promise<Object|null>}
   */
  findByEmail: async (email, includePassword = false) => {
    const columns = includePassword
      ? 'id, email, password, role, is_active, created_at, updated_at'
      : 'id, email, role, is_active, created_at, updated_at';

    const [rows] = await query(
      `SELECT ${columns} FROM users WHERE email = ? LIMIT 1`,
      [email]
    );
    return rows[0] || null;
  },

  /**
   * Find a user by primary key.
   * Uses the PRIMARY KEY index → O(1) lookup.
   *
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  findById: async (id) => {
    const [rows] = await query(
      `SELECT id, email, role, is_active, created_at, updated_at
       FROM users WHERE id = ? LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  },

  /**
   * Create a new user.
   * Password MUST be pre-hashed before calling this method.
   *
   * @param {{ email: string, password: string, role?: string }} userData
   * @returns {Promise<Object>} The newly created user (without password)
   */
  create: async ({ email, password, role = 'STUDENT' }) => {
    const [result] = await query(
      `INSERT INTO users (email, password, role) VALUES (?, ?, ?)`,
      [email, password, role]
    );

    // Return newly created user without password
    return {
      id: result.insertId,
      email,
      role,
      is_active: 1,
    };
  },

  /**
   * Check if any ADMIN user exists (for seeding).
   *
   * @returns {Promise<boolean>}
   */
  adminExists: async () => {
    const [rows] = await query(
      `SELECT 1 FROM users WHERE role = 'ADMIN' LIMIT 1`
    );
    return rows.length > 0;
  },

  /**
   * Update user fields by ID.
   *
   * @param {number} id
   * @param {Object} fields - Key/value pairs to SET
   * @returns {Promise<boolean>} True if a row was updated
   */
  updateById: async (id, fields) => {
    const keys = Object.keys(fields);
    const values = Object.values(fields);

    if (keys.length === 0) return false;

    const setClause = keys.map((key) => `${key} = ?`).join(', ');
    const [result] = await query(
      `UPDATE users SET ${setClause} WHERE id = ?`,
      [...values, id]
    );

    return result.affectedRows > 0;
  },
};

module.exports = UserModel;
