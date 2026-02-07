import { NextResponse } from "next/server";
import { getSiteSettings } from "@/app/lib/site-settings";

/** GET /api/site-settings — Site ayarlarını döndür (herkese açık, meta/header/footer için) */
export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json(settings);
  } catch (err) {
    console.error("[api/site-settings]", err);
    return NextResponse.json(
      {
        site_title: "Ana Sayfa | Atakan Güloğlu",
        title_template: "%s | Atakan Güloğlu",
        meta_description: "Atakan Güloğlu kişisel portfolyo sitesi.",
        contact_email: "",
        contact_phone: "",
        whatsapp_number: "",
        linkedin_url: "",
        github_url: "",
        instagram_url: "",
        twitter_url: "",
        facebook_url: "",
      },
      { status: 200 }
    );
  }
}
