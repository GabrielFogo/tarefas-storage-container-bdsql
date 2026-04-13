import mysql from 'mysql2/promise';

const dbHost = process.env.DB_HOST || 'localhost';
const isCloudSqlSocket = dbHost.startsWith('/cloudsql/');

const pool = mysql.createPool({
  ...(isCloudSqlSocket ? { socketPath: dbHost } : { host: dbHost }),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'test',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

export default pool;
