-- Allow a scheduled self-service deletion to be cancelled.
--
-- When a user signs back in during the 30-day grace period we reactivate their
-- account: unblock the profile and mark the pending deletion request as
-- 'cancelled' (so the daily purge job — which only touches 'scheduled' rows —
-- leaves it alone). This adds the new terminal status to the check constraint.

alter table public.account_deletion_requests
  drop constraint if exists account_deletion_requests_status_check;
alter table public.account_deletion_requests
  add constraint account_deletion_requests_status_check
  check (status in ('pending', 'processing', 'scheduled', 'completed', 'rejected', 'cancelled'));
