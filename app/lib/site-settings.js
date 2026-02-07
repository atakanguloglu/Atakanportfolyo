import { query } from "@/app/lib/db";

const DEFAULTS = {
  site_title: "Ana Sayfa | Atakan Güloğlu",
  title_template: "%s | Atakan Güloğlu",
  meta_description: "Atakan Güloğlu kişisel portfolyo sitesi. Geliştirici ve tasarımcı projeleri.",
  contact_email: "atakan2100120@gmail.com",
  contact_phone: "+90 538 080 30 23",
  whatsapp_number: "905380803023",
  linkedin_url: "https://www.linkedin.com/in/atakan-güloğlu-6613331b8/",
  github_url: "https://github.com/atakanguloglu",
  instagram_url: "https://www.instagram.com/atakanguloglu_/",
  twitter_url: "",
  facebook_url: "",
};

/**
 * Tek satır site ayarlarını döndürür. Tablo yoksa veya satır yoksa varsayılanlar kullanılır.
 */
export async function getSiteSettings() {
  try {
    const res = await query(
      "SELECT site_title, title_template, meta_description, contact_email, contact_phone, whatsapp_number, linkedin_url, github_url, instagram_url, twitter_url, facebook_url FROM site_settings WHERE id = 1 LIMIT 1"
    );
    const row = res.rows[0];
    if (!row) return { ...DEFAULTS };
    return {
      site_title: row.site_title ?? DEFAULTS.site_title,
      title_template: row.title_template ?? DEFAULTS.title_template,
      meta_description: row.meta_description ?? DEFAULTS.meta_description,
      contact_email: row.contact_email ?? DEFAULTS.contact_email,
      contact_phone: row.contact_phone ?? DEFAULTS.contact_phone,
      whatsapp_number: row.whatsapp_number ?? DEFAULTS.whatsapp_number,
      linkedin_url: row.linkedin_url ?? DEFAULTS.linkedin_url,
      github_url: row.github_url ?? DEFAULTS.github_url,
      instagram_url: row.instagram_url ?? DEFAULTS.instagram_url,
      twitter_url: row.twitter_url ?? DEFAULTS.twitter_url,
      facebook_url: row.facebook_url ?? DEFAULTS.facebook_url,
    };
  } catch {
    return { ...DEFAULTS };
  }
}
