# Next.js Projesini IIS Üzerinden Sunucuya Çıkarma

Bu rehber, portföy sitesini Windows sunucusunda IIS ile yayına almak için adım adım anlatır.

**Alan adı:** `atakanguloglu.com.tr`

---

## IIS'e tüm projeyi mi koyacağım?

**Hayır.** Projeyi olduğu gibi IIS’e “koymuyorsun”. İki ayrı şey var:

1. **Node uygulaması** — Site aslında bir **Node.js** programı olarak çalışıyor (örn. port 3000). Bunu sunucuda **PM2** veya benzeri ile çalıştırıyorsun.
2. **IIS** — Sadece **reverse proxy** görevi görüyor: Gelen istekleri (atakanguloglu.com.tr) alıp Node’un çalıştığı porta (3000) yönlendiriyor. IIS’e koyduğun şey genelde sadece **web.config** (ve isteğe bağlı boş/statik bir klasör).

Yani: **IIS = kapı**, **Node = asıl uygulama**.

### Sunucuya ne koyacaksın? İki yol:

| Yol | Ne yapıyorsun | Sunucuda ne var? |
|-----|----------------|------------------|
| **A) Build sunucuda** | Projeyi (Git/FTP ile) sunucuya atıyorsun → `npm ci` → `npm run build` → Node’u `.next/standalone` ile çalıştırıyorsun | Tüm proje (kaynak kod, node_modules, .next) |
| **B) Build kendi PC’nde** | Kendi bilgisayarında `npm run build` yapıyorsun → Sadece **`.next/standalone`** klasörünü + **`.env`** (veya .env.local) sunucuya kopyalıyorsun → Sunucuda sadece Node ile bu klasörü çalıştırıyorsun | Sadece **standalone** klasörü + ortam değişkenleri |

**B** daha hafif: Sunucuda kaynak kod, `node_modules` yok; sadece çalıştırılabilir çıktı var. **A** daha kolay: Sunucuda her şey var, güncellemek için `git pull` + `npm run build` yeter.

**“Projeyi komple atsam ne olur?”** — Olur. `C:\inetpub\wwwroot\atakanguloglu.com.tr` içine tüm projeyi (kaynak kod, package.json, app/, public/, vb.) + **web.config** atabilirsin. IIS sadece **web.config**’e bakıp istekleri Node’a yönlendirir; Node’u sen ayrıca çalıştırırsın (aynı sunucuda `npm ci` → `npm run build` → `npm start` veya `node .next/standalone/server.js`). Yani klasörde proje + web.config olur, sunucuda bir kez build alıp Node’u port 3000’de açman yeter.

IIS tarafında her iki yolda da aynı: Bir site oluşturup **web.config** ile istekleri Node’un portuna yönlendiriyorsun (aşağıda anlatılıyor).

---

## Kopyalama bittikten sonra ne yapacaksın?

Proje dosyalarını `C:\inetpub\wwwroot\atakanguloglu.com.tr` içine attıysan, sırayla şunları yap:

| # | Ne yapacaksın | Nasıl |
|---|----------------|--------|
| 1 | **Ortam değişkenleri** | Klasörün kökünde `.env.local` olsun (PostgreSQL, `NEXT_PUBLIC_APP_URL=https://atakanguloglu.com.tr`, `JWT_SECRET`, Resend vb.). Yoksa `env.example`’dan kopyala, sunucu bilgileriyle doldur. |
| 2 | **Bağımlılıklar** | Klasöre gir: `cd C:\inetpub\wwwroot\atakanguloglu.com.tr` → `npm ci` (veya `npm install`). |
| 3 | **Build** | `npm run build` çalıştır. `.next` ve `.next/standalone` oluşur. |
| 4 | **Veritabanı** | Sunucuda PostgreSQL kurulu ve çalışıyor olsun. Bir kez: `node scripts/setup-db.js` ve gerekirse `node scripts/seed-admin.js`. |
| 5 | **Node’u çalıştır** | Port 3000’de: `set PORT=3000` sonra `npm start` veya `cd .next\standalone` → `node server.js`. Kalıcı için **PM2**: `pm2 start npm --name "atakanguloglu" -- start` (veya standalone ile `pm2 start server.js --name "atakanguloglu"`). |
| 6 | **IIS site** | IIS Yöneticisi → Sites → Add Website → Physical path: `C:\inetpub\wwwroot\atakanguloglu.com.tr`, Binding: `atakanguloglu.com.tr`. Kökte **web.config** olduğundan emin ol. |
| 7 | **Test** | Tarayıcıda `http://atakanguloglu.com.tr` (veya sunucu IP) aç; site geliyorsa tamam. |

**Özet:** Kopyala → `.env.local` → `npm ci` → `npm run build` → veritabanı kur → Node’u 3000’de çalıştır (PM2 önerilir) → IIS’te site tanımla.

---

## Genel Akış

1. Sunucuda Node.js + PostgreSQL kurulu olacak.
2. Projeyi build edip `standalone` çıktı ile çalıştıracağız.
3. Node uygulaması bir portta (örn. 3000) çalışacak.
4. IIS, bu porta **reverse proxy** ile istekleri yönlendirecek (SSL, domain tek yerde).

