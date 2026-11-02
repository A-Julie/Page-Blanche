"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { characterSchema, CharacterFormData } from "@/lib/schemas";
import { supabase } from "@/lib/supabase";

export default function NewCharacterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CharacterFormData>({
    resolver: zodResolver(characterSchema),
  });

  const onSubmit = async (data: CharacterFormData) => {
    setServerError(null);

    // On récupère l'utilisateur connecté pour lier le personnage à son profil
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      setServerError("Tu dois être connectée pour créer un personnage.");
      return;
    }

    // Transformation du texte "mot1, mot2" en tableau ["mot1", "mot2"]
    const keywordsArray = data.keywords
      ? data.keywords.split(",").map((k) => k.trim()).filter(Boolean)
      : [];

    const { error } = await supabase.from("characters").insert({
      owner_id: userData.user.id,
      name: data.name,
      pitch: data.pitch,
      bio: data.bio || null,
      keywords: keywordsArray,
      status: "draft",
    });

    if (error) {
      setServerError(error.message);
      return;
    }

    router.push("/hub");
  };

  return (
    <div className="mx-auto max-w-md px-6 py-10">
      <h1 className="font-serif text-2xl font-semibold mb-6">Créer un personnage</h1>

      {serverError && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nom</label>
          <input
            {...register("name")}
            type="text"
            className="w-full rounded-lg border border-[#E5E1DB] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5654A]"
          />
          {errors.name && (
            <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Pitch</label>
          <textarea
            {...register("pitch")}
            rows={3}
            placeholder="Une courte accroche pour donner envie de rejoindre l'histoire..."
            className="w-full rounded-lg border border-[#E5E1DB] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5654A]"
          />
          {errors.pitch && (
            <p className="text-sm text-red-600 mt-1">{errors.pitch.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Bio (optionnel)</label>
          <textarea
            {...register("bio")}
            rows={4}
            className="w-full rounded-lg border border-[#E5E1DB] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5654A]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Mots-clés (séparés par une virgule)
          </label>
          <input
            {...register("keywords")}
            type="text"
            placeholder="fantaisie, mystère, forêt"
            className="w-full rounded-lg border border-[#E5E1DB] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5654A]"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 rounded-full bg-[#B5654A] px-6 py-2 font-medium text-white hover:opacity-90 transition disabled:opacity-50"
        >
          {isSubmitting ? "Création..." : "Créer le personnage"}
        </button>
      </form>
    </div>
  );
}