# VoyageAI Database Dictionary

This document describes the proposed production schema before any SQL migrations are created. It is the review artifact for approval only.

## Scope

The connected Supabase project currently contains only the managed `auth.*` and `storage.*` platform schemas. No application tables, no application migrations, no application RLS policies, and no storage buckets currently exist.

The dictionary below covers the proposed VoyageAI application schema only.

## Conventions

- Primary keys use UUID unless noted otherwise.
- Foreign keys are indexed.
- Soft deletes use `deleted_at`.
- Audit columns use `created_at` and `updated_at`.
- Read paths should prefer keyset pagination and partial indexes on active rows.

## Master Data

### countries

Purpose: canonical country reference table.

Columns:
- `id` UUID PK
- `iso2` text NOT NULL unique
- `iso3` text NOT NULL unique
- `numeric_code` text unique nullable
- `name` text NOT NULL
- `region` text nullable
- `subregion` text nullable
- `currency_id` UUID FK to `currencies.id` nullable
- `default_language_id` UUID FK to `languages.id` nullable
- `created_at` timestamptz NOT NULL
- `updated_at` timestamptz NOT NULL

Keys and constraints:
- PK: `id`
- Unique: `iso2`, `iso3`, `numeric_code`
- Check: `char_length(iso2) = 2`
- Check: `char_length(iso3) = 3`

Indexes:
- Unique btree on `iso2`
- Unique btree on `iso3`
- Optional partial unique on `numeric_code` when present

Relationships:
- Referenced by `places`, `airports`, `airlines`, `hotels`, `profiles`, and `trips`.

### currencies

Purpose: canonical currency reference table.

Columns:
- `id` UUID PK
- `iso_code` text NOT NULL unique
- `numeric_code` integer unique nullable
- `name` text NOT NULL
- `symbol` text nullable
- `minor_units` smallint NOT NULL
- `is_active` boolean NOT NULL default true
- `created_at` timestamptz NOT NULL
- `updated_at` timestamptz NOT NULL

Keys and constraints:
- PK: `id`
- Unique: `iso_code`
- Check: `minor_units >= 0`

Indexes:
- Unique btree on `iso_code`
- Optional partial unique on `numeric_code` when present

Relationships:
- Referenced by `profiles`, `trips`, `trip_budgets`, `trip_expenses`, and `bookings`.

### languages

Purpose: canonical language reference table.

Columns:
- `id` UUID PK
- `iso639_1` text unique nullable
- `iso639_3` text NOT NULL unique
- `name` text NOT NULL
- `native_name` text nullable
- `script` text nullable
- `is_active` boolean NOT NULL default true
- `created_at` timestamptz NOT NULL
- `updated_at` timestamptz NOT NULL

Keys and constraints:
- PK: `id`
- Unique: `iso639_1`, `iso639_3`
- Check: `char_length(iso639_3) = 3`

Indexes:
- Unique btree on `iso639_3`
- Optional partial unique on `iso639_1` when present

Relationships:
- Referenced by `profiles` and `trips`.

### expense_categories

Purpose: reusable expense taxonomy.

Columns:
- `id` UUID PK
- `category_key` text NOT NULL unique
- `name` text NOT NULL
- `parent_category_id` UUID FK to `expense_categories.id` nullable
- `sort_order` integer NOT NULL default 0
- `is_active` boolean NOT NULL default true
- `created_at` timestamptz NOT NULL
- `updated_at` timestamptz NOT NULL
- `deleted_at` timestamptz nullable

Keys and constraints:
- PK: `id`
- Unique: `category_key`

Indexes:
- Unique btree on `category_key`
- Btree on `parent_category_id`
- Partial btree on `(is_active, sort_order)` where `deleted_at is null`

Relationships:
- Referenced by `trip_expenses`.

### places

Purpose: generic location entity for cities, districts, landmarks, and other search targets.

Columns:
- `id` UUID PK
- `place_type` text NOT NULL
- `name` text NOT NULL
- `country_id` UUID FK to `countries.id`
- `region` text nullable
- `locality` text nullable
- `address_line1` text nullable
- `address_line2` text nullable
- `postal_code` text nullable
- `latitude` numeric(9,6) nullable
- `longitude` numeric(9,6) nullable
- `timezone` text nullable
- `website_url` text nullable
- `phone_number` text nullable
- `metadata` jsonb NOT NULL default `'{}'`
- `created_at` timestamptz NOT NULL
- `updated_at` timestamptz NOT NULL
- `deleted_at` timestamptz nullable

Keys and constraints:
- PK: `id`
- Check: latitude between -90 and 90 when present
- Check: longitude between -180 and 180 when present

Indexes:
- Btree on `country_id`
- Trigram on `name`
- GIN on `metadata`
- Partial btree on `(country_id, locality)` where `deleted_at is null`

Relationships:
- Parent table for `airports` and `hotels`.
- Referenced by `trip_destinations`, `saved_places`, `wishlist_items`, and generic place reviews.

### airports

Purpose: dedicated airport master data.

Columns:
- `id` UUID PK
- `place_id` UUID FK to `places.id` unique
- `country_id` UUID FK to `countries.id`
- `iata_code` text NOT NULL unique
- `icao_code` text unique nullable
- `name` text NOT NULL
- `city_name` text nullable
- `timezone` text nullable
- `latitude` numeric(9,6) nullable
- `longitude` numeric(9,6) nullable
- `status` text NOT NULL
- `created_at` timestamptz NOT NULL
- `updated_at` timestamptz NOT NULL
- `deleted_at` timestamptz nullable

Keys and constraints:
- PK: `id`
- Unique: `place_id`, `iata_code`, `icao_code`
- Check: `char_length(iata_code) = 3`

Indexes:
- Unique btree on `iata_code`
- Unique partial on `icao_code` when present
- Btree on `country_id`

