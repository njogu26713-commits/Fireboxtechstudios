# FireboxTechStudios Website

A premium full-stack company website and CMS for **FireboxTechStudios** — a software company specializing in AI, web development, mobile apps, cybersecurity, cloud computing, DevOps, and more.

## Architecture

This is a **pnpm monorepo** with two runnable artifacts:

| Artifact | Description | Dev command |
|---|---|---|
| `artifacts/firebox-website` | React + Vite public website + admin CMS | `pnpm --filter @workspace/firebox-website run dev` |
| `artifacts/api-server` | Express.js REST API | `pnpm --filter @workspace/api-server run dev` |

### Shared Libraries

| Package | Purpose |
|---|---|
| `lib/db` | Mongoose models + MongoDB connection |
| `lib/api-zod` | Zod validation schemas (generated from OpenAPI spec) |
| `lib/api-spec` | OpenAPI spec (`openapi.yaml`) |
| `lib/api-client-react` | React Query hooks (generated from OpenAPI spec) |

## Database: MongoDB

The API server uses **MongoDB via Mongoose**. You must set the `MONGODB_URI` secret (Replit Secrets) to a valid MongoDB connection string (e.g. MongoDB Atlas free tier).

Collections: services, projects, tutorials, blogposts, reviews, contactmessages, quoterequests, newslettersubscriptions, sitesettings, teammembers, faqitems, trustedclients, jobs.

## Running Locally

Both workflows are managed by Replit. The API server starts at `:8080/api` and the website at port defined by the `PORT` env var.

## Regenerating the API Client

If you change `lib/api-spec/openapi.yaml`, regenerate the client:

```bash
pnpm --filter @workspace/api-spec run generate
```

## User Preferences

- Use MongoDB (not PostgreSQL) for the database layer.