---

## 1. Sunucuda Gereksinimler

- **Node.js** 18+ (LTS önerilir) — [nodejs.org](https://nodejs.org)
- **PostgreSQL** — veritabanı için
- **IIS** — Windows’ta “Web Sunucusu (IIS)” rolü açık olmalı
- **URL Rewrite** ve **ARR** — IIS’e eklenti olarak kurulacak

### URL Rewrite + ARR Kurulumu

1. [URL Rewrite](https://www.iis.net/downloads/microsoft/url-rewrite) indirip kur.
2. [Application Request Routing (ARR)](https://www.iis.net/downloads/microsoft/application-request-routing) indirip kur.
3. IIS Yöneticisi → Sunucu adı → **Application Request Routing Cache** → **Server Proxy Settings** → “Enable proxy” işaretle, kaydet.

---

## 2. Projeyi Sunucuya Taşıma ve Build

### 2.1 Projeyi sunucuya kopyala

- Git ile clone edebilir veya dosyaları FTP/klasörle kopyalayabilirsin.
- Örnek: `C:\inetpub\wwwroot\atakanguloglu.com.tr` (veya istediğin yere koyabilirsin).

### 2.2 Ortam değişkenleri (.env.local)

Sunucudaki proje kökünde `.env.local` oluştur (veya sunucu ortam değişkenleriyle ver):

```env
# PostgreSQL (sunucudaki gerçek bilgiler)
DATABASE_URL=postgresql://KULLANICI:SIFRE@localhost:5432/portfolio_db
# veya:
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=xxx
PGDATABASE=portfolio_db

# Canlı site adresi
NEXT_PUBLIC_APP_URL=https://atakanguloglu.com.tr

# Güvenlik — mutlaka değiştir
JWT_SECRET=guclu-rastgele-bir-secret

# İletişim formu e-posta (Resend)
RESEND_API_KEY=re_xxxx
CONTACT_EMAIL=atakan2100120@gmail.com
```

### 2.3 Bağımlılıklar ve build

Sunucuda proje klasöründe (PowerShell veya CMD):

```bash
cd C:\inetpub\wwwroot\atakanguloglu.com.tr
npm ci
npm run build
```

Build sonrası:

- `.next/standalone` klasörü oluşur.
- `public` içeriği `standalone` içine kopyalanmalı; aşağıdaki script ile yapılabilir.

### 2.4 Standalone için public ve static kopyalama

`npm run build` çalıştığında **postbuild** script’i otomatik olarak `public` ve `.next/static` klasörlerini `.next/standalone` içine kopyalar. Elle yapmak istersen:

```bash
node scripts/copy-standalone.js
```

---

## 3. Node Uygulamasını Çalıştırma

Standalone, tek bir Node sunucusu gibi çalışır. Port vereceğiz (örn. 3000).

### Seçenek A: Doğrudan çalıştırma (test için)

```bash
cd C:\inetpub\wwwroot\atakanguloglu.com.tr\.next\standalone
set PORT=3000
node server.js
```

Tarayıcıda `http://sunucu-ip:3000` ile kontrol et.

### Seçenek B: PM2 ile sürekli çalıştırma (önerilen)

1. **PM2** kur (global):

   ```bash
   npm install -g pm2
   ```

2. Proje kökünde bir start script’i kullan veya doğrudan:

   ```bash
   cd C:\inetpub\wwwroot\atakanguloglu.com.tr
   set PORT=3000
   pm2 start npm --name "atakanguloglu" -- start
   ```

   veya standalone kullanıyorsan:

   ```bash
   cd C:\inetpub\wwwroot\atakanguloglu.com.tr\.next\standalone
   set PORT=3000
   pm2 start server.js --name "atakanguloglu"
   ```

3. Sunucu açıldığında otomatik başlasın:

   ```bash
   pm2 startup
   pm2 save
   ```

Böylece Node uygulaması sürekli 3000 portunda çalışır; IIS bu porta proxy yapacak.

---

## 4. IIS’i Reverse Proxy Olarak Ayarlama

### 4.1 Site oluşturma

1. **IIS Yöneticisi** aç.
2. **Sites** → sağ tık → **Add Website**.
3. **Site name:** atakanguloglu (veya istediğin ad).
4. **Physical path:** Örneğin `C:\inetpub\wwwroot\atakanguloglu.com.tr` (sadece statik dosya için; asıl uygulama Node’da). İstersen boş bir klasör de olabilir, çünkü tüm istekler proxy’e gidecek.
5. **Binding:** Domain’i yaz: `atakanguloglu.com.tr` (istersen `www.atakanguloglu.com.tr` ekle), gerekirse HTTPS bağlaması ekle.

### 4.2 Proxy kuralı (web.config)

Site kökünde `web.config` oluştur (path’i 4.1’deki “Physical path” ile aynı klasör olacak, örn. `C:\inetpub\wwwroot\atakanguloglu.com.tr\web.config` veya sitenin “path”i nereyse orada):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="ReverseProxyToNode" stopProcessing="true">
          <match url="(.*)" />
          <action type="Rewrite" url="http://127.0.0.1:3000/{R:1}" />
          <serverVariables>
            <set name="HTTP_X_Forwarded_For" value="{REMOTE_ADDR}" />
            <set name="HTTP_X_Forwarded_Proto" value="https" />
          </serverVariables>
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

- `HTTP_X_Forwarded_Proto` = https ise, Next.js doğru scheme’i bilir (gerekirse `NEXT_PUBLIC_APP_URL` ile de uyumlu olur).
- Eğer sadece HTTP kullanıyorsan `value="https"` yerine `value="http"` yazabilirsin.

Kaydedip IIS’te siteyi yenile. Artık tüm istekler `http://127.0.0.1:3000` üzerindeki Node uygulamasına gidecek.

---

## 4.3 IIS’ten start/stop (HttpPlatformHandler ile)

Node’u ayrı çalıştırmak yerine **IIS’in siteyi başlatıp durdurmasıyla** Node’u da başlatıp durdurabilirsin. Bunun için **HttpPlatformHandler** kullanılır.

**Ne fark eder?**  
- **Reverse proxy (yukarıdaki):** Node’u sen (PM2 vb.) çalıştırırsın; IIS sadece isteği yönlendirir. Siteyi IIS’te stop etsen Node çalışmaya devam eder.  
- **HttpPlatformHandler:** IIS siteyi başlatınca Node süreci de başlar, siteyi durdurunca Node da durur. Yani **IIS’ten Start/Stop** = Node da start/stop.

**Adımlar:**

1. **HttpPlatformHandler’ı kur**  
   [Hosting Bundle / HttpPlatformHandler](https://www.iis.net/downloads/microsoft/httpplatformhandler) indirip sunucuya kur.

2. **Build al**  
   Proje klasöründe `npm run build` çalıştır (`.next/standalone` oluşur).

3. **Standalone klasörüne web.config koy**  
   Projedeki `deploy/web.config-httpplatform` dosyasını **`.next/standalone`** içine **`web.config`** adıyla kopyala:
   - Kaynak: `deploy/web.config-httpplatform`  
   - Hedef: `C:\inetpub\wwwroot\atakanguloglu.com.tr\.next\standalone\web.config`

4. **IIS’te sitenin fiziksel yolu = standalone**  
   - IIS Yöneticisi → Sites → (atakanguloglu.com.tr sitesi) → sağ tık → **Manage Website** → **Advanced Settings**  
   - **Physical Path:** `C:\inetpub\wwwroot\atakanguloglu.com.tr\.next\standalone`  
   (Proje kökü değil, **standalone** klasörü olmalı.)

5. **Ortam değişkenleri**  
   Node’un görmesi için `.env` veya `.env.local` değerlerini **standalone** klasörüne kopyala veya sunucuda sistem/process ortam değişkeni olarak tanımla (örn. App Pool → Advanced Settings → Environment Variables veya sunucu ortam değişkenleri).

6. **Start/Stop**  
   IIS’te siteye sağ tık → **Start** / **Stop**. Node süreci de buna göre başlar ve durur.

**Not:** İlk kurulumda `.next\standalone` içinde `logs` klasörü yoksa oluştur (veya web.config’teki `stdoutLogFile` yolunu buna göre ayarla). Hata alırsan `logs\node.log` dosyasına bak.

---

## 5. Veritabanı

- Sunucuda PostgreSQL kurulu olmalı.
- Projedeki `scripts/setup-db.js` ve migration/seed script’lerini **sunucuda bir kez** çalıştır:

  ```bash
  cd C:\inetpub\wwwroot\atakanguloglu.com.tr
  node scripts/setup-db.js
  node scripts/seed-admin.js
  ```

- `.env.local` içindeki `DATABASE_URL` veya `PGHOST/PGPORT/PGUSER/PGPASSWORD/PGDATABASE` sunucudaki PostgreSQL’e işaret etmeli.

---

## 6. Özet Kontrol Listesi

| Adım | Açıklama |
|------|----------|
| 1 | Node.js + PostgreSQL + IIS + URL Rewrite + ARR kurulu |
| 2 | Proje kopyalandı, `.env.local` dolduruldu |
| 3 | `npm ci` ve `npm run build` çalıştırıldı |
| 4 | `public` içeriği `.next/standalone/public` içine kopyalandı |
| 5 | Veritabanı oluşturuldu, gerekirse seed çalıştırıldı |
| 6 | Node uygulaması PM2 (veya başka yöntem) ile port 3000’de çalışıyor |
| 7 | IIS’te site tanımlandı, `web.config` ile reverse proxy 3000’e yönlendiriliyor |
| 8 | Domain / SSL (HTTPS) IIS binding’de ayarlandı |

Bu adımlarla proje IIS üzerinden sunucuya çıkmış olur. Sorun olursa önce `http://sunucu-ip:3000` ile Node’un doğru çalıştığını kontrol et, sonra IIS proxy ve binding’e bak.
