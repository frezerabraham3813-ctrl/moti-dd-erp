-- Run once in Supabase > SQL Editor (safe to run again). Needs 04_round1.sql first (erp_is_manager / erp_can_view).
-- Profile: employee ID number + photo for every user.
alter table public.profiles add column if not exists employee_id text;
alter table public.profiles add column if not exists photo text;      -- small picture stored as text (the page shrinks it to 256px)

-- A user saves his own ID and photo. p_photo: null = keep, '' = remove, otherwise the new picture.
create or replace function public.update_my_profile(p_employee_id text, p_photo text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if length(coalesce(p_photo, '')) > 300000 then raise exception 'Photo is too big'; end if;
  update public.profiles
     set employee_id = nullif(trim(p_employee_id), ''),
         photo = case when p_photo is null then photo when p_photo = '' then null else p_photo end
   where id = auth.uid();
end $$;

-- Manager sets the ID number of any user
create or replace function public.set_employee_id(p_user uuid, p_employee_id text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.erp_is_manager() then raise exception 'Manager access required'; end if;
  update public.profiles set employee_id = nullif(trim(p_employee_id), '') where id = p_user;
end $$;

-- Manager / admin see everybody's profile card
create or replace function public.list_profiles()
returns table (id uuid, full_name text, role text, employee_id text, photo text)
language sql stable security definer set search_path = public as $$
  select p.id, p.full_name::text, p.role::text, p.employee_id, p.photo
    from public.profiles p where public.erp_can_view() and p.active order by p.full_name;
$$;

revoke execute on function public.update_my_profile(text, text), public.set_employee_id(uuid, text), public.list_profiles() from public, anon;
grant execute on function public.update_my_profile(text, text), public.set_employee_id(uuid, text), public.list_profiles() to authenticated;