Relationships:
- Referenced by flight segments and wishlist items.

### airlines

Purpose: dedicated airline master data.

Columns:
- `id` UUID PK
- `country_id` UUID FK to `countries.id`
- `iata_code` text NOT NULL unique
- `icao_code` text unique nullable
- `name` text NOT NULL
- `callsign` text nullable
- `website_url` text nullable
- `status` text NOT NULL
- `created_at` timestamptz NOT NULL
- `updated_at` timestamptz NOT NULL
- `deleted_at` timestamptz nullable

Keys and constraints:
- PK: `id`
- Unique: `iata_code`, `icao_code`
- Check: `char_length(iata_code) = 2`

Indexes:
- Unique btree on `iata_code`
- Unique partial on `icao_code` when present
- Trigram on `name`

Relationships:
- Referenced by flight bookings and flight segments.

### hotels

Purpose: dedicated hotel master data.

Columns:
- `id` UUID PK
- `place_id` UUID FK to `places.id` unique
- `country_id` UUID FK to `countries.id`
- `brand_name` text nullable
- `chain_name` text nullable
- `star_rating` smallint nullable
- `check_in_time` time nullable
- `check_out_time` time nullable
- `metadata` jsonb NOT NULL default `'{}'`
- `created_at` timestamptz NOT NULL
- `updated_at` timestamptz NOT NULL
- `deleted_at` timestamptz nullable

Keys and constraints:
- PK: `id`
- Unique: `place_id`
- Check: `star_rating between 1 and 5` when present

Indexes:
- Btree on `country_id`
- Trigram on `brand_name`, `chain_name`
- GIN on `metadata`

Relationships:
- Referenced by hotel bookings, wishlist items, and hotel reviews.

## User and Account

### profiles

Purpose: application profile record for each auth user.

Columns:
- `id` UUID PK and FK to `auth.users.id`
- `username` text NOT NULL unique
- `display_name` text nullable
- `bio` text nullable
- `avatar_object_path` text nullable
- `banner_object_path` text nullable
- `nationality_country_id` UUID FK to `countries.id` nullable
- `preferred_currency_id` UUID FK to `currencies.id` nullable
- `preferred_language_id` UUID FK to `languages.id` nullable
- `time_zone` text nullable
- `passport_ready` boolean NOT NULL default false
- `profile_status` text NOT NULL default `'active'`
- `created_at` timestamptz NOT NULL
- `updated_at` timestamptz NOT NULL
- `deleted_at` timestamptz nullable

Keys and constraints:
- PK: `id`
- Unique: `username`
- Check: username should satisfy the approved character policy

Indexes:
- Unique btree on `username`
- Trigram on `display_name`
- Partial btree on `deleted_at is null`

Relationships:
- One-to-one with `auth.users`
- Parent for all user-owned business objects

### linked_accounts

Purpose: persistent account linkage registry for Google, Apple, GitHub, and similar providers.

Columns:
- `id` UUID PK
- `user_id` UUID FK to `auth.users.id`
- `provider_key` text NOT NULL
- `provider_account_id` text NOT NULL
- `provider_email` text nullable
- `scopes` text nullable
- `linked_at` timestamptz NOT NULL
- `last_used_at` timestamptz nullable
- `revoked_at` timestamptz nullable
- `token_vault_ref` text nullable
- `metadata` jsonb NOT NULL default `'{}'`
- `created_at` timestamptz NOT NULL
- `updated_at` timestamptz NOT NULL
- `deleted_at` timestamptz nullable

Keys and constraints:
- PK: `id`
- Unique: `(provider_key, provider_account_id)`

Indexes:
- Unique btree on `(provider_key, provider_account_id)`
- Btree on `user_id`

Relationships:
- Belongs to a user profile and stores non-secret linkage metadata only.

### user_sessions

Purpose: application-level login history.

Columns:
- `id` UUID PK
- `user_id` UUID FK to `auth.users.id`
- `auth_session_id` UUID nullable
- `login_at` timestamptz NOT NULL
- `logout_at` timestamptz nullable
- `ip_address` inet nullable
- `user_agent` text nullable
- `device_type` text nullable
- `platform` text nullable
- `country_id` UUID FK to `countries.id` nullable
- `city_name` text nullable
- `is_current` boolean NOT NULL default false
- `created_at` timestamptz NOT NULL
- `updated_at` timestamptz NOT NULL

Keys and constraints:
- PK: `id`

Indexes:
- Btree on `user_id`
- Partial btree on `(user_id, login_at desc)`
- Partial btree on `(user_id, is_current)` where `is_current = true`

Relationships:
- Mirrors auth login activity for analytics and security review.

### notification_preferences

Purpose: per-user notification delivery configuration.

Columns:
- `id` UUID PK
- `user_id` UUID FK to `auth.users.id`
- `notification_type` text NOT NULL
- `channel` text NOT NULL
- `is_enabled` boolean NOT NULL default true
- `quiet_hours` jsonb NOT NULL default `'{}'`
- `delivery_rules` jsonb NOT NULL default `'{}'`
- `created_at` timestamptz NOT NULL
- `updated_at` timestamptz NOT NULL
- `deleted_at` timestamptz nullable

Keys and constraints:
- PK: `id`
- Unique: `(user_id, notification_type, channel)`

Indexes:
- Unique btree on `(user_id, notification_type, channel)`
- Btree on `user_id`

### emergency_contacts

Purpose: trip-aware emergency contact registry.

Columns:
- `id` UUID PK
- `user_id` UUID FK to `auth.users.id`
- `trip_id` UUID FK to `trips.id` nullable
- `full_name` text NOT NULL
- `relationship` text nullable
- `phone_country_code` text nullable
- `phone_number` text NOT NULL
- `email` text nullable
- `priority` integer NOT NULL default 0
- `notes` text nullable
- `created_at` timestamptz NOT NULL
- `updated_at` timestamptz NOT NULL
- `deleted_at` timestamptz nullable

