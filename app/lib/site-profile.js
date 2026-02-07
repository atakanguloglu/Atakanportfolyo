import { query } from "@/app/lib/db";

const DEFAULT_PROFILE_IMAGE = "/profile.png";

/**
 * Sitede gösterilecek profil resmi URL'si.
 * Veritabanında avatar_url dolu ilk kullanıcıyı kullanır; yoksa /profile.png.
 * avatar_url sütunu yoksa (migration çalışmamışsa) varsayılan döner, hata fırlatmaz.
 */
export async function getSiteProfileImageUrl() {
  try {
    const hasColumn = await query(
      `SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'avatar_url' LIMIT 1`
    );
    if (hasColumn.rows.length === 0) {
      return DEFAULT_PROFILE_IMAGE;
    }
    const res = await query(
      "SELECT avatar_url FROM users WHERE avatar_url IS NOT NULL AND avatar_url != '' ORDER BY id ASC LIMIT 1"
    );
    const url = res.rows[0]?.avatar_url?.trim();
    return url || DEFAULT_PROFILE_IMAGE;
  } catch {
    return DEFAULT_PROFILE_IMAGE;
  }
}
