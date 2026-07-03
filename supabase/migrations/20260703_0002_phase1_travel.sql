begin;

create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null,
  title text not null,
  slug text not null,
  trip_type text not null,
  status text not null default 'draft',
  visibility text not null default 'private',
  start_date date,
  end_date date,
  origin_country_id uuid,
  destination_country_id uuid,
  primary_language_id uuid,
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint trips_slug_key unique (slug),
  constraint trips_owner_user_id_fkey foreign key (owner_user_id) references auth.users (id) on delete cascade,
  constraint trips_origin_country_id_fkey foreign key (origin_country_id) references public.countries (id) on delete restrict,
  constraint trips_destination_country_id_fkey foreign key (destination_country_id) references public.countries (id) on delete restrict,
  constraint trips_primary_language_id_fkey foreign key (primary_language_id) references public.languages (id) on delete restrict,
  constraint trips_status_check check (status in ('draft', 'planned', 'active', 'completed', 'cancelled', 'archived')),
  constraint trips_visibility_check check (visibility in ('private', 'shared', 'public')),
  constraint trips_trip_type_check check (trip_type in ('solo', 'business', 'leisure', 'family', 'group', 'other')),
  constraint trips_date_range_check check (end_date is null or start_date is null or end_date >= start_date)
);

create or replace function public.is_trip_owner(p_trip_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.trips trips
    where trips.id = p_trip_id
      and trips.owner_user_id = auth.uid()
      and trips.deleted_at is null
  )
$$;

create table if not exists public.trip_destinations (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null,
  place_id uuid not null,
  sequence_no integer not null,
  arrival_date date,
  departure_date date,
  is_primary boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint trip_destinations_trip_id_fkey foreign key (trip_id) references public.trips (id) on delete cascade,
  constraint trip_destinations_place_id_fkey foreign key (place_id) references public.places (id) on delete restrict,
  constraint trip_destinations_trip_sequence_key unique (trip_id, sequence_no),
  constraint trip_destinations_sequence_no_check check (sequence_no > 0),
  constraint trip_destinations_date_range_check check (departure_date is null or arrival_date is null or departure_date >= arrival_date)
);

create table if not exists public.trip_budgets (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null,
  currency_id uuid not null,
  budget_type text not null,
  planned_amount numeric(14,2) not null,
  reserved_amount numeric(14,2) not null default 0,
  actual_spent_amount_cached numeric(14,2) not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint trip_budgets_trip_id_fkey foreign key (trip_id) references public.trips (id) on delete cascade,
  constraint trip_budgets_currency_id_fkey foreign key (currency_id) references public.currencies (id) on delete restrict,
  constraint trip_budgets_trip_currency_budget_type_key unique (trip_id, currency_id, budget_type),
  constraint trip_budgets_budget_type_check check (budget_type in ('total', 'transport', 'lodging', 'food', 'activities', 'buffer', 'other')),
  constraint trip_budgets_amounts_check check (planned_amount >= 0 and reserved_amount >= 0 and actual_spent_amount_cached >= 0)
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  trip_id uuid,
  booking_type text not null,
  provider_name text,
  provider_reference text,
  status text not null default 'pending',
  booked_at timestamptz,
  currency_id uuid,
  total_amount numeric(14,2),
  cancellation_policy text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint bookings_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade,
  constraint bookings_trip_id_fkey foreign key (trip_id) references public.trips (id) on delete cascade,
  constraint bookings_currency_id_fkey foreign key (currency_id) references public.currencies (id) on delete restrict,
  constraint bookings_booking_type_check check (booking_type in ('flight', 'hotel', 'activity', 'ground', 'other')),
  constraint bookings_status_check check (status in ('draft', 'pending', 'confirmed', 'cancelled', 'completed', 'failed', 'refunded')),
  constraint bookings_total_amount_check check (total_amount is null or total_amount >= 0)
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null,
  trip_id uuid,
  booking_id uuid,
  document_type text not null,
  storage_bucket text not null,
  storage_path text not null,
  file_name text not null,
  mime_type text not null,
  file_size_bytes bigint not null,
  checksum text,
  extracted_text text,
  issued_at date,
  expires_at date,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint documents_owner_user_id_fkey foreign key (owner_user_id) references auth.users (id) on delete cascade,
  constraint documents_trip_id_fkey foreign key (trip_id) references public.trips (id) on delete cascade,
  constraint documents_booking_id_fkey foreign key (booking_id) references public.bookings (id) on delete set null,
  constraint documents_storage_bucket_path_key unique (storage_bucket, storage_path),
  constraint documents_file_size_check check (file_size_bytes > 0)
);

