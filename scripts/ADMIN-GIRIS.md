# Admin Girişi ve Panel

## İlk kurulum

1. **Veritabanı tabloları** (users tablosu dahil):
   ```bash
   npm run db:setup
   ```

2. **Admin kullanıcı oluştur** (varsayılan: kullanıcı adı `admin`, şifre `admin123`):
   ```bash
   npm run db:seed
   ```

3. **Uygulamayı çalıştır:**
   ```bash
   npm run dev
   ```

## Giriş

- **Adres:** http://localhost:3000/admin/login
- **Varsayılan kullanıcı adı:** `admin`
- **Varsayılan şifre:** `admin123`

Giriş yaptıktan sonra **Admin Panel** ana sayfasına yönlendirilirsiniz. Buradan:
- **Bloglar** (yakında) – yazıları yönetme
- **Çıkış** – oturumu kapatma

## Güvenlik

- `.env.local` içinde **JWT_SECRET** değerini mutlaka değiştirin.
- İlk girişten sonra admin şifresini değiştirmek için (ileride) panelde şifre değiştirme eklenebilir.
