Kurulumda ezmemen gerekenler

.env.local ve web.config aynı kalsın

deploy paketin bunları ezmesin

1️⃣ Node’u durdur

(Çalışıyorsa)

Ctrl + C

2️⃣ Proje klasörüne gir
cd C:\inetpub\wwwroot\atakanguloglu.com.tr

3️⃣ Eski build’i temizle (ÖNEMLİ)
rmdir /s /q .next


İstersen temiz kurulum için:

rmdir /s /q node_modules

4️⃣ Paketleri kur (EN DOĞRUSU)
npm install


veya daha stabil (önerilir):

npm ci

5️⃣ Production build al
npm run build


Eğer package.json’da farklıysa:

npm run build:prod


Build sonunda .next/standalone oluşmalı.

🟢 BAŞLATMA (Production)
6️⃣ (Önerilir) ENV’leri garantiye al
$env:NODE_ENV="production"


Eğer env sorun yaşamamak için elle set etmek istersen:

$env:DATABASE_URL="postgresql://postgres:admin@localhost:5432/portfolio_db"
$env:PGPASSWORD="admin"

7️⃣ Next.js’i başlat (standalone)
node .next\standalone\server.js


Başlatmak için bunlar gerekir 

$env:DATABASE_URL="postgresql://postgres:admin@localhost:5432/portfolio_db"
$env:PGHOST="localhost"
$env:PGPORT="5432"
$env:PGUSER="postgres"
$env:PGPASSWORD="admin"
$env:PGDATABASE="portfolio_db"
node .next\standalone\server.js 
