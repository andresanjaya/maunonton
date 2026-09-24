-- Keyset-paginated reading queries and block-aware visibility for journals.

drop policy if exists "Readable journals" on public.journals;
create policy "Readable active journals"
on public.journals for select to anon, authenticated
using (
  moderation_status = 'active'
  and (
    (visibility = 'public' and not exists (
      select 1 from public.blocks
      where (blocks.blocker_id = (select auth.uid()) and blocks.blocked_id = journals.author_id)
         or (blocks.blocker_id = journals.author_id and blocks.blocked_id = (select auth.uid()))
    ))
    or author_id = (select auth.uid())
  )
);

drop policy if exists "Journal image metadata follows journal visibility" on public.journal_images;
create policy "Journal image metadata follows active journal visibility"
on public.journal_images for select to anon, authenticated
using (
  exists (
    select 1 from public.journals
    where journals.id = journal_images.journal_id
  )
);

drop policy if exists "Journal images follow journal visibility" on storage.objects;
create policy "Journal images follow active journal visibility"
on storage.objects for select to anon, authenticated
using (
  bucket_id = 'journal-images'
  and exists (
    select 1
    from public.journal_images
    join public.journals on journals.id = journal_images.journal_id
    where journal_images.storage_path = storage.objects.name
  )
);

create or replace function public.get_journal_feed(
  feed_kind text,
  cursor_created_at timestamptz default null,
  cursor_id uuid default null,
  page_size integer default 10
)
returns table (
  id uuid,
  author_id uuid,
  author_username text,
  author_display_name text,
  author_avatar_path text,
  film_title text,
  film_original_title text,
  film_poster_path text,
  watched_on date,
  mood text,
  rating numeric,
  reaction text,
  is_spoiler boolean,
  visibility text,
  created_at timestamptz,
  cover_storage_path text,
  like_count bigint,
  comment_count bigint
)
language sql
stable
security invoker
set search_path = public
as $$
  select
    journals.id,
    journals.author_id,
    profiles.username::text,
    profiles.display_name,
    profiles.avatar_path,
    films.title,
    films.original_title,
    films.poster_path,
    journals.watched_on,
    journals.mood,
    journals.rating,
    journals.reaction,
    journals.is_spoiler,
    journals.visibility,
    journals.created_at,
    cover.storage_path,
    likes.count,
    comments.count
  from public.journals
  join public.profiles on profiles.id = journals.author_id
  join public.films on films.id = journals.film_id
  left join lateral (
    select journal_images.storage_path
    from public.journal_images
    where journal_images.journal_id = journals.id
    order by journal_images.sort_order
    limit 1
  ) cover on true
  left join lateral (
    select count(*)::bigint as count
    from public.journal_likes
    where journal_likes.journal_id = journals.id
  ) likes on true
  left join lateral (
    select count(*)::bigint as count
    from public.comments
    where comments.journal_id = journals.id
      and comments.moderation_status = 'active'
  ) comments on true
  where journals.moderation_status = 'active'
    and (
      (feed_kind = 'profile' and journals.author_id = (select auth.uid()))
      or (journals.visibility = 'public' and feed_kind = 'explore')
      or (journals.visibility = 'public' and feed_kind = 'home' and exists (
        select 1 from public.follows
        where follows.follower_id = (select auth.uid())
          and follows.following_id = journals.author_id
      ))
    )
    and (
      cursor_created_at is null
      or journals.created_at < cursor_created_at
      or (journals.created_at = cursor_created_at and journals.id < cursor_id)
    )
  order by journals.created_at desc, journals.id desc
  limit greatest(1, least(page_size, 20));
$$;

grant execute on function public.get_journal_feed(text, timestamptz, uuid, integer) to anon, authenticated;
