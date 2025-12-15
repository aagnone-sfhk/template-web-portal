# Web Portal Template

A modern, full-featured admin dashboard template built with Next.js 15, featuring AI chat capabilities, database integration, and a clean UI.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Auth**: Simple username/password (cookie-based)
- **Database**: [PostgreSQL](https://www.postgresql.org) with [Drizzle ORM](https://orm.drizzle.team)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Components**: [Shadcn UI](https://ui.shadcn.com)
- **AI Chat**: Claude models via Heroku AI inference

## Features

- 📊 Dashboard with customizable stats and activity feeds
- 💬 AI Chat assistant with multiple model support
- 📋 Generic items list view with pagination and search
- 🔐 Simple username/password authentication
- 🎨 Clean, responsive UI with dark mode support
- 🔧 MCP (Model Context Protocol) server integration

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL database
- Auth credentials (AUTH_USERNAME/AUTH_PASSWORD env vars)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd template-web-portal

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your values

# Run development server
pnpm dev
```

Visit http://localhost:3000 to see your app.

## Environment Variables

### Required

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `INFERENCE_URL` | AI inference endpoint URL |
| `INFERENCE_KEY` | API key for AI inference |
| `INFERENCE_MODEL_ID` | Model ID to use for inference |

### UI Configuration (Optional)

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_APP_TITLE` | "Admin Portal" | Application title |
| `NEXT_PUBLIC_APP_DESCRIPTION` | "Your intelligent AI assistant" | App description |
| `NEXT_PUBLIC_LOGO` | "/af.png" | Logo image path |
| `NEXT_PUBLIC_AVATAR` | "/af.png" | Chat avatar path |

### Salesforce AgentForce (Optional)

If you want to use Salesforce AgentForce integration:

| Variable | Description |
|----------|-------------|
| `SF_MY_DOMAIN_URL` | Your Salesforce My Domain URL |
| `SF_CONSUMER_KEY` | Connected App consumer key |
| `SF_CONSUMER_SECRET` | Connected App consumer secret |
| `SF_AGENT_ID` | Einstein Agent ID |

### External Links (Optional)

Configure up to 3 external links to display in the dashboard:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_EXTERNAL_LINK_1_URL` | URL for first external link |
| `NEXT_PUBLIC_EXTERNAL_LINK_1_LABEL` | Label for first external link |
| `NEXT_PUBLIC_EXTERNAL_LINK_2_URL` | URL for second external link |
| `NEXT_PUBLIC_EXTERNAL_LINK_2_LABEL` | Label for second external link |
| `NEXT_PUBLIC_EXTERNAL_LINK_3_URL` | URL for third external link |
| `NEXT_PUBLIC_EXTERNAL_LINK_3_LABEL` | Label for third external link |

## Customization

### Database Schema

The template includes a generic `items` table in `lib/db.ts`. To customize:

1. Edit the schema in `lib/db.ts`
2. Update the types and queries as needed
3. Create your database tables to match

Example schema:

```typescript
export const items = pgTable('items', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  description: text('description'),
  status: varchar('status', { length: 50 }).default('active'),
  website: varchar('website', { length: 255 }),
  imageUrl: varchar('image_url', { length: 255 }),
  isDeleted: boolean('is_deleted').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

### Adding New Pages

1. Create a new directory in `app/(dashboard)/`
2. Add a `page.tsx` file
3. Update navigation in `app/(dashboard)/layout.tsx`

### Theming

Customize colors in `tailwind.config.ts`. The template includes Heroku brand colors but can be easily modified.

## Project Structure

```
├── app/
│   ├── (dashboard)/        # Dashboard routes
│   │   ├── chat/           # AI chat page
│   │   ├── items/          # Items list page
│   │   └── layout.tsx      # Dashboard layout
│   ├── api/                # API routes
│   │   ├── heroku-mia/     # AI chat endpoint
│   │   └── mcp-servers/    # MCP server endpoint
│   ├── chat/               # Chat components and logic
│   └── config/             # Environment configuration
├── components/
│   └── ui/                 # Shadcn UI components
├── constants/              # App constants (agents, etc.)
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities and database
└── types/                  # TypeScript types
```

## Deployment

### Heroku

```bash
# Create app
heroku create your-app-name

# Add PostgreSQL
heroku addons:create heroku-postgresql:essential-0

# Set config vars
heroku config:set INFERENCE_URL=<your-url>
heroku config:set INFERENCE_KEY=<your-key>
# ... other env vars

# Deploy
git push heroku main
```

## License

MIT
