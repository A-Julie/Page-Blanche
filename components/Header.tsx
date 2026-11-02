import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-[#FAF8F5]/90 backdrop-blur px-8 py-3 border-b border-[#E5E1DB]">
      <Link href="/" className="font-serif text-lg font-semibold text-[#1C1B1A]">
        Page Blanche
      </Link>
      <div className="flex gap-3">
        <Link
          href="/register"
          className="rounded-full px-4 py-2 text-sm font-medium text-[#1C1B1A] hover:bg-[#E5E1DB] transition"
        >
          Inscription
        </Link>
        <Link
          href="/login"
          className="rounded-full bg-[#B5654A] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition"
        >
          Connexion
        </Link>
      </div>
    </header>
  );
}