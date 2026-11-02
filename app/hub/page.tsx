"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Character = {
  id: string;
  name: string;
  pitch: string;
  status: string;
  keywords: string[];
};

export default function HubPage() {
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCharacters = async () => {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("characters")
        .select("id, name, pitch, status, keywords")
        .eq("owner_id", userData.user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setCharacters(data);
      }

      setLoading(false);
    };

    loadCharacters();
  }, [router]);

  if (loading) {
    return <div className="px-6 py-10 text-center">Chargement...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold">Tes personnages</h1>
        <Link
          href="/characters/new"
          className="rounded-full bg-[#B5654A] px-5 py-2 text-sm font-medium text-white hover:opacity-90 transition"
        >
          + Nouveau personnage
        </Link>
      </div>

      {characters.length === 0 ? (
        <p className="text-[#6B6560]">
          Tu n&apos;as pas encore de personnage. Crée-en un pour commencer !
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {characters.map((character) => (
            <Link key={character.id} href={`/characters/${character.id}`}className="rounded-xl border border-[#E5E1DB] p-4 bg-white block hover:shadow-sm transition">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-serif text-lg font-semibold">{character.name}</h2>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    character.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {character.status === "active" ? "Actif" : "Brouillon"}
                </span>
              </div>
              <p className="text-sm text-[#6B6560] mb-2">{character.pitch}</p>
              {character.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {character.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="text-xs bg-[#E5E1DB] px-2 py-0.5 rounded-full"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}