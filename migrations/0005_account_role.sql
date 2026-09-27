-- One product role per profile: vendor or affiliate.
-- Admin is is_admin from the Step 1 owner allowlist, never a self-selected role.
update profiles
set roles = case
  when ',' || replace(roles, ' ', '') || ',' like '%,vendor,%' then 'vendor'
  else 'affiliate'
end;
