-- maunonton initial data model and access-control policies.
-- Journal image object paths must use: <user_id>/<journal_id>/<filename>

create extension if not exists citext with schema extensions;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username extensions.citext unique,
  display_name text not null,
  bio text,
  avatar_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_username_format check (username is null or username::text ~ '^[A-Za-z0-9_]{3,30}$'),
  constraint profiles_display_name_not_blank check (length(btrim(display_name)) > 0)
);

create table public.films (
  id uuid primary key default gen_random_uuid(),
  tmdb_id bigint not null unique,
  title text not null,
  original_title text not null,
  release_date date,
  poster_path text,
  backdrop_path text,
  overview text,
  original_language text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint films_tmdb_id_positive check (tmdb_id > 0),
  constraint films_title_not_blank check (length(btrim(title)) > 0),
  constraint films_original_title_not_blank check (length(btrim(original_title)) > 0)
);

create table public.journals (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  film_id uuid not null references public.films (id) on delete restrict,
  watched_on date not null,
  mood text not null,
  rating numeric(2, 1),
  reaction text not null,
  body text,
  visibility text not null default 'private',
  is_spoiler boolean not null default false,
  moderation_status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint journals_mood_not_blank check (length(btrim(mood)) > 0),
  constraint journals_reaction_not_blank check (length(btrim(reaction)) > 0),
  constraint journals_rating_range check (
    rating is null or (rating >= 0.5 and rating <= 5 and rating * 2 = trunc(rating * 2))
  ),
  constraint journals_visibility_allowed check (visibility in ('public', 'private')),
  constraint journals_moderation_status_allowed check (moderation_status in ('active', 'pending', 'hidden'))
);

create table public.journal_images (
  id uuid primary key default gen_random_uuid(),
  journal_id uuid not null references public.journals (id) on delete cascade,
  storage_path text not null unique,
  sort_order smallint not null,
  width integer not null,
  height integer not null,
  created_at timestamptz not null default now(),
  constraint journal_images_sort_order_nonnegative check (sort_order >= 0),
  constraint journal_images_dimensions_positive check (width > 0 and height > 0),
  constraint journal_images_journal_sort_unique unique (journal_id, sort_order)
);

create table public.follows (
  follower_id uuid not null references public.profiles (id) on delete cascade,
  following_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id),
  constraint follows_cannot_follow_self check (follower_id <> following_id)
);

