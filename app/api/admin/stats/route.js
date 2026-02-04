import { NextResponse } from "next/server";
import { query } from "@/app/lib/db";
import { getAuthFromRequest } from "@/app/lib/auth-request";

/**
 * GET /api/admin/stats
 * Dashboard için sayılar (sadece giriş yapmış admin).
 */
export async function GET(request) {
  try {
    const auth = await getAuthFromRequest();
    if (!auth) {
      return NextResponse.json({ error: "Giriş yapın." }, { status: 401 });
    }

    const [contactsRes, commentsRes, blogsRes, projectsRes, testimonialsRes, newsletterRes] = await Promise.all([
      query("SELECT COUNT(*)::int AS count FROM contacts"),
      query("SELECT COUNT(*)::int AS count FROM comments WHERE is_approved = false"),
      query("SELECT COUNT(*)::int AS count FROM blogs"),
      query("SELECT COUNT(*)::int AS count FROM projects"),
      query("SELECT COUNT(*)::int AS count FROM testimonials"),
      query("SELECT COUNT(*)::int AS count FROM newsletter_subscribers").catch(() => ({ rows: [{ count: 0 }] })),
    ]);

    return NextResponse.json({
      contacts: contactsRes.rows[0]?.count ?? 0,
      commentsPending: commentsRes.rows[0]?.count ?? 0,
      blogs: blogsRes.rows[0]?.count ?? 0,
      projects: projectsRes.rows[0]?.count ?? 0,
      testimonials: testimonialsRes.rows[0]?.count ?? 0,
      newsletter: newsletterRes.rows[0]?.count ?? 0,
    });
  } catch (err) {
    console.error("[api/admin/stats]", err);
    return NextResponse.json(
      { error: "İstatistikler alınamadı." },
      { status: 500 }
    );
  }
}
