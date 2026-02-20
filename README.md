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
   - `VITE_APP_BASE` for asset base path (`/` for Docker/custom hosting, `/miledesign/` for GitHub Pages)
   - `VITE_ENABLE_ADMIN` to show/hide admin portal (`false` recommended for production)
   - `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for auth + content storage
   - `VITE_INQUIRY_EMAIL` for contact form email submissions

3. Run the app:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000 in your browser

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Deploy with Docker

**Prerequisites:** Docker & Docker Compose

1. Build and start the container:
   ```bash
   docker compose up -d --build
   ```

2. Access the app at http://localhost:3000

3. To stop:
   ```bash
   docker compose down
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

**Note:** set `VITE_APP_BASE=/miledesign/` before building for GitHub Pages.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key for AI features | Optional |
| `VITE_APP_BASE` | Base path for built assets (`/` or `/miledesign/`) | Yes |
| `VITE_ENABLE_ADMIN` | Enables browser admin portal (disable in production) | Yes |
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon public key | Yes |
| `VITE_INQUIRY_EMAIL` | Default email recipient for inquiry form submissions (can be updated in Admin Portal > Contact) | Yes |
| `VITE_INQUIRY_WHATSAPP_NUMBER` | Default WhatsApp number for inquiry submissions and floating WhatsApp action (can be updated in Admin Portal > Contact) | Yes |

## Runtime Config Fallback (Static Hosts)

If your host blocks scoped environment variables, you can set runtime values in `public/runtime-config.js`:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `ENABLE_ADMIN`
- `INQUIRY_EMAIL`
- `INQUIRY_WHATSAPP_NUMBER`

## Supabase Setup (Production Secure)

1. In Supabase SQL Editor, run:
   ```sql
   -- from file
   supabase/schema.sql
   ```

2. In Supabase Auth, create admin user(s) with email/password.

3. Add each admin auth user to `public.admin_users`:
   ```sql
   insert into public.admin_users (user_id, display_name, is_active)
   values ('AUTH_USER_UUID_HERE', 'Site Administrator', true);
   ```

4. Set `VITE_ENABLE_ADMIN=true` only after the steps above are completed.

## Tech Stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS 4
- Recharts (for cost calculator visualization)
- Google GenAI (for AI consultant)
