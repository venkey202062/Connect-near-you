-- Connect Near You production database
-- Target: Supabase Postgres
-- Run this file in Supabase SQL Editor after creating a project.

create extension if not exists postgis;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 80),
  birth_date date not null,
  gender text not null check (gender in ('woman','man','non-binary','prefer_not')),
  bio text not null default '' check (char_length(bio) <= 250),
  job text,
  education text,
  interests text[] not null default '{}',
  preferences text[] not null default '{}',
  show_online_status boolean not null default true,
  show_activity_status boolean not null default true,
  show_in_discovery boolean not null default true,
  allow_messages boolean not null default true,
  notify_messages boolean not null default true,
  notify_calls boolean not null default true,
  notify_activity boolean not null default true,
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profile_locations (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  location geography(point, 4326) not null,
  updated_at timestamptz not null default now()
);

create index if not exists profile_locations_gist_idx
  on public.profile_locations using gist (location);

create table if not exists public.profile_photos (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  storage_path text not null,
  sort_order integer not null default 0 check (sort_order between 0 and 5),
  created_at timestamptz not null default now()
);

create index if not exists profile_photos_profile_idx
  on public.profile_photos(profile_id, sort_order);

create unique index if not exists profile_photos_sort_unique
  on public.profile_photos(profile_id, sort_order);

create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  from_user_id uuid not null references public.profiles(id) on delete cascade,
  to_user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint likes_not_self check (from_user_id <> to_user_id),
  constraint likes_unique_pair unique (from_user_id, to_user_id)
);

create index if not exists likes_to_user_idx on public.likes(to_user_id);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  user_a uuid not null references public.profiles(id) on delete cascade,
  user_b uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint matches_not_self check (user_a <> user_b)
);

create unique index if not exists matches_pair_unique
  on public.matches (least(user_a, user_b), greatest(user_a, user_b));

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null unique references public.matches(id) on delete cascade,
  created_at timestamptz not null default now(),
  last_message_at timestamptz
);

create table if not exists public.conversation_members (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (conversation_id, user_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  message_type text not null default 'text' check (message_type in ('text','image','voice','call_audio','call_video')),
  body text,
  media_path text,
  call_status text,
  call_duration_seconds integer,
  created_at timestamptz not null default now(),
  delivered_at timestamptz,
  read_at timestamptz
);

create index if not exists messages_conversation_created_idx
  on public.messages(conversation_id, created_at desc);

create table if not exists public.blocks (
  blocker_id uuid not null references public.profiles(id) on delete cascade,
  blocked_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  constraint blocks_not_self check (blocker_id <> blocked_id)
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  reported_user_id uuid not null references public.profiles(id) on delete cascade,
  reason text not null,
  details text,
  created_at timestamptz not null default now(),
  status text not null default 'open' check (status in ('open','reviewing','resolved','dismissed'))
);

create index if not exists reports_status_idx on public.reports(status, created_at desc);

-- Keep updated_at current.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- Discovery RPC: returns users around the caller without exposing the
-- exact stored coordinates. Distance is returned in kilometres.
create or replace function public.discover_nearby_users(
  radius_km numeric default 50,
  min_age integer default 18,
  max_age integer default 100,
  desired_genders text[] default '{}',
  online_only boolean default false,
  require_photos boolean default false,
  without_photos boolean default false
)
returns table (
  id uuid,
  display_name text,
  age integer,
  gender text,
  bio text,
  job text,
  education text,
  interests text[],
  distance_km numeric,
  last_seen_at timestamptz,
  photo_count bigint
)
language sql
security invoker
as $$
  with me as (
    select location
    from public.profile_locations
    where profile_id = auth.uid()
  )
  select
    p.id,
    p.display_name,
    extract(year from age(current_date, p.birth_date))::integer as age,
    p.gender,
    p.bio,
    p.job,
    p.education,
    p.interests,
    round((st_distance(pl.location, me.location) / 1000.0)::numeric, 1) as distance_km,
    case when p.show_activity_status then p.last_seen_at else null end as last_seen_at,
    count(pp.id)::bigint as photo_count
  from public.profiles p
  join public.profile_locations pl on pl.profile_id = p.id
  cross join me
  left join public.profile_photos pp on pp.profile_id = p.id
  where p.id <> auth.uid()
    and p.show_in_discovery = true
    and extract(year from age(current_date, p.birth_date)) between greatest(18, min_age) and max_age
    and st_dwithin(pl.location, me.location, radius_km * 1000)
    and (cardinality(desired_genders) = 0 or p.gender = any(desired_genders))
    and (not online_only or p.last_seen_at >= now() - interval '10 minutes')
  group by p.id, pl.location, me.location
  having
    (not require_photos or count(pp.id) > 0)
    and (not without_photos or count(pp.id) = 0)
  order by st_distance(pl.location, me.location);
$$;

-- Row Level Security.
alter table public.profiles enable row level security;
alter table public.profile_locations enable row level security;
alter table public.profile_photos enable row level security;
alter table public.likes enable row level security;
alter table public.matches enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;
alter table public.blocks enable row level security;
alter table public.reports enable row level security;

create policy "profiles_select_discoverable"
on public.profiles for select
to authenticated
using (show_in_discovery = true or id = auth.uid());

create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "profiles_insert_own"
on public.profiles for insert
to authenticated
with check (id = auth.uid());

create policy "locations_manage_own"
on public.profile_locations for all
to authenticated
using (profile_id = auth.uid())
with check (profile_id = auth.uid());

create policy "photos_select_discoverable"
on public.profile_photos for select
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = profile_photos.profile_id
      and (p.show_in_discovery = true or p.id = auth.uid())
  )
);

create policy "photos_manage_own"
on public.profile_photos for all
to authenticated
using (profile_id = auth.uid())
with check (profile_id = auth.uid());

create policy "likes_manage_own"
on public.likes for all
to authenticated
using (from_user_id = auth.uid())
with check (from_user_id = auth.uid());

create policy "matches_member_select"
on public.matches for select
to authenticated
using (user_a = auth.uid() or user_b = auth.uid());

create policy "conversation_member_select"
on public.conversation_members for select
to authenticated
using (user_id = auth.uid());

create policy "messages_member_select"
on public.messages for select
to authenticated
using (
  exists (
    select 1 from public.conversation_members cm
    where cm.conversation_id = messages.conversation_id
      and cm.user_id = auth.uid()
  )
);

create policy "messages_member_insert"
on public.messages for insert
to authenticated
with check (
  sender_id = auth.uid()
  and exists (
    select 1 from public.conversation_members cm
    where cm.conversation_id = messages.conversation_id
      and cm.user_id = auth.uid()
  )
);

create policy "blocks_manage_own"
on public.blocks for all
to authenticated
using (blocker_id = auth.uid())
with check (blocker_id = auth.uid());

create policy "reports_insert_own"
on public.reports for insert
to authenticated
with check (reporter_id = auth.uid());

-- Required for realtime chat in Supabase.
alter publication supabase_realtime add table public.messages;
