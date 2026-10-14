# GitScope

A modern GitHub profile exploration web application. Search any GitHub user, inspect their
profile and repositories, analyze developer statistics, and save favorites — all powered by the
official GitHub REST API.

![Stack](https://img.shields.io/badge/React-18-61dafb) ![Vite](https://img.shields.io/badge/Vite-5-646cff) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6) ![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8)

---

## Features

### GitHub User Search
- Search for any GitHub user by username.
- Real data fetched live from the GitHub REST API.
- Clear loading state while fetching.
- Helpful error messages for missing users, network failures, and API rate limits.

### User Profile
- Avatar, username, full name, and bio.
- Location, company, and personal website (when available).
- Public repository, follower, and following counts.
- Account creation date.
- Direct links to the user's GitHub profile and blog.

### Repository Explorer
- Full list of the user's public repositories.
- Name, description, primary language, stars, forks, and last update.
- Search repositories by name or description.
- Filter by programming language.
- Sort by stars, last updated, or name.
- "Load more" pagination.

### Developer Statistics
- Repository totals, total stars, forks, and open issues.
- Language distribution rendered as animated progress bars.
- Most-starred repositories highlighted.
- Latest repository activity based on push timestamps.
- A clear label indicating that all statistics are computed from the currently fetched data.

### Favorites
- Save favorite GitHub profiles to `localStorage`.
- Revisit or remove saved profiles from a slide-over panel.
- Friendly empty state when no favorites exist.

### User Experience
- Fully responsive (desktop, tablet, mobile).
- Dark mode and light mode with system-preference detection.
- Recent-search suggestions.
- Accessible forms, buttons, and ARIA labels.
- Smooth transitions and polished micro-interactions.

---

## Technology Stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Framework  | React 18                            |
| Build tool | Vite 5                              |
| Language   | TypeScript 5                        |
| Styling    | Tailwind CSS 3                      |
| Icons      | Lucide React                        |
| API        | GitHub REST API (unauthenticated)   |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ and npm.

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/gitscope.git
cd gitscope

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will open at `http://localhost:5173`.

### Other scripts

```bash
npm run build    # Type-check and produce a production build in dist/
npm run preview  # Preview the production build locally
npm run lint     # Run the TypeScript compiler in no-emit mode
```

---

## GitHub API Endpoints

GitScope uses the official GitHub REST API without authentication (subject to the standard
[rate limits](https://docs.github.com/rest/overview/rate-limits-for-the-rest-api)):

| Endpoint                              | Purpose                                  |
| ------------------------------------- | ---------------------------------------- |
| `GET /users/{username}`            | Fetch a user's public profile.           |
| `GET /users/{username}/repos`      | Fetch the user's public repositories.    |

All profile data and statistics are derived directly from these responses. No data is invented.

### Rate limiting

Unauthenticated requests are limited to 60 per hour per IP. When the limit is reached, GitScope
displays a graceful error message with the reset time. To raise the limit you may optionally set
a personal access token in a `.env` file (see below) — but it is **not required** for the app to
function.

---

## Project Structure

```
GitScope/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── tailwind.config.js
├── postcss.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── api/
    │   └── github.ts          # GitHub REST API client
    ├── components/
    │   ├── Header.tsx
    │   ├── SearchBar.tsx
    │   ├── ProfileCard.tsx
    │   ├── StatsPanel.tsx
    │   ├── RepoList.tsx
    │   ├── RepoCard.tsx
    │   ├── FavoritesPanel.tsx
    │   ├── Loading.tsx
    │   ├── ErrorState.tsx
    │   └── EmptyState.tsx
    ├── hooks/
    │   ├── useTheme.ts
    │   ├── useFavorites.ts
    │   ├── useDebounce.ts
    │   └── useProfileSearch.tsx
    ├── types/
    │   └── github.ts
    └── utils/
        ├── format.ts
        ├── languages.ts
        └── stats.ts
```

---

## Notes

- No personal access tokens or secrets are required or stored in the frontend.
- Favorites and theme preferences persist in `localStorage`.
- The app gracefully handles missing profile fields (e.g. no bio, no location).
