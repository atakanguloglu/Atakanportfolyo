import { NextResponse } from "next/server";
import { getAuthFromRequest } from "@/app/lib/auth-request";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const ALLOWED_TYPES = ["image/svg+xml", "image/png", "image/jpeg", "image/jpg", "image/webp"];
const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

function sanitizeFilename(name) {
  const ext = path.extname(name).toLowerCase() || ".png";
  const base = path.basename(name, path.extname(name))
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(0, 60) || "logo";
  return `${base}${ext}`;
}

/** Benzersiz dosya adı: aynı isimle yüklemede üzerine yazmayı ve cache sorununu azaltır */
function uniqueFilename(originalName) {
  const safe = sanitizeFilename(originalName);
  const stamp = Date.now();
  const ext = path.extname(safe);
  const base = path.basename(safe, ext);
  return `${base}-${stamp}${ext}`;
}

/** POST /api/admin/upload/client-logo — Logo dosyası yükle (sadece admin), public/clients/ içine kaydeder */
export async function POST(request) {
  try {
    const auth = await getAuthFromRequest();
    if (!auth) {
      return NextResponse.json({ error: "Giriş yapın." }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Dosya seçin." }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type) && !file.name?.match(/\.(svg|png|jpg|jpeg|webp)$/i)) {
      return NextResponse.json({ error: "Sadece resim dosyaları (SVG, PNG, JPG, WebP) yüklenebilir." }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Dosya boyutu 2 MB'dan küçük olmalı." }, { status: 400 });
    }

    const filename = uniqueFilename(file.name || "logo.png");
    const dir = path.join(process.cwd(), "public", "clients");
    await mkdir(dir, { recursive: true });
    const filepath = path.join(dir, filename);

    const bytes = await file.arrayBuffer();
    await writeFile(filepath, Buffer.from(bytes));

    return NextResponse.json({ image: filename });
  } catch (err) {
    console.error("[api/admin/upload/client-logo]", err);
    return NextResponse.json({ error: "Yükleme başarısız." }, { status: 500 });
  }
}
