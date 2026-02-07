import pg from "pg";

const { Pool } = pg;

let pool = null;

/**
 * PostgreSQL bağlantı havuzu.
 * pgAdmin ile aynı PostgreSQL sunucusuna bağlanır.
 * Ortam değişkenleri: DATABASE_URL veya PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE
 */
function getPool() {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL;

  if (connectionString) {
    pool = new Pool({
      connectionString,
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
  } else {
    pool = new Pool({
      host: process.env.PGHOST || "localhost",
      port: parseInt(process.env.PGPORT || "5432", 10),
      user: process.env.PGUSER || "postgres",
      password: process.env.PGPASSWORD || "",
      database: process.env.PGDATABASE || "portfolio_db",
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
  }

  return pool;
}

/**
 * Tek bir SQL sorgusu çalıştırır.
 * @param {string} text - SQL sorgusu
 * @param {Array} params - Parametreler ($1, $2, ...)
 */
export async function query(text, params = []) {
  const pool = getPool();
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (err) {
    console.error("[db error]", err.message);
    throw err;
  }
}

export { getPool };
