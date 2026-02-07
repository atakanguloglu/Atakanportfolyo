/**
 * Veritabanı migration / kurulum.
 * Tabloları otomatik oluşturur. pgAdmin'e elle SQL yazmaya gerek yok.
 *
 * Kullanım: npm run db:setup   veya   npm run db:migrate
 * Önce .env.local dosyasında PostgreSQL bilgilerini ayarlayın.
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
    const sqlPath = path.join(__dirname, "init.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");
    // Yorum satırlarını ve boş satırları temizle, tek SQL olarak çalıştır
    const statements = sql
      .split(";")
      .map((s) => s.replace(/--[^\n]*/g, "").trim())
      .filter((s) => s.length > 0);

    for (const statement of statements) {
      await client.query(statement + ";");
      console.log("[db:setup] Tablo/şema güncellendi.");
    }
    // Mevcut kurulumlarda users tablosuna avatar_url ekle (yoksa)
    await client.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500);");
    console.log("[db:setup] Bitti. Tablolar hazır.");
  } catch (err) {
    console.error("[db:setup] Hata:", err.message);
    if (err.code === "ECONNREFUSED") {
      console.error("PostgreSQL çalışıyor mu? .env.local doğru mu?");
    }
    if (err.code === "3D000") {
      console.error("Önce pgAdmin'de veritabanı oluşturun: CREATE DATABASE portfolio_db;");
    }
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
