-- A selected TMDB result is persisted through a server action using the
-- authenticated user's RLS context. This removes the service-role dependency
-- from the journal composer while keeping direct writes constrained to basic
-- TMDB snapshot fields.

grant insert on table public.films to authenticated;

create policy "Authenticated users can add film snapshots"
on public.films for insert to authenticated
with check (
  tmdb_id > 0
  and length(btrim(title)) > 0
  and length(btrim(original_title)) > 0
);
