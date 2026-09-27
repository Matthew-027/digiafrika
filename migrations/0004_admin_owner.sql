-- First-signup used to grant is_admin. That is not a production owner model.
-- Revoke leftover operator flags; access is re-granted from the server-side
-- owner allowlist on the next authenticated request.
update profiles
set
  is_admin = false,
  roles = trim(both ',' from replace(',' || roles || ',', ',admin,', ','))
where is_admin = true or roles like '%admin%';
