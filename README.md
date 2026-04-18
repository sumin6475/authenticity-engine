# Authenticity Engine

A reflection app for saving captures (ideas or links): AI adds tags, summaries, and embeddings, then surfaces similar notes and identity-style insights.

## Stack

- **Frontend:** React, Vite, Tailwind CSS  
- **Backend:** Node.js, Express, Mongoose  
- **Database:** MongoDB Atlas + Vector Search  
- **AI:** OpenAI (`gpt-4o-mini`, `text-embedding-3-small`) — Responses API + Zod structured output  

## Prerequisites

- Node.js 18+ recommended  
- MongoDB Atlas cluster and connection string  
- OpenAI API key  

## Local setup

```bash
git clone https://github.com/sumin6475/authenticity-engine.git
cd authenticity-engine
```

**Server** (`server/`)

```bash
cd server
npm install
```

Example `server/.env`:

```env
MONGODB_URI=mongodb+srv://...
OPENAI_API_KEY=sk-...
# Optional; defaults to 5000 — must match client VITE_API_BASE
PORT=5000
```

```bash
npm start
```

**Client** (`client/`, second terminal)

```bash
cd client
npm install
```

`client/.env` or `.env.local`:

```env
# No trailing slash; same origin as the API server
VITE_API_BASE=http://localhost:5000
```

```bash
npm run dev
```

## MongoDB Atlas — Vector Search

Create a Vector Search index on the `captures` collection named **`vector_index`** (must match the code).

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 1536,
      "similarity": "cosine"
    }
  ]
}
```

## Deploy notes

- **Frontend** (e.g. Vercel): set `VITE_API_BASE` to your public API origin at build time.  
- **Backend / DB** (e.g. Railway): set `MONGODB_URI`, `OPENAI_API_KEY`, and `PORT` in the host environment.  

## Repo layout

```
authenticity-engine/
├── client/    # Vite + React
└── server/    # Express + Mongoose + OpenAI
```
