-- Run once in Supabase > SQL Editor (safe to run again).
-- "I received it": marks the shipment received AND sends the sender a "Received!" message.
-- Who may confirm: the receiving engineer, the manager, or (old records without a receiver) the sender.
create or replace function public.confirm_received(p_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare s public.shipments; who text;
begin
  update public.shipments sh
     set status = 'received', received_at = now()
   where sh.id = p_id and sh.status = 'sent'
     and (sh.receiver_id = auth.uid()
          or (sh.receiver_id is null and sh.engineer_id = auth.uid())
          or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'manager'))
   returning * into s;
  if s.id is null then return; end if;
  select full_name into who from public.profiles where id = auth.uid();
  if s.engineer_id is distinct from auth.uid() then
    insert into public.notifications(user_id, kind, data)
    values (s.engineer_id, 'ship_received', jsonb_build_object('serial', s.serial_no, 'name', coalesce(s.receiver_name, who)));
  end if;
end $$;
revoke execute on function public.confirm_received(uuid) from public, anon;
grant execute on function public.confirm_received(uuid) to authenticated;
