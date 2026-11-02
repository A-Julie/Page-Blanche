-- Aperçu d'une histoire privée via son token (avant de rejoindre)
create or replace function get_story_preview_by_token(p_token text)
returns table (
  id uuid,
  title text,
  pitch text,
  slots_total int,
  slots_taken int,
  ai_plays_character boolean
)
language sql
security definer
set search_path = public
as $$
  select
    s.id,
    s.title,
    s.pitch,
    s.slots_total,
    (select count(*) from story_participants sp where sp.story_id = s.id)::int,
    s.ai_plays_character
  from stories s
  where s.invite_token = p_token
    and s.visibility = 'private'
    and s.status = 'open';
$$;

grant execute on function get_story_preview_by_token(text) to anon, authenticated;

-- Rejoindre une histoire privée avec un personnage
create or replace function join_story_by_token(p_token text, p_character_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_story stories%rowtype;
  v_slots_taken int;
  v_character_owner uuid;
begin
  select * into v_story from stories
    where invite_token = p_token
      and visibility = 'private'
      and status = 'open';

  if not found then
    raise exception 'Cette histoire n''existe pas ou n''est plus ouverte.';
  end if;

  select owner_id into v_character_owner from characters where id = p_character_id;

  if v_character_owner is null or v_character_owner <> auth.uid() then
    raise exception 'Ce personnage ne t''appartient pas.';
  end if;

  select count(*) into v_slots_taken from story_participants where story_id = v_story.id;

  if v_slots_taken >= v_story.slots_total then
    raise exception 'Cette histoire est déjà complète.';
  end if;

  if exists (
    select 1 from story_participants
    where story_id = v_story.id and character_id = p_character_id
  ) then
    raise exception 'Ce personnage participe déjà à cette histoire.';
  end if;

  insert into story_participants (story_id, character_id, profile_id, role)
  values (v_story.id, p_character_id, auth.uid(), 'participant');

  if v_slots_taken + 1 = v_story.slots_total then
    update stories set status = 'in_progress' where id = v_story.id;
  end if;

  return v_story.id;
end;
$$;

grant execute on function join_story_by_token(text, uuid) to authenticated;