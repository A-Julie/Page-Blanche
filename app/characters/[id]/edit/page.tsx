"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { characterSchema, CharacterFormData } from "@/lib/schemas";
import { supabase } from "@/lib/supabase";

export default function EditCharacterPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CharacterFormData>({
    resolver: zodResolver(characterSchema),
  });

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

      // On pré-remplit le formulaire avec les données existantes
      reset({
        name: data.name,
        pitch: data.pitch,
        bio: data.bio || "",
        keywords: data.keywords?.join(", ") || "",
      });

      setLoading(false);
    };

    loadCharacter();
  }, [id, router, reset]);

  const onSubmit = async (data: CharacterFormData) => {
    setServerError(null);

    const keywordsArray = data.keywords
      ? data.keywords.split(",").map((k) => k.trim()).filter(Boolean)
      : [];

    const { error } = await supabase
      .from("characters")
      .update({
        name: data.name,
        pitch: data.pitch,
        bio: data.bio || null,
        keywords: keywordsArray,
      })
      .eq("id", id);

    if (error) {
      setServerError(error.message);
      return;
    }

    router.push(`/characters/${id}`);
  };

  if (loading) {
    return <div className="px-6 py-10 text-center">Chargement...</div>;
  }

  return (
    <div className="mx-auto max-w-md px-6 py-10">
      <h1 className="font-serif text-2xl font-semibold mb-6">Modifier le personnage</h1>

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
            className="w-full rounded-lg border border-[#E5E1DB] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5654A]"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 rounded-full bg-[#B5654A] px-6 py-2 font-medium text-white hover:opacity-90 transition disabled:opacity-50"
        >
          {isSubmitting ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>
    </div>
  );
}