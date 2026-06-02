# CareCircle Hub

A private family health management app for organizing medicines, readings, and everyday care notes.

## Problem Statement

Families often coordinate medicine schedules, BP or sugar readings, and care updates across messages, notebooks, and memory. CareCircle Hub gives one household a shared place to track the basics without turning the experience into a clinical system.

## Target Users

- Families caring for parents, children, or relatives at home
- Caregivers who need a simple daily medicine board
- Households that want a shared health timeline for basic readings and medicine actions

## V0.1 Features

- Email/password signup and login with Supabase Auth
- Create one Family Hub per signed-in user
- Add family members with basic profile details
- Add active medicines for each member
- View Today's Care Board
- Mark medicines as taken or skipped
- Log BP or sugar readings
- View a member Health Timeline with medicine logs and vitals
- Logout from the dashboard

V0.1 intentionally does not include AI, OCR, charts, document upload, reports, payments, or advanced notifications.

## Tech Stack

- React Native
- Expo
- TypeScript
- Expo Router
- Supabase Auth
- Supabase PostgreSQL
- `@supabase/supabase-js`
- Simple React Native `StyleSheet` styling

## App Flow

1. User opens the app.
2. `app/index.tsx` checks the Supabase session.
3. Logged-out users go to login.
4. Logged-in users without a family go to Create Family Hub.
5. Logged-in users with a family go to Today's Care Board.
6. From the dashboard, users can add members, add medicines, log readings, mark medicine actions, and open member timelines.

## Database Schema

The SQL schema lives in `supabase/schema.sql`.

- `families`: stores one hub owned by the authenticated user through `created_by`
- `family_members`: stores people connected to a family
- `medicines`: stores active medicine schedule items for members
- `medicine_logs`: stores taken/skipped medicine events
- `vitals`: stores BP, sugar, and future simple reading types

Row Level Security is enabled on every table. V0.1 policies allow users to create and manage their own families, and to access members, medicines, logs, and vitals only when those records belong to a family they created.

## Setup Instructions

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment template:

   ```bash
   cp .env.example .env
   ```

3. Fill in `.env`:

   ```bash
   EXPO_PUBLIC_SUPABASE_URL=your-project-url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. In Supabase, open SQL Editor and run:

   ```sql
   -- Paste the contents of supabase/schema.sql
   ```

5. Make sure email/password auth is enabled in Supabase Authentication settings.

6. Start the app:

   ```bash
   npm run start
   ```

7. Run a type check:

   ```bash
   npm run typecheck
   ```

## Future Scope

- Invite multiple family caregivers to the same hub
- Better medicine scheduling by time of day
- Reminder notifications
- Edit/delete flows for members, medicines, readings, and logs
- Timeline filters
- Charts for readings
- Doctor visit notes and report storage
- Exportable care summaries

## Safety Note

CareCircle Hub is not a medical diagnosis or treatment tool. It only helps families organize medicines, readings, and health notes. Always follow advice from qualified healthcare professionals.
