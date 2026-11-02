create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  pronoun text not null,
  name_profil text not null,
  datebirth date not null,
  created_at timestamp with time zone default now()
);

-- Sécurité : chaque utilisateur ne peut lire/modifier que son propre profil
alter table profiles enable row level security;

create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);