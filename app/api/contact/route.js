import { NextResponse } from "next/server";
import { query } from "@/app/lib/db";
import { Resend } from "resend";
import { checkRateLimit } from "@/app/lib/rate-limit";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const CONTACT_MAX_PER_MINUTE = 3;

/**
 * POST /api/contact
 * İletişim formundan gelen veriyi PostgreSQL'e kaydeder ve (isteğe bağlı) e-posta bildirimi gönderir.
 */
export async function POST(request) {
  try {
    const limit = checkRateLimit(request, "contact", CONTACT_MAX_PER_MINUTE);
    if (limit.limited) {
      return NextResponse.json(
        { success: false, error: "Çok fazla istek. Lütfen biraz sonra tekrar deneyin." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, location, budget, subject, message } = body;

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json(
        { success: false, error: "Ad ve e-posta zorunludur." },
        { status: 400 }
      );
    }

    await query(
      `INSERT INTO contacts (name, email, location, budget, subject, message, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [
        (name || "").trim(),
        (email || "").trim(),
        (location || "").trim(),
        (budget || "").trim(),
        (subject || "").trim(),
        (message || "").trim(),
      ]
    );

    const contactEmail = process.env.CONTACT_EMAIL || "atakan2100120@gmail.com";
    if (resend && contactEmail) {
      const emailSubject = subject?.trim() ? `Portfolyo: ${subject.trim()}` : `Portfolyo iletişim: ${(name || "").trim()}`;
      const html = `
        <h2>Yeni iletişim mesajı</h2>
        <p><strong>Ad:</strong> ${(name || "").trim()}</p>
        <p><strong>E-posta:</strong> ${(email || "").trim()}</p>
        ${location?.trim() ? `<p><strong>Konum:</strong> ${location.trim()}</p>` : ""}
        ${budget?.trim() ? `<p><strong>Bütçe:</strong> ${budget.trim()}</p>` : ""}
        ${subject?.trim() ? `<p><strong>Konu:</strong> ${subject.trim()}</p>` : ""}
        <p><strong>Mesaj:</strong></p>
        <p>${(message || "-").trim().replace(/\n/g, "<br>")}</p>
      `;
      await resend.emails.send({
        from: "Portfolyo İletişim <onboarding@resend.dev>",
        to: contactEmail,
        subject: emailSubject,
        html,
      }).catch((err) => console.error("[api/contact] E-posta gönderilemedi:", err));
    }

    return NextResponse.json({ success: true, message: "Mesajınız alındı." });
  } catch (err) {
    console.error("[api/contact]", err);

    if (err.code === "42P01") {
      return NextResponse.json(
        {
          success: false,
          error: "Veritabanı tablosu bulunamadı. pgAdmin'de init.sql çalıştırın.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Mesaj kaydedilemedi. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
