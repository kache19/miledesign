<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# MILEDESIGNS Design & Build

A modern design and build consultation platform with AI-powered features.

## Run Locally

**Prerequisites:** Node.js 18+

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set environment variables in `.env.local`:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local and add your keys
   ```
   - `GEMINI_API_KEY` for AI consultant features
   - `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for contact form database submissions

3. Create the Supabase table used by the contact form:
   ```sql
   create table if not exists public.contact_inquiries (
     id uuid primary key default gen_random_uuid(),
     first_name text not null,
     last_name text not null,
     email text not null,
     phone text not null,
     service_type text not null,
     budget_range text not null,
     timeline text not null,
     message text not null,
     created_at timestamptz not null default now()
   );

   alter table public.contact_inquiries enable row level security;

   create policy "Allow public inserts for contact inquiries"
   on public.contact_inquiries
   for insert
   to anon
   with check (true);
   ```

4. Run the app:
   ```bash
   npm run dev
   ```

5. Open http://localhost:3000 in your browser

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Deploy with Docker

**Prerequisites:** Docker & Docker Compose

1. Build and start the container:
   ```bash
   docker-compose up -d --build
   ```

2. Access the app at http://localhost:3000

3. To stop:
   ```bash
   docker-compose down
   ```

## Deploy to GitHub Pages

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to GitHub Pages:
   ```bash
   npm run deploy
   ```

**Note:** The base path is configured as `/miledesign/` for GitHub Pages deployment.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key for AI features | Yes |
| `VITE_SUPABASE_URL` | Supabase project URL | Yes (for DB submissions) |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key | Yes (for DB submissions) |

## Tech Stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS 4
- Recharts (for cost calculator visualization)
- Google GenAI (for AI consultant)