Indexes:
- Btree on `user_id`
- Btree on `trip_id`

### search_history

Purpose: user and trip search persistence.

Columns:
- `id` UUID PK
- `user_id` UUID FK to `auth.users.id`
- `trip_id` UUID FK to `trips.id` nullable
- `search_scope` text NOT NULL
- `query_text` text NOT NULL
- `filters` jsonb NOT NULL default `'{}'`
- `result_count` integer NOT NULL default 0
- `created_at` timestamptz NOT NULL
- `deleted_at` timestamptz nullable

Indexes:
- Btree on `user_id`
- Partial btree on `(user_id, created_at desc)`
- GIN on `filters`

### wishlists

Purpose: user-curated collections of future travel targets.

Columns:
- `id` UUID PK
- `user_id` UUID FK to `auth.users.id`
- `title` text NOT NULL
- `description` text nullable
- `visibility` text NOT NULL
- `created_at` timestamptz NOT NULL
- `updated_at` timestamptz NOT NULL
- `deleted_at` timestamptz nullable

Indexes:
- Btree on `user_id`
- Partial btree on `(user_id, created_at desc)` where `deleted_at is null`

### wishlist_items

Purpose: heterogeneous wishlist targets.

Columns:
- `id` UUID PK
- `wishlist_id` UUID FK to `wishlists.id`
- `item_type` text NOT NULL
- `place_id` UUID FK to `places.id` nullable
- `hotel_id` UUID FK to `hotels.id` nullable
- `airport_id` UUID FK to `airports.id` nullable
- `airline_id` UUID FK to `airlines.id` nullable
- `trip_id` UUID FK to `trips.id` nullable
- `notes` text nullable
- `rank` integer NOT NULL default 0
- `created_at` timestamptz NOT NULL
- `updated_at` timestamptz NOT NULL
- `deleted_at` timestamptz nullable

Constraints:
- Exactly one target FK should be populated per row.

Indexes:
- Btree on `wishlist_id`
- Partial btree on `(wishlist_id, rank)` where `deleted_at is null`

### saved_places

Purpose: persisted personal saved destinations and POIs.

Columns:
- `id` UUID PK
- `user_id` UUID FK to `auth.users.id`
- `place_id` UUID FK to `places.id`
- `trip_id` UUID FK to `trips.id` nullable
- `label` text nullable
- `notes` text nullable
- `is_favorite` boolean NOT NULL default false
- `created_at` timestamptz NOT NULL
- `updated_at` timestamptz NOT NULL
- `deleted_at` timestamptz nullable

Constraints:
- Unique recommended on `(user_id, place_id, trip_id)`.

Indexes:
- Btree on `user_id`
- Btree on `place_id`

## Travel Core

### trips

Purpose: trip aggregate root.

Columns:
- `id` UUID PK
- `owner_user_id` UUID FK to `auth.users.id`
- `title` text NOT NULL
- `slug` text NOT NULL unique
- `trip_type` text NOT NULL
- `status` text NOT NULL
- `visibility` text NOT NULL
- `start_date` date nullable
- `end_date` date nullable
- `origin_country_id` UUID FK to `countries.id` nullable
- `destination_country_id` UUID FK to `countries.id` nullable
- `primary_language_id` UUID FK to `languages.id` nullable
- `notes` text nullable
- `created_at` timestamptz NOT NULL
- `updated_at` timestamptz NOT NULL
- `deleted_at` timestamptz nullable

Keys and constraints:
- PK: `id`
- Unique: `slug`
- Check: `end_date >= start_date` when both are present

Indexes:
- Unique btree on `slug`
- Btree on `(owner_user_id, created_at desc)`
- Partial btree on `(owner_user_id, status)` where `deleted_at is null`

### trip_destinations

Purpose: itinerary geography for a trip.

Columns:
- `id` UUID PK
- `trip_id` UUID FK to `trips.id`
- `place_id` UUID FK to `places.id`
- `sequence_no` integer NOT NULL
- `arrival_date` date nullable
- `departure_date` date nullable
- `is_primary` boolean NOT NULL default false
- `notes` text nullable
- `created_at` timestamptz NOT NULL
- `updated_at` timestamptz NOT NULL
- `deleted_at` timestamptz nullable

Keys and constraints:
- Unique: `(trip_id, sequence_no)`

Indexes:
- Btree on `trip_id`
- Btree on `place_id`

### trip_budgets

Purpose: budget planning layer separated from trip metadata.

Columns:
- `id` UUID PK
- `trip_id` UUID FK to `trips.id`
- `currency_id` UUID FK to `currencies.id`
- `budget_type` text NOT NULL
- `planned_amount` numeric(14,2) NOT NULL
- `reserved_amount` numeric(14,2) NOT NULL default 0
- `actual_spent_amount_cached` numeric(14,2) NOT NULL default 0
- `notes` text nullable
- `created_at` timestamptz NOT NULL
- `updated_at` timestamptz NOT NULL
- `deleted_at` timestamptz nullable

Constraints:
- Check amounts are non-negative.

Indexes:
- Recommended unique on `(trip_id, currency_id, budget_type)`.

### trip_expenses

Purpose: normalized expense ledger for trips.

Columns:
- `id` UUID PK
- `trip_id` UUID FK to `trips.id`
- `expense_category_id` UUID FK to `expense_categories.id`
- `currency_id` UUID FK to `currencies.id`
- `amount` numeric(14,2) NOT NULL
- `expense_date` date NOT NULL
- `merchant_name` text nullable
- `booking_id` UUID FK to `bookings.id` nullable
- `receipt_document_id` UUID FK to `documents.id` nullable
- `notes` text nullable
- `created_at` timestamptz NOT NULL
- `updated_at` timestamptz NOT NULL
- `deleted_at` timestamptz nullable

