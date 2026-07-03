begin;

create extension if not exists citext schema extensions;
create extension if not exists pg_trgm schema extensions;
create extension if not exists unaccent schema extensions;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  candidate_username text;
  candidate_display_name text;
begin
  candidate_username := lower(
    coalesce(
      nullif(new.raw_user_meta_data ->> 'username', ''),
      nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
      ''
    )
  );
  candidate_username := regexp_replace(candidate_username, '[^a-z0-9_]+', '', 'g');
  candidate_username := left(candidate_username, 24);

  if candidate_username is null or candidate_username = '' then
    candidate_username := 'user_' || substr(replace(new.id::text, '-', ''), 1, 12);
  end if;

  if exists (
    select 1
    from public.profiles profiles
    where profiles.username = candidate_username::extensions.citext
  ) then
    candidate_username := left(candidate_username, 24) || '_' || substr(replace(new.id::text, '-', ''), 1, 6);
  end if;

  candidate_display_name := nullif(
    coalesce(
      new.raw_user_meta_data ->> 'display_name',
      new.raw_user_meta_data ->> 'name',
      nullif(split_part(coalesce(new.email, ''), '@', 1), '')
    ),
    ''
  );

  insert into public.profiles (
    id,
    username,
    display_name,
    bio,
    avatar_object_path,
    banner_object_path,
    nationality_country_id,
    preferred_currency_id,
    preferred_language_id,
    time_zone,
    passport_ready,
    profile_status,
    created_at,
    updated_at
  ) values (
    new.id,
    candidate_username::extensions.citext,
    candidate_display_name,
    null,
    null,
    null,
    null,
    null,
    null,
    nullif(new.raw_user_meta_data ->> 'time_zone', ''),
    false,
    'active',
    now(),
    now()
  ) on conflict (id) do nothing;

  return new;
end;
$$;

create table if not exists public.currencies (
  id uuid primary key default gen_random_uuid(),
  iso_code text not null,
  numeric_code integer,
  name text not null,
  symbol text,
  minor_units smallint not null default 2,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint currencies_iso_code_key unique (iso_code),
  constraint currencies_numeric_code_key unique (numeric_code),
  constraint currencies_iso_code_check check (iso_code ~ '^[A-Z]{3}$'),
  constraint currencies_numeric_code_check check (numeric_code is null or numeric_code > 0),
  constraint currencies_minor_units_check check (minor_units >= 0)
);

create table if not exists public.languages (
  id uuid primary key default gen_random_uuid(),
  iso639_1 text,
  iso639_3 text not null,
  name text not null,
  native_name text,
  script text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint languages_iso639_1_key unique (iso639_1),
  constraint languages_iso639_3_key unique (iso639_3),
  constraint languages_iso639_1_check check (iso639_1 is null or iso639_1 ~ '^[a-z]{2}$'),
  constraint languages_iso639_3_check check (iso639_3 ~ '^[a-z]{3}$')
);

create table if not exists public.countries (
  id uuid primary key default gen_random_uuid(),
  iso2 text not null,
  iso3 text not null,
  numeric_code integer,
  name text not null,
  region text,
  subregion text,
  currency_id uuid,
  default_language_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint countries_iso2_key unique (iso2),
  constraint countries_iso3_key unique (iso3),
  constraint countries_numeric_code_key unique (numeric_code),
  constraint countries_iso2_check check (iso2 ~ '^[A-Z]{2}$'),
  constraint countries_iso3_check check (iso3 ~ '^[A-Z]{3}$'),
  constraint countries_numeric_code_check check (numeric_code is null or numeric_code > 0),
  constraint countries_currency_id_fkey foreign key (currency_id) references public.currencies (id) on delete restrict,
  constraint countries_default_language_id_fkey foreign key (default_language_id) references public.languages (id) on delete restrict
);

create table if not exists public.places (
  id uuid primary key default gen_random_uuid(),
  place_type text not null,
  name text not null,
  country_id uuid not null,
  region text,
  locality text,
  address_line1 text,
  address_line2 text,
  postal_code text,
  latitude numeric(9,6),
  longitude numeric(9,6),
  timezone text,
  website_url text,
  phone_number text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint places_country_id_fkey foreign key (country_id) references public.countries (id) on delete restrict,
  constraint places_latitude_check check (latitude is null or (latitude between -90 and 90)),
  constraint places_longitude_check check (longitude is null or (longitude between -180 and 180)),
  constraint places_place_type_check check (place_type in ('city', 'district', 'landmark', 'poi', 'region', 'other'))
);

create table if not exists public.airports (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null,
  country_id uuid not null,
  iata_code text not null,
  icao_code text,
  name text not null,
  city_name text,
  timezone text,
  latitude numeric(9,6),
  longitude numeric(9,6),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint airports_place_id_key unique (place_id),
  constraint airports_iata_code_key unique (iata_code),
  constraint airports_icao_code_key unique (icao_code),
  constraint airports_place_id_fkey foreign key (place_id) references public.places (id) on delete cascade,
  constraint airports_country_id_fkey foreign key (country_id) references public.countries (id) on delete restrict,
  constraint airports_iata_code_check check (iata_code ~ '^[A-Z0-9]{3}$'),
  constraint airports_icao_code_check check (icao_code is null or icao_code ~ '^[A-Z0-9]{4}$'),
  constraint airports_latitude_check check (latitude is null or (latitude between -90 and 90)),
  constraint airports_longitude_check check (longitude is null or (longitude between -180 and 180)),
  constraint airports_status_check check (status in ('active', 'inactive', 'closed'))
);

