import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://atakanguloglu.com.tr";

export const metadata = {
  title: "Projeler",
  description: "Web siteleri, uygulamalar ve UI/UX projelerimden seçmeler.",
  openGraph: {
    title: "Projeler | Atakan Güloğlu",
    description: "Web siteleri, uygulamalar ve UI/UX projelerimden seçmeler.",
    url: `${SITE_URL}/projects`,
    siteName: "Atakan Güloğlu",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Atakan Güloğlu Projeler" }],
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projeler | Atakan Güloğlu",
    description: "Web siteleri, uygulamalar ve UI/UX projelerimden seçmeler.",
  },
};

async function getProjects() {
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_APP_URL
        ? `${process.env.NEXT_PUBLIC_APP_URL}/api/projects`
        : "http://localhost:3000/api/projects",
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12 lg:py-20">
        <h1 className="text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
          Projeler
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-xl mx-auto mb-12">
          Web siteleri, uygulamalar ve UI/UX projelerimden seçmeler.
        </p>

        {projects.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-12">Henüz yayınlanmış proje yok.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-solid border-[#E6E8EB] dark:border-gray-700 overflow-hidden"
              >
                <div className="relative h-[248px]">
                  {project.image_url ? (
                    <Image
                      src={project.image_url.startsWith("/") ? project.image_url : project.image_url}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-400 text-4xl font-light">
                      {project.title?.charAt(0) || "?"}
                    </div>
                  )}
                </div>
                <div className="p-8">
                  {project.category && (
                    <div className="text-gray-400 dark:text-gray-500 text-xs font-medium">
                      {project.category}
                    </div>
                  )}
                  <div className="text-gray-900 dark:text-white text-lg font-semibold mb-1">
                    {project.title}
                  </div>
                  {project.description && (
                    <div className="text-gray-600 dark:text-gray-300 text-sm mt-3">
                      {project.description}
                    </div>
                  )}
                  <Link
                    href={project.link || "#"}
                    target={project.link?.startsWith("http") ? "_blank" : undefined}
                    rel={project.link?.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="p-button p-button-outlined mt-5 text-primary-500 font-bold no-underline inline-flex items-center dark:!border-primary-400 dark:!text-primary-200 dark:hover:!bg-primary-500/20 dark:hover:!text-primary-100"
                  >
                    Örnek Çalışma
                    <ArrowRightIcon className="size-6 text-primary-500 ml-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-center mt-12">
          <Link href="/" className="text-primary-500 hover:underline font-medium">
            ← Ana sayfaya dön
          </Link>
        </p>
      </div>
    </div>
  );
}
