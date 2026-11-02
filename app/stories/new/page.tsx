"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { storySchema, StoryFormData } from "@/lib/schemas";
import { supabase } from "@/lib/supabase";

type Character = {
  id: string;
  name: string;
};

export default function NewStoryPage() {
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loadingCharacters, setLoadingCharacters] = useState(true);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StoryFormData>({
    resolver: zodResolver(storySchema),
    defaultValues: {
      visibility: "private",
      publishMode: "deferred",
      slotsTotal: 2,
      aiPlaysCharacter: false,
    },
  });

  useEffect(() => {
    const loadCharacters = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("characters")
        .select("id, name")
        .eq("owner_id", userData.user.id)
        .eq("status", "active");

      if (!error && data) {
        setCharacters(data);
      }
      setLoadingCharacters(false);
    };

    loadCharacters();
  }, [router]);

  const onSubmit = async (data: StoryFormData) => {
    setServerError(null);

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      router.push("/login");
      return;
    }

    // Génère un token d'invitation uniquement si l'histoire est privée
    const inviteToken =
      data.visibility === "private"
        ? crypto.randomUUID()
        : null;

    // 1. Créer l'histoire
    const { data: story, error: storyError } = await supabase
      .from("stories")
      .insert({
        author_id: userData.user.id,
        title: data.title,
        pitch: data.pitch,
        visibility: data.visibility,
        publish_mode: data.publishMode,
        slots_total: data.slotsTotal,
        ai_plays_character: data.aiPlaysCharacter,
        invite_token: inviteToken,
      })
      .select()
      .single();

    if (storyError || !story) {
      setServerError(storyError?.message || "Erreur lors de la création.");
      return;
    }

    // 2. Inscrire l'auteur comme premier participant
    const { error: participantError } = await supabase
      .from("story_participants")
      .insert({
        story_id: story.id,
        character_id: data.characterId,
        profile_id: userData.user.id,
        role: "author",
      });

    if (participantError) {
      setServerError(participantError.message);
      return;
    }

    router.push("/hub");
  };

  if (loadingCharacters) {
    return <div className="px-6 py-10 text-center">Chargement...</div>;
  }

  if (characters.length === 0) {
    return (
      <div className="mx-auto max-w-md px-6 py-10 text-center">
        <p className="text-[#6B6560]">
          Tu as besoin d&apos;au moins un personnage actif pour créer une histoire.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-6 py-10">
      <h1 className="font-serif text-2xl font-semibold mb-6">Créer une histoire</h1>

      {serverError && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Titre</label>
          <input
            {...register("title")}
            type="text"
            className="w-full rounded-lg border border-[#E5E1DB] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5654A]"
          />
          {errors.title && (
            <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Pitch</label>
          <textarea
            {...register("pitch")}
            rows={3}
            className="w-full rounded-lg border border-[#E5E1DB] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5654A]"
          />
          {errors.pitch && (
            <p className="text-sm text-red-600 mt-1">{errors.pitch.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ton personnage</label>
          <select
            {...register("characterId")}
            className="w-full rounded-lg border border-[#E5E1DB] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5654A]"
          >
            <option value="">-- Choisir --</option>
            {characters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.characterId && (
            <p className="text-sm text-red-600 mt-1">{errors.characterId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Visibilité</label>
          <select
            {...register("visibility")}
            className="w-full rounded-lg border border-[#E5E1DB] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5654A]"
          >
            <option value="private">Privée (lien d&apos;invitation)</option>
            <option value="public">Publique (découvrable)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mode de publication</label>
          <select
            {...register("publishMode")}
            className="w-full rounded-lg border border-[#E5E1DB] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5654A]"
          >
            <option value="deferred">Différé (l&apos;IA remodèle à la fin)</option>
            <option value="live">En direct (lecteurs peuvent suivre)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Nombre de personnages jouables (2 à 5)
          </label>
          <input
            {...register("slotsTotal")}
            type="number"
            min={2}
            max={5}
            className="w-full rounded-lg border border-[#E5E1DB] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5654A]"
          />
          {errors.slotsTotal && (
            <p className="text-sm text-red-600 mt-1">{errors.slotsTotal.message}</p>
          )}
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("aiPlaysCharacter")} />
          L&apos;IA joue un des personnages
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 rounded-full bg-[#B5654A] px-6 py-2 font-medium text-white hover:opacity-90 transition disabled:opacity-50"
        >
          {isSubmitting ? "Création..." : "Créer l'histoire"}
        </button>
      </form>
    </div>
  );
}