create table if not exists public.airlines (
  id uuid primary key default gen_random_uuid(),
  country_id uuid not null,
  iata_code text not null,
  icao_code text,
  name text not null,
  callsign text,
  website_url text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint airlines_iata_code_key unique (iata_code),
  constraint airlines_icao_code_key unique (icao_code),
  constraint airlines_country_id_fkey foreign key (country_id) references public.countries (id) on delete restrict,
  constraint airlines_iata_code_check check (iata_code ~ '^[A-Z0-9]{2}$'),
  constraint airlines_icao_code_check check (icao_code is null or icao_code ~ '^[A-Z0-9]{3}$'),
  constraint airlines_status_check check (status in ('active', 'inactive', 'closed'))
);

create table if not exists public.hotels (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null,
  country_id uuid not null,
  brand_name text,
  chain_name text,
  star_rating smallint,
  check_in_time time,
  check_out_time time,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint hotels_place_id_key unique (place_id),
  constraint hotels_place_id_fkey foreign key (place_id) references public.places (id) on delete cascade,
  constraint hotels_country_id_fkey foreign key (country_id) references public.countries (id) on delete restrict,
  constraint hotels_star_rating_check check (star_rating is null or (star_rating between 1 and 5))
);

create table if not exists public.expense_categories (
  id uuid primary key default gen_random_uuid(),
  category_key text not null,
  name text not null,
  parent_category_id uuid,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint expense_categories_category_key_key unique (category_key),
  constraint expense_categories_parent_category_id_fkey foreign key (parent_category_id) references public.expense_categories (id) on delete set null,
  constraint expense_categories_sort_order_check check (sort_order >= 0)
);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username extensions.citext not null,
  display_name text,
  bio text,
  avatar_object_path text,
  banner_object_path text,
  nationality_country_id uuid,
  preferred_currency_id uuid,
  preferred_language_id uuid,
  time_zone text,
  passport_ready boolean not null default false,
  profile_status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint profiles_username_key unique (username),
  constraint profiles_username_check check (char_length(username::text) between 3 and 32),
  constraint profiles_username_format_check check (username::text ~ '^[a-z0-9_]+$'),
  constraint profiles_nationality_country_id_fkey foreign key (nationality_country_id) references public.countries (id) on delete restrict,
  constraint profiles_preferred_currency_id_fkey foreign key (preferred_currency_id) references public.currencies (id) on delete restrict,
  constraint profiles_preferred_language_id_fkey foreign key (preferred_language_id) references public.languages (id) on delete restrict,
  constraint profiles_profile_status_check check (profile_status in ('active', 'suspended', 'disabled'))
);

create index if not exists places_country_id_idx on public.places (country_id);
create index if not exists places_name_trgm_idx on public.places using gin (name extensions.gin_trgm_ops);
create index if not exists airports_country_id_idx on public.airports (country_id);
create index if not exists airports_name_trgm_idx on public.airports using gin (name extensions.gin_trgm_ops);
create index if not exists airlines_country_id_idx on public.airlines (country_id);
create index if not exists airlines_name_trgm_idx on public.airlines using gin (name extensions.gin_trgm_ops);
create index if not exists hotels_country_id_idx on public.hotels (country_id);
create index if not exists hotels_brand_name_trgm_idx on public.hotels using gin (brand_name extensions.gin_trgm_ops);
create index if not exists hotels_chain_name_trgm_idx on public.hotels using gin (chain_name extensions.gin_trgm_ops);
create index if not exists expense_categories_parent_category_id_idx on public.expense_categories (parent_category_id);
create index if not exists profiles_display_name_trgm_idx on public.profiles using gin (display_name extensions.gin_trgm_ops);

alter table public.currencies enable row level security;
alter table public.languages enable row level security;
alter table public.countries enable row level security;
alter table public.places enable row level security;
alter table public.airports enable row level security;
alter table public.airlines enable row level security;
alter table public.hotels enable row level security;
alter table public.expense_categories enable row level security;
alter table public.profiles enable row level security;

create policy currencies_read_authenticated on public.currencies
  for select to authenticated
  using (true);

create policy languages_read_authenticated on public.languages
  for select to authenticated
  using (true);

create policy countries_read_authenticated on public.countries
  for select to authenticated
  using (true);

create policy places_read_authenticated on public.places
  for select to authenticated
  using (true);

create policy airports_read_authenticated on public.airports
  for select to authenticated
  using (true);

create policy airlines_read_authenticated on public.airlines
  for select to authenticated
  using (true);

create policy hotels_read_authenticated on public.hotels
  for select to authenticated
  using (true);

create policy expense_categories_read_authenticated on public.expense_categories
  for select to authenticated
  using (true);

create policy profiles_owner_all on public.profiles
  for all to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create trigger set_updated_at_currencies
before update on public.currencies
for each row execute function public.set_updated_at();

create trigger set_updated_at_languages
before update on public.languages
for each row execute function public.set_updated_at();

create trigger set_updated_at_countries
before update on public.countries
for each row execute function public.set_updated_at();

create trigger set_updated_at_places
before update on public.places
for each row execute function public.set_updated_at();

create trigger set_updated_at_airports
before update on public.airports
for each row execute function public.set_updated_at();

create trigger set_updated_at_airlines
before update on public.airlines
for each row execute function public.set_updated_at();

create trigger set_updated_at_hotels
before update on public.hotels
for each row execute function public.set_updated_at();

create trigger set_updated_at_expense_categories
before update on public.expense_categories
for each row execute function public.set_updated_at();

create trigger set_updated_at_profiles
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

commit;