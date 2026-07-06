create table if not exists public.saved_destinations (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    destination_slug text not null,
    city text not null,
    country text not null,
    image_url text,
    rating numeric(3,1),
    best_season text,
    starting_budget numeric,
    category text[] default '{}',
    continent text,
    description text,
    saved_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    -- Ensure a user can only save a specific destination once
    unique(user_id, destination_slug)
);

-- Enable RLS
alter table public.saved_destinations enable row level security;

-- Create Policies
create policy "Users can view their own saved destinations"
    on public.saved_destinations for select
    using (auth.uid() = user_id);

create policy "Users can insert their own saved destinations"
    on public.saved_destinations for insert
    with check (auth.uid() = user_id);

create policy "Users can delete their own saved destinations"
    on public.saved_destinations for delete
    using (auth.uid() = user_id);

-- Create index for faster querying
create index if not exists idx_saved_destinations_user_id on public.saved_destinations(user_id);
