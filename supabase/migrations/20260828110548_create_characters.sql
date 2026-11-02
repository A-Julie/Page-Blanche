create table characters (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  pitch text not null,
  bio text,
  keywords text[] default '{}',
  avatar_url text,
  status text not null default 'draft' check (status in ('draft', 'active')),
  created_at timestamp with time zone default now()
);

-- Sécurité RLS
alter table characters enable row level security;

-- Tout le monde peut voir les personnages "actifs" (pour la découverte plus tard)
create policy "Anyone can view active characters"
  on characters for select
  using (status = 'active');

-- Le propriétaire peut voir ses propres personnages, même en brouillon
create policy "Owners can view their own characters"
  on characters for select
  using (auth.uid() = owner_id);

-- Le propriétaire peut créer, modifier, supprimer ses personnages
create policy "Owners can insert their own characters"
  on characters for insert
  with check (auth.uid() = owner_id);

create policy "Owners can update their own characters"
  on characters for update
  using (auth.uid() = owner_id);

create policy "Owners can delete their own characters"
  on characters for delete
  using (auth.uid() = owner_id);

-- Grants (on n'oublie plus cette fois !)
grant select on public.characters to anon, authenticated;
grant insert, update, delete on public.characters to authenticated;