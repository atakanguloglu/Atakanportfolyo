import Link from "next/link";
import Image from "next/image";
import NewsletterForm from "./NewsletterForm";

const navLinks = [
  { href: "/#home", label: "Ana Sayfa" },
  { href: "/#about", label: "Hakkımda" },
  { href: "/calisma-hayati", label: "Çalışma Hayatım" },
  { href: "/#process", label: "Süreç" },
  { href: "/#portfolio", label: "Portfolyo" },
  { href: "/blogs", label: "Blog" },
  { href: "/#services", label: "Hizmetler" },
  { href: "/#contact", label: "İletişim" },
];

export default function Page() {
  return (
    <footer className="bg-navy-900 pt-16 pb-6">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Üst bölüm: Logo, menü, bülten */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          <div className="lg:col-span-4 flex justify-center lg:justify-start">
            <Link href="/" className="inline-block">
              <span className="sr-only">Atakan Güloğlu</span>
              <Image src="/logo.png" alt="Atakan Güloğlu - Portföy" width={360} height={112} className="h-20 sm:h-24 md:h-[6rem] lg:h-[7rem] w-auto object-contain" />
            </Link>
          </div>
          <nav className="lg:col-span-4 flex flex-wrap justify-center lg:justify-center gap-x-6 gap-y-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-gray-300 hover:text-white no-underline text-sm py-1"
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="lg:col-span-4 flex flex-col items-center lg:items-end">
            <p className="text-gray-400 text-sm mb-2">Yeni yazılardan haberdar olun</p>
            <NewsletterForm variant="footer" className="w-full lg:w-auto" />
          </div>
        </div>

        {/* Tech stack — yazılımcı detayı */}
        <div className="mt-10 pt-4 border-t border-navy-700/50 flex justify-center">
          <p className="text-xs text-gray-500 tracking-wide">
            Built with <span className="text-gray-400">Next.js</span> · <span className="text-gray-400">React</span> · <span className="text-gray-400">Tailwind CSS</span> · <span className="text-gray-400">Node</span>
          </p>
        </div>
        {/* Alt çizgi + şirket, telif & admin */}
        <div className="mt-6 pt-6 border-t border-navy-700 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm text-gray-400 flex-wrap">
          <span className="font-medium text-gray-300">TITARA Technology</span>
          <span className="hidden sm:inline text-gray-600">·</span>
          <span>© 2025 Atakan Güloğlu. Tüm hakları saklıdır.</span>
          <span className="hidden sm:inline text-gray-600">·</span>
          <Link href="/feed" className="text-gray-500 hover:text-gray-300 no-underline" title="RSS 2.0">
            RSS
          </Link>
          <span className="hidden sm:inline text-gray-600">·</span>
          <Link href="/admin/login" className="text-gray-500 hover:text-gray-300 no-underline">
            Admin girişi
          </Link>
        </div>
      </div>
    </footer>
  );
}
