-- On s'assure qu'aucun droit de suppression n'est accordé (défense en profondeur)
revoke delete on public.profiles from authenticated;

-- On s'assure que les utilisateurs non connectés (anon) n'ont aucun accès à profiles
revoke all on public.profiles from anon;