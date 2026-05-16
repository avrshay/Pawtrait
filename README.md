# Pawtrait backend

## Goal of the app

**Pawtrait** is an e-commerce API for custom pet products (mugs, bags, pillows, and similar items). Customers upload a photo of their pet, pick a product, and place an order. After payment is confirmed (mock **Bit** flow), the backend sends each line’s pet image to an **AI** step that fills in `aiDesignImageUrl` on the order item — the final design image for production.

This repo is **Assignment 2**: a Node.js + Express REST API with **mock data in memory** (no real database yet). A future frontend will call these same routes.

**Typical flow**

1. Register / log in (`/auth`)
2. Browse products (`/gallery`)
3. Add items to cart with `petImageUrl` (`/cart`)
4. Create an order (`/orders/:id`)
5. Start payment and complete webhook (`/payments`)
6. AI runs on paid orders; check line items for `aiDesignImageUrl`
7. Staff (`admin` / `manager`) can manage users, orders, and catalog

---

## Project structure

| Path | Role |
|------|------|
| **`server.js`** | Starts Express, loads middleware and routes, serves static images under `/models/images` |
| **`routes/`** | URL paths and HTTP methods; wires auth, validation, and controllers |
| **`controllers/`** | Request logic: read/write mock data, return JSON |
| **`models/`** | In-memory mock “database” (arrays and helper functions) |
| **`middleware/`** | Cross-cutting logic used on many routes |
| **`docs/`** | API reference (`API.md`), Postman collection, screenshots for submission |

### `routes/`

| File | Mount path | Purpose |
|------|------------|---------|
| `auth.js` | `/auth` | Register, login |
| `users.js` | `/users` | User CRUD and profile (role-protected) |
| `productsGallery.js` | `/gallery` | Product catalog (public read; admin write) |
| `cart.js` | `/cart` | Shopping cart per user |
| `orders.js` | `/orders` | Orders and line items |
| `paymentRoutes.js` | `/payments` | Bit-style payment start + webhook |

### `controllers/`

| File | Purpose |
|------|---------|
| `authController.js` | Register and login |
| `usersController.js` | List/get/create/update/delete users; update profile |
| `productsController.js` | Gallery products CRUD |
| `cartController.js` | Cart lines: get, add, update quantity, delete, clear |
| `ordersController.js` | Orders for a user, line items, checkout |
| `paymentController.js` | Start payment; webhook marks paid and triggers AI |
| `aiController.js` | Mock AI: sets `aiDesignImageUrl` on order items after payment (not a public route) |

### `models/`

| File | Purpose |
|------|---------|
| `usersMockData.js` | Users (roles: `user`, `manager`, `admin`) |
| `productsMockData.js` | Catalog products |
| `cartsMockData.js` | Carts and cart line items |
| `ordersMockData.js` | Order headers and line items (`petImageUrl`, `aiDesignImageUrl`) |
| `paymentData.js` | Pending/completed payments linked to `orderId` |

### `middleware/`

| File | Purpose |
|------|---------|
| `logger.js` | Logs method, URL, time, and status for every request |
| `auth.js` | Role checks (`x-user-role`, `x-user-id`) and cart owner header |
| `validate.js` | Body and param validation (e.g. ids, quantities, register/login) |
| `errorHandler.js` | `sendSuccess` / `sendError` — standard JSON response shape |

### `docs/`

| File | Purpose |
|------|---------|
| `API.md` | Full endpoint list with bodies and example JSON |
| `Pawtrait.postman_collection.json` | Import into Postman to test all routes |
| `screenshots/` | Postman success/error screenshots for the assignment zip |

---

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
- **API base path:** `/` — try `GET http://localhost:3000/` for a welcome JSON message.

## How to test

1. Start the server (see above).
2. In Postman: **Import** → `docs/Pawtrait.postman_collection.json` (uses `http://localhost:3000`).
3. For protected routes, set headers `x-user-role` and `x-user-id` as described in `docs/API.md`.
4. Save screenshots under `docs/screenshots/` for the assignment (one success per resource, one error example).

## API reference

See **`docs/API.md`** for every route, headers, body fields, and example success and error JSON.

## Assumptions

- Data is **mock / in memory**. It **resets when you restart the server**.
- **IDs:** New users, products, orders, and cart lines get new numbers from the mock layer (usually max id + 1). Payment ids from `POST /payments/start` look like `BIT-<timestamp>`.
- **Login is simulated** with headers, not real tokens:
  - `x-user-role`: `admin`, `manager`, or `user`
  - `x-user-id`: a number when the route needs it (see `docs/API.md`)
- **AI** runs only after `POST /payments/webhook` with `"status": "success"`. Until then, `aiDesignImageUrl` on order lines is `""`.
