# Shadi Khata - Wedding Event Management System

A production-ready Next.js application for managing wedding events, families, and guest invitations.

## Features

### Core Features
- **Authentication**: Email + password signup/login with NextAuth
- **Dashboard**: Overview of events, families, and total guests
- **Events Module**: Create, edit, and delete wedding events (Mehndi, Barat, Walima, etc.)
- **Families Module**: Manage guest families with contact information
- **Invitations Module**: Map families to events with specific guest counts

### Bonus Features
- **Search**: Search families by name or contact person
- **Filter**: Filter invitations by event
- **Export**: Download guest list as CSV for any event
- **Dark Mode**: Toggle between light and dark themes

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (local) / PostgreSQL (production)
- **ORM**: Prisma
- **Authentication**: NextAuth (Auth.js)
- **Validation**: Zod
- **Forms**: React Hook Form

## Project Structure

```
shadi-khata/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data
├── src/
│   ├── app/
│   │   ├── (auth)/        # Auth pages (login, register)
│   │   ├── (dashboard)/   # Protected pages
│   │   │   ├── dashboard/
│   │   │   ├── events/
│   │   │   ├── families/
│   │   │   └── invitations/
│   │   ├── api/auth/      # NextAuth API route
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx       # Landing page
│   ├── actions/           # Server actions
│   │   ├── auth.ts
│   │   ├── dashboard.ts
│   │   ├── events.ts
│   │   ├── families.ts
│   │   └── invitations.ts
│   ├── components/
│   │   ├── forms/         # Form components
│   │   ├── layout/        # Layout components
│   │   └── ui/            # Reusable UI components
│   ├── lib/
│   │   ├── auth.ts        # NextAuth configuration
│   │   ├── db.ts          # Prisma client
│   │   ├── utils.ts       # Utility functions
│   │   └── validations.ts # Zod schemas
│   ├── middleware.ts      # Route protection
│   └── types/
│       └── next-auth.d.ts # Type augmentation
├── .env                   # Environment variables
├── .env.example           # Example env file
├── postcss.config.mjs     # PostCSS config for Tailwind
├── tsconfig.json
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd shadi-khata
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and set:
- `DATABASE_URL`: SQLite path or PostgreSQL connection string
- `AUTH_SECRET`: A secure random string for NextAuth
- `AUTH_URL`: Your app URL (http://localhost:3000 for local)

4. Set up the database:
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Seed with demo data
npm run db:seed
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Credentials

After running the seed script:
- **Email**: demo@example.com
- **Password**: demo123

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Create migration |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed database with demo data |

## Database Schema

### User
- id, email, password, name, createdAt, updatedAt

### Event
- id, name, date, notes, userId, createdAt, updatedAt

### Family
- id, name, contactPerson, phone, userId, createdAt, updatedAt

### Invitation
- id, eventId, familyId, persons, createdAt, updatedAt
- Unique constraint on (eventId, familyId)

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Set environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `AUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `AUTH_URL`: Your Vercel deployment URL

### Using PostgreSQL

Update `.env`:
```
DATABASE_URL="postgresql://user:password@host:5432/shadi_khata?schema=public"
```

Then run:
```bash
npm run db:push
```

## License

MIT
