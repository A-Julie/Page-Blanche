export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-[#FAF8F5] border-t border-[#E5E1DB] py-4 text-center text-sm text-[#1C1B1A]">
      <nav className="mb-1 flex justify-center gap-2 text-[#6B6560]">
        <a href="/mentions" className="hover:underline">Mentions légales</a>
        <span>|</span>
        <a href="/conditions" className="hover:underline">Conditions d&apos;utilisation</a>
        <span>|</span>
        <a href="/confidentialite" className="hover:underline">Confidentialité</a>
      </nav>
      <p>© Page Blanche — Créé en 2025</p>
    </footer>
  );
}