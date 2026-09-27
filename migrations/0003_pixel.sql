alter table platform_settings
  add column if not exists pixel_secret text not null default 'digiafrika_sandbox_pixel';

update platform_settings
set pixel_secret = coalesce(nullif(pixel_secret, ''), 'digiafrika_sandbox_pixel')
where id = 1;
