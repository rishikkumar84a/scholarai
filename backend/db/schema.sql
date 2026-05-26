create extension if not exists vector with schema extensions;

create table if not exists public.users (
  id uuid primary key,
  email text unique not null,
  name text,
  profile jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;

create table if not exists public.scholarships (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country text not null,
  degree_level text[] not null default '{}',
  field text[] not null default '{}',
  gpa_requirement double precision,
  deadline text,
  link text,
  description text not null,
  embedding extensions.vector(1536),
  created_at timestamptz not null default now()
);

alter table public.scholarships enable row level security;

create table if not exists public.papers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  source_url text,
  raw_text text not null,
  summary jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.papers enable row level security;

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  scholarship_id uuid references public.scholarships(id) on delete set null,
  sop_text text,
  sop_score jsonb,
  resume_text text,
  roadmap jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now()
);

alter table public.applications enable row level security;

create table if not exists public.research_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  topic text not null,
  plan jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.research_plans enable row level security;

create index if not exists scholarships_embedding_hnsw_idx
  on public.scholarships
  using hnsw (embedding extensions.vector_cosine_ops);

create or replace function public.match_scholarships(
  query_embedding extensions.vector(1536),
  match_count int default 10
)
returns table (
  id uuid,
  name text,
  country text,
  degree_level text[],
  field text[],
  gpa_requirement double precision,
  deadline text,
  link text,
  description text,
  similarity double precision
)
language sql
stable
as $$
  select
    scholarships.id,
    scholarships.name,
    scholarships.country,
    scholarships.degree_level,
    scholarships.field,
    scholarships.gpa_requirement,
    scholarships.deadline,
    scholarships.link,
    scholarships.description,
    1 - (scholarships.embedding <=> query_embedding) as similarity
  from public.scholarships
  where scholarships.embedding is not null
  order by scholarships.embedding <=> query_embedding
  limit match_count;
$$;

grant select on public.scholarships to anon, authenticated;
grant all on public.users, public.papers, public.applications, public.research_plans to service_role;
grant execute on function public.match_scholarships(extensions.vector, int) to authenticated, service_role;
