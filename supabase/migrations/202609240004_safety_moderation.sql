alter table public.journals drop constraint if exists journals_moderation_status_allowed;
alter table public.journals add constraint journals_moderation_status_allowed check (moderation_status in ('active', 'hidden', 'removed', 'under_review'));
alter table public.comments drop constraint if exists comments_moderation_status_allowed;
alter table public.comments add constraint comments_moderation_status_allowed check (moderation_status in ('active', 'hidden', 'removed', 'under_review'));

create unique index reports_open_unique_target
on public.reports (reporter_id, target_type, target_id)
where status in ('open', 'reviewing');

create or replace function public.remove_follows_when_blocked()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  delete from public.follows
  where (follower_id = new.blocker_id and following_id = new.blocked_id)
     or (follower_id = new.blocked_id and following_id = new.blocker_id);
  return new;
end;
$$;

drop trigger if exists blocks_remove_follows on public.blocks;
create trigger blocks_remove_follows after insert on public.blocks
for each row execute function public.remove_follows_when_blocked();
