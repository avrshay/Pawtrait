# Pawtrait

## Project Purpose

**Pawtrait** is an e-commerce platform for custom pet products (mugs, tote bags, pillows, baseball caps, and similar items). Customers upload a photo of their pet, choose a product, and place an order. After payment is confirmed (mock **Bit** flow), a step fills in a finished design image for each order line (`aiDesignImageUrl`) - **this step is currently mocked** ([`backend/src/controllers/aiController.js`](backend/src/controllers/aiController.js) just reuses the product's existing image or builds a placeholder URL; no real image-generation model runs). The separate **AI chat assistant** described below is real and does call a live model - see [AI Feature](#ai-feature).

The repo is split into two apps:

| App | Stack | Folder |
|-----|-------|--------|
| Backend | Node.js + Express + Sequelize (MySQL) + Socket.IO | [`backend/`](backend/) |
| Frontend | React (Create React App) | [`frontend/`](frontend/) |

See [`backend/README.md`](backend/README.md) and [`frontend/README.md`](frontend/README.md) for app-specific details (project structure tables, screens, test accounts). This root README focuses on getting the whole stack running end-to-end and the cross-cutting features (DB, AI, WebSocket).

---

## Installation Instructions

You need **two terminals** - one for the backend, one for the frontend. Backend must be started first (and a database must exist - see [Database Setup](#database-setup)).

### 1. Backend
```bash
cd backend
npm install
npm start
```
Runs at **http://localhost:3000**.

### 2. Frontend
```bash
cd frontend
npm install
npm start
```
Runs at **http://localhost:5173** and talks to the backend at `http://localhost:3000` (hardcoded in [`frontend/src/services/api.js`](frontend/src/services/api.js) and [`frontend/src/context/SocketContext.js`](frontend/src/context/SocketContext.js)).

### Test accounts
| Role    | Email            | Password  |
|---------|------------------|-----------|
| Admin   | dan1@gmail.com   | Dan123    |
| Manager | shani2@gmail.com | Shani123  |
| User    | gal3@gmail.com   | gal123    |

(These come from the seeders - see below. If you haven't seeded the DB yet, register a new account instead.)

---

## Database Setup

The backend uses **MySQL** via Sequelize. You need a MySQL server running locally (MySQL Community Server, XAMPP, Docker, etc. - anything that listens on port `3306`).

1. **Create the database** (name must match `DB_NAME` in your `.env`, see below):
   ```sql
   CREATE DATABASE pawtrait;
   ```
2. **Run migrations** (creates all tables):
   ```bash
   cd backend
   npx sequelize-cli db:migrate
   ```
3. **Seed sample data** (optional, but recommended - creates the 3 test accounts above, sample products, orders, and carts):
   ```bash
   npx sequelize-cli db:seed:all
   ```
   Seeder files live in [`backend/seeders/`](backend/seeders/) and are numbered (`01-`, `02-`, ...) because they must run in that exact order - later seeders reference rows created by earlier ones via foreign keys (e.g. carts need users to already exist).

If you ever change a migration file *after* it has already run, you must `db:migrate:undo` it (and anything that depends on it, in reverse order) before re-running `db:migrate` - editing the file alone does not change the live table.

---

## Environment Variables

Copy [`backend/.env.example`](backend/.env.example) to `backend/.env` and fill in your real MySQL password (`backend/.env` is git-ignored, so it's never committed):

```bash
cd backend
cp .env.example .env
```

| Variable | Required | Used in | Purpose |
|----------|----------|---------|---------|
| `DB_HOST` | Yes | [`backend/config/config.js`](backend/config/config.js) | MySQL host |
| `DB_USER` | Yes | same | MySQL username |
| `DB_PASSWORD` | Yes | same | MySQL password |
| `DB_NAME` | Yes | same | Database name (must already exist - see above) |
| `OLLAMA_URL` | No (has a default) | [`backend/src/chat/aiAgent.js`](backend/src/chat/aiAgent.js) | Local Ollama chat endpoint |
| `OLLAMA_MODEL` | No (has a default) | same | Which local model to use for the AI chat |

---

## ORM Setup

The backend uses **Sequelize** as its ORM over MySQL.

- **Models**: [`backend/models/`](backend/models/) - one file per table (`user.js`, `product.js`, `order.js`, `orderitem.js`, `cart.js`, `cartitem.js`). [`backend/models/index.js`](backend/models/index.js) auto-loads every file in that folder that exports a `(sequelize, DataTypes) => Model` function, builds the Sequelize connection from `backend/config/config.js`, and wires up associations.
- **Migrations**: [`backend/migrations/`](backend/migrations/) - the actual table definitions (columns, types, foreign keys). These are the source of truth for the database schema; the models must match them (Sequelize does **not** check this for you - a mismatch fails at query time, not at startup).
- **Seeders**: [`backend/seeders/`](backend/seeders/) - sample data, see [Database Setup](#database-setup).
- **Config**: [`backend/config/config.js`](backend/config/config.js) reads `.env` via `dotenv` and exports the `development` connection settings that both `sequelize-cli` and `backend/models/index.js` use.

`backend/models/paymentData.js` is **not** a Sequelize model - it's a plain in-memory array used to mock the Bit payment flow (no real payments are stored). `backend/models/index.js` explicitly skips it when auto-loading models.

---

## API Endpoints

All responses use this envelope (Assignment 2 format):
```json
// success
{ "success": true, "data": {}, "error": null }

// error
{ "success": false, "data": null, "error": { "code": "ERROR_CODE", "message": "...", "details": {} } }
```

| Mount path | Routes file | Purpose |
|------------|-------------|---------|
| `/auth` | [`routes/auth.js`](backend/src/routes/auth.js) | Register, login |
| `/users` | [`routes/users.js`](backend/src/routes/users.js) | User CRUD, profile (role-protected) |
| `/gallery` | [`routes/productsGallery.js`](backend/src/routes/productsGallery.js) | Product catalog (public read, admin/manager write) |
| `/cart` | [`routes/cart.js`](backend/src/routes/cart.js) | Shopping cart per user |
| `/orders` | [`routes/orders.js`](backend/src/routes/orders.js) | Orders and line items |
| `/payments` | [`routes/paymentRoutes.js`](backend/src/routes/paymentRoutes.js) | Mock Bit payment start + webhook |
| `/upload` | [`routes/petImageUpload.js`](backend/src/routes/petImageUpload.js) | Save an uploaded pet photo, returns a usable URL |
| `/chat` | [`routes/chat.js`](backend/src/routes/chat.js) | AI chat (see [AI Feature](#ai-feature)) |

Full request/response examples (bodies, headers, status codes) are in [`backend/docs/API.md`](backend/docs/API.md), with a ready-to-import [`backend/docs/pawtrait API.postman_collection.json`](backend/docs/) collection.

**Auth model**: there's no real token/session system. Protected routes read plain headers:
- `x-user-role`: `admin` | `manager` | `user`
- `x-user-id`: numeric id, required by routes that need to know "whose data is this" (cart, orders, etc.)

The frontend sends these automatically (see `frontend/src/services/api.js`) based on whatever was returned from `/auth/login` and stored in `localStorage`.

---

## WebSocket Feature

Live human support chat runs over **Socket.IO**, set up in [`backend/src/chat/socketHandler.js`](backend/src/chat/socketHandler.js) and initialized from [`backend/src/server.js`](backend/src/server.js) alongside the Express app (same HTTP server, different protocol).

- A customer connects with `?role=user`; a staff member connects with `?role=manager` (see [`frontend/src/context/SocketContext.js`](frontend/src/context/SocketContext.js)).
- While chatting with the **AI**, no socket traffic is involved - that part goes over plain REST (`POST /chat/message`, see below). The socket is only used for the **human handoff** path:
  1. Customer clicks "Talk to the manager" → emits `human_handoff` with their AI conversation so far.
  2. Every connected manager sees it appear under "Pending Requests" (broadcast to a `manager_room`).
  3. A manager clicks "Accept" → emits `handoff_accepted`; from then on, `sendMessage` events are relayed directly between that customer's socket and that manager.
  4. If the customer's socket disconnects (closes the tab, or logs out - see below), the server emits `client_disconnected` so the manager's UI shows "The customer has left the chat."
- **On login/logout**, the frontend deliberately disconnects and reconnects the socket (see [`frontend/src/components/ChatBot.js`](frontend/src/components/ChatBot.js)) so each browser session/user starts a clean chat and the manager is correctly notified if a previous customer's session ends.

### Socket event listeners

| Event | Listened by | Role |
|-------|-------------|------|
| `human_handoff` | Manager | Customer asked to talk to a human; adds the request to "Pending Requests" with their AI chat history so far |
| `handoff_accepted` | Customer | A manager accepted the request; switches the customer's chat into live "human" mode |
| `sendMessage` | Customer & Manager | Relays a single chat message between the two sides once a handoff has been accepted |
| `typing` | Customer & Manager | Shows/hides the "typing..." indicator on the other side |
| `joined_room` | Manager | Confirms to the manager that they're now paired with a specific customer's chat room |
| `client_disconnected` | Manager | The customer's socket dropped (tab closed or logged out); shown as "The customer has left the chat" |

---

## AI Feature

The chatbot ("Paw Assistant") is implemented as a required **AI API endpoint**: `POST /chat/message` ([`backend/src/controllers/chatController.js`](backend/src/controllers/chatController.js)), which the frontend calls like any other REST endpoint - the AI provider is never exposed to the browser.

- **Model**: a **local [Ollama](https://ollama.com/)** server (`http://localhost:11434` by default). [`backend/src/chat/aiAgent.js`](backend/src/chat/aiAgent.js) calls Ollama's `/api/chat` endpoint directly with `fetch`.
  - **You must have Ollama installed and running locally**, with the model pulled (`ollama pull llama3.2`, or whatever you set `OLLAMA_MODEL` to), for this feature to work. If Ollama isn't running, `/chat/message` returns a `502 AI_PROVIDER_ERROR`.
- **Context injection (RAG-lite)**: rather than hoping the model "knows" about Pawtrait, the controller builds real context from the database before every call:
  - **Always**: the current product catalog (name + price for every product).
  - **When the request includes a `userId`** (i.e. the customer is logged in): that user's current cart contents and order history.
  
  This is why asking the bot "what do you sell?" or "what's in my cart?" gets accurate, current answers instead of guesses.
- **Conversation memory**: kept in-memory per `sessionId` (generated client-side, stored in `sessionStorage`) - `conversations` in `chatController.js`. **Resets when the backend restarts**, same as everything else in this app that isn't in the DB.

---

## Known Limitations

- **The per-order "AI design" is mocked, not generated.** `aiDesignImageUrl` is set by [`backend/src/controllers/aiController.js`](backend/src/controllers/aiController.js) to either the product's existing `custom_product_image_url` or a placeholder path - no model actually processes the uploaded pet photo. Don't confuse this with the AI chat assistant below, which does call a real local model.
- **No real authentication.** `x-user-id` / `x-user-role` are plain, unsigned headers - anyone can call the API with any id/role using curl/Postman. Fine for a course assignment, not production-safe.
- **AI chat context trusts the client.** The `userId` sent to `/chat/message` is not verified against any session - a malicious client could pass another user's id and get their cart/order context back. Same trust model as the rest of the API (see above), just worth knowing.
- **Chat history is in-memory.** Both the AI conversation history (`chatController.js`) and the live Socket.IO room state (`socketHandler.js`) reset whenever the backend restarts. There's no persistence to the database for chat.
- **Payments are mocked.** `POST /payments/start` / `POST /payments/webhook` simulate a Bit-style flow in memory (`backend/models/paymentData.js`) - no real payment gateway is integrated, and payment records aren't persisted to the DB.
- **Ollama is a hard dependency for the AI feature.** There's no fallback if it isn't installed/running - the chat will return a clear error, but won't degrade gracefully to a canned response.
- **Hardcoded ports/URLs.** Backend is always `:3000`, frontend dev server `:5173`, and CORS in `backend/src/server.js` only allows that exact origin. Running on different ports requires editing the code (no env-based config for this yet).
- **Migrations and models can drift.** Sequelize does not validate that a model's fields match the actual table columns at startup - a mismatch (e.g. a renamed column) only surfaces as a runtime SQL error the first time that field is queried. If you add a column, update both the migration **and** the model.
