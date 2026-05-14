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

Or:

```bash
node server.js
```

## Where the API runs

- **Port:** `3000`
- **Base URL:** `http://localhost:3000`
- **API base path:** `/` — the first thing to try is `GET http://localhost:3000/` (returns a short JSON welcome message).

## How to test

1. Start the server (see above).
2. In Postman: **Import** → choose `docs/Pawtrait.postman_collection.json`.
3. The collection already uses `http://localhost:3000` as `baseUrl`. You can change it in the collection variables if you use another host or port.

For the assignment, save **screenshots** of Postman (at least one success per resource and one error) into `docs/screenshots/` before you zip the project.

## API reference

See **`docs/API.md`** for every route, headers, body fields, and example success and error JSON.

## Assumptions

- Data is **mock / in memory**. It **resets when you restart the server**.
- **IDs:** New users, products, orders, and cart lines get new numbers from the mock layer (usually max id + 1). Payment ids from `POST /payments/start` look like `BIT-<timestamp>`.
- **Login is simulated** with headers, not real tokens:
  - `x-user-role`: `admin`, `manager`, or `user`
  - `x-user-id`: a number when the route needs it (see `docs/API.md`)
