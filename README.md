# Atakan Güloğlu — Portfolyo Sitesi

Kişisel portfolyo ve blog sitesi. **Next.js**, **Tailwind CSS** ve **PostgreSQL** ile geliştirildi.

**Canlı site:** [https://atakanguloglu.com.tr](https://atakanguloglu.com.tr)

---

## Özellikler

- Ana sayfa (tanıtım, projeler, referanslar, iletişim)
- Blog (yazılar, yorumlar, bülten)
- Çalışma hayatı / timeline
- Admin paneli (blog, projeler, müşteri logoları, referanslar, iletişim mesajları, bülten aboneleri, ziyaret istatistikleri)
- SEO (sitemap, robots, Open Graph), Google Search Console doğrulama
- Mobil uyumlu, cookie bilgilendirmesi

---

## Kurulum

### Gereksinimler

- Node.js 18+
- PostgreSQL

### 1. Repoyu klonlayın

```bash
git clone https://github.com/atakanguloglu/Atakanportfolyo.git
cd Atakanportfolyo
```

### 2. Bağımlılıklar

```bash
npm install
```

### 3. Ortam değişkenleri

`env.example` dosyasını `.env.local` olarak kopyalayıp PostgreSQL, `NEXT_PUBLIC_APP_URL`, `JWT_SECRET` vb. değerleri doldurun.

### 4. Veritabanı

```bash
npm run db:setup
npm run db:seed
```

### 5. Geliştirme sunucusu

```bash
npm run dev
```

Tarayıcıda: http://localhost:3000  
Admin paneli: http://localhost:3000/admin/login (varsayılan: `admin` / `admin123`)

---

## Lisans

Bu proje kişisel kullanım içindir.

## Geliştirici

**Atakan Güloğlu** — [atakanguloglu.com.tr](https://atakanguloglu.com.tr)
