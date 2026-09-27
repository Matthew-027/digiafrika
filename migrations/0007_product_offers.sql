-- Extend campaigns into the product/offer model. Keep existing rows and FKs.
alter table campaigns add column if not exists product_type text not null default 'digital';
alter table campaigns add column if not exists image_url text;
alter table campaigns add column if not exists currency text not null default 'NGN';
alter table campaigns add column if not exists price_amount integer not null default 0;
alter table campaigns add column if not exists commission_type text not null default 'percent';
alter table campaigns add column if not exists commission_value integer not null default 0;
alter table campaigns add column if not exists commission_mode text not null default 'one_time';
alter table campaigns add column if not exists review_note text;
alter table campaigns add column if not exists submitted_at timestamptz;
alter table campaigns add column if not exists reviewed_at timestamptz;
alter table campaigns add column if not exists reviewed_by text;
alter table campaigns add column if not exists updated_at timestamptz not null default now();
alter table campaigns add column if not exists is_demo boolean not null default false;

update campaigns set price_amount = price_ngn where price_amount = 0 and price_ngn > 0;
update campaigns set commission_value = commission_pct where commission_value = 0 and commission_pct > 0;
update campaigns set is_demo = true where vendor_user_id like 'platform-%';

update campaigns set status = 'approved' where status = 'live';
update campaigns set status = 'suspended' where status = 'paused';
update campaigns set status = 'draft' where status = 'pending';
update campaigns set status = 'rejected' where status = 'rejected';

-- Seeded catalog rows are not production offers.
update campaigns set clicks = 0, sales = 0 where is_demo = true;
