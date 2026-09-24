-- Restore strict visibility after the feed migration. Private journal media,
-- comments, and profiles must not leak through direct table queries.

drop policy if exists "Profiles are publicly readable" on public.profiles;
create policy "Profiles exclude blocked relationships"
on public.profiles for select to anon, authenticated
using (
  id = (select auth.uid())
  or not public.users_are_blocked((select auth.uid()), id)
);

drop policy if exists "Journal image metadata follows active journal visibility" on public.journal_images;
create policy "Journal image metadata follows active journal visibility"
on public.journal_images for select to anon, authenticated
using (
  exists (
    select 1
    from public.journals
    where journals.id = journal_images.journal_id
      and journals.moderation_status = 'active'
      and (
        journals.author_id = (select auth.uid())
        or (
          journals.visibility = 'public'
          and not public.users_are_blocked((select auth.uid()), journals.author_id)
        )
      )
  )
);

drop policy if exists "Journal images follow active journal visibility" on storage.objects;
create policy "Journal images follow active journal visibility"
on storage.objects for select to anon, authenticated
using (
  bucket_id = 'journal-images'
  and exists (
    select 1
    from public.journal_images
    join public.journals on journals.id = journal_images.journal_id
    where journal_images.storage_path = storage.objects.name
      and journals.moderation_status = 'active'
      and (
        journals.author_id = (select auth.uid())
        or (
          journals.visibility = 'public'
          and not public.users_are_blocked((select auth.uid()), journals.author_id)
        )
      )
  )
);

drop policy if exists "Active comments follow journal visibility" on public.comments;
create policy "Active comments follow visible journals"
on public.comments for select to anon, authenticated
using (
  moderation_status = 'active'
  and not public.users_are_blocked((select auth.uid()), author_id)
  and exists (
    select 1
    from public.journals
    where journals.id = comments.journal_id
      and journals.moderation_status = 'active'
      and (
        journals.author_id = (select auth.uid())
        or (
          journals.visibility = 'public'
          and not public.users_are_blocked((select auth.uid()), journals.author_id)
        )
      )
  )
);

drop policy if exists "Follows are publicly readable" on public.follows;
create policy "Follows exclude blocked relationships"
on public.follows for select to anon, authenticated
using (not public.users_are_blocked((select auth.uid()), follower_id)
  and not public.users_are_blocked((select auth.uid()), following_id));
