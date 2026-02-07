-- Mevcut veritabanına profil resmi (avatar_url) alanı ekler.
-- Sadece daha önce init.sql ile kurulmuş ve users tablosunda avatar_url olmayan kurulumlarda çalıştırın.

ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500);
