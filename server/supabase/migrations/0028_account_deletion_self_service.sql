-- Self-service account deletion (Apple Guideline 5.1.1(v)).
--
-- The signed-in user can delete their own account in-app with no admin step.
-- Behaviour: the account is locked immediately (profiles.is_blocked = true,
-- enforced by SupabaseAuthGuard) and the permanent purge is scheduled 30 days
-- out. A daily pg_cron job deletes the auth user once the grace period elapses;
-- the profile and every dependent row cascade off auth.users.

-- 1. Grace-period timestamp on the existing audit table.
alter table public.account_deletion_requests
  add column if not exists scheduled_purge_at timestamptz;

-- 2. Allow the new 'scheduled' grace state.
alter table public.account_deletion_requests
  drop constraint if exists account_deletion_requests_status_check;
alter table public.account_deletion_requests
  add constraint account_deletion_requests_status_check
  check (status in ('pending', 'processing', 'scheduled', 'completed', 'rejected'));

create index if not exists account_deletion_requests_scheduled_idx
  on public.account_deletion_requests (scheduled_purge_at)
  where status = 'scheduled';

-- 3. Purge function: delete auth users whose 30-day grace has elapsed. Deleting
--    auth.users cascades to public.profiles (FK on delete cascade) and all
--    user-owned rows. Runs as the definer (postgres) so it can touch auth.users.
create or replace function public.purge_scheduled_account_deletions()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  r record;
begin
  for r in
    select id, matched_user_id
    from public.account_deletion_requests
    where status = 'scheduled'
      and matched_user_id is not null
      and scheduled_purge_at is not null
      and scheduled_purge_at <= now()
  loop
    delete from auth.users where id = r.matched_user_id;
    update public.account_deletion_requests
      set status = 'completed', processed_at = now()
      where id = r.id;
  end loop;
end;
$$;

-- 4. Schedule the purge daily at 03:00 UTC via pg_cron. The API runs serverless
--    (no always-on process), so the schedule lives in the database.
create extension if not exists pg_cron;

do $$
begin
  if exists (select 1 from cron.job where jobname = 'purge-account-deletions') then
    perform cron.unschedule('purge-account-deletions');
  end if;
end $$;

select cron.schedule(
  'purge-account-deletions',
  '0 3 * * *',
  $$ select public.purge_scheduled_account_deletions(); $$
);
