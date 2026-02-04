-- pgAdmin'de bu dosyayı çalıştırın veya Query Tool'da yapıştırın.
-- Önce veritabanı oluşturun: CREATE DATABASE portfolio_db;

-- İletişim formu kayıtları
CREATE TABLE IF NOT EXISTS contacts (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  email      VARCHAR(255) NOT NULL,
  location   VARCHAR(255),
  budget     VARCHAR(100),
  subject    VARCHAR(255),
  message    TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin kullanıcılar (login için)
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  display_name  VARCHAR(255),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Blog yazıları (admin panelden eklenir, açık sayfada listelenir)
CREATE TABLE IF NOT EXISTS blogs (
  id            SERIAL PRIMARY KEY,
  title         VARCHAR(255) NOT NULL,
  slug          VARCHAR(255) NOT NULL UNIQUE,
  excerpt       TEXT,
  content       TEXT,
  image_url     VARCHAR(500),
  author        VARCHAR(255),
  is_published  BOOLEAN DEFAULT true,
  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Blog yorumları (yayında sadece onaylılar görünür, admin onaylar/siler)
CREATE TABLE IF NOT EXISTS comments (
  id            SERIAL PRIMARY KEY,
  blog_id       INT NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
  author_name   VARCHAR(255) NOT NULL,
  author_email  VARCHAR(255) NOT NULL,
  content       TEXT NOT NULL,
  is_approved   BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_blog_id ON comments(blog_id);
CREATE INDEX IF NOT EXISTS idx_comments_is_approved ON comments(is_approved);

-- Projeler (admin panelden yönetilir, ana sayfa ve /projects’te listelenir)
CREATE TABLE IF NOT EXISTS projects (
  id           SERIAL PRIMARY KEY,
  title        VARCHAR(255) NOT NULL,
  category     VARCHAR(100),
  description  TEXT,
  image_url    VARCHAR(500),
  link         VARCHAR(500),
  is_published BOOLEAN DEFAULT true,
  sort_order   INT DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_is_published ON projects(is_published);
CREATE INDEX IF NOT EXISTS idx_projects_sort_order ON projects(sort_order);

-- Referanslar / testimonial (admin panelden yönetilir, ana sayfada carousel’de listelenir)
CREATE TABLE IF NOT EXISTS testimonials (
  id           SERIAL PRIMARY KEY,
  text         TEXT NOT NULL,
  user_name    VARCHAR(255) NOT NULL,
  user_post    VARCHAR(255),
  user_company VARCHAR(255),
  sort_order   INT DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_testimonials_sort_order ON testimonials(sort_order);

-- Örnek referanslar (isteğe bağlı, admin panelden de ekleyebilirsiniz)
INSERT INTO testimonials (text, user_name, user_post, user_company, sort_order)
SELECT 'Atakan ile çalışmak harikaydı. Projemizi zamanında teslim etti, iletişimi çok iyi. Kesinlikle tekrar çalışırız.', 'Ahmet Yılmaz', 'Genel Müdür', 'ABC Şirketi', 0
WHERE NOT EXISTS (SELECT 1 FROM testimonials LIMIT 1);
INSERT INTO testimonials (text, user_name, user_post, user_company, sort_order)
SELECT 'Profesyonel yaklaşımı ve kaliteli iş çıktıları sayesinde web sitemiz çok beğenildi. Herkese tavsiye ederim.', 'Ayşe Kaya', 'Pazarlama Müdürü', 'XYZ Ltd.', 1
WHERE (SELECT COUNT(*) FROM testimonials) < 2;
INSERT INTO testimonials (text, user_name, user_post, user_company, sort_order)
SELECT 'Kullanıcı deneyimi konusunda çok titiz. Tasarımları hem şık hem işlevsel. Memnun kaldık.', 'Mehmet Demir', 'Ürün Yöneticisi', 'Tech Co.', 2
WHERE (SELECT COUNT(*) FROM testimonials) < 3;

-- Bülten aboneleri (yeni yazılardan haberdar ol)
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id         SERIAL PRIMARY KEY,
  email      VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);

-- Admin giriş geçmişi (siteye giriş yapanları takip)
CREATE TABLE IF NOT EXISTS admin_logins (
  id          SERIAL PRIMARY KEY,
  user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  username    VARCHAR(100) NOT NULL,
  ip_address  VARCHAR(45),
  user_agent  TEXT,
  logged_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_logins_logged_at ON admin_logins(logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_logins_user_id ON admin_logins(user_id);

-- Site ziyaretleri (gezenleri takip — sayfa görüntüleme)
CREATE TABLE IF NOT EXISTS site_visits (
  id          SERIAL PRIMARY KEY,
  path        VARCHAR(500) NOT NULL,
  referer     VARCHAR(500),
  user_agent  TEXT,
  visited_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_site_visits_visited_at ON site_visits(visited_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_visits_path ON site_visits(path);

-- Mutlu Müşteriler (ana sayfada logo carousel, admin panelden yönetilir)
CREATE TABLE IF NOT EXISTS clients (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  image      VARCHAR(500) NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clients_sort_order ON clients(sort_order);

INSERT INTO clients (name, image, sort_order) SELECT 'Google', 'google.svg', 0 WHERE NOT EXISTS (SELECT 1 FROM clients LIMIT 1);
INSERT INTO clients (name, image, sort_order) SELECT 'Dribbble', 'dribbble.svg', 1 WHERE (SELECT COUNT(*) FROM clients) < 2;
INSERT INTO clients (name, image, sort_order) SELECT 'LinkedIn', 'linkedin.svg', 2 WHERE (SELECT COUNT(*) FROM clients) < 3;
INSERT INTO clients (name, image, sort_order) SELECT 'Amazon', 'amazon.svg', 3 WHERE (SELECT COUNT(*) FROM clients) < 4;
INSERT INTO clients (name, image, sort_order) SELECT 'Medium', 'medium.svg', 4 WHERE (SELECT COUNT(*) FROM clients) < 5;
INSERT INTO clients (name, image, sort_order) SELECT 'Spotify', 'spotify.svg', 5 WHERE (SELECT COUNT(*) FROM clients) < 6;
