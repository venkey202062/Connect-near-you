# Connect Near You — Production Setup

This repository contains the front-end product and the deployment/build automation. The production backend is designed for Supabase.

## Architecture

- React + TypeScript + Vite: web UI
- Capacitor: Android packaging
- Supabase: authentication, Postgres, storage, realtime
- PostGIS: distance/radius queries for nearby discovery
- GitHub Actions: cloud Android builds

## Production data

The SQL schema in `supabase/schema.sql` creates:

- profiles
- private profile locations
- profile photos
- likes
- matches
- conversations
- conversation members
- messages
- blocks
- reports
- a server-side nearby-user discovery function

RLS is enabled so users can only manage their own protected records, and discovery returns distance rather than exact coordinates.

## Required user actions before production integration

These cannot be completed safely from source code alone:

1. Create a Supabase production project.
2. Run `supabase/schema.sql` in that project.
3. Enable/configure the authentication methods we decide to ship (initially email/password; Google/Apple can be added after their provider setup).
4. Create the profile photo storage bucket and storage policies.
5. Provide the Supabase project URL and publishable key as environment/secrets.
6. Choose whether map tiles/geocoding will use Google Maps or another provider and create the relevant project/key.
7. Create the Google Play Console developer account for Android publishing.
8. Complete the app's legal text (Terms, Privacy Policy, Community/Safety Rules) and publisher/developer information before store submission.

Do not commit secret keys, service-role keys, Android signing keys, or production credentials to Git.

## Android builds

The workflow at `.github/workflows/android-build.yml` builds a debug APK on pushes to `production-build`. A production release workflow will be added only after the signing setup is available.

## Release gates

Before the first public release:

- real authentication tested
- profile creation/editing tested
- photo upload/removal tested
- location permission and location update tested
- nearby discovery and all filters tested
- likes/matches tested
- realtime messaging tested
- blocking/reporting tested
- notifications tested
- audio/video calls implemented and tested
- account deletion and data cleanup tested
- privacy/security review completed
- Android signed AAB produced
- Play Console declarations completed
- closed testing completed
