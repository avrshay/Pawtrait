# Pawtrait backend

## How to run

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm start
```

## Where the API runs

- **Port:** `3000`
- **Base URL:** `http://localhost:3000`
- **API base path:** `/` — the first thing to try is `GET http://localhost:3000/` (returns a short JSON welcome message).

## API reference

See **`docs/API.md`** for every route, headers, body fields, and example success and error JSON.

## Assumptions

- Data is **mock / in memory**. It **resets when you restart the server**.
- **IDs:** New users, products, orders, and cart lines get new numbers from the mock layer (usually max id + 1). Payment ids from `POST /payments/start` look like `BIT-<timestamp>`.
- **Login is simulated** with headers, not real tokens:
  - `x-user-role`: `admin`, `manager`, or `user`
  - `x-user-id`: a number when the route needs it (see `docs/API.md`)
