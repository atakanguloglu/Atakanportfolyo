import { NextResponse } from "next/server";
import { getAuthFromRequest } from "@/app/lib/auth-request";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const MAX_SIZE = 3 * 1024 * 1024; // 3 MB

function sanitizeFilename(name) {
  const ext = path.extname(name).toLowerCase() || ".png";
  const base = path.basename(name, path.extname(name))
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(0, 40) || "profil";
  return `${base}${ext}`;
}

function uniqueFilename(originalName) {
  const safe = sanitizeFilename(originalName);
  const stamp = Date.now();
  const ext = path.extname(safe);
  const base = path.basename(safe, ext);
  return `${base}-${stamp}${ext}`;
}

/** POST /api/admin/upload/profile-image — Profil resmi yükle (sadece giriş yapmış admin), public/profile/ içine kaydeder */
export async function POST(request) {
  try {
    const auth = await getAuthFromRequest();
    if (!auth?.userId) {
      return NextResponse.json({ error: "Giriş yapın." }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Dosya seçin." }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type) && !file.name?.match(/\.(png|jpg|jpeg|webp)$/i)) {
      return NextResponse.json({ error: "Sadece resim dosyaları (PNG, JPG, WebP) yüklenebilir." }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Dosya boyutu 3 MB'dan küçük olmalı." }, { status: 400 });
    }

    const filename = uniqueFilename(file.name || "profil.png");
    const dir = path.join(process.cwd(), "public", "profile");
    await mkdir(dir, { recursive: true });
    const filepath = path.join(dir, filename);

    const bytes = await file.arrayBuffer();
    await writeFile(filepath, Buffer.from(bytes));

    const publicUrl = `/profile/${filename}`;
    return NextResponse.json({ image: filename, url: publicUrl });
  } catch (err) {
    console.error("[api/admin/upload/profile-image]", err);
    return NextResponse.json({ error: "Yükleme başarısız." }, { status: 500 });
  }
}