create table if not exists public.trip_expenses (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null,
  expense_category_id uuid not null,
  currency_id uuid not null,
  amount numeric(14,2) not null,
  expense_date date not null,
  merchant_name text,
  booking_id uuid,
  receipt_document_id uuid,
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint trip_expenses_trip_id_fkey foreign key (trip_id) references public.trips (id) on delete cascade,
  constraint trip_expenses_expense_category_id_fkey foreign key (expense_category_id) references public.expense_categories (id) on delete restrict,
  constraint trip_expenses_currency_id_fkey foreign key (currency_id) references public.currencies (id) on delete restrict,
  constraint trip_expenses_booking_id_fkey foreign key (booking_id) references public.bookings (id) on delete set null,
  constraint trip_expenses_receipt_document_id_fkey foreign key (receipt_document_id) references public.documents (id) on delete set null,
  constraint trip_expenses_amount_check check (amount >= 0)
);

create table if not exists public.itineraries (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null,
  title text not null,
  version_number integer not null default 1,
  status text not null default 'draft',
  timezone text,
  published_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint itineraries_trip_id_fkey foreign key (trip_id) references public.trips (id) on delete cascade,
  constraint itineraries_trip_version_key unique (trip_id, version_number),
  constraint itineraries_status_check check (status in ('draft', 'published', 'archived')),
  constraint itineraries_version_number_check check (version_number > 0)
);

create table if not exists public.itinerary_days (
  id uuid primary key default gen_random_uuid(),
  itinerary_id uuid not null,
  trip_date date not null,
  day_number integer not null,
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint itinerary_days_itinerary_id_fkey foreign key (itinerary_id) references public.itineraries (id) on delete cascade,
  constraint itinerary_days_itinerary_day_key unique (itinerary_id, day_number),
  constraint itinerary_days_day_number_check check (day_number > 0)
);

create table if not exists public.itinerary_items (
  id uuid primary key default gen_random_uuid(),
  itinerary_day_id uuid not null,
  item_type text not null,
  place_id uuid,
  booking_id uuid,
  title text not null,
  description text,
  start_at timestamptz,
  end_at timestamptz,
  order_index integer not null default 0,
  estimated_cost_amount numeric(14,2),
  estimated_cost_currency_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint itinerary_items_itinerary_day_id_fkey foreign key (itinerary_day_id) references public.itinerary_days (id) on delete cascade,
  constraint itinerary_items_place_id_fkey foreign key (place_id) references public.places (id) on delete restrict,
  constraint itinerary_items_booking_id_fkey foreign key (booking_id) references public.bookings (id) on delete set null,
  constraint itinerary_items_estimated_cost_currency_id_fkey foreign key (estimated_cost_currency_id) references public.currencies (id) on delete restrict,
  constraint itinerary_items_itinerary_day_order_key unique (itinerary_day_id, order_index),
  constraint itinerary_items_item_type_check check (item_type in ('flight', 'hotel', 'activity', 'restaurant', 'transfer', 'note', 'custom')),
  constraint itinerary_items_order_index_check check (order_index >= 0),
  constraint itinerary_items_time_range_check check (end_at is null or start_at is null or end_at >= start_at),
  constraint itinerary_items_estimated_cost_check check (estimated_cost_amount is null or estimated_cost_amount >= 0)
);

create table if not exists public.flight_segments (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null,
  booking_id uuid,
  segment_order integer not null,
  airline_id uuid not null,
  departure_airport_id uuid not null,
  arrival_airport_id uuid not null,
  departure_at timestamptz not null,
  arrival_at timestamptz not null,
  cabin_class text,
  seat_number text,
  terminal text,
  gate text,
  status text not null default 'scheduled',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint flight_segments_trip_id_fkey foreign key (trip_id) references public.trips (id) on delete cascade,
  constraint flight_segments_booking_id_fkey foreign key (booking_id) references public.bookings (id) on delete set null,
  constraint flight_segments_airline_id_fkey foreign key (airline_id) references public.airlines (id) on delete restrict,
  constraint flight_segments_departure_airport_id_fkey foreign key (departure_airport_id) references public.airports (id) on delete restrict,
  constraint flight_segments_arrival_airport_id_fkey foreign key (arrival_airport_id) references public.airports (id) on delete restrict,
  constraint flight_segments_trip_segment_key unique (trip_id, segment_order),
  constraint flight_segments_segment_order_check check (segment_order > 0),
  constraint flight_segments_time_range_check check (arrival_at >= departure_at),
  constraint flight_segments_status_check check (status in ('scheduled', 'delayed', 'boarding', 'departed', 'arrived', 'cancelled'))
);