Constraints:
- Check `amount >= 0`

Indexes:
- Btree on `trip_id`
- Btree on `expense_date`
- Btree on `(trip_id, expense_date desc)`
- Btree on `expense_category_id`

### itineraries

Purpose: trip itinerary versions.

Columns:
- `id` UUID PK
- `trip_id` UUID FK to `trips.id`
- `title` text NOT NULL
- `version_number` integer NOT NULL default 1
- `status` text NOT NULL
- `timezone` text nullable
- `published_at` timestamptz nullable
- `created_at` timestamptz NOT NULL
- `updated_at` timestamptz NOT NULL
- `deleted_at` timestamptz nullable

Indexes:
- Btree on `trip_id`
- Recommended unique on `(trip_id, version_number)`

### itinerary_days

Purpose: daily itinerary partition.

Columns:
- `id` UUID PK
- `itinerary_id` UUID FK to `itineraries.id`
- `trip_date` date NOT NULL
- `day_number` integer NOT NULL
- `notes` text nullable
- `created_at` timestamptz NOT NULL
- `updated_at` timestamptz NOT NULL
- `deleted_at` timestamptz nullable

Keys and constraints:
- Unique: `(itinerary_id, day_number)`

Indexes:
- Btree on `itinerary_id`
- Btree on `(itinerary_id, trip_date)`

### itinerary_items

Purpose: ordered activities, bookings, and stops.

Columns:
- `id` UUID PK
- `itinerary_day_id` UUID FK to `itinerary_days.id`
- `item_type` text NOT NULL
- `place_id` UUID FK to `places.id` nullable
- `booking_id` UUID FK to `bookings.id` nullable
- `title` text NOT NULL
- `description` text nullable
- `start_at` timestamptz nullable
- `end_at` timestamptz nullable
- `order_index` integer NOT NULL default 0
- `estimated_cost_amount` numeric(14,2) nullable
- `estimated_cost_currency_id` UUID FK to `currencies.id` nullable
- `metadata` jsonb NOT NULL default `'{}'`
- `created_at` timestamptz NOT NULL
- `updated_at` timestamptz NOT NULL
- `deleted_at` timestamptz nullable

Constraints:
- Check `end_at >= start_at` when both are present.

Indexes:
- Btree on `itinerary_day_id`
- Partial btree on `(itinerary_day_id, order_index)` where `deleted_at is null`
- GIN on `metadata`

### checklists

Purpose: trip or personal checklist containers.

Columns:
- `id` UUID PK
- `trip_id` UUID FK to `trips.id` nullable
- `user_id` UUID FK to `auth.users.id` nullable
- `title` text NOT NULL
- `scope` text NOT NULL
- `status` text NOT NULL
- `due_at` timestamptz nullable
- `created_at` timestamptz NOT NULL
- `updated_at` timestamptz NOT NULL
- `deleted_at` timestamptz nullable

Constraints:
- Scope must determine whether `trip_id` or `user_id` is populated.

Indexes:
- Btree on `trip_id`
- Btree on `user_id`

### checklist_items

Purpose: hierarchical checklist items.

Columns:
- `id` UUID PK
- `checklist_id` UUID FK to `checklists.id`
- `parent_item_id` UUID FK to `checklist_items.id` nullable
- `title` text NOT NULL
- `notes` text nullable
- `priority` integer NOT NULL default 0
- `status` text NOT NULL
- `due_at` timestamptz nullable
- `completed_at` timestamptz nullable
- `order_index` integer NOT NULL default 0
- `created_at` timestamptz NOT NULL
- `updated_at` timestamptz NOT NULL
- `deleted_at` timestamptz nullable

Indexes:
- Btree on `checklist_id`
- Btree on `parent_item_id`
- Partial btree on `(checklist_id, order_index)` where `deleted_at is null`

### documents

Purpose: file metadata and extracted content pointers.

Columns:
- `id` UUID PK
- `owner_user_id` UUID FK to `auth.users.id`
- `trip_id` UUID FK to `trips.id` nullable
- `booking_id` UUID FK to `bookings.id` nullable
- `document_type` text NOT NULL
- `storage_bucket` text NOT NULL
- `storage_path` text NOT NULL
- `file_name` text NOT NULL
- `mime_type` text NOT NULL
- `file_size_bytes` bigint NOT NULL
- `checksum` text nullable
- `extracted_text` text nullable
- `issued_at` date nullable
- `expires_at` date nullable
- `metadata` jsonb NOT NULL default `'{}'`
- `created_at` timestamptz NOT NULL
- `updated_at` timestamptz NOT NULL
- `deleted_at` timestamptz nullable

Constraints:
- `file_size_bytes > 0`

Indexes:
- Btree on `owner_user_id`
- Btree on `trip_id`
- Btree on `booking_id`
- Trigram on `file_name`
- GIN on `metadata`

### bookings

Purpose: booking supertype for flight and hotel reservations.

Columns:
- `id` UUID PK
- `user_id` UUID FK to `auth.users.id`
- `trip_id` UUID FK to `trips.id` nullable
- `booking_type` text NOT NULL
- `provider_name` text nullable
- `provider_reference` text nullable
- `status` text NOT NULL
- `booked_at` timestamptz nullable
- `currency_id` UUID FK to `currencies.id`
- `total_amount` numeric(14,2) nullable
- `cancellation_policy` text nullable
- `metadata` jsonb NOT NULL default `'{}'`
- `created_at` timestamptz NOT NULL
- `updated_at` timestamptz NOT NULL
- `deleted_at` timestamptz nullable

