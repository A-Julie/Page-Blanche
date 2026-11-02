import { z } from "zod";

export const registerSchema = z.object({
  pronoun: z.string().min(1, "Le pronom est requis"),
  nameProfil: z.string().min(2, "Le nom de profil doit faire au moins 2 caractères"),
  datebirth: z.string().min(1, "La date de naissance est requise"),
  email: z.string().email("Email invalide"),
  password: z.string().min(10, "Le mot de passe doit faire au moins 10 caractères"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const characterSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  pitch: z.string().min(10, "Le pitch doit faire au moins 10 caractères").max(200, "Le pitch doit faire moins de 200 caractères"),
  bio: z.string().optional(),
  keywords: z.string().optional(), // saisi comme texte, transformé en tableau ensuite
});

export type CharacterFormData = z.infer<typeof characterSchema>;

export const storySchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  pitch: z.string().min(10, "Le pitch doit faire au moins 10 caractères").max(300),
  characterId: z.string().min(1, "Choisis un personnage"),
  visibility: z.enum(["private", "public"]),
  publishMode: z.enum(["live", "deferred"]),
  slotsTotal: z.coerce.number().min(2).max(5),
  aiPlaysCharacter: z.boolean(),
});

export type StoryFormData = z.infer<typeof storySchema>;