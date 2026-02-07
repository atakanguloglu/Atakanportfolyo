import Image from "next/image";
import Link from "next/link";
import Navigation from "@/app/_components/Navigation";
import ThemeToggle from "@/app/_components/ThemeToggle";
import LanguageSwitcher from "@/app/_components/LanguageSwitcher";

export default function Page() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b-2 border-gray-300 dark:border-gray-600 shadow-[0_4px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] h-20 sm:h-24 flex items-center">
      <div className="container mx-auto px-4 w-full">
        <div className="flex justify-between items-center gap-3 sm:gap-6 w-full">
          <Link href="/" className="flex items-center shrink-0 h-16 sm:h-20 min-w-0 max-w-[60%] sm:max-w-none flex-1">
            <span className="sr-only">Atakan Güloğlu</span>
            <Image
              src="/logo.png"
              alt="Atakan Güloğlu - Portföy"
              width={360}
              height={112}
              className="h-full w-auto max-h-16 sm:max-h-20 object-contain object-left dark:invert"
              priority
            />
          </Link>
          <div className="shrink-0 flex items-center gap-3 sm:gap-4">
            <LanguageSwitcher />
            <ThemeToggle />
            <span className="hidden lg:block w-px h-6 bg-gray-200 dark:bg-gray-600 rounded-full" aria-hidden />
            <Navigation />
          </div>
        </div>
      </div>
    </header>
  );
}
