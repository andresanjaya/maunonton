-- Social actions are block-aware at the RLS boundary, not only in the UI.

create or replace function public.users_are_blocked(first_user_id uuid, second_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.blocks
    where (blocker_id = first_user_id and blocked_id = second_user_id)
       or (blocker_id = second_user_id and blocked_id = first_user_id)
  );
$$;

grant execute on function public.users_are_blocked(uuid, uuid) to anon, authenticated;

drop policy if exists "Readable active journals" on public.journals;
create policy "Readable active journals"
on public.journals for select to anon, authenticated
using (
  moderation_status = 'active'
  and (
    (visibility = 'public' and not public.users_are_blocked((select auth.uid()), author_id))
    or author_id = (select auth.uid())
  )
);

drop policy if exists "Users can follow from their own account" on public.follows;
create policy "Users can follow from their own account"
on public.follows for insert to authenticated
with check (
  follower_id = (select auth.uid())
  and follower_id <> following_id
  and not public.users_are_blocked((select auth.uid()), following_id)
);

drop policy if exists "Users can like as themselves" on public.journal_likes;
create policy "Users can like as themselves"
on public.journal_likes for insert to authenticated
with check (
  user_id = (select auth.uid())
  and exists (
    select 1 from public.journals
    where journals.id = journal_likes.journal_id
      and journals.visibility = 'public'
      and journals.moderation_status = 'active'
      and not public.users_are_blocked((select auth.uid()), journals.author_id)
  )
);

drop policy if exists "Users can comment as themselves" on public.comments;
create policy "Users can comment as themselves"
on public.comments for insert to authenticated
with check (
  author_id = (select auth.uid())
  and length(btrim(body)) > 0
  and exists (
    select 1 from public.journals
    where journals.id = comments.journal_id
      and journals.visibility = 'public'
      and journals.moderation_status = 'active'
      and not public.users_are_blocked((select auth.uid()), journals.author_id)
  )
);

drop policy if exists "Comment authors and journal owners can delete comments" on public.comments;
create policy "Comment authors and journal owners can delete comments"
on public.comments for delete to authenticated
using (
  (
    author_id = (select auth.uid())
    and exists (
      select 1 from public.journals
      where journals.id = comments.journal_id
        and not public.users_are_blocked((select auth.uid()), journals.author_id)
    )
  )
  or exists (
    select 1 from public.journals
    where journals.id = comments.journal_id
      and journals.author_id = (select auth.uid())
  )
);

create or replace function public.get_journal_feed(
  feed_kind text,
  cursor_created_at timestamptz default null,
  cursor_id uuid default null,
  page_size integer default 10
)
returns table (
  id uuid, author_id uuid, author_username text, author_display_name text, author_avatar_path text,
  film_title text, film_original_title text, film_poster_path text, watched_on date, mood text, rating numeric,
  reaction text, is_spoiler boolean, visibility text, created_at timestamptz, cover_storage_path text,
  like_count bigint, comment_count bigint
)
language sql stable security invoker set search_path = public
as $$
  select journals.id, journals.author_id, profiles.username::text, profiles.display_name, profiles.avatar_path,
    films.title, films.original_title, films.poster_path, journals.watched_on, journals.mood, journals.rating,
    journals.reaction, journals.is_spoiler, journals.visibility, journals.created_at, cover.storage_path,
    likes.count, comments.count
  from public.journals
  join public.profiles on profiles.id = journals.author_id
  join public.films on films.id = journals.film_id
  left join lateral (select storage_path from public.journal_images where journal_id = journals.id order by sort_order limit 1) cover on true
  left join lateral (select count(*)::bigint as count from public.journal_likes where journal_id = journals.id) likes on true
  left join lateral (select count(*)::bigint as count from public.comments where journal_id = journals.id and moderation_status = 'active') comments on true
  where journals.moderation_status = 'active'
    and not public.users_are_blocked((select auth.uid()), journals.author_id)
    and ((feed_kind = 'profile' and journals.author_id = (select auth.uid()))
      or (journals.visibility = 'public' and feed_kind = 'explore')
      or (journals.visibility = 'public' and feed_kind = 'home' and exists (
        select 1 from public.follows where follower_id = (select auth.uid()) and following_id = journals.author_id
      )))
    and (cursor_created_at is null or journals.created_at < cursor_created_at or (journals.created_at = cursor_created_at and journals.id < cursor_id))
  order by journals.created_at desc, journals.id desc
  limit greatest(1, least(page_size, 20));
$$;
