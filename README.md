# LearnHub

LearnHub is a course platform built with Next.js and Supabase. Students can browse a course catalog, enroll in courses, track their progress, and leave reviews. Admins manage the course and instructor catalog through a dedicated admin panel. Instructors are catalog-only profiles (no login) shown as course authors.

## Tech stack

- **Framework:** Next.js (App Router, Server Components, Server Actions)
- **Language:** TypeScript
- **Database & Auth:** Supabase (Postgres, Row Level Security, Supabase Auth)
- **Styling:** Plain CSS with a small design token system (no CSS framework)
- **Validation:** Zod, used on every Server Action that accepts user input

## Features

- Public course catalog with search, category and level filters
- Course detail pages with instructor info, average rating and reviews
- Student registration and login (Supabase Auth)
- Enrollment, progress tracking, and unenrollment
- A beginner-level nudge when a student enrolls in a course above their stated skill level
- Course reviews (1–5 stars + comment), restricted to enrolled students, one review per student per course
- Admin panel (separate `admins` table, not tied to students or instructors) for creating, editing and deleting courses and instructors
- Defense-in-depth authorization: every privileged action is checked both in the Next.js Server Action (UI-level) and enforced again by Postgres Row Level Security (database-level), so the database stays safe even if a request bypasses the UI entirely

## Architecture overview

### Roles

The platform has three distinct account types, kept intentionally separate:

- **Students** — the only role that can register and log in through the public site. Students enroll in courses, track progress, and leave reviews.
- **Instructors** — catalog data only. Instructors have no login and no `auth.users` account; they exist purely as authors displayed on course and instructor pages. They are managed entirely by admins.
- **Admins** — a separate `admins` table, linked to `auth.users` by `user_uuid`. Admin accounts are created manually in Supabase (there is no public admin sign-up), and only admins can create, edit or delete courses and instructors.

This separation was a deliberate design decision: instructors "maintain the platform" conceptually, but do not need platform access, while admins are the only accounts trusted with catalog management. Keeping the three roles in separate tables (rather than a single `role` column) makes the Row Level Security policies simpler to reason about and avoids one account accidentally gaining permissions meant for another role.

### Authorization model

Every privileged Server Action checks the current user's role server-side before doing anything (e.g. `requireAdmin()` in `lib/admin.ts`). This is a UX-level guard — it prevents an unauthorized page or button from ever rendering.

The real security boundary is Postgres Row Level Security (RLS), enabled on every table. Each RLS policy re-checks the same authorization logic directly in the database (for example, an `insert` policy on `courses` that checks `exists (select 1 from admins where user_uuid = auth.uid())`). This means that even a request sent directly to the Supabase REST API, bypassing the Next.js app entirely, is still rejected by the database if the caller isn't authorized. Neither layer alone is sufficient — the Server Action checks make for a clean UI, and RLS makes the authorization actually enforceable.

### Data flow

- `lib/catalog.ts` — all read/write functions for courses, instructors, enrollments and reviews. This is the single place that talks to Supabase for catalog data.
- `lib/admin.ts` — resolves the currently logged-in user's role (admin or student) server-side.
- `lib/validation.ts` — Zod schemas for every form. Every Server Action validates `FormData` against a schema before touching the database, independent of any client-side form validation.
- `actions/*.ts` — Server Actions (`"use server"`), one file per concern (`auth`, `enroll`, `admin-courses`, `admin-instructors`, `reviews`). These are the only place that mutate data.
- `app/**/page.tsx` — Server Components that fetch data via `lib/catalog.ts` and render it. Interactive pieces (forms with client-side state) are separate `"use client"` components.

## Database schema

Tables (Supabase / Postgres):

- **students** — `id`, `user_uuid` (FK to `auth.users`), `full_name`, `country`, `skill_level`, timestamps
- **instructors** — `id`, `slug`, `full_name`, `email`, `specialty`, `status`, `short_bio`, `bio`, timestamps (no `user_uuid` — instructors cannot log in)
- **admins** — `id`, `user_uuid` (FK to `auth.users`), `full_name`, `email`, `created_at`
- **courses** — `id`, `slug`, `title`, `category`, `level`, `status` (`draft`/`published`), `price`, `duration`, `description`, `short_description`, `instructor_id` (FK to `instructors`), timestamps
- **enrollments** — `id`, `student_id` (FK), `course_id` (FK), `progress_percent`, `enrolled_at`
- **reviews** — `id`, `student_id` (FK), `course_id` (FK), `rating` (1–5), `comment`, `created_at`, unique on `(student_id, course_id)`

A Postgres trigger (`handle_new_student`) fires on every new `auth.users` row and automatically creates a matching `students` row, using metadata passed at sign-up (`full_name`, `country`, `skill_level`). Admin accounts are created manually and are not affected by this trigger (the admin's auto-created student row is deleted as part of the manual admin setup).

A view, `student_public_profiles`, exposes only `id` and `full_name` from the `students` table. It exists so that review authors' names can be shown publicly on course pages without exposing the rest of a student's row (country, skill level, etc.) to other users, since the base `students` table's Row Level Security only allows a student to read their own row.

### Row Level Security summary

- `courses`, `instructors`: public `select`; `insert`/`update`/`delete` restricted to admins
- `students`: a student can only `select`/`update` their own row
- `enrollments`: a student can only `select`/`insert`/`update`/`delete` rows belonging to their own `student_id`
- `reviews`: public `select`; `insert` requires the student to be enrolled in the course being reviewed; `update`/`delete` restricted to the review's own author
- `admins`: a user can only `select` their own row

## Known limitations

- Email changes rely on Supabase's built-in mailer, which has sending restrictions without a custom SMTP provider configured. Name and password changes work without this limitation.
- There is no automated test suite or CI pipeline yet.
- Instructor and admin accounts are provisioned manually through the Supabase dashboard; there is no self-service sign-up for either role, by design.

## Project structure

```
app/                    Routes (Next.js App Router)
  admin/                Admin-only pages (courses, instructors)
  courses/              Public course catalog and detail pages
  instructors/          Public instructor catalog and detail pages
  my-courses/           Student's enrolled courses
  login/, register/     Auth pages
actions/                Server Actions (all data mutations)
components/             Shared and admin UI components
lib/                    Data access (catalog.ts), validation, auth helpers
utils/supabase/         Supabase client setup
```

## Getting started

### Prerequisites

- Node.js 18+
- A Supabase project (free tier is enough)

### Setup

1. Clone the repository and install dependencies:

   ```
   npm install
   ```

2. Copy the environment file and fill in your Supabase project's URL and publishable key (found in your Supabase project's API settings):

   ```
   cp .env.example .env.local
   ```

3. Set up the database: run the SQL migrations in your Supabase project's SQL editor to create the tables, trigger, view, and RLS policies described above (see `Database schema`).

4. Create an admin account manually:
   - In Supabase Studio, go to **Authentication → Users → Add user**, create a user, and check "Auto Confirm User".
   - Copy the generated user UUID.
   - Run in the SQL editor:
     ```sql
     delete from students where user_uuid = 'PASTE_UUID_HERE';
     insert into admins (user_uuid, full_name, email)
     values ('PASTE_UUID_HERE', 'Admin Name', 'admin@example.com');
     ```

5. Run the app locally:

   ```
   npm run dev
   ```

6. Open `http://localhost:3000`.