Indexes:
- Btree on `user_id`
- Btree on `trip_id`
- Btree on `status`
- Partial btree on `(user_id, booked_at desc)` where `deleted_at is null`

### flight_bookings

Columns:
- `booking_id` UUID PK FK to `bookings.id`
- `pnr` text nullable
- `ticket_number` text nullable
- `airline_id` UUID FK to `airlines.id`
- `fare_class` text nullable
- `passenger_count` integer NOT NULL default 1
- `baggage_allowance` jsonb nullable
- `metadata` jsonb NOT NULL default `'{}'`

Indexes:
- Btree on `airline_id`
- Unique partial on `ticket_number` when present

### hotel_bookings

Columns:
- `booking_id` UUID PK FK to `bookings.id`
- `hotel_id` UUID FK to `hotels.id`
- `confirmation_number` text nullable
- `room_type` text nullable
- `check_in_date` date nullable
- `check_out_date` date nullable
- `guest_count` integer NOT NULL default 1
- `metadata` jsonb NOT NULL default `'{}'`

Indexes:
- Btree on `hotel_id`
- Btree on `confirmation_number` when present

### flight_segments

Columns:
- `id` UUID PK
- `trip_id` UUID FK to `trips.id`
- `booking_id` UUID FK to `bookings.id` nullable
- `segment_order` integer NOT NULL
- `airline_id` UUID FK to `airlines.id`
- `departure_airport_id` UUID FK to `airports.id`
- `arrival_airport_id` UUID FK to `airports.id`
- `departure_at` timestamptz NOT NULL
- `arrival_at` timestamptz NOT NULL
- `cabin_class` text nullable
- `seat_number` text nullable
- `terminal` text nullable
- `gate` text nullable
- `status` text NOT NULL
- `created_at` timestamptz NOT NULL
- `updated_at` timestamptz NOT NULL
- `deleted_at` timestamptz nullable

Constraints:
- `arrival_at >= departure_at`
- Unique `(booking_id, segment_order)` when `booking_id` is populated

Indexes:
- Btree on `trip_id`
- Btree on `booking_id`
- Btree on `(airline_id, departure_at)`

### booking_status_history

Purpose: immutable booking state transitions.

Columns:
- `id` UUID PK
- `booking_id` UUID FK to `bookings.id`
- `from_status` text NOT NULL
- `to_status` text NOT NULL
- `changed_by_user_id` UUID FK to `auth.users.id` nullable
- `reason` text nullable
- `change_metadata` jsonb NOT NULL default `'{}'`
- `changed_at` timestamptz NOT NULL
- `created_at` timestamptz NOT NULL

Indexes:
- Btree on `booking_id`
- Partial btree on `(booking_id, changed_at desc)`

## AI

### agent_templates

Columns:
- `id` UUID PK
- `template_key` text NOT NULL unique
- `name` text NOT NULL
- `description` text nullable
- `default_model` text nullable
- `default_system_prompt` text nullable
- `default_tools` jsonb NOT NULL default `'[]'`
- `template_config` jsonb NOT NULL default `'{}'`
- `is_active` boolean NOT NULL default true
- `created_at` timestamptz NOT NULL
- `updated_at` timestamptz NOT NULL
- `deleted_at` timestamptz nullable

Indexes:
- Unique btree on `template_key`

### ai_agents

Columns:
- `id` UUID PK
- `owner_user_id` UUID FK to `auth.users.id`
- `template_id` UUID FK to `agent_templates.id` nullable
- `name` text NOT NULL
- `slug` text NOT NULL unique
- `description` text nullable
- `provider_key` text nullable
- `model` text nullable
- `system_prompt` text nullable
- `configuration` jsonb NOT NULL default `'{}'`
- `is_active` boolean NOT NULL default true
- `archived_at` timestamptz nullable
- `created_at` timestamptz NOT NULL
- `updated_at` timestamptz NOT NULL
- `deleted_at` timestamptz nullable

Indexes:
- Unique btree on `slug`
- Btree on `owner_user_id`
- Btree on `template_id`

### agent_workflows

Columns:
- `id` UUID PK
- `owner_user_id` UUID FK to `auth.users.id`
- `workflow_key` text NOT NULL unique
- `name` text NOT NULL
- `description` text nullable
- `orchestration_type` text NOT NULL
- `workflow_config` jsonb NOT NULL default `'{}'`
- `is_active` boolean NOT NULL default true
- `created_at` timestamptz NOT NULL
- `updated_at` timestamptz NOT NULL
- `deleted_at` timestamptz nullable

### agent_workflow_steps

Columns:
- `id` UUID PK
- `workflow_id` UUID FK to `agent_workflows.id`
- `step_order` integer NOT NULL
- `step_key` text NOT NULL
- `agent_id` UUID FK to `ai_agents.id` nullable
- `template_id` UUID FK to `agent_templates.id` nullable
- `depends_on_step_id` UUID FK to `agent_workflow_steps.id` nullable
- `step_config` jsonb NOT NULL default `'{}'`
- `created_at` timestamptz NOT NULL
- `updated_at` timestamptz NOT NULL
- `deleted_at` timestamptz nullable

Constraints:
- Unique `(workflow_id, step_order)`

### agent_workflow_runs

Columns:
- `id` UUID PK
- `workflow_id` UUID FK to `agent_workflows.id`
- `root_conversation_id` UUID FK to `ai_conversations.id` nullable
- `status` text NOT NULL
- `input_payload` jsonb NOT NULL default `'{}'`
- `output_payload` jsonb NOT NULL default `'{}'`
- `started_at` timestamptz nullable
- `finished_at` timestamptz nullable
- `error_message` text nullable
- `created_at` timestamptz NOT NULL

### ai_conversations

