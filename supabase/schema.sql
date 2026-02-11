-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES TABLE (Extends auth.users)
-- Trigger adds a profile when a user signs up
create table public.profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  department text,
  is_admin boolean default false,
  updated_at timestamp with time zone
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- PROMPTS TABLE
-- Removed enum constraint to allow dynamic categories
-- create type prompt_category as enum ('Académico', 'Ventas', 'RRHH', 'Directivo');

create table public.prompts (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  content text not null,
  category text not null,
  tags text[], -- Array of strings
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.prompts enable row level security;

create policy "Prompts are viewable by authenticated users."
  on prompts for select
  using ( auth.role() = 'authenticated' );

create policy "Only Admins can insert prompts."
  on prompts for insert
  with check ( 
    exists ( select 1 from profiles where id = auth.uid() and is_admin = true )
  );

create policy "Only Admins can update prompts."
  on prompts for update
  using ( 
    exists ( select 1 from profiles where id = auth.uid() and is_admin = true )
  );

create policy "Only Admins can delete prompts."
  on prompts for delete
  using ( 
    exists ( select 1 from profiles where id = auth.uid() and is_admin = true )
  );

-- VIDEOS TABLE
create type video_category as enum ('Hacks', 'Tutoriales', 'Casos de Uso');

create table public.videos (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  url text not null, -- Stores YouTube/TikTok/Vimeo URL
  category video_category default 'Hacks',
  duration text, -- e.g. "2:30"
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.videos enable row level security;

create policy "Videos are viewable by authenticated users."
  on videos for select
  using ( auth.role() = 'authenticated' );

create policy "Only Admins can insert videos."
  on videos for insert
  with check ( 
    exists ( select 1 from profiles where id = auth.uid() and is_admin = true )
  );

create policy "Only Admins can update videos."
  on videos for update
  using ( 
    exists ( select 1 from profiles where id = auth.uid() and is_admin = true )
  );

create policy "Only Admins can delete videos."
  on videos for delete
  using ( 
    exists ( select 1 from profiles where id = auth.uid() and is_admin = true )
  );

-- FUNCTION TO HANDLE NEW USER SIGNUP
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, full_name, is_admin)
  values (new.id, new.raw_user_meta_data->>'full_name', false);
  return new;
end;
$$ language plpgsql security definer;

-- TRIGGER FOR NEW USER SIGNUP
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
