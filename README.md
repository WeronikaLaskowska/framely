# Framely 🎬

A cinematic movie-guessing game in the spirit of **VEIL** — dark, modern, and
full of motion. Built with Next.js (App Router), React 19 and Tailwind v4, using
**TheMovieDB** as the data source. Only films released in **1980 or later** are
ever drawn.

## Games

1. **Spotle — Guess the movie** (`/games/guess-movie`)
   A secret film is drawn each round. Name any movie to compare it against the
   target across six attributes — **genre, year, box office, rating, studio,
   cast**. Each cell lights up:
   - 🟩 **green** — exact match
   - 🟨 **amber** — close (overlapping genres/cast, near year/rating/revenue)
   - ⬜ **grey** — cold
   - **↑ / ↓** arrows on year, box office and rating point toward the target.
   You get 8 guesses.

2. **Poster — Name the artwork** (`/games/poster`)
   A poster hidden behind a grid of frosted tiles. Every wrong guess clears more
   fragments. Three difficulties (**easy / medium / hard**) change the tile
   count and number of guesses.

The landing page (`/`) features an animated TV (`public/animations/tv.json`)
inside a glowing CRT frame, and links into the game-selection screen (`/games`).

## Setup

```bash
# 1. Add your TheMovieDB v3 API key
cp .env.local.example .env.local
#   then edit .env.local and set TMDB_API_KEY=...

# 2. Install + run
npm install
npm run dev
```

Open http://localhost:3000.

> Get a free TMDB v3 key at https://www.themoviedb.org/settings/api

## How the secret stays secret

There is no database. When a round starts, the server picks a target movie and
returns a **signed token** (HMAC over the movie id, see `lib/token.ts`) — never
the title or facts. Each guess sends the token back; the server verifies the
signature, fetches both movies, compares them (`lib/compare.ts`) and returns
only the coloured result. The target's full details are revealed solely on a win
or a give-up.

## Project layout

```
app/
  page.tsx                 Landing page
  games/                   Selection + the two games
  api/
    movies/search          Title autocomplete
    games/guess/*          Spotle: start + guess
    games/poster/*         Poster: start + guess
features/
  landing/                 Hero (TV), how-it-works, previews, CTA
  games/                   MovieSearch, result banner, both game UIs
lib/
  tmdb.ts                  Server-only TMDB client (>= 1980)
  compare.ts               Pure guess-comparison logic
  token.ts                 Signed target tokens
  format.ts  cn.ts  games.ts  types.ts
```

This product uses the TMDB API but is not endorsed or certified by TheMovieDB.
