import { NextResponse } from "next/server";
import { getAuthFromRequest } from "@/app/lib/auth-request";
import { query } from "@/app/lib/db";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Atakan Güloğlu Bülten <onboarding@resend.dev>";

/**
 * POST /api/admin/newsletter/send
 * Tüm bülten abonelerine toplu e-posta gönderir (sadece admin).
 * Body: { subject: string, body: string } — body HTML veya düz metin.
 */
export async function POST(request) {
  const auth = await getAuthFromRequest();
  if (!auth?.userId) {
    return NextResponse.json({ error: "Giriş yapın." }, { status: 401 });
  }
  if (!resend) {
    return NextResponse.json(
      { error: "E-posta gönderimi yapılandırılmamış (RESEND_API_KEY)." },
      { status: 503 }
    );
  }
  try {
    const body = await request.json();
    const subject = typeof body?.subject === "string" ? body.subject.trim() : "";
    const rawBody = typeof body?.body === "string" ? body.body.trim() : "";
    if (!subject) {
      return NextResponse.json({ error: "Konu gerekli." }, { status: 400 });
    }
    if (!rawBody) {
      return NextResponse.json({ error: "Mesaj gerekli." }, { status: 400 });
    }
    const html = rawBody.includes("<") ? rawBody : rawBody.replace(/\n/g, "<br>");

    const res = await query("SELECT email FROM newsletter_subscribers");
    const emails = (res.rows || []).map((r) => r.email).filter(Boolean);
    if (emails.length === 0) {
      return NextResponse.json({ success: true, sent: 0, message: "Abone yok." });
    }

    const chunkSize = 50;
    let sent = 0;
    for (let i = 0; i < emails.length; i += chunkSize) {
      const to = emails.slice(i, i + chunkSize);
      const { error } = await resend.emails.send({
        from: FROM_EMAIL,
        to,
        subject,
        html,
      });
      if (error) {
        console.error("[api/admin/newsletter/send]", error);
        const isDomainRequired =
          error.statusCode === 403 &&
          (error.message || "").toLowerCase().includes("verify a domain");
        if (isDomainRequired) {
          return NextResponse.json(
            {
              error:
                "Abonelere mail göndermek için Resend'de kendi domain'inizi doğrulamanız gerekir. resend.com/domains adresinden domain ekleyin, ardından .env.local'e RESEND_FROM_EMAIL=Bülten <newsletter@siteniz.com> ekleyin.",
            },
            { status: 403 }
          );
        }
        return NextResponse.json(
          { error: error.message || "Gönderim hatası.", sent },
          { status: 500 }
        );
      }
      sent += to.length;
    }

    return NextResponse.json({ success: true, sent });
  } catch (err) {
    console.error("[api/admin/newsletter/send]", err);
    return NextResponse.json({ error: "İstek işlenemedi." }, { status: 500 });
  }
}
