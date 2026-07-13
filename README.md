# Event Explorer

A full-stack event discovery application built with a modern TypeScript stack. Users can search for live events powered by the Ticketmaster Discovery API, view event details, and save events of interest to a personal list backed by a PostgreSQL database.

This project is actively in development and serves as a practical exploration of a production-relevant stack including Express, Drizzle ORM, Zod, React, and Vite.

---

The app is deployed and running. Date: 2026.07.13
App Frontend: [Event Explorer](https://eventexplorer.scarletwingscreative.com/)
Application backend is running on [Railway](https://railway.com/) cloud platform.

---

## Architecture

```
Ticketmaster Discovery API
        ↓
Express REST API (Node.js / TypeScript)
  - Zod schema validation
  - Drizzle ORM → PostgreSQL
        ↓
React + Vite Frontend (TypeScript)
  - wouter client-side routing
  - Tailwind CSS
```

---

## Tech Stack

### Backend
- **Express** — REST API framework
- **PostgreSQL** — relational database for persistent event storage
- **Drizzle ORM** — type-safe database queries and schema management
- **Zod** — runtime schema validation with TypeScript type inference
- **TypeScript** — end-to-end type safety
- **tsx + nodemon** — development server with hot reload

### Frontend
- **React 19** — component-based UI
- **Vite** — fast development server and build tool
- **wouter** — lightweight client-side routing
- **Tailwind CSS** — utility-first styling
- **TypeScript** — typed components and API responses
- **axios** — HTTP client for API calls

### External API
- **Ticketmaster Discovery API** — live event data including venue, pricing, images, and ticket links

---

## Features

- Search events by keyword and city
- Browse results as responsive cards with event images, dates, venue, and pricing
- Save events to a personal list persisted in PostgreSQL
- Remove saved events
- View saved events on a dedicated page
- Direct links to purchase tickets on Ticketmaster

---

## Project Structure

```
event-explorer/
  server/
    src/
      db/
        index.ts        — PostgreSQL connection pool via Drizzle
        schema.ts       — Drizzle table definitions (events, saved_events)
      routes/
        events.ts       — Search, save, retrieve, and delete event endpoints
      schemas/          — Zod validation schemas
      index.ts          — Express app entry point
    drizzle/            — Generated SQL migration files
    drizzle.config.ts   — Drizzle Kit configuration
  client/
    src/
      pages/
        SearchPage.tsx  — Event search interface
        SavedPage.tsx   — Saved events list
      components/       — Reusable UI components
      services/
        api.ts          — Typed API call functions
      types/
        event.ts        — TypeScript interfaces for event data
      App.tsx           — Root component with routing and nav
```

---

## Local Setup

### Prerequisites
- Node.js 20+
- PostgreSQL 14+
- Ticketmaster Developer API key — register free at [developer.ticketmaster.com](https://developer.ticketmaster.com)

### 1. Clone the repo

```bash
git clone https://github.com/matt-turan/event-explorer.git
cd event-explorer
```

### 2. Set up the server

```bash
cd server
npm install
```

Create a `.env` file in `server/`:

```
PORT=3001
TICKETMASTER_API_KEY=your_ticketmaster_key_here
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/eventexplorer
```

Create the database:

```bash
psql -U postgres -c "CREATE DATABASE eventexplorer;"
```

Run migrations:

```bash
npm run db:generate
npm run db:migrate
```

Start the server:

```bash
npm run dev
```

Server runs at `http://localhost:3001`

### 3. Set up the client

```bash
cd ../client
npm install
npm run dev
```

Client runs at `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events/search?keyword=&city=` | Search events via Ticketmaster |
| POST | `/api/events/save` | Save an event to PostgreSQL |
| GET | `/api/events/saved` | Retrieve all saved events |
| DELETE | `/api/events/saved/:id` | Remove a saved event |

---

## Health Check

```
GET http://localhost:3001/health
```

---

## Roadmap

- [ ] Prevent duplicate event saves
- [ ] Pagination for search results
- [ ] Event detail page with full information
- [ ] Search by geolocation
- [ ] Filter by category and date range
- [ ] Stripe integration for ticket purchase flow
- [ ] User authentication

---

## Notes

- The Ticketmaster API free tier has rate limits — avoid rapid repeated searches during development
- The Vite dev server proxies `/api` requests to `localhost:3001`, so both servers must be running during development
- Database migrations are managed by Drizzle Kit — run `npm run db:generate` after any schema changes, then `npm run db:migrate` to apply
