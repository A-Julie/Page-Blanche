-- Table des histoires
create table stories (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  pitch text not null,
  visibility text not null default 'private' check (visibility in ('private', 'public')),
  status text not null default 'open' check (status in ('open', 'in_progress', 'completed', 'abandoned')),
  publish_mode text not null default 'deferred' check (publish_mode in ('live', 'deferred')),
  slots_total int not null check (slots_total between 2 and 5),
  ai_plays_character boolean not null default false,
  invite_token text unique,
  created_at timestamp with time zone default now()
);

alter table stories enable row level security;

create policy "Anyone can view public stories"
  on stories for select
  using (visibility = 'public');

create policy "Author can view their own stories"
  on stories for select
  using (auth.uid() = author_id);

create policy "Authenticated users can create stories"
  on stories for insert
  with check (auth.uid() = author_id);

create policy "Author can update their own story"
  on stories for update
  using (auth.uid() = author_id);

create policy "Author can delete their own story"
  on stories for delete
  using (auth.uid() = author_id);

grant select on public.stories to anon, authenticated;
grant insert, update, delete on public.stories to authenticated;

-- Table de participation (qui joue quel personnage dans quelle histoire)
create table story_participants (
  id uuid primary key default gen_random_uuid(),
  story_id uuid references stories(id) on delete cascade not null,
  character_id uuid references characters(id) on delete cascade not null,
  profile_id uuid references profiles(id) on delete cascade not null,
  role text not null default 'participant' check (role in ('author', 'participant')),
  turns_taken int not null default 0,
  status text not null default 'active' check (status in ('active', 'abandoned', 'ejected')),
  joined_at timestamp with time zone default now(),
  unique (story_id, character_id)
);

alter table story_participants enable row level security;

create policy "Participants can view participants of their stories"
  on story_participants for select
  using (
    exists (
      select 1 from story_participants sp
      where sp.story_id = story_participants.story_id
        and sp.profile_id = auth.uid()
    )
    or exists (
      select 1 from stories s
      where s.id = story_participants.story_id
        and s.visibility = 'public'
    )
  );

create policy "Users can join a story as themselves"
  on story_participants for insert
  with check (auth.uid() = profile_id);

create policy "Users can update their own participation"
  on story_participants for update
  using (auth.uid() = profile_id);

create policy "Author can update participants (eject)"
  on story_participants for update
  using (
    exists (
      select 1 from stories s
      where s.id = story_participants.story_id
        and s.author_id = auth.uid()
    )
  );

grant select, insert, update on public.story_participants to authenticated;