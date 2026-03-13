import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 5, // Reduced to prevent stale connections
  idleTimeout: 30000, // 30 seconds - lower than server wait_timeout
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000, // 10 seconds - proactive keepalive
  charset: 'utf8mb4',
});

export default pool;

/**
 * Retry wrapper for database operations that may fail due to stale connections.
 * Automatically retries on ECONNRESET or PROTOCOL_CONNECTION_LOST errors.
 */
export async function withRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (retries > 0 && (error.code === 'ECONNRESET' || error.code === 'PROTOCOL_CONNECTION_LOST')) {
      return withRetry(fn, retries - 1);
    }
    throw error;
  }
}
