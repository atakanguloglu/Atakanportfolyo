# PostgreSQL / pgAdmin Kurulumu

Backend ayrı uygulama değil; bu Next.js projesi içinde API route'lar ile PostgreSQL'e bağlanıyor. pgAdmin ile aynı veritabanını yönetirsiniz.

## 1. PostgreSQL kurulu olsun

- [PostgreSQL indir](https://www.postgresql.org/download/) (pgAdmin genelde birlikte gelir)
- Sunucunun çalıştığından emin olun (varsayılan port: 5432)

## 2. pgAdmin'de veritabanı oluşturma

1. pgAdmin'i açın, sunucuya bağlanın (örn. Local / PostgreSQL).
2. **Databases** → sağ tık → **Create** → **Database**
3. **Database** adı: `portfolio_db` (veya `env.example` içindeki `PGDATABASE` ile aynı)
4. **Save**

## 3. Tabloyu otomatik oluşturma (migration)

**Önce** `.env.local` dosyasını oluşturup bağlantı bilgilerini girin (aşağıdaki 4. adım). Sonra:

```bash
npm install
npm run db:setup
```

veya aynı işlem için:

```bash
npm run db:migrate
```

Bu komut `scripts/init.sql` dosyasını çalıştırır; `contacts`, `users`, `blogs`, `comments`, `projects`, `testimonials`, `clients` (Mutlu Müşteriler logoları), `newsletter_subscribers`, `admin_logins` (admin giriş geçmişi) ve `site_visits` (site ziyaretçileri) tabloları otomatik oluşur. pgAdmin'de elle SQL yazmanız gerekmez.

*(İsterseniz pgAdmin'de Query Tool açıp `scripts/init.sql` içeriğini yapıştırarak da tabloyu oluşturabilirsiniz.)*

## 4. Projede bağlantı ayarları

1. Proje kökünde `env.example` dosyasını `.env.local` olarak kopyalayın.
2. `.env.local` içinde PostgreSQL bilgilerinizi girin:

```env
# Tek satır (tercih edilen)
DATABASE_URL=postgresql://postgres:SIFRENIZ@localhost:5432/portfolio_db

# veya ayrı ayrı
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=SIFRENIZ
PGDATABASE=portfolio_db
```

3. **Önce** `npm run db:setup` ile tabloları oluşturun (yukarıdaki 3. adım).
4. `npm run dev` ile projeyi çalıştırın.
5. İletişim formunu doldurup **Gönder** deyin; kayıt `contacts` tablosuna düşer.
6. pgAdmin'de **portfolio_db** → **Schemas** → **public** → **Tables** → **contacts** → **View/Edit Data** ile kayıtları görebilirsiniz.

## Özet

- **Backend:** Bu proje içinde `app/api/contact/route.js` (ayrı uygulama yok).
- **Veritabanı:** PostgreSQL; pgAdmin ile aynı sunucu/veritabanı.
- **Migration:** `npm run db:setup` veya `npm run db:migrate` — tablolar otomatik oluşur (`scripts/init.sql`).
