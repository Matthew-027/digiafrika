create table if not exists profiles (
  user_id text primary key,
  display_name text not null,
  email text,
  avatar_url text,
  country text not null default 'NG',
  phone text,
  roles text not null default 'affiliate',
  is_admin boolean not null default false,
  referral_code text not null unique,
  referred_by text,
  payout_method text,
  payout_details text,
  onboarded_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists campaigns (
  id text primary key,
  vendor_user_id text not null,
  vendor_name text not null,
  slug text not null unique,
  title text not null,
  tagline text not null,
  category text not null,
  description text not null,
  highlights text not null,
  price_ngn integer not null,
  commission_pct integer not null,
  cookie_days integer not null default 30,
  landing_url text not null,
  jv_page_url text,
  creatives text,
  status text not null default 'pending',
  clicks integer not null default 0,
  sales integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists campaigns_status_idx on campaigns (status);
create index if not exists campaigns_vendor_idx on campaigns (vendor_user_id);

create table if not exists enrollments (
  id text primary key,
  campaign_id text not null references campaigns(id),
  affiliate_user_id text not null,
  tracking_code text not null unique,
  clicks integer not null default 0,
  sales integer not null default 0,
  earned_ngn integer not null default 0,
  created_at timestamptz not null default now(),
  unique (campaign_id, affiliate_user_id)
);

create index if not exists enrollments_aff_idx on enrollments (affiliate_user_id);

create table if not exists clicks (
  id serial primary key,
  enrollment_id text not null,
  referer text,
  created_at timestamptz not null default now()
);

create table if not exists conversions (
  id text primary key,
  enrollment_id text not null,
  order_ref text,
  amount_ngn integer not null,
  created_at timestamptz not null default now()
);

create table if not exists commissions (
  id text primary key,
  conversion_id text not null,
  affiliate_user_id text not null,
  vendor_user_id text not null,
  campaign_id text not null,
  amount_ngn integer not null,
  status text not null default 'approved',
  created_at timestamptz not null default now()
);

create index if not exists commissions_aff_idx on commissions (affiliate_user_id);

create table if not exists wallets (
  user_id text primary key,
  available_ngn integer not null default 0,
  pending_ngn integer not null default 0,
  paid_ngn integer not null default 0,
  lifetime_ngn integer not null default 0
);

create table if not exists payouts (
  id text primary key,
  user_id text not null,
  amount_ngn integer not null,
  method text not null,
  details text not null,
  status text not null default 'requested',
  admin_note text,
  created_at timestamptz not null default now(),
  processed_at timestamptz
);

create index if not exists payouts_user_idx on payouts (user_id);

create table if not exists notifications (
  id text primary key,
  user_id text not null,
  title text not null,
  body text not null,
  kind text not null,
  href text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_idx on notifications (user_id, created_at desc);

create table if not exists platform_settings (
  id integer primary key default 1,
  min_payout_ngn integer not null default 5000,
  cookie_days integer not null default 30,
  referral_pct integer not null default 5,
  platform_fee_pct integer not null default 5
);

insert into platform_settings (id, min_payout_ngn, cookie_days, referral_pct, platform_fee_pct)
select 1, 5000, 30, 5, 5
where not exists (select 1 from platform_settings where id = 1);

insert into campaigns (
  id, vendor_user_id, vendor_name, slug, title, tagline, category, description, highlights,
  price_ngn, commission_pct, cookie_days, landing_url, jv_page_url, creatives, status, clicks, sales
)
select * from (values
  (
    'cmp_naira', 'platform-ada', 'Ada Okonkwo Studio', 'naira-masterclass',
    'Naira Masterclass', 'Build a cash-flow system that survives inflation.',
    'Finance',
    'A 6-week money operating system for African professionals: budgeting in volatile currencies, emergency funds, Naira/USD pairing, and a 90-day savings sprint. Includes bank-ready worksheets and weekly office hours.',
    'Inflation-proof cash plan' || chr(10) || 'NGN + USD pairing worksheets' || chr(10) || '90-day savings sprint' || chr(10) || 'Private alumni circle',
    45000, 55, 45, 'https://adaokonkwo.example/naira', 'https://adaokonkwo.example/jv',
    'Headline: Stop leaking Naira every month.' || chr(10) || 'Angle: cash system, not another budget app.' || chr(10) || 'CTA: Start the 90-day sprint.',
    'live', 18420, 612
  ),
  (
    'cmp_copy', 'platform-kofi', 'Kofi Mensah Lab', 'lagos-copy-lab',
    'Lagos Copy Lab', 'Write offers that convert on WhatsApp, not just landing pages.',
    'Creative',
    'Copywriting for African digital sellers. Learn the WhatsApp-first sales letter, voice-note scripts, and offer stacks used by top Stakecut-style vendors. Includes swipe file of 40 winning angles.',
    'WhatsApp sales letters' || chr(10) || '40-angle swipe file' || chr(10) || 'Voice-note close scripts' || chr(10) || 'Live weekly hot seats',
    32000, 60, 30, 'https://lagoscopy.example', 'https://lagoscopy.example/partners',
    'Headline: Your audience is on WhatsApp. Your copy should be too.',
    'live', 22110, 804
  ),
  (
    'cmp_farm', 'platform-amara', 'FarmStack Africa', 'farmstack-pos',
    'FarmStack POS', 'Inventory + payments for agribusinesses from farm gate to market.',
    'Software',
    'A lightweight POS and inventory stack for produce aggregators, co-ops, and last-mile agro dealers. Works with intermittent connectivity. M-Pesa, Paystack, and cash-on-delivery modes.',
    'Offline-first POS' || chr(10) || 'M-Pesa & Paystack rails' || chr(10) || 'Co-op inventory' || chr(10) || 'Harvest season reports',
    89000, 40, 60, 'https://farmstack.example', 'https://farmstack.example/affiliates',
    'Headline: Sell the harvest. Track every crate.',
    'live', 9800, 211
  ),
  (
    'cmp_hair', 'platform-zuri', 'Zuri Formulas', 'afrohair-pro',
    'AfroHair Pro', 'Formulator course for natural hair brands across West Africa.',
    'Health',
    'Turn kitchen chemistry into a licensed hair-care line. Modules cover oils, preservatives, labeling for NAFDAC/FDA Ghana, and a launch kit for TikTok Shop + Jumia.',
    'NAFDAC-ready labeling' || chr(10) || '12 formula bases' || chr(10) || 'TikTok Shop launch' || chr(10) || 'Supplier directory',
    58000, 50, 30, 'https://afrohairpro.example', 'https://afrohairpro.example/jv',
    'Headline: From shea bowl to shelf.',
    'live', 15640, 498
  ),
  (
    'cmp_saas', 'platform-accra', 'Accra Founders Guild', 'saas-in-accra',
    'SaaS in Accra', 'Ship a B2B product for African operators in 8 weeks.',
    'Career',
    'A founder playbook for building software that invoices in local rails. Pricing in NGN/GHS/KES, collections, and hiring your first two engineers. Includes pitch templates for regional VCs.',
    'Local-rail billing' || chr(10) || '8-week build plan' || chr(10) || 'VC pitch kit' || chr(10) || 'Operator interviews',
    120000, 45, 45, 'https://saasaccra.example', 'https://saasaccra.example/partners',
    'Headline: Charge in Naira. Keep the lights on.',
    'live', 7420, 156
  ),
  (
    'cmp_mpesa', 'platform-nairobi', 'Rift Payments', 'mpesa-growth-kit',
    'M-Pesa Growth Kit', 'Collect, reconcile, and grow a Kenyan commerce brand.',
    'Commerce',
    'A complete operating kit for Shopify/WhatsApp stores that live on M-Pesa: STK push patterns, reconciliation spreadsheets, failed-payment recovery, and Lipa Na M-Pesa storefront copy.',
    'STK push playbook' || chr(10) || 'Failed-pay recovery' || chr(10) || 'Reconciliation sheets' || chr(10) || 'Storefront copy pack',
    27000, 65, 30, 'https://mpesakit.example', 'https://mpesakit.example/aff',
    'Headline: Every missed STK is lost revenue.',
    'live', 19880, 733
  ),
  (
    'cmp_funnel', 'platform-dakar', 'Baobab Funnels', 'francophone-funnel',
    'Francophone Funnel', 'Sell digital products across Dakar, Abidjan, and Yaoundé.',
    'Creative',
    'French-first funnels for digital educators. Includes Wave/Orange Money payment copy, WhatsApp broadcast cadences, and 12 proven VSL structures for francophone West Africa.',
    'French VSL pack' || chr(10) || 'Wave + Orange Money copy' || chr(10) || 'Broadcast cadences' || chr(10) || '12 offer structures',
    41000, 58, 30, 'https://baobabfunnels.example', 'https://baobabfunnels.example/jv',
    'Headline: The market is bigger in French.',
    'live', 11230, 301
  ),
  (
    'cmp_prompt', 'platform-prompt', 'Sahara Prompt Works', 'prompt-studio-africa',
    'Prompt Studio Africa', 'A private library of 400 production prompts for African teams.',
    'AI',
    'Prompts tuned for local context: Naira pricing pages, Swahili customer support, NAFDAC label drafts, and proposal writing for government RFPs. Updated monthly.',
    '400 production prompts' || chr(10) || 'Local-language packs' || chr(10) || 'Monthly drops' || chr(10) || 'Team seats',
    18000, 70, 21, 'https://promptstudio.example', 'https://promptstudio.example/partners',
    'Headline: Prompts that know NAFDAC from Naira.',
    'live', 26400, 1412
  ),
  (
    'cmp_remit', 'platform-diaspora', 'HomeWire Guides', 'diaspora-remit',
    'Diaspora Remit Guide', 'Send money home without losing it to spread and fees.',
    'Finance',
    'A practical comparison of remittance rails for UK/US/EU to NG/KE/GH/ZA. Includes a family-treasury template and a quarterly rate-watch method.',
    'Rail comparison' || chr(10) || 'Family treasury sheet' || chr(10) || 'Rate-watch method' || chr(10) || 'Tax notes',
    15000, 62, 30, 'https://homewire.example', 'https://homewire.example/aff',
    'Headline: The spread is the silent tax.',
    'live', 13110, 522
  ),
  (
    'cmp_kente', 'platform-kente', 'Kente Commerce', 'kente-commerce',
    'Kente Commerce', 'Launch a premium goods store with Jumia + Instagram + export.',
    'Commerce',
    'Sourcing, photography, and export paperwork for fashion and home goods. Built with Ghanaian and Nigerian makers in mind. Includes a buyer list for EU boutiques.',
    'Maker sourcing map' || chr(10) || 'Export paperwork' || chr(10) || 'Boutique buyer list' || chr(10) || 'Photo direction',
    64000, 48, 45, 'https://kentecommerce.example', 'https://kentecommerce.example/jv',
    'Headline: Craft is the brand. Operations is the profit.',
    'live', 6890, 188
  ),
  (
    'cmp_clinic', 'platform-health', 'HealthStack Labs', 'healthstack-clinic',
    'HealthStack Clinic OS', 'Run a private clinic with records, billing, and follow-ups.',
    'Health',
    'Clinic operations for 1–8 doctor practices. Patient records, NHIS-ish billing notes, SMS follow-ups, and a pharmacy stock module. Designed for Lagos, Nairobi, and Accra practices.',
    'Patient records' || chr(10) || 'SMS follow-ups' || chr(10) || 'Pharmacy stock' || chr(10) || 'Practice dashboards',
    210000, 35, 60, 'https://healthstack.example', 'https://healthstack.example/partners',
    'Headline: Paper folders are not a medical record.',
    'live', 4210, 74
  ),
  (
    'cmp_exam', 'platform-exam', 'ExamPass Faculty', 'exampass-waec',
    'ExamPass WAEC & JAMB', 'A complete revision system with weekly live rooms.',
    'Education',
    'Past-question engine, spaced-repetition decks, and Sunday live rooms for WAEC, NECO, and JAMB. Parent dashboard included. Built by examiners, not influencers.',
    'Past-question engine' || chr(10) || 'Sunday live rooms' || chr(10) || 'Parent dashboard' || chr(10) || 'Spaced repetition',
    12000, 68, 21, 'https://exampass.example', 'https://exampass.example/aff',
    'Headline: The exam is a system. Train the system.',
    'live', 31200, 2204
  )
) as v
where not exists (select 1 from campaigns where id = v.column1);
