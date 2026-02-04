import { Resend } from "resend";
import { query } from "@/app/lib/db";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://atakanguloglu.com.tr";
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/**
 * Yeni yayınlanan blog yazısı için tüm bülten abonelerine e-posta gönderir.
 * @param {string} slug - Blog slug
 * @param {string} title - Blog başlığı
 * @param {string} [excerpt] - Kısa özet
 */
export async function sendNewPostToSubscribers(slug, title, excerpt = "") {
  if (!resend) return;

  let rows = [];
  try {
    const res = await query("SELECT email FROM newsletter_subscribers");
    rows = res?.rows || [];
  } catch (err) {
    console.error("[newsletter-email] Aboneler alınamadı:", err);
    return;
  }

  if (rows.length === 0) return;

  const url = `${SITE_URL}/blogs/${slug}`;
  const subject = `Yeni yazı: ${title}`;
  const html = `
    <h2>Yeni bir blog yazısı yayınlandı</h2>
    <h3>${title}</h3>
    ${excerpt ? `<p>${excerpt}</p>` : ""}
    <p><a href="${url}" style="color:#1e3a5f;font-weight:bold;">Yazıyı oku →</a></p>
    <p style="color:#6b7280;font-size:12px;">Atakan Güloğlu · Bülten</p>
  `;

  const toList = rows.map((r) => r.email);
  const chunkSize = 100;
  for (let i = 0; i < toList.length; i += chunkSize) {
    const to = toList.slice(i, i + chunkSize);
    try {
      await resend.emails.send({
        from: "Atakan Güloğlu Blog <onboarding@resend.dev>",
        to,
        subject,
        html,
      });
    } catch (err) {
      console.error("[newsletter-email] Gönderim hatası:", err);
    }
  }
}
