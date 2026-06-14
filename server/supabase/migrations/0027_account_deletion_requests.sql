-- Self-service account-deletion requests filed from the public web page
-- (App Store / Google Play compliance: users must be able to request deletion
-- of their account and associated data without signing in).
--
-- Accounts are keyed by phone (Prelude OTP auth), so `phone` is the identifier
-- a requester supplies. The API does a best-effort match against profiles to
-- attach the owning account for the admin who fulfils the request.

create table if not exists public.account_deletion_requests (
  id              uuid primary key default gen_random_uuid(),
  full_name       text,
  phone           text not null,
  email           text,
  reason          text,
  status          text not null default 'pending'
                    check (status in ('pending', 'processing', 'completed', 'rejected')),
  admin_notes     text,
  -- Best-effort link to the matched account (null if no profile matched the
  -- phone at submission time). on delete set null so fulfilling the request —
  -- which deletes the profile — doesn't also wipe the audit row.
  matched_user_id uuid references public.profiles(id) on delete set null,
  created_at      timestamptz not null default now(),
  processed_at    timestamptz
);

create index if not exists account_deletion_requests_status_idx
  on public.account_deletion_requests(status, created_at desc);

alter table public.account_deletion_requests enable row level security;

-- No anon/auth policies: the table is written only by the API's service-role
-- client (which bypasses RLS) from the public submit endpoint, and read/managed
-- only by admins. An explicit admin policy keeps direct dashboard access working.
drop policy if exists account_deletion_requests_admin on public.account_deletion_requests;
create policy account_deletion_requests_admin on public.account_deletion_requests
  for all
  using (public.current_user_is_admin())
  with check (public.current_user_is_admin());