create index if not exists trips_owner_user_id_idx on public.trips (owner_user_id);
create index if not exists trips_status_start_date_idx on public.trips (status, start_date);
create index if not exists trips_slug_idx on public.trips (slug);
create index if not exists trip_destinations_trip_id_idx on public.trip_destinations (trip_id);
create index if not exists trip_destinations_place_id_idx on public.trip_destinations (place_id);
create index if not exists trip_budgets_trip_id_idx on public.trip_budgets (trip_id);
create index if not exists trip_budgets_currency_id_idx on public.trip_budgets (currency_id);
create index if not exists bookings_user_id_idx on public.bookings (user_id);
create index if not exists bookings_trip_id_idx on public.bookings (trip_id);
create index if not exists bookings_status_booked_at_idx on public.bookings (status, booked_at desc);
create index if not exists documents_owner_user_id_idx on public.documents (owner_user_id);
create index if not exists documents_trip_id_idx on public.documents (trip_id);
create index if not exists documents_booking_id_idx on public.documents (booking_id);
create index if not exists documents_file_name_trgm_idx on public.documents using gin (file_name extensions.gin_trgm_ops);
create index if not exists trip_expenses_trip_id_idx on public.trip_expenses (trip_id);
create index if not exists trip_expenses_expense_date_idx on public.trip_expenses (expense_date desc);
create index if not exists trip_expenses_category_id_idx on public.trip_expenses (expense_category_id);
create index if not exists itineraries_trip_id_idx on public.itineraries (trip_id);
create index if not exists itinerary_days_itinerary_id_idx on public.itinerary_days (itinerary_id);
create index if not exists itinerary_items_itinerary_day_id_idx on public.itinerary_items (itinerary_day_id);
create index if not exists itinerary_items_place_id_idx on public.itinerary_items (place_id);
create index if not exists flight_segments_trip_id_idx on public.flight_segments (trip_id);
create index if not exists flight_segments_booking_id_idx on public.flight_segments (booking_id);
create index if not exists flight_segments_airline_departure_idx on public.flight_segments (airline_id, departure_at);

alter table public.trips enable row level security;
alter table public.trip_destinations enable row level security;
alter table public.trip_budgets enable row level security;
alter table public.bookings enable row level security;
alter table public.documents enable row level security;
alter table public.trip_expenses enable row level security;
alter table public.itineraries enable row level security;
alter table public.itinerary_days enable row level security;
alter table public.itinerary_items enable row level security;
alter table public.flight_segments enable row level security;

create policy trips_owner_all on public.trips
  for all to authenticated
  using (auth.uid() = owner_user_id)
  with check (auth.uid() = owner_user_id);

create policy trip_destinations_owner_all on public.trip_destinations
  for all to authenticated
  using (public.is_trip_owner(trip_id))
  with check (public.is_trip_owner(trip_id));

create policy trip_budgets_owner_all on public.trip_budgets
  for all to authenticated
  using (public.is_trip_owner(trip_id))
  with check (public.is_trip_owner(trip_id));

create policy bookings_owner_all on public.bookings
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy documents_owner_all on public.documents
  for all to authenticated
  using (auth.uid() = owner_user_id)
  with check (auth.uid() = owner_user_id);

create policy trip_expenses_owner_all on public.trip_expenses
  for all to authenticated
  using (public.is_trip_owner(trip_id))
  with check (public.is_trip_owner(trip_id));

create policy itineraries_owner_all on public.itineraries
  for all to authenticated
  using (public.is_trip_owner(trip_id))
  with check (public.is_trip_owner(trip_id));

create policy itinerary_days_owner_all on public.itinerary_days
  for all to authenticated
  using (
    exists (
      select 1
      from public.itineraries itineraries
      where itineraries.id = itinerary_days.itinerary_id
        and public.is_trip_owner(itineraries.trip_id)
    )
  )
  with check (
    exists (
      select 1
      from public.itineraries itineraries
      where itineraries.id = itinerary_days.itinerary_id
        and public.is_trip_owner(itineraries.trip_id)
    )
  );

create policy itinerary_items_owner_all on public.itinerary_items
  for all to authenticated
  using (
    exists (
      select 1
      from public.itinerary_days itinerary_days
      join public.itineraries itineraries on itineraries.id = itinerary_days.itinerary_id
      where itinerary_days.id = itinerary_items.itinerary_day_id
        and public.is_trip_owner(itineraries.trip_id)
    )
  )
  with check (
    exists (
      select 1
      from public.itinerary_days itinerary_days
      join public.itineraries itineraries on itineraries.id = itinerary_days.itinerary_id
      where itinerary_days.id = itinerary_items.itinerary_day_id
        and public.is_trip_owner(itineraries.trip_id)
    )
  );

create policy flight_segments_owner_all on public.flight_segments
  for all to authenticated
  using (public.is_trip_owner(trip_id))
  with check (public.is_trip_owner(trip_id));

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'trips',
    'trip_destinations',
    'trip_budgets',
    'bookings',
    'documents',
    'trip_expenses',
    'itineraries',
    'itinerary_days',
    'itinerary_items',
    'flight_segments'
  ]
  loop
    execute format('drop trigger if exists %I on public.%I', 'set_updated_at_' || table_name, table_name);
    execute format('create trigger %I before update on public.%I for each row execute function public.set_updated_at()', 'set_updated_at_' || table_name, table_name);
  end loop;
end $$;

commit;