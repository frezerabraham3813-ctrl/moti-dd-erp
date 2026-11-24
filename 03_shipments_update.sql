-- Run once in Supabase > SQL Editor.
-- 1) Track which shipments were already included in a manager report (4500 rule)
alter table public.shipments add column if not exists reported boolean not null default false;

-- 2) Lets the engineer who recorded a shipment confirm "received" (changes only the status)
create or replace function public.confirm_received(p_id uuid)
returns void language sql security definer set search_path = public as $$
  update public.shipments
  set status = 'received', received_at = now()
  where id = p_id and engineer_id = auth.uid() and status = 'sent';
$$;
revoke execute on function public.confirm_received(uuid) from public, anon;
grant execute on function public.confirm_received(uuid) to authenticated;
