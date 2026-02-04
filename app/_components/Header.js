import Image from "next/image";
import Navigation from "@/app/_components/Navigation";
import Link from "next/link";

export default function Page() {
  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm h-20 sm:h-24 flex items-center">
      <div className="container mx-auto px-4 w-full">
        <div className="flex justify-between items-center gap-2 sm:gap-4 w-full">
          <Link href="/" className="flex items-center shrink-0 h-16 sm:h-20 min-w-0 max-w-[60%] sm:max-w-none flex-1">
            <span className="sr-only">Atakan Güloğlu</span>
            <Image
              src="/logo.png"
              alt="Atakan Güloğlu - Portföy"
              width={360}
              height={112}
              className="h-full w-auto max-h-16 sm:max-h-20 object-contain object-left"
              priority
            />
          </Link>
          <div className="shrink-0 flex items-center">
            <Navigation />
          </div>
        </div>
      </div>
    </header>
  );
}