Columns:
- `id` UUID PK
- `user_id` UUID FK to `auth.users.id`
- `agent_id` UUID FK to `ai_agents.id` nullable
- `workflow_run_id` UUID FK to `agent_workflow_runs.id` nullable
- `trip_id` UUID FK to `trips.id` nullable
- `title` text nullable
- `summary` text nullable
- `context` jsonb NOT NULL default `'{}'`
- `last_message_at` timestamptz nullable
- `created_at` timestamptz NOT NULL
- `updated_at` timestamptz NOT NULL
- `deleted_at` timestamptz nullable

Indexes:
- Btree on `user_id`
- Btree on `agent_id`
- Btree on `trip_id`
- Partial btree on `(user_id, last_message_at desc)`

### ai_messages

Columns:
- `id` UUID PK
- `conversation_id` UUID FK to `ai_conversations.id`
- `role` text NOT NULL
- `message_index` integer NOT NULL
- `content` text NOT NULL
- `content_format` text NOT NULL
- `token_count` integer nullable
- `metadata` jsonb NOT NULL default `'{}'`
- `created_at` timestamptz NOT NULL
- `updated_at` timestamptz NOT NULL
- `deleted_at` timestamptz nullable

Constraints:
- Unique `(conversation_id, message_index)`

Indexes:
- Btree on `conversation_id`

### ai_memory_items

Columns:
- `id` UUID PK
- `user_id` UUID FK to `auth.users.id`
- `agent_id` UUID FK to `ai_agents.id` nullable
- `conversation_id` UUID FK to `ai_conversations.id` nullable
- `memory_type` text NOT NULL
- `namespace` text NOT NULL
- `content` text NOT NULL
- `embedding` vector nullable
- `metadata` jsonb NOT NULL default `'{}'`
- `created_at` timestamptz NOT NULL
- `updated_at` timestamptz NOT NULL
- `deleted_at` timestamptz nullable

Indexes:
- Btree on `user_id`
- Btree on `agent_id`
- GIN on `metadata`
- Vector index on `embedding`

### ai_tasks

Columns:
- `id` UUID PK
- `user_id` UUID FK to `auth.users.id`
- `agent_id` UUID FK to `ai_agents.id` nullable
- `conversation_id` UUID FK to `ai_conversations.id` nullable
- `task_type` text NOT NULL
- `priority` integer NOT NULL default 0
- `status` text NOT NULL
- `input_payload` jsonb NOT NULL default `'{}'`
- `scheduled_at` timestamptz nullable
- `started_at` timestamptz nullable
- `finished_at` timestamptz nullable
- `retry_count` integer NOT NULL default 0
- `error_message` text nullable
- `created_at` timestamptz NOT NULL
- `updated_at` timestamptz NOT NULL
- `deleted_at` timestamptz nullable

Indexes:
- Btree on `(status, priority desc, scheduled_at)`
- Btree on `user_id`
- Btree on `agent_id`

### ai_execution_history

Columns:
- `id` UUID PK
- `task_id` UUID FK to `ai_tasks.id` nullable
- `agent_id` UUID FK to `ai_agents.id`
- `conversation_id` UUID FK to `ai_conversations.id` nullable
- `workflow_run_id` UUID FK to `agent_workflow_runs.id` nullable
- `execution_type` text NOT NULL
- `status` text NOT NULL
- `input_snapshot` jsonb NOT NULL default `'{}'`
- `output_snapshot` jsonb NOT NULL default `'{}'`
- `error_message` text nullable
- `latency_ms` integer nullable
- `started_at` timestamptz NOT NULL
- `finished_at` timestamptz nullable
- `created_at` timestamptz NOT NULL

Indexes:
- Btree on `task_id`
- Btree on `agent_id`
- Partial btree on `(agent_id, started_at desc)`

### tool_call_history

Columns:
- `id` UUID PK
- `agent_id` UUID FK to `ai_agents.id`
- `conversation_id` UUID FK to `ai_conversations.id` nullable
- `workflow_run_id` UUID FK to `agent_workflow_runs.id` nullable
- `task_id` UUID FK to `ai_tasks.id` nullable
- `provider_config_id` UUID FK to `provider_configs.id` nullable
- `tool_name` text NOT NULL
- `input_payload` jsonb NOT NULL default `'{}'`
- `output_payload` jsonb NOT NULL default `'{}'`
- `status` text NOT NULL
- `latency_ms` integer nullable
- `started_at` timestamptz NOT NULL
- `finished_at` timestamptz nullable
- `error_message` text nullable
- `created_at` timestamptz NOT NULL

Indexes:
- Btree on `agent_id`
- Btree on `provider_config_id`
- Partial btree on `(tool_name, started_at desc)`

### recommendation_history

Columns:
- `id` UUID PK
- `user_id` UUID FK to `auth.users.id`
- `agent_id` UUID FK to `ai_agents.id` nullable
- `conversation_id` UUID FK to `ai_conversations.id` nullable
- `source_entity_type` text NOT NULL
- `source_entity_id` UUID NOT NULL
- `recommendation_type` text NOT NULL
- `recommendation_payload` jsonb NOT NULL default `'{}'`
- `decision_status` text NOT NULL
- `decision_reason` text nullable
- `decided_at` timestamptz nullable
- `created_at` timestamptz NOT NULL

Indexes:
- Btree on `user_id`
- Btree on `agent_id`
- Partial btree on `(user_id, created_at desc)`

### ai_feedback

Columns:
- `id` UUID PK
- `user_id` UUID FK to `auth.users.id`
- `agent_id` UUID FK to `ai_agents.id` nullable
- `conversation_id` UUID FK to `ai_conversations.id` nullable
- `feedback_target_type` text NOT NULL
- `feedback_target_id` UUID nullable
- `rating_value` smallint nullable
- `sentiment` text NOT NULL
- `feedback_text` text nullable
- `metadata` jsonb NOT NULL default `'{}'`
- `created_at` timestamptz NOT NULL
- `updated_at` timestamptz NOT NULL
- `deleted_at` timestamptz nullable

