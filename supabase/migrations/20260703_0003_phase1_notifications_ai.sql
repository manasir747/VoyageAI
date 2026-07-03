begin;

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  notification_type text not null,
  title text not null,
  body text not null,
  channel text not null default 'in_app',
  entity_type text,
  entity_id uuid,
  action_url text,
  payload jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint notifications_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade,
  constraint notifications_channel_check check (channel in ('in_app', 'email', 'sms', 'push'))
);

create table if not exists public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  trip_id uuid,
  title text,
  summary text,
  context jsonb not null default '{}'::jsonb,
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint ai_conversations_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade,
  constraint ai_conversations_trip_id_fkey foreign key (trip_id) references public.trips (id) on delete set null
);

create or replace function public.is_conversation_owner(p_conversation_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.ai_conversations ai_conversations
    where ai_conversations.id = p_conversation_id
      and ai_conversations.user_id = auth.uid()
      and ai_conversations.deleted_at is null
  )
$$;

create table if not exists public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null,
  role text not null,
  message_index integer not null,
  content text not null,
  content_format text not null default 'text',
  token_count integer,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint ai_messages_conversation_id_fkey foreign key (conversation_id) references public.ai_conversations (id) on delete cascade,
  constraint ai_messages_conversation_message_key unique (conversation_id, message_index),
  constraint ai_messages_message_index_check check (message_index >= 0),
  constraint ai_messages_role_check check (role in ('system', 'user', 'assistant', 'tool')),
  constraint ai_messages_content_format_check check (content_format in ('text', 'markdown', 'json')),
  constraint ai_messages_token_count_check check (token_count is null or token_count >= 0)
);

create index if not exists notifications_user_id_idx on public.notifications (user_id);
create index if not exists notifications_user_read_at_idx on public.notifications (user_id, read_at);
create index if not exists notifications_created_at_idx on public.notifications (created_at desc);
create index if not exists ai_conversations_user_id_idx on public.ai_conversations (user_id);
create index if not exists ai_conversations_trip_id_idx on public.ai_conversations (trip_id);
create index if not exists ai_conversations_user_last_message_idx on public.ai_conversations (user_id, last_message_at desc);
create index if not exists ai_messages_conversation_id_idx on public.ai_messages (conversation_id);
create index if not exists ai_messages_conversation_message_idx on public.ai_messages (conversation_id, message_index);

alter table public.notifications enable row level security;
alter table public.ai_conversations enable row level security;
alter table public.ai_messages enable row level security;

create policy notifications_owner_all on public.notifications
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy ai_conversations_owner_all on public.ai_conversations
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy ai_messages_owner_all on public.ai_messages
  for all to authenticated
  using (
    exists (
      select 1
      from public.ai_conversations ai_conversations
      where ai_conversations.id = ai_messages.conversation_id
        and ai_conversations.user_id = auth.uid()
        and ai_conversations.deleted_at is null
    )
  )
  with check (
    exists (
      select 1
      from public.ai_conversations ai_conversations
      where ai_conversations.id = ai_messages.conversation_id
        and ai_conversations.user_id = auth.uid()
        and ai_conversations.deleted_at is null
    )
  );

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'notifications',
    'ai_conversations',
    'ai_messages'
  ]
  loop
    execute format('drop trigger if exists %I on public.%I', 'set_updated_at_' || table_name, table_name);
    execute format('create trigger %I before update on public.%I for each row execute function public.set_updated_at()', 'set_updated_at_' || table_name, table_name);
  end loop;
end $$;

commit;