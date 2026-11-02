"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormData } from "@/lib/schemas";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);

    // 1. Créer le compte dans auth.users
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (authError) {
      setServerError(authError.message);
      return;
    }

    if (!authData.user) {
      setServerError("Une erreur est survenue, réessaie.");
      return;
    }

    // 2. Insérer les infos complémentaires dans profiles
    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      pronoun: data.pronoun,
      name_profil: data.nameProfil,
      datebirth: data.datebirth,
    });

    if (profileError) {
      setServerError(profileError.message);
      return;
    }

    setSuccess(true);
  };

  if (success) {
    return (
      <div className="mx-auto max-w-md px-6 py-10 text-center">
        <h1 className="font-serif text-2xl font-semibold mb-4">C&apos;est fait !</h1>
        <p>Ton compte a bien été créé.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-6 py-10">
      <h1 className="font-serif text-2xl font-semibold mb-6">Inscription</h1>

      {serverError && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Pronom</label>
          <input
            {...register("pronoun")}
            type="text"
            className="w-full rounded-lg border border-[#E5E1DB] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5654A]"
          />
          {errors.pronoun && (
            <p className="text-sm text-red-600 mt-1">{errors.pronoun.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Nom de profil</label>
          <input
            {...register("nameProfil")}
            type="text"
            className="w-full rounded-lg border border-[#E5E1DB] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5654A]"
          />
          {errors.nameProfil && (
            <p className="text-sm text-red-600 mt-1">{errors.nameProfil.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date de naissance</label>
          <input
            {...register("datebirth")}
            type="date"
            className="w-full rounded-lg border border-[#E5E1DB] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5654A]"
          />
          {errors.datebirth && (
            <p className="text-sm text-red-600 mt-1">{errors.datebirth.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            {...register("email")}
            type="email"
            className="w-full rounded-lg border border-[#E5E1DB] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5654A]"
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mot de passe</label>
          <input
            {...register("password")}
            type="password"
            className="w-full rounded-lg border border-[#E5E1DB] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#B5654A]"
          />
          {errors.password && (
            <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 rounded-full bg-[#B5654A] px-6 py-2 font-medium text-white hover:opacity-90 transition disabled:opacity-50"
        >
          {isSubmitting ? "Envoi..." : "S'inscrire"}
        </button>
      </form>
    </div>
  );
}