Constraints:
- Check `rating_value` between 1 and 5 when present

## Social

### reviews

Columns:
- `id` UUID PK
- `user_id` UUID FK to `auth.users.id`
- `place_id` UUID FK to `places.id` nullable
- `hotel_id` UUID FK to `hotels.id` nullable
- `trip_id` UUID FK to `trips.id` nullable
- `booking_id` UUID FK to `bookings.id` nullable
- `rating_value` smallint NOT NULL
- `title` text nullable
- `body` text nullable
- `status` text NOT NULL
- `is_public` boolean NOT NULL default true
- `moderation_state` text NOT NULL default `'pending'`
- `created_at` timestamptz NOT NULL
- `updated_at` timestamptz NOT NULL
- `deleted_at` timestamptz nullable

Constraints:
- `rating_value` between 1 and 5
- At least one target FK must be populated

Indexes:
- Btree on `user_id`
- Btree on each target FK
- Partial btree on `(place_id, rating_value)` where `deleted_at is null`

### shared_trips

Columns:
- `id` UUID PK
- `trip_id` UUID FK to `trips.id` unique
- `owner_user_id` UUID FK to `auth.users.id`
- `access_level` text NOT NULL
- `share_token` text NOT NULL unique
- `is_public` boolean NOT NULL default false
- `expires_at` timestamptz nullable
- `created_at` timestamptz NOT NULL
- `updated_at` timestamptz NOT NULL
- `deleted_at` timestamptz nullable

Indexes:
- Unique btree on `trip_id`
- Unique btree on `share_token`

### shared_trip_invites

Columns:
- `id` UUID PK
- `shared_trip_id` UUID FK to `shared_trips.id`
- `invited_by_user_id` UUID FK to `auth.users.id`
- `invitee_email` text nullable
- `invitee_user_id` UUID FK to `auth.users.id` nullable
- `invite_token` text NOT NULL unique
- `status` text NOT NULL
- `sent_at` timestamptz nullable
- `accepted_at` timestamptz nullable
- `revoked_at` timestamptz nullable
- `created_at` timestamptz NOT NULL
- `updated_at` timestamptz NOT NULL
- `deleted_at` timestamptz nullable

Indexes:
- Btree on `shared_trip_id`
- Unique btree on `invite_token`

### shared_trip_members

Columns:
- `id` UUID PK
- `shared_trip_id` UUID FK to `shared_trips.id`
- `user_id` UUID FK to `auth.users.id`
- `permission_level` text NOT NULL
- `created_at` timestamptz NOT NULL
- `updated_at` timestamptz NOT NULL
- `deleted_at` timestamptz nullable

Constraints:
- Unique `(shared_trip_id, user_id)`

Indexes:
- Btree on `shared_trip_id`
- Btree on `user_id`

## System

### provider_configs

Columns:
- `id` UUID PK
- `provider_key` text NOT NULL unique
- `provider_category` text NOT NULL
- `display_name` text NOT NULL
- `environment` text NOT NULL
- `base_url` text nullable
- `docs_url` text nullable
- `enabled` boolean NOT NULL default true
- `config_metadata` jsonb NOT NULL default `'{}'`
- `rate_limit_policy` jsonb NOT NULL default `'{}'`
- `secret_vault_ref` text nullable
- `created_at` timestamptz NOT NULL
- `updated_at` timestamptz NOT NULL
- `deleted_at` timestamptz nullable

Constraints:
- No secrets may be stored in this table; only metadata and Vault references.

Indexes:
- Unique btree on `provider_key`
- Btree on `provider_category`

### notifications

Columns:
- `id` UUID PK
- `user_id` UUID FK to `auth.users.id`
- `notification_type` text NOT NULL
- `title` text NOT NULL
- `body` text NOT NULL
- `channel` text NOT NULL
- `action_url` text nullable
- `payload` jsonb NOT NULL default `'{}'`
- `read_at` timestamptz nullable
- `created_at` timestamptz NOT NULL
- `updated_at` timestamptz NOT NULL
- `deleted_at` timestamptz nullable

Indexes:
- Btree on `user_id`
- Partial btree on `(user_id, read_at)` where `deleted_at is null`

### notification_deliveries

Columns:
- `id` UUID PK
- `notification_id` UUID FK to `notifications.id`
- `user_id` UUID FK to `auth.users.id`
- `channel` text NOT NULL
- `delivery_status` text NOT NULL
- `provider_message_id` text nullable
- `sent_at` timestamptz nullable
- `delivered_at` timestamptz nullable
- `failed_at` timestamptz nullable
- `error_message` text nullable
- `created_at` timestamptz NOT NULL

Indexes:
- Btree on `notification_id`
- Btree on `user_id`
- Partial btree on `(delivery_status, created_at desc)`

### audit_log_entries

Columns:
- `id` UUID PK
- `actor_user_id` UUID FK to `auth.users.id` nullable
- `action` text NOT NULL
- `entity_schema` text NOT NULL
- `entity_table` text NOT NULL
- `entity_id` UUID nullable
- `before_state` jsonb nullable
- `after_state` jsonb nullable
- `request_id` text nullable
- `ip_address` inet nullable
- `user_agent` text nullable
- `created_at` timestamptz NOT NULL

Indexes:
- Btree on `actor_user_id`
- Btree on `(entity_schema, entity_table, entity_id)`
- Partial btree on `(created_at desc)`

### system_logs

Columns:
- `id` UUID PK
- `log_level` text NOT NULL
- `source_service` text NOT NULL
- `source_component` text nullable
- `message` text NOT NULL
- `context` jsonb NOT NULL default `'{}'`
- `correlation_id` text nullable
- `actor_user_id` UUID FK to `auth.users.id` nullable
- `created_at` timestamptz NOT NULL