create table public.journal_likes (
  journal_id uuid not null references public.journals (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (journal_id, user_id)
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  journal_id uuid not null references public.journals (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  moderation_status text not null default 'active',
  created_at timestamptz not null default now(),
  constraint comments_body_not_blank check (length(btrim(body)) > 0),
  constraint comments_moderation_status_allowed check (moderation_status in ('active', 'pending', 'hidden'))
);

create table public.blocks (
  blocker_id uuid not null references public.profiles (id) on delete cascade,
  blocked_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  constraint blocks_cannot_block_self check (blocker_id <> blocked_id)
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles (id) on delete cascade,
  target_type text not null,
  target_id uuid not null,
  reason text not null,
  details text,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  constraint reports_target_type_allowed check (target_type in ('profile', 'journal', 'comment')),
  constraint reports_reason_allowed check (reason in ('harassment', 'spam', 'inappropriate', 'copyright', 'unmarked_spoiler', 'other')),
  constraint reports_status_allowed check (status in ('open', 'reviewing', 'resolved', 'dismissed')),
  constraint reports_resolution_time_valid check (resolved_at is null or resolved_at >= created_at)
);

-- Foreign-key, feed, profile, moderation, and policy-filter indexes.
create index journals_public_feed_idx on public.journals (created_at desc, id desc)
  where visibility = 'public' and moderation_status = 'active';
create index journals_author_created_idx on public.journals (author_id, created_at desc);
create index journals_film_created_idx on public.journals (film_id, created_at desc);
create index journal_images_journal_idx on public.journal_images (journal_id, sort_order);
create index follows_following_idx on public.follows (following_id, created_at desc);
create index journal_likes_user_idx on public.journal_likes (user_id, created_at desc);
create index comments_journal_created_idx on public.comments (journal_id, created_at);
create index comments_author_idx on public.comments (author_id, created_at desc);
create index blocks_blocked_idx on public.blocks (blocked_id);
create index reports_reporter_idx on public.reports (reporter_id, created_at desc);
create index reports_queue_idx on public.reports (status, created_at);
create index reports_target_idx on public.reports (target_type, target_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger films_set_updated_at before update on public.films
for each row execute function public.set_updated_at();
create trigger journals_set_updated_at before update on public.journals
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'display_name', ''),
      nullif(split_part(new.email, '@', 1), ''),
      'New member'
    )
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.films enable row level security;
alter table public.journals enable row level security;
alter table public.journal_images enable row level security;
alter table public.follows enable row level security;
alter table public.journal_likes enable row level security;
alter table public.comments enable row level security;
alter table public.blocks enable row level security;
alter table public.reports enable row level security;

-- Start from explicit grants so policies cannot accidentally expose an operation.
revoke all on table public.profiles, public.films, public.journals,
  public.journal_images, public.follows, public.journal_likes,
  public.comments, public.blocks, public.reports from anon, authenticated;

grant select on table public.profiles, public.films to anon, authenticated;
grant select on table public.journals, public.journal_images,
  public.follows, public.journal_likes, public.comments to anon, authenticated;
grant insert, update, delete on table public.profiles, public.journals,
  public.journal_images to authenticated;
grant insert, delete on table public.follows, public.journal_likes,
  public.blocks to authenticated;
grant insert on table public.comments, public.reports to authenticated;
grant select on table public.blocks to authenticated;

-- Profiles are public, while each authenticated user owns their profile row.
create policy "Profiles are publicly readable"
on public.profiles for select to anon, authenticated using (true);
create policy "Users can create their own profile"
on public.profiles for insert to authenticated
with check ((select auth.uid()) = id);
create policy "Users can update their own profile"
on public.profiles for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);
create policy "Users can delete their own profile"
on public.profiles for delete to authenticated
using ((select auth.uid()) = id);

-- TMDB snapshots are readable by everyone and writable only by trusted server roles.
create policy "Films are publicly readable"
on public.films for select to anon, authenticated using (true);

-- Anyone can read active public journals; authors can additionally read and manage their own.
create policy "Readable journals"
on public.journals for select to anon, authenticated
using (
  (visibility = 'public' and moderation_status = 'active')
  or author_id = (select auth.uid())
);
create policy "Users can create their own journals"
on public.journals for insert to authenticated
with check (author_id = (select auth.uid()));
create policy "Users can update their own journals"
on public.journals for update to authenticated
using (author_id = (select auth.uid()))
with check (author_id = (select auth.uid()));
create policy "Users can delete their own journals"
on public.journals for delete to authenticated
using (author_id = (select auth.uid()));

create policy "Journal image metadata follows journal visibility"
on public.journal_images for select to anon, authenticated
using (
  exists (
    select 1 from public.journals
    where journals.id = journal_images.journal_id
      and (
        (journals.visibility = 'public' and journals.moderation_status = 'active')
        or journals.author_id = (select auth.uid())
      )
  )
);
create policy "Authors can create their journal image metadata"
on public.journal_images for insert to authenticated
with check (
  split_part(storage_path, '/', 1) = (select auth.uid())::text
  and split_part(storage_path, '/', 2) = journal_id::text
  and exists (
    select 1 from public.journals
    where journals.id = journal_images.journal_id
      and journals.author_id = (select auth.uid())
  )
);
create policy "Authors can update their journal image metadata"
on public.journal_images for update to authenticated
using (
  exists (
    select 1 from public.journals
    where journals.id = journal_images.journal_id
      and journals.author_id = (select auth.uid())
  )
)
with check (
  split_part(storage_path, '/', 1) = (select auth.uid())::text
  and split_part(storage_path, '/', 2) = journal_id::text
  and exists (
    select 1 from public.journals
    where journals.id = journal_images.journal_id
      and journals.author_id = (select auth.uid())
  )
);
create policy "Authors can delete their journal image metadata"
on public.journal_images for delete to authenticated
using (
  exists (
    select 1 from public.journals
    where journals.id = journal_images.journal_id
      and journals.author_id = (select auth.uid())
  )
);

