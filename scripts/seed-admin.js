/**
 * İlk admin kullanıcıyı oluşturur.
 * Kullanım: npm run db:seed
 * Varsayılan: kullanıcı adı "admin", şifre "admin123"
 */

const path = require("path");
const fs = require("fs");

function loadEnv() {
  const envPath = fs.existsSync(path.join(__dirname, "..", ".env.local"))
    ? path.join(__dirname, "..", ".env.local")
    : path.join(__dirname, "..", ".env");
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf8");
  content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const eq = trimmed.indexOf("=");
      if (eq > 0) {
        const key = trimmed.slice(0, eq).trim();
        let val = trimmed.slice(eq + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
          val = val.slice(1, -1);
        process.env[key] = val;
      }
    }
  });
}
loadEnv();

const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

const DEFAULT_USERNAME = "admin";
const DEFAULT_PASSWORD = "admin123";

async function run() {
  const connectionString = process.env.DATABASE_URL;
  const pool = connectionString
    ? new Pool({ connectionString })
    : new Pool({
        host: process.env.PGHOST || "localhost",
        port: parseInt(process.env.PGPORT || "5432", 10),
        user: process.env.PGUSER || "postgres",
        password: process.env.PGPASSWORD || "",
        database: process.env.PGDATABASE || "portfolio_db",
      });

  const client = await pool.connect();
  try {
    const username = process.env.ADMIN_USERNAME || DEFAULT_USERNAME;
    const password = process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD;
    const hash = bcrypt.hashSync(password, 10);

    const res = await client.query(
      "INSERT INTO users (username, password_hash, display_name) VALUES ($1, $2, $3) ON CONFLICT (username) DO NOTHING RETURNING id",
      [username, hash, "Admin"]
    );

    if (res.rowCount > 0) {
      console.log("[db:seed] Admin kullanıcı oluşturuldu. Kullanıcı adı:", username, "Şifre:", password);
    } else {
      console.log("[db:seed] Admin zaten var. Kullanıcı adı:", username);
    }
  } catch (err) {
    console.error("[db:seed] Hata:", err.message);
    if (err.code === "42P01") console.error("Önce npm run db:setup çalıştırın.");
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