Indexes:
- Btree on `log_level`
- Btree on `source_service`
- Partial btree on `(source_service, created_at desc)`

### analytics_events

Columns:
- `id` UUID PK
- `user_id` UUID FK to `auth.users.id` nullable
- `session_id` text nullable
- `event_name` text NOT NULL
- `entity_type` text nullable
- `entity_id` UUID nullable
- `properties` jsonb NOT NULL default `'{}'`
- `occurred_at` timestamptz NOT NULL
- `ingested_at` timestamptz NOT NULL

Indexes:
- Btree on `user_id`
- Btree on `(event_name, occurred_at desc)`
- GIN on `properties`

### analytics_daily_rollups

Columns:
- `id` UUID PK
- `rollup_date` date NOT NULL
- `metric_name` text NOT NULL
- `dimension_key` text NOT NULL
- `dimension_value` text nullable
- `metric_value` numeric(18,4) NOT NULL
- `created_at` timestamptz NOT NULL
- `updated_at` timestamptz NOT NULL

Constraints:
- Unique recommended on `(rollup_date, metric_name, dimension_key, dimension_value)`.

### admin_roles

Columns:
- `id` UUID PK
- `role_key` text NOT NULL unique
- `display_name` text NOT NULL
- `description` text nullable
- `created_at` timestamptz NOT NULL
- `updated_at` timestamptz NOT NULL
- `deleted_at` timestamptz nullable

### user_roles

Columns:
- `id` UUID PK
- `user_id` UUID FK to `auth.users.id`
- `role_id` UUID FK to `admin_roles.id`
- `assigned_by_user_id` UUID FK to `auth.users.id` nullable
- `assigned_at` timestamptz NOT NULL
- `revoked_at` timestamptz nullable
- `created_at` timestamptz NOT NULL
- `updated_at` timestamptz NOT NULL
- `deleted_at` timestamptz nullable

Constraints:
- Unique recommended on `(user_id, role_id)` for active assignments.

## Index Summary

Must-have index patterns:

- All foreign key columns.
- All natural keys such as ISO codes, slugs, usernames, provider keys, and share tokens.
- Partial indexes on active rows using `deleted_at is null`.
- Time-based indexes on feed, message, history, log, and analytics tables.
- Trigram indexes on human search fields such as names and titles.
- GIN indexes on JSONB filter columns.
- Vector index on `ai_memory_items.embedding` when pgvector is installed.

## Constraint Summary

Primary keys:
- Every application table above has a primary key.

Foreign keys:
- All relationships noted above should be enforced by foreign key constraints.

Unique constraints:
- ISO codes, slugs, usernames, provider keys, external IDs, share tokens, and `(conversation_id, message_index)` should be unique as noted.

Check constraints:
- Enforce code lengths, rating bounds, date ranges, amount positivity, and geographic bounds.

## Relationships Summary

- `profiles` is the one-to-one extension of `auth.users`.
- `trips` is the primary travel aggregate root.
- `places` is the normalized location layer.
- `airports`, `airlines`, and `hotels` are normalized master entities, not generic place overloads.
- `bookings` is the base booking supertype, with `flight_bookings` and `hotel_bookings` as subtypes.
- `itineraries` own `itinerary_days` and `itinerary_items`.
- `wishlists` own `wishlist_items`.
- `shared_trips` governs collaborator access to trips.
- `ai_agents`, `agent_templates`, and `agent_workflows` support multi-agent orchestration.
- `tool_call_history`, `recommendation_history`, and `ai_feedback` capture learning and audit signals.
- `provider_configs` stores metadata only; secrets remain in Supabase Vault.

## Phase Review

Phase 1 MVP tables:
- `countries`
- `currencies`
- `languages`
- `places`
- `airports`
- `airlines`
- `hotels`
- `expense_categories`
- `profiles`
- `linked_accounts`
- `user_sessions`
- `notification_preferences`
- `trips`
- `trip_destinations`
- `trip_budgets`
- `trip_expenses`
- `search_history`
- `wishlists`
- `wishlist_items`
- `emergency_contacts`
- `saved_places`
- `itineraries`
- `itinerary_days`
- `itinerary_items`
- `checklists`
- `checklist_items`
- `documents`
- `bookings`
- `flight_bookings`
- `hotel_bookings`
- `flight_segments`
- `agent_templates`
- `ai_agents`
- `ai_conversations`
- `ai_messages`
- `ai_tasks`
- `ai_execution_history`
- `tool_call_history`
- `notifications`
- `notification_deliveries`

Phase 2:
- `ai_memory_items`
- `agent_workflows`
- `agent_workflow_steps`
- `agent_workflow_runs`
- `recommendation_history`
- `ai_feedback`
- `shared_trips`
- `shared_trip_invites`
- `shared_trip_members`
- `booking_status_history`
- `provider_configs`
- `reviews`
- `audit_log_entries`
- `system_logs`

Phase 3:
- `analytics_events`
- `analytics_daily_rollups`
- `admin_roles`
- `user_roles`
- `profile_banners`

Future expansion:
- advanced geo/routing models
- enriched hotel amenities and room catalogs
- airline network/routing analytics
- first-class experimentation and feature flags

## Review Notes

- No unnecessary Phase 1 tables were added.
- `countries`, `currencies`, `languages`, `airports`, `airlines`, and `hotels` are normalized master data to eliminate repeated codes.
- `provider_configs` intentionally stores no secrets.
- Analytics and log tables should be partitioned once write volume justifies it.
- Polymorphic targets such as wishlist items and reviews should be enforced with check constraints and application-level validation.

If this review artifact is approved, the next step is to turn this design into phased SQL migrations.