create policy "Follows are publicly readable"
on public.follows for select to anon, authenticated using (true);
create policy "Users can follow from their own account"
on public.follows for insert to authenticated
with check (follower_id = (select auth.uid()) and follower_id <> following_id);
create policy "Users can unfollow from their own account"
on public.follows for delete to authenticated
using (follower_id = (select auth.uid()));

create policy "Likes follow journal visibility"
on public.journal_likes for select to anon, authenticated
using (
  exists (
    select 1 from public.journals
    where journals.id = journal_likes.journal_id
      and (
        (journals.visibility = 'public' and journals.moderation_status = 'active')
        or journals.author_id = (select auth.uid())
      )
  )
);
create policy "Users can like as themselves"
on public.journal_likes for insert to authenticated
with check (
  user_id = (select auth.uid())
  and exists (
    select 1 from public.journals
    where journals.id = journal_likes.journal_id
      and (
        (journals.visibility = 'public' and journals.moderation_status = 'active')
        or journals.author_id = (select auth.uid())
      )
  )
);
create policy "Users can remove their own likes"
on public.journal_likes for delete to authenticated
using (user_id = (select auth.uid()));

create policy "Active comments follow journal visibility"
on public.comments for select to anon, authenticated
using (
  moderation_status = 'active'
  and exists (
    select 1 from public.journals
    where journals.id = comments.journal_id
      and (
        (journals.visibility = 'public' and journals.moderation_status = 'active')
        or journals.author_id = (select auth.uid())
      )
  )
);
create policy "Users can comment as themselves"
on public.comments for insert to authenticated
with check (
  author_id = (select auth.uid())
  and exists (
    select 1 from public.journals
    where journals.id = comments.journal_id
      and (
        (journals.visibility = 'public' and journals.moderation_status = 'active')
        or journals.author_id = (select auth.uid())
      )
  )
);

-- Block rows are visible only to the blocker. They are never public.
create policy "Users can read blocks they created"
on public.blocks for select to authenticated
using (blocker_id = (select auth.uid()));
create policy "Users can block from their own account"
on public.blocks for insert to authenticated
with check (blocker_id = (select auth.uid()) and blocker_id <> blocked_id);
create policy "Users can remove blocks they created"
on public.blocks for delete to authenticated
using (blocker_id = (select auth.uid()));

-- Reports deliberately have no SELECT policy or SELECT grant for public roles.
create policy "Users can submit reports as themselves"
on public.reports for insert to authenticated
with check (reporter_id = (select auth.uid()));

-- Private Storage bucket. Five MiB images; object access is governed below.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'journal-images',
  'journal-images',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Journal images follow journal visibility"
on storage.objects for select to anon, authenticated
using (
  bucket_id = 'journal-images'
  and exists (
    select 1
    from public.journal_images
    join public.journals on journals.id = journal_images.journal_id
    where journal_images.storage_path = storage.objects.name
      and (
        (journals.visibility = 'public' and journals.moderation_status = 'active')
        or journals.author_id = (select auth.uid())
      )
  )
);

create policy "Authors can upload journal images"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'journal-images'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (
    select 1 from public.journals
    where journals.id::text = (storage.foldername(name))[2]
      and journals.author_id = (select auth.uid())
  )
);

create policy "Authors can update their journal images"
on storage.objects for update to authenticated
using (
  bucket_id = 'journal-images'
  and owner_id = (select auth.uid())::text
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'journal-images'
  and owner_id = (select auth.uid())::text
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (
    select 1 from public.journals
    where journals.id::text = (storage.foldername(name))[2]
      and journals.author_id = (select auth.uid())
  )
);

create policy "Authors can delete their journal images"
on storage.objects for delete to authenticated
using (
  bucket_id = 'journal-images'
  and owner_id = (select auth.uid())::text
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
