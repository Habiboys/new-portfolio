-- =============================================
-- SUPABASE FULL SETUP — Portfolio
-- Jalankan SEKALI di Supabase SQL Editor
-- =============================================

-- 1. EXTENSION
create extension if not exists pgcrypto;

-- 2. TABEL

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  title text not null,
  description text not null,
  photo_base64 text,
  email text,
  phone text,
  location text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists about_paragraphs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  body text not null,
  sort_order int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists tech_stack (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  icon_slug text not null,
  sort_order int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists experiences (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  organization text not null,
  period_label text not null,
  description text not null,
  image_base64 text,
  image_alt text,
  sort_order int not null default 0,
  is_current boolean not null default false,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  slug text not null unique,
  description text not null,
  detailed_description text,
  preview_image_base64 text,
  preview_image_alt text,
  live_demo_url text,
  source_code_url text,
  sort_order int not null default 0,
  is_featured boolean not null default false,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  image_base64 text not null,
  image_alt text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists project_features (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  feature text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists project_technologies (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  technology_name text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists blog_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references blog_categories(id) on delete set null,
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content text not null,
  image_base64 text,
  image_alt text,
  published_at date,
  read_time text,
  is_published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists blog_tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists blog_post_tags (
  blog_post_id uuid not null references blog_posts(id) on delete cascade,
  tag_id uuid not null references blog_tags(id) on delete cascade,
  primary key (blog_post_id, tag_id)
);

create table if not exists gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_base64 text not null,
  image_alt text,
  class_name text, -- legacy grid layout (deprecated, unused by CircularGallery)
  sort_order int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on column gallery_items.title is 'Label teks di CircularGallery (beranda)';
comment on column gallery_items.image_base64 is 'URL gambar, storage:path, atau data URL';
comment on column gallery_items.image_alt is 'Alt text untuk aksesibilitas';
comment on column gallery_items.class_name is 'Deprecated — dulu untuk CSS grid, tidak dipakai lagi';

create table if not exists contact_sections (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists social_links (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  platform text not null,
  url text not null,
  icon text not null,
  sort_order int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. INDEXES
create index if not exists idx_about_profile_order on about_paragraphs(profile_id, sort_order);
create index if not exists idx_tech_profile_order on tech_stack(profile_id, sort_order);
create index if not exists idx_experiences_profile_order on experiences(profile_id, sort_order);
create index if not exists idx_projects_profile_order on projects(profile_id, sort_order);
create index if not exists idx_project_images_order on project_images(project_id, sort_order);
create index if not exists idx_project_features_order on project_features(project_id, sort_order);
create index if not exists idx_project_technologies_order on project_technologies(project_id, sort_order);
create index if not exists idx_blog_posts_published on blog_posts(is_published, published_at desc);
create index if not exists idx_gallery_order on gallery_items(sort_order);
create index if not exists idx_social_profile_order on social_links(profile_id, sort_order);

-- 4. TRIGGER updated_at
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_profiles_updated_at before update on profiles for each row execute function set_updated_at();
create trigger set_about_paragraphs_updated_at before update on about_paragraphs for each row execute function set_updated_at();
create trigger set_tech_stack_updated_at before update on tech_stack for each row execute function set_updated_at();
create trigger set_experiences_updated_at before update on experiences for each row execute function set_updated_at();
create trigger set_projects_updated_at before update on projects for each row execute function set_updated_at();
create trigger set_blog_categories_updated_at before update on blog_categories for each row execute function set_updated_at();
create trigger set_blog_posts_updated_at before update on blog_posts for each row execute function set_updated_at();
create trigger set_gallery_items_updated_at before update on gallery_items for each row execute function set_updated_at();
create trigger set_contact_sections_updated_at before update on contact_sections for each row execute function set_updated_at();
create trigger set_social_links_updated_at before update on social_links for each row execute function set_updated_at();

-- 5. RLS PUBLIC READ
alter table profiles enable row level security;
alter table about_paragraphs enable row level security;
alter table tech_stack enable row level security;
alter table experiences enable row level security;
alter table projects enable row level security;
alter table project_images enable row level security;
alter table project_features enable row level security;
alter table project_technologies enable row level security;
alter table blog_categories enable row level security;
alter table blog_posts enable row level security;
alter table blog_tags enable row level security;
alter table blog_post_tags enable row level security;
alter table gallery_items enable row level security;
alter table contact_sections enable row level security;
alter table social_links enable row level security;

create policy "public read active profiles" on profiles for select using (is_active = true);
create policy "public read visible about" on about_paragraphs for select using (is_visible = true);
create policy "public read visible tech" on tech_stack for select using (is_visible = true);
create policy "public read visible experiences" on experiences for select using (is_visible = true);
create policy "public read visible projects" on projects for select using (is_visible = true);
create policy "public read project images" on project_images for select using (exists (select 1 from projects where projects.id = project_images.project_id and projects.is_visible = true));
create policy "public read project features" on project_features for select using (exists (select 1 from projects where projects.id = project_features.project_id and projects.is_visible = true));
create policy "public read project technologies" on project_technologies for select using (exists (select 1 from projects where projects.id = project_technologies.project_id and projects.is_visible = true));
create policy "public read blog categories" on blog_categories for select using (true);
create policy "public read published blog posts" on blog_posts for select using (is_published = true);
create policy "public read blog tags" on blog_tags for select using (true);
create policy "public read published blog post tags" on blog_post_tags for select using (exists (select 1 from blog_posts where blog_posts.id = blog_post_tags.blog_post_id and blog_posts.is_published = true));
create policy "public read visible gallery" on gallery_items for select using (is_visible = true);
create policy "public read active contact" on contact_sections for select using (is_active = true);
create policy "public read visible social links" on social_links for select using (is_visible = true);

-- 6. ADMIN USERS
-- Buat tabel admin_users (tidak kena RLS agar isAdminUser() bisa SELECT)
create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz default now()
);

-- Disable RLS di admin_users biar SELECT dari service side tanpa auth beres
alter table public.admin_users disable row level security;

-- Trigger otomatis buat user baru
create or replace function public.handle_new_admin_user()
returns trigger as $$
begin
  if new.email in ('nouvalhabibie18@gmail.com') then
    insert into public.admin_users (id, email) values (new.id, new.email);
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_admin_user();

-- Insert user admin yg udah ada (ganti UUID dan email sesuai user kamu)
insert into public.admin_users (id, email)
values ('3178c941-2f45-446b-922f-9a27c176173f', 'nouvalhabibie18@gmail.com')
on conflict (id) do nothing;

-- 7. RLS ADMIN CRUD — full akses buat admin di semua tabel
create policy "admin all on profiles" on profiles for all
using ( auth.uid() in (select id from public.admin_users) )
with check ( auth.uid() in (select id from public.admin_users) );

create policy "admin all on about_paragraphs" on about_paragraphs for all
using ( auth.uid() in (select id from public.admin_users) )
with check ( auth.uid() in (select id from public.admin_users) );

create policy "admin all on tech_stack" on tech_stack for all
using ( auth.uid() in (select id from public.admin_users) )
with check ( auth.uid() in (select id from public.admin_users) );

create policy "admin all on experiences" on experiences for all
using ( auth.uid() in (select id from public.admin_users) )
with check ( auth.uid() in (select id from public.admin_users) );

create policy "admin all on projects" on projects for all
using ( auth.uid() in (select id from public.admin_users) )
with check ( auth.uid() in (select id from public.admin_users) );

create policy "admin all on project_images" on project_images for all
using ( auth.uid() in (select id from public.admin_users) )
with check ( auth.uid() in (select id from public.admin_users) );

create policy "admin all on project_features" on project_features for all
using ( auth.uid() in (select id from public.admin_users) )
with check ( auth.uid() in (select id from public.admin_users) );

create policy "admin all on project_technologies" on project_technologies for all
using ( auth.uid() in (select id from public.admin_users) )
with check ( auth.uid() in (select id from public.admin_users) );

create policy "admin all on blog_categories" on blog_categories for all
using ( auth.uid() in (select id from public.admin_users) )
with check ( auth.uid() in (select id from public.admin_users) );

create policy "admin all on blog_posts" on blog_posts for all
using ( auth.uid() in (select id from public.admin_users) )
with check ( auth.uid() in (select id from public.admin_users) );

create policy "admin all on blog_tags" on blog_tags for all
using ( auth.uid() in (select id from public.admin_users) )
with check ( auth.uid() in (select id from public.admin_users) );

create policy "admin all on blog_post_tags" on blog_post_tags for all
using ( auth.uid() in (select id from public.admin_users) )
with check ( auth.uid() in (select id from public.admin_users) );

create policy "admin all on gallery_items" on gallery_items for all
using ( auth.uid() in (select id from public.admin_users) )
with check ( auth.uid() in (select id from public.admin_users) );

create policy "admin all on contact_sections" on contact_sections for all
using ( auth.uid() in (select id from public.admin_users) )
with check ( auth.uid() in (select id from public.admin_users) );

create policy "admin all on social_links" on social_links for all
using ( auth.uid() in (select id from public.admin_users) )
with check ( auth.uid() in (select id from public.admin_users) );

-- =============================================
-- 8. SEED DATA — dari portfolioData.ts
-- =============================================
do $$
declare
  v_profile_id uuid;
  v_project_id uuid;
  v_category_id uuid;
  v_post_id uuid;
  v_tag_id uuid;
begin
  -- Profile
  insert into profiles (name, title, description, photo_base64, email, phone, location, is_active)
  values (
    'Muhammad Nouval Habibie',
    'System Development Enthusiast',
    'Information Systems student passionate about building innovative web and mobile solutions',
    'data:image/webp;base64,PASTE_BASE64_HABIBIE_WEBP',
    'nouvalhabibie18@gmail.com',
    '+6285142247464',
    'Padang, Sumatra Barat, Indonesia',
    true
  )
  returning id into v_profile_id;

  -- About paragraphs
  insert into about_paragraphs (profile_id, body, sort_order) values
    (v_profile_id, 'I''m currently a 6th-semester Information Systems student at Universitas Andalas, deeply passionate about system development and cloud computing. My journey in technology has been driven by curiosity and a desire to create meaningful digital solutions.', 1),
    (v_profile_id, 'With hands-on experience in both web and mobile development, I enjoy tackling complex problems and transforming ideas into functional, user-friendly applications. My interests span across modern development practices, cloud technologies, and building scalable systems.', 2);

  -- Tech stack
  insert into tech_stack (profile_id, name, icon_slug, sort_order) values
    (v_profile_id, 'nodejs', 'nodejs', 1),
    (v_profile_id, 'express', 'express', 2),
    (v_profile_id, 'react', 'react', 3),
    (v_profile_id, 'laravel', 'laravel', 4),
    (v_profile_id, 'git', 'git', 5),
    (v_profile_id, 'docker', 'docker', 6),
    (v_profile_id, 'mysql', 'mysql', 7),
    (v_profile_id, 'javascript', 'javascript', 8),
    (v_profile_id, 'typescript', 'typescript', 9),
    (v_profile_id, 'gcp', 'gcp', 10),
    (v_profile_id, 'java', 'java', 11),
    (v_profile_id, 'php', 'php', 12),
    (v_profile_id, 'postgresql', 'postgresql', 14),
    (v_profile_id, 'figma', 'figma', 17),
    (v_profile_id, 'postman', 'postman', 18),
    (v_profile_id, 'tailwind', 'tailwind', 19),
    (v_profile_id, 'bootstrap', 'bootstrap', 20);

  -- Experiences
  insert into experiences (profile_id, title, organization, period_label, description, image_base64, image_alt, sort_order, is_current) values
    (v_profile_id, 'Backend Developer', 'PT Metro Indonesian Software', 'August 2025 - Present', 'Developing backend services for various projects.', 'data:image/png;base64,PASTE_BASE64_EXPERIENCE_METRO_PNG', 'PT Metro Indonesian Software logo', 1, true),
    (v_profile_id, 'Full Stack Developer', 'Neo Telemetri', 'Jan 2025 - Present', 'Manage project and build project', 'data:image/png;base64,PASTE_BASE64_EXPERIENCE_NEO_PNG', 'Neo Telemetri logo', 2, true),
    (v_profile_id, 'Cloud Computing Enthusiast', 'Bangkit Academy 2024', 'June 2024 - Present', 'Learning about cloud computing and its applications.', 'data:image/png;base64,PASTE_BASE64_EXPERIENCE_BANGKIT_PNG', 'Bangkit Academy logo', 3, true);

  -- Project 1: SIMSAPRAS
  insert into projects (profile_id, title, slug, description, detailed_description, preview_image_base64, preview_image_alt, live_demo_url, source_code_url, sort_order, is_featured)
  values (
    v_profile_id,
    'Sistem Informasi Peminjaman Sarana & Prasarana Universitas Andalas',
    'sistem-informasi-peminjaman-sarana-prasarana-universitas-andalas',
    'Sistem Informasi untuk mengelola peminjaman sarana dan prasarana dilingkungan Universitas Andalas.',
    'Sistem informasi komprehensif untuk mengelola peminjaman sarana dan prasarana di lingkungan Universitas Andalas. Sistem ini menyediakan fitur peminjaman real-time, manajemen admin, dan pelaporan yang detail untuk memudahkan pengelolaan aset universitas.',
    'data:image/webp;base64,PASTE_BASE64_PROJECT_SIMSAPRAS_COVER_WEBP',
    'Sistem Informasi Peminjaman Sarana & Prasarana Universitas Andalas preview',
    'https://simsapras.unand.ac.id/',
    '',
    1, true
  ) returning id into v_project_id;

  insert into project_technologies (project_id, technology_name, sort_order) values
    (v_project_id, 'Laravel', 1), (v_project_id, 'MySQL', 2), (v_project_id, 'Pusher', 3), (v_project_id, 'Flowbite', 4);

  insert into project_features (project_id, feature, sort_order) values
    (v_project_id, 'Peminjaman Sarana & Prasarana', 1),
    (v_project_id, 'Manajemen Admin', 2),
    (v_project_id, 'Pengelolaan Peminjaman', 3),
    (v_project_id, 'Dashboard & Pelaporan', 4),
    (v_project_id, 'Pengelolaan Sarana & Prasarana', 5),
    (v_project_id, 'Notifikasi Real-time', 6);

  insert into project_images (project_id, image_base64, image_alt, sort_order) values
    (v_project_id, 'data:image/webp;base64,PASTE_BASE64_PROJECT_SIMSAPRAS_COVER_WEBP', 'SIMSAPRAS cover', 1),
    (v_project_id, 'data:image/webp;base64,PASTE_BASE64_PROJECT_SIMSAPRAS_PEMINJAMAN_WEBP', 'SIMSAPRAS peminjaman', 2),
    (v_project_id, 'data:image/webp;base64,PASTE_BASE64_PROJECT_SIMSAPRAS_DASHBOARD_WEBP', 'SIMSAPRAS dashboard', 3),
    (v_project_id, 'data:image/webp;base64,PASTE_BASE64_PROJECT_SIMSAPRAS_KALENDERADMIN_WEBP', 'SIMSAPRAS kalender admin', 4),
    (v_project_id, 'data:image/webp;base64,PASTE_BASE64_PROJECT_SIMSAPRAS_SARANA_WEBP', 'SIMSAPRAS sarana', 5),
    (v_project_id, 'data:image/webp;base64,PASTE_BASE64_PROJECT_SIMSAPRAS_DETAILGEDUNG_WEBP', 'SIMSAPRAS detail gedung', 6);

  -- Project 2: PLANMAX
  insert into projects (profile_id, title, slug, description, detailed_description, preview_image_base64, preview_image_alt, live_demo_url, source_code_url, sort_order, is_featured)
  values (
    v_profile_id, 'PLANMAX', 'planmax',
    'AI Based Project Management For Smarter Collaboration.',
    'An intelligent project management solution that combines AI-powered task scheduling with comprehensive team collaboration tools. The system automatically optimizes project timelines, allocates resources efficiently, and provides real-time project insights to ensure successful project delivery.',
    'data:image/webp;base64,PASTE_BASE64_PROJECT_PLANMAX_LANDING_PAGE_WEBP', 'PLANMAX preview', 'https://project-planner-demo.com', '', 2, true
  ) returning id into v_project_id;

  insert into project_technologies (project_id, technology_name, sort_order) values
    (v_project_id, 'React', 1), (v_project_id, 'Nextjs', 2), (v_project_id, 'FastAPI', 3), (v_project_id, 'PostgreSQL', 4);

  insert into project_features (project_id, feature, sort_order) values
    (v_project_id, 'AI-powered task scheduling', 1),
    (v_project_id, 'Resource allocation optimization', 2),
    (v_project_id, 'Team collaboration tools', 3),
    (v_project_id, 'Real-time project tracking', 4),
    (v_project_id, 'Gantt chart visualization', 5),
    (v_project_id, 'Performance analytics and reporting', 6),
    (v_project_id, 'Machine learning for blocker detection and timeline prediction', 7),
    (v_project_id, 'Interactive Gantt-based timeline builder with AI prompts', 8),
    (v_project_id, 'Collaborative task management with team communication', 9),
    (v_project_id, 'Integrated project and task dependency mapping', 10);

  insert into project_images (project_id, image_base64, image_alt, sort_order) values
    (v_project_id, 'data:image/webp;base64,PASTE_BASE64_PROJECT_PLANMAX_LANDING_PAGE_WEBP', 'PLANMAX landing page', 1),
    (v_project_id, 'data:image/webp;base64,PASTE_BASE64_PROJECT_PLANMAX_ALL_PROJECT_WEBP', 'PLANMAX all project', 2),
    (v_project_id, 'data:image/webp;base64,PASTE_BASE64_PROJECT_PLANMAX_DETAIL_PROJECT_WEBP', 'PLANMAX detail project', 3),
    (v_project_id, 'data:image/webp;base64,PASTE_BASE64_PROJECT_PLANMAX_ALL_TASK_WEBP', 'PLANMAX all task', 4),
    (v_project_id, 'data:image/webp;base64,PASTE_BASE64_PROJECT_PLANMAX_GANTT_CHART_WEBP', 'PLANMAX gantt chart', 5),
    (v_project_id, 'data:image/webp;base64,PASTE_BASE64_PROJECT_PLANMAX_AI_CREATOR_WEBP', 'PLANMAX AI creator', 6);

  -- Project 3: Portal TPB
  insert into projects (profile_id, title, slug, description, detailed_description, preview_image_base64, preview_image_alt, live_demo_url, source_code_url, sort_order, is_featured)
  values (
    v_profile_id, 'Portal TPB Universitas Andalas', 'portal-tpb-universitas-andalas',
    'Portal TPB Universitas Andalas',
    'Portal Nilai Mahasiswa Departemen Teknik Pertanian & Biosistem Sesuai Panduan IABEE',
    'data:image/png;base64,PASTE_BASE64_PROJECT_TPB_LOGIN_PNG', 'Portal TPB Universitas Andalas preview',
    'https://portal.tpbunand.com/', '', 3, true
  ) returning id into v_project_id;

  insert into project_technologies (project_id, technology_name, sort_order) values
    (v_project_id, 'Laravel', 1), (v_project_id, 'MySQL', 2), (v_project_id, 'Pusher', 3), (v_project_id, 'Flowbite', 4);

  insert into project_features (project_id, feature, sort_order) values
    (v_project_id, 'Dashboard Dosen', 1),
    (v_project_id, 'Dashboard Laport CPMK', 2),
    (v_project_id, 'Ketercapaian CPL', 3),
    (v_project_id, 'NIlai Mahassiwa Total & PerCPL', 4);

  insert into project_images (project_id, image_base64, image_alt, sort_order) values
    (v_project_id, 'data:image/png;base64,PASTE_BASE64_PROJECT_TPB_LOGIN_PNG', 'Portal TPB login', 1),
    (v_project_id, 'data:image/png;base64,PASTE_BASE64_PROJECT_TPB_DASHBOARD_PNG', 'Portal TPB dashboard', 2),
    (v_project_id, 'data:image/png;base64,PASTE_BASE64_PROJECT_TPB_CPMK_PNG', 'Portal TPB CPMK', 3),
    (v_project_id, 'data:image/png;base64,PASTE_BASE64_PROJECT_TPB_BOBOT_PNG', 'Portal TPB bobot', 4),
    (v_project_id, 'data:image/png;base64,PASTE_BASE64_PROJECT_TPB_LAPORCPMK_PNG', 'Portal TPB lapor CPMK', 5),
    (v_project_id, 'data:image/png;base64,PASTE_BASE64_PROJECT_TPB_NILAI_PNG', 'Portal TPB nilai', 6);

  -- Blog categories
  insert into blog_categories (name, slug) values
    ('Web Development', 'web-development'),
    ('Cloud Computing', 'cloud-computing'),
    ('Database', 'database'),
    ('Machine Learning', 'machine-learning'),
    ('Frontend', 'frontend')
  on conflict (slug) do nothing;

  -- Blog tags
  insert into blog_tags (name, slug) values
    ('React', 'react'), ('Node.js', 'node-js'), ('JavaScript', 'javascript'), ('Web Development', 'web-development'),
    ('Cloud Computing', 'cloud-computing'), ('AWS', 'aws'), ('DevOps', 'devops'), ('Technology', 'technology'),
    ('Database', 'database'), ('SQL', 'sql'), ('Performance', 'performance'), ('Optimization', 'optimization'),
    ('Machine Learning', 'machine-learning'), ('AI', 'ai'), ('Python', 'python'),
    ('CSS', 'css'), ('Frontend', 'frontend'), ('UI/UX', 'ui-ux'), ('Web Design', 'web-design')
  on conflict (slug) do nothing;

  -- Blog post 1
  select id into v_category_id from blog_categories where slug = 'web-development';
  insert into blog_posts (category_id, title, slug, excerpt, content, image_base64, image_alt, published_at, read_time, is_published, sort_order)
  values (v_category_id, 'Building Scalable Web Applications with React and Node.js', 'building-scalable-web-applications-with-react-and-node-js',
    'Learn how to create robust, scalable web applications using modern JavaScript technologies and best practices.',
    'Full blog content here...',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop', 'Building scalable web applications',
    '2024-01-15', '5 min read', true, 1)
  returning id into v_post_id;
  foreach v_tag_id in array array(select id from blog_tags where slug in ('react', 'node-js', 'javascript', 'web-development')) loop
    insert into blog_post_tags (blog_post_id, tag_id) values (v_post_id, v_tag_id) on conflict do nothing;
  end loop;

  -- Blog post 2
  select id into v_category_id from blog_categories where slug = 'cloud-computing';
  insert into blog_posts (category_id, title, slug, excerpt, content, image_base64, image_alt, published_at, read_time, is_published, sort_order)
  values (v_category_id, 'The Future of Cloud Computing in Software Development', 'the-future-of-cloud-computing-in-software-development',
    'Exploring how cloud technologies are reshaping the way we build and deploy applications in the modern era.',
    'Full blog content here...',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop', 'Cloud computing',
    '2024-01-10', '7 min read', true, 2)
  returning id into v_post_id;
  foreach v_tag_id in array array(select id from blog_tags where slug in ('cloud-computing', 'aws', 'devops', 'technology')) loop
    insert into blog_post_tags (blog_post_id, tag_id) values (v_post_id, v_tag_id) on conflict do nothing;
  end loop;

  -- Blog post 3
  select id into v_category_id from blog_categories where slug = 'database';
  insert into blog_posts (category_id, title, slug, excerpt, content, image_base64, image_alt, published_at, read_time, is_published, sort_order)
  values (v_category_id, 'Best Practices for Database Design and Optimization', 'best-practices-for-database-design-and-optimization',
    'Essential tips and strategies for designing efficient databases that scale with your application''s growth.',
    'Full blog content here...',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop', 'Database design and optimization',
    '2024-01-05', '6 min read', true, 3)
  returning id into v_post_id;
  foreach v_tag_id in array array(select id from blog_tags where slug in ('database', 'sql', 'performance', 'optimization')) loop
    insert into blog_post_tags (blog_post_id, tag_id) values (v_post_id, v_tag_id) on conflict do nothing;
  end loop;

  -- Blog post 4
  select id into v_category_id from blog_categories where slug = 'machine-learning';
  insert into blog_posts (category_id, title, slug, excerpt, content, image_base64, image_alt, published_at, read_time, is_published, sort_order)
  values (v_category_id, 'Introduction to Machine Learning for Web Developers', 'introduction-to-machine-learning-for-web-developers',
    'A beginner-friendly guide to understanding and implementing machine learning concepts in web applications.',
    'Full blog content here...',
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop', 'Machine learning for web developers',
    '2023-12-28', '8 min read', true, 4)
  returning id into v_post_id;
  foreach v_tag_id in array array(select id from blog_tags where slug in ('machine-learning', 'ai', 'python', 'web-development')) loop
    insert into blog_post_tags (blog_post_id, tag_id) values (v_post_id, v_tag_id) on conflict do nothing;
  end loop;

  -- Blog post 5
  select id into v_category_id from blog_categories where slug = 'frontend';
  insert into blog_posts (category_id, title, slug, excerpt, content, image_base64, image_alt, published_at, read_time, is_published, sort_order)
  values (v_category_id, 'Modern CSS Techniques for Better User Interfaces', 'modern-css-techniques-for-better-user-interfaces',
    'Discover the latest CSS features and techniques to create stunning, responsive user interfaces.',
    'Full blog content here...',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop', 'Modern CSS techniques',
    '2023-12-20', '4 min read', true, 5)
  returning id into v_post_id;
  foreach v_tag_id in array array(select id from blog_tags where slug in ('css', 'frontend', 'ui-ux', 'web-design')) loop
    insert into blog_post_tags (blog_post_id, tag_id) values (v_post_id, v_tag_id) on conflict do nothing;
  end loop;

  -- Contact section
  insert into contact_sections (profile_id, title, description, is_active) values
    (v_profile_id, 'Let''s Connect', 'I''m always open to discussing new opportunities, interesting projects, or just having a chat about technology.', true);

  -- Social links
  insert into social_links (profile_id, platform, url, icon, sort_order) values
    (v_profile_id, 'LinkedIn', 'https://www.linkedin.com/in/nouvalhabibie/', 'linkedin', 1),
    (v_profile_id, 'GitHub', 'https://github.com/habiboys', 'github', 2),
    (v_profile_id, 'Instagram', 'https://instagram.com/nuval18_', 'instagram', 3);

  -- Gallery items (CircularGallery: title = label, image_base64 = foto, image_alt = a11y)
  insert into gallery_items (title, description, image_base64, image_alt, sort_order) values
    ('Neo Telemetri', null, 'data:image/webp;base64,PASTE_BASE64_GALLERY_NEO_WEBP', 'Neo Telemetri', 1),
    ('Impact National Hackhaton By Maxy Academy 2024', null, 'data:image/webp;base64,PASTE_BASE64_GALLERY_MAXY_WEBP', 'Impact National Hackhaton By Maxy Academy 2024', 2),
    ('Bukit Bintang', null, 'data:image/jpeg;base64,PASTE_BASE64_GALLERY_SOLO_JPG', 'Bukit Bintang', 3),
    ('Hackathon CyberTech PNP 2024', null, 'data:image/webp;base64,PASTE_BASE64_GALLERY_WINCYBERTECH_WEBP', 'Hackathon CyberTech PNP 2024', 4);
end $$;

-- =============================================
-- 8. SUPABASE STORAGE (portfolio-media)
-- Bucket PUBLIC: gambar bisa dibuka langsung via URL getPublicUrl().
-- JANGAN buat policy SELECT di storage.objects — itu memungkinkan list semua file
-- (Supabase Advisor warning). Upload/delete cukup untuk admin (authenticated).
-- =============================================

insert into storage.buckets (id, name, public)
values ('portfolio-media', 'portfolio-media', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read portfolio media" on storage.objects;
drop policy if exists "Authenticated upload portfolio media" on storage.objects;
drop policy if exists "Authenticated update portfolio media" on storage.objects;
drop policy if exists "Authenticated delete portfolio media" on storage.objects;

create policy "Authenticated upload portfolio media"
on storage.objects for insert
to authenticated
with check (bucket_id = 'portfolio-media');

create policy "Authenticated update portfolio media"
on storage.objects for update
to authenticated
using (bucket_id = 'portfolio-media')
with check (bucket_id = 'portfolio-media');

create policy "Authenticated delete portfolio media"
on storage.objects for delete
to authenticated
using (bucket_id = 'portfolio-media');

-- =============================================
-- OPSIONAL: migrasi gallery lama (hapus class_name grid)
-- Jalankan sekali di SQL Editor jika DB sudah ada sebelumnya
-- =============================================
-- update gallery_items set class_name = null where class_name is not null;
-- alter table gallery_items drop column if exists class_name;

-- =============================================
-- VERIFIKASI
-- =============================================
select 'SUCCESS: All tables created' as result;
select count(*) as profiles_count from profiles;
select count(*) as projects_count from projects;
select count(*) as blog_posts_count from blog_posts;
select count(*) as admin_users_count from admin_users;
select * from admin_users;
