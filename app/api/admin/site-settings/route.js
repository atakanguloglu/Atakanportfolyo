import { NextResponse } from "next/server";
import { getAuthFromRequest } from "@/app/lib/auth-request";
import { query } from "@/app/lib/db";
import { getSiteSettings } from "@/app/lib/site-settings";

/** GET /api/admin/site-settings — Admin: mevcut ayarları getir */
export async function GET() {
  const auth = await getAuthFromRequest();
  if (!auth?.userId) {
    return NextResponse.json({ error: "Giriş yapın." }, { status: 401 });
  }
  try {
    const settings = await getSiteSettings();
    return NextResponse.json(settings);
  } catch (err) {
    console.error("[api/admin/site-settings GET]", err);
    return NextResponse.json({ error: "Ayarlar alınamadı." }, { status: 500 });
  }
}

/** PATCH /api/admin/site-settings — Admin: ayarları güncelle */
export async function PATCH(request) {
  const auth = await getAuthFromRequest();
  if (!auth?.userId) {
    return NextResponse.json({ error: "Giriş yapın." }, { status: 401 });
  }
  try {
    const body = await request.json();
    const {
      site_title,
      title_template,
      meta_description,
      contact_email,
      contact_phone,
      whatsapp_number,
      linkedin_url,
      github_url,
      instagram_url,
      twitter_url,
      facebook_url,
    } = body;

    const updates = [];
    const params = [];
    let i = 1;
    const set = (col, val) => {
      if (val !== undefined) {
        updates.push(`${col} = $${i++}`);
        params.push(val === null || val === "" ? null : String(val).trim().slice(0, 500));
      }
    };
    set("site_title", site_title);
    set("title_template", title_template);
    set("meta_description", meta_description);
    set("contact_email", contact_email);
    set("contact_phone", contact_phone);
    set("whatsapp_number", whatsapp_number);
    set("linkedin_url", linkedin_url);
    set("github_url", github_url);
    set("instagram_url", instagram_url);
    set("twitter_url", twitter_url);
    set("facebook_url", facebook_url);

    if (updates.length === 0) {
      return NextResponse.json({ error: "Güncellenecek alan belirtin." }, { status: 400 });
    }

    updates.push("updated_at = NOW()");
    const sql = `UPDATE site_settings SET ${updates.join(", ")} WHERE id = 1`;
    const upd = await query(sql, params);
    if (upd.rowCount === 0) {
      const v = (x) => (x !== undefined && x !== null ? String(x).trim().slice(0, 500) : "");
      await query(
        `INSERT INTO site_settings (id, site_title, title_template, meta_description, contact_email, contact_phone, whatsapp_number, linkedin_url, github_url, instagram_url, twitter_url, facebook_url)
         VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          v(body.site_title) || "Site",
          v(body.title_template) || "%s | Atakan Güloğlu",
          v(body.meta_description),
          v(body.contact_email),
          v(body.contact_phone),
          v(body.whatsapp_number),
          v(body.linkedin_url),
          v(body.github_url),
          v(body.instagram_url),
          v(body.twitter_url),
          v(body.facebook_url),
        ]
      );
    }

    const settings = await getSiteSettings();
    return NextResponse.json({ success: true, settings });
  } catch (err) {
    console.error("[api/admin/site-settings PATCH]", err);
    return NextResponse.json({ error: "Ayarlar güncellenemedi." }, { status: 500 });
  }
}
