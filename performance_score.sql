-- Run once in Supabase > SQL Editor (safe to run again). Needs 04_round1.sql first (erp_is_manager / erp_can_view).
-- Performance page: the free weekly spare-request limit + the manager's manual points.

-- 1) Settings: one row only, holds the free spare requests per week (default 3)
create table if not exists public.performance_settings (
  id boolean primary key default true check (id),
  weekly_spare_request_limit integer not null default 3 check (weekly_spare_request_limit between 0 and 100),
  updated_at timestamptz not null default now()
);
insert into public.performance_settings (id) values (true) on conflict (id) do nothing;

-- 2) Manual points the manager gives or takes (+ or -)
create table if not exists public.performance_adjustments (
  id uuid primary key default gen_random_uuid(),
  engineer_id uuid not null references public.profiles(id) on delete cascade,
  adjustment_date date not null default current_date,
  points numeric not null check (points <> 0 and points between -100 and 100),
  reason text not null default '',
  created_by uuid references public.profiles(id) default auth.uid(),
  created_at timestamptz not null default now()
);
create index if not exists performance_adjustments_date_idx on public.performance_adjustments (adjustment_date);

-- 3) Who can see / change what
alter table public.performance_settings enable row level security;
alter table public.performance_adjustments enable row level security;

drop policy if exists "perf settings: everyone reads" on public.performance_settings;
create policy "perf settings: everyone reads" on public.performance_settings
  for select to authenticated using (true);

drop policy if exists "perf adj: manager/admin see all, engineer sees own" on public.performance_adjustments;
create policy "perf adj: manager/admin see all, engineer sees own" on public.performance_adjustments
  for select to authenticated using (public.erp_can_view() or engineer_id = auth.uid());

drop policy if exists "perf adj: manager deletes" on public.performance_adjustments;
create policy "perf adj: manager deletes" on public.performance_adjustments
  for delete to authenticated using (public.erp_is_manager());
-- No insert/update policy: points are added only through add_performance_adjustment below.

-- 4) Manager changes the free weekly limit
create or replace function public.set_weekly_spare_request_limit(p_limit integer)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.erp_is_manager() then raise exception 'Manager access required'; end if;
  if p_limit is null or p_limit < 0 or p_limit > 100 then raise exception 'Limit must be between 0 and 100'; end if;
  insert into public.performance_settings (id, weekly_spare_request_limit, updated_at) values (true, p_limit, now())
  on conflict (id) do update set weekly_spare_request_limit = excluded.weekly_spare_request_limit, updated_at = now();
end $$;

-- 5) Manager adds manual points to an engineer
create or replace function public.add_performance_adjustment(p_engineer_id uuid, p_date date, p_points numeric, p_reason text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.erp_is_manager() then raise exception 'Manager access required'; end if;
  insert into public.performance_adjustments (engineer_id, adjustment_date, points, reason, created_by)
  values (p_engineer_id, coalesce(p_date, current_date), p_points, coalesce(trim(p_reason), ''), auth.uid());
end $$;

revoke execute on function public.set_weekly_spare_request_limit(integer), public.add_performance_adjustment(uuid, date, numeric, text) from public, anon;
grant execute on function public.set_weekly_spare_request_limit(integer), public.add_performance_adjustment(uuid, date, numeric, text) to authenticated;
