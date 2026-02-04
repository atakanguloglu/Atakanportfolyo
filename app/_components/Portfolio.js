"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-16">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg border border-[#E6E8EB] overflow-hidden animate-pulse">
            <div className="h-[248px] bg-gray-200" />
            <div className="p-8 space-y-3">
              <div className="h-3 bg-gray-200 rounded w-1/3" />
              <div className="h-5 bg-gray-200 rounded w-2/3" />
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-10 bg-gray-200 rounded w-32 mt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8 mt-16">
        Henüz yayınlanmış proje yok. Admin panelinden proje ekleyebilirsiniz.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-16">
      {projects.map((project) => (
        <div
          key={project.id}
          className="bg-white rounded-lg border border-solid border-[#E6E8EB] overflow-hidden"
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
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-4xl font-light">
                {project.title?.charAt(0) || "?"}
              </div>
            )}
          </div>
          <div className="p-8">
            {project.category && (
              <div className="text-gray-400 text-xs font-medium">
                {project.category}
              </div>
            )}
            <div className="text-gray-900 text-lg font-semibold mb-1">
              {project.title}
            </div>
            {project.description && (
              <div className="text-gray-600 text-sm mt-3">
                {project.description}
              </div>
            )}
            <Link
              href={project.link || "#"}
              target={project.link?.startsWith("http") ? "_blank" : undefined}
              rel={project.link?.startsWith("http") ? "noopener noreferrer" : undefined}
              className="p-button p-button-outlined mt-5 text-primary-500 font-bold no-underline"
            >
              Örnek Çalışma
              <ArrowRightIcon className="size-6 text-primary-500 ml-3" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
