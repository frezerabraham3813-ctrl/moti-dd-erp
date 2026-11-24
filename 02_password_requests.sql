-- Lets someone who is NOT logged in send a "forgot password" request.
-- Run once in Supabase > SQL Editor.
create policy "pwreq: anyone can request" on public.password_requests
  for insert to anon with check (status = 'pending');
