"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Character = {
  id: string;
  owner_id: string;
  name: string;
  pitch: string;
  bio: string | null;
  keywords: string[];
  status: string;
};

export default function CharacterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    const loadCharacter = async () => {
      const { data, error } = await supabase
        .from("characters")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        router.push("/hub");
        return;
      }

      setCharacter(data);
      setLoading(false);
    };

    loadCharacter();
  }, [id, router]);

  const handlePublish = async () => {
    setActionError(null);
    const { error } = await supabase
      .from("characters")
      .update({ status: "active" })
      .eq("id", id);

    if (error) {
      setActionError(error.message);
      return;
    }

    setCharacter((prev) => (prev ? { ...prev, status: "active" } : prev));
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Supprimer "${character?.name}" définitivement ?`
    );
    if (!confirmed) return;

    const { error } = await supabase.from("characters").delete().eq("id", id);

    if (error) {
      setActionError(error.message);
      return;
    }

    router.push("/hub");
  };

  if (loading) {
    return <div className="px-6 py-10 text-center">Chargement...</div>;
  }

  if (!character) {
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <Link href="/hub" className="text-sm text-[#B5654A] hover:underline">
        ← Retour au hub
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <h1 className="font-serif text-3xl font-semibold">{character.name}</h1>
        <span
          className={`text-xs px-3 py-1 rounded-full ${
            character.status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {character.status === "active" ? "Actif" : "Brouillon"}
        </span>
      </div>

      <p className="mt-4 text-[#1C1B1A]">{character.pitch}</p>

      {character.bio && (
        <p className="mt-4 text-[#6B6560] whitespace-pre-wrap">{character.bio}</p>
      )}

      {character.keywords.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1">
          {character.keywords.map((kw) => (
            <span key={kw} className="text-xs bg-[#E5E1DB] px-2 py-0.5 rounded-full">
              {kw}
            </span>
          ))}
        </div>
      )}

      {actionError && (
        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </div>
      )}

      <div className="mt-8 flex gap-3">
        <Link
          href={`/characters/${character.id}/edit`}
          className="rounded-full border border-[#E5E1DB] px-5 py-2 text-sm font-medium hover:bg-[#E5E1DB] transition"
        >
          Modifier
        </Link>

        {character.status === "draft" && (
          <button
            onClick={handlePublish}
            className="rounded-full bg-[#B5654A] px-5 py-2 text-sm font-medium text-white hover:opacity-90 transition"
          >
            Publier
          </button>
        )}

        <button
          onClick={handleDelete}
          className="rounded-full border border-red-200 px-5 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}