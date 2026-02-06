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

2. Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local and add your API key
   ```

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

## Tech Stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS 4
- Recharts (for cost calculator visualization)
- Google GenAI (for AI consultant)
