# Used Gravitrons

A digital archive of the Used Gravitrons zine, built with Deno and deployed on Vercel.

## Local Development

### Prerequisites
- [Deno](https://deno.land/) installed
- [Vercel CLI](https://vercel.com/cli) installed (optional, for `vercel dev`)
- [LaunchDarkly](https://launchdarkly.com) account (for feature flags)

### Running Locally

1. **Set up environment variables**:
   ```bash
   cp env.example .env
   # Edit .env with your LaunchDarkly SDK key
   ```

2. **Start the local development server**:
   ```bash
   deno run --allow-all local-dev.ts
   ```

The site will be available at `http://localhost:8000`

### Alternative: Vercel Dev (if working)

```bash
vercel dev
```

*Note: `vercel dev` may have issues with Deno type stripping. Use the local Deno server above for reliable development.*

## Deployment

### Automatic Deployment

- **Push to `main`** → Deploys to production
- **Push to `dev`** → Deploys to preview environment

No manual deployment steps needed - Vercel handles everything automatically!

### Manual Deployment (if needed)

```bash
vercel --prod
```

## Assets

Assets (images and PDFs) are served from Cloudflare R2 CDN at `https://cdn.usedgravitrons.com`.

- Images: `https://cdn.usedgravitrons.com/issue_01/images/01_page1.png`
- PDFs: `https://cdn.usedgravitrons.com/issue_01/pdfs/01.pdf`

## Project Structure

```
├── api/                 # Vercel serverless function
│   └── index.ts        # Main API handler
├── site/               # Site source code
│   ├── data.ts         # Data management
│   ├── templates.ts    # HTML templates
│   ├── types.ts        # TypeScript types
│   └── config.ts       # Asset URL configuration
├── local-dev.ts        # Local development server
└── vercel.json         # Vercel configuration
```

## Technology Stack

- **Runtime**: Deno
- **Deployment**: Vercel
- **Assets**: Cloudflare R2 + CDN
- **Feature Flags**: LaunchDarkly
- **Styling**: Vanilla CSS
- **Data**: JSON files with extracted content

## Development Notes

- The site uses extracted content from PDFs stored in `site/data/`
- Images and PDFs are served from R2 CDN for optimal performance
- Local development bypasses Vercel's dev server issues by using Deno directly
