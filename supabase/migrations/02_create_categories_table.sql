-- Create categories table
create table public.prompt_categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.prompt_categories enable row level security;

-- Policies
create policy "Categories are viewable by everyone."
  on prompt_categories for select
  using ( true );

create policy "Only Admins can manage categories."
  on prompt_categories for all
  using ( exists ( select 1 from profiles where id = auth.uid() and is_admin = true ) );

-- Insert initial data
insert into public.prompt_categories (name) values
('Marketing'),
('Ventas'),
('Control Escolar'),
('Finanzas y contabilidad'),
('Recursos humanos'),
('Académica, profesores y coordinadores'),
('Alta dirección y gerencias');
