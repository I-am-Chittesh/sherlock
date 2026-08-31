# Sherlocked: Digital Evidence & Hypothesis Engine

A brutalist, real-time investigation war room built to map multi-variable evidence clusters, calculate dynamic hypothesis probabilities, and maintain an immutable audit matrix. Designed with a flat, high-contrast aesthetic.

## System Architecture

* **Frontend:** Vue 3 (Composition API) + Vite + Tailwind CSS
* **Canvas Engine:** Vue Flow (Node/Edge Mapping)
* **Backend:** Express.js (REST API) + Node.js
* **Database:** Supabase (PostgreSQL) + Edge Auth
* **Deployment:** Vercel (Serverless Functions + Static Build)

## Core Engine Mechanics

1. **The War Room Canvas:** A visual pinboard where evidence nodes are injected and linked via parent-child relational edges.
2. **Probability Engine:** A mathematical backend script that recalculates competing hypothesis scores live based on the shifting status weights of linked evidence (Pending, Verified, Debunked).
3. **Admin Overseer:** An immutable, polling terminal matrix tracking every database mutation (node creation, status overrides, theory injections) by role.

## Local Deployment (VS Code)

Requires Node.js 18+ and a local or hosted Supabase instance.

### 1. Environment Configuration
Create a `.env` file in the root directory:
```env
SUPABASE_URL=your_project_url
SUPABASE_ANON_KEY=your_anon_key
PORT=3000