-- One vendor store profile per user. Status is server-owned; vendors cannot self-approve.
create table if not exists vendor_profiles (
  user_id text primary key,
  store_name text not null default '',
  description text not null default '',
  country text not null default 'NG',
  contact_email text,
  contact_phone text,
  category text not null default '',
  website_url text,
  status text not null default 'incomplete',
  review_note text,
  submitted_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists vendor_profiles_status_idx on vendor_profiles (status);

insert into vendor_profiles (user_id, store_name, description, country, contact_email, category, status, submitted_at)
select p.user_id, p.display_name, 'Vendor desk opened. Store profile not submitted.', p.country, p.email, '', 'incomplete', null
from profiles p
where p.roles = 'vendor'
  and p.is_admin = false
  and not exists (select 1 from vendor_profiles v where v.user_id = p.user_id);
