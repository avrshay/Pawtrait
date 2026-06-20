# API reference

Base URL: `http://localhost:3000`

There are no query-string parameters on the routes below.

All JSON responses use this shape:

**Success**

```json
{
  "success": true,
  "data": { },
  "error": null
}
```

**Error**

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Human readable message",
    "details": { }
  }
}
```

---

## Simulated login (headers)

Many routes need headers:

| Header | When |
|--------|------|
| `x-user-role` | One of: `admin`, `manager`, `user` |
| `x-user-id` | A number. Required for `authorizeSelf` routes when role is `user`, and for all `/cart` routes |

If the role is not allowed, you get **403** and the error format above with `"code": "FORBIDDEN"`.

---

## Root

| Method | Path | Query | Body | Notes |
|--------|------|-------|------|-------|
| GET | `/` | none | none | Welcome JSON |

---

## Auth

No headers.

| Method | Path | Query | Body |
|--------|------|-------|------|
| POST | `/auth/register` | none | `firstName`, `lastName`, `email`, `phone_number`, `password` (password at least 6 characters) |
| POST | `/auth/login` | none | `email`, `password` |

---

## Users

Headers: `x-user-role` (and `x-user-id` when role is `user` and the route checks “self”).

| Method | Path | Who | Body |
|--------|------|-----|------|
| GET | `/users` | `admin`, `manager` | none |
| GET | `/users/:id` | `admin`, `manager`, or `user` with same id | none |
| POST | `/users` | `admin`, `manager` | `firstName`, `lastName`, `userRole` (`user` \| `manager` \| `admin`) |
| PUT | `/users/:id` | `admin`, `manager` | `firstName`, `lastName`, `userRole` (`user` \| `manager` \| `admin`) |
| PUT | `/users/profile/:id` | `admin`, `manager`, or `user` with same id |`firstName`, `lastName`, 'email', `phone_number`|
| DELETE | `/users/:id` | `admin` only | none |

---

## Orders

Headers: `x-user-role`, and `x-user-id` when role is `user` (must match `:id` where `authorizeSelf` is used).

| Method | Path | Who | Body |
|--------|------|-----|------|
| GET | `/orders` | `admin`, `manager` | none |
| GET | `/orders/:id` | `user` (self), `admin`, `manager` | none |
| GET | `/orders/:id/:orderId` | `user` (self), `admin`, `manager` | none |
| POST | `/orders/:id` | same | `items`: array of `{ "productId": number, "quantity" or "amount": number, "petImageUrl": string }` |
| PUT | `/orders/:id/:orderId` | `admin`, `manager` | optional: `userId`, `status`, `createDate` (merged with existing order; `status` must stay non-empty) |
| DELETE | `/orders/:id/:orderId` | `admin`, `manager` | none |

---

## Cart

Headers: `x-user-role`, `x-user-id` (see `requireCartUserIdHeader` in code: for `user`, id must exist in the users mock).

| Method | Path | Body |
|--------|------|------|
| GET | `/cart` | none |
| POST | `/cart` | `productId`, `quantity`, `petImageUrl` |
| PUT | `/cart/:item_id` | `quantity` |
| DELETE | `/cart/:item_id` | none |
| DELETE | `/cart/clear` | none |

---

## Gallery (products)

Public read. Write routes need `x-user-role`: `admin`.

| Method | Path | Body |
|--------|------|------|
| GET | `/gallery` | none |
| GET | `/gallery/:product_id` | none |
| POST | `/gallery` | `name`, `original_pet_image_url`, `custom_product_image_url`, `price` |
| PUT | `/gallery/:product_id` | same fields as POST |
| DELETE | `/gallery/:product_id` | none |

---

## Payments

No auth headers.

| Method | Path | Body |
|--------|------|------|
| POST | `/payments/start` | `userId`, `totalAmount`, `orderId` (order must belong to that user) |
| POST | `/payments/webhook` | `paymentId` (required), optional `status` — on `success`, AI runs for that payment’s order line items (`aiDesignImageUrl` starts empty) |

---

## Static files

| Method | Path | Notes |
|--------|------|-------|
| GET | `/models/images/...` | Files under `models/images` |

---

## Example success (GET `gallery/1`)

{
    "success": true,
    "data": {
        "product_id": 1,
        "name": "designed_cup",
        "original_pet_image_url": "http://localhost:3000/images/clients/dog1-original.jpg",
        "custom_product_image_url": "http://localhost:3000/images/catalog/products/cup-design-dog1.png",
        "price": 50
    },
    "error": null
}

## Example error (GET `gallery/8`)

{
    "success": false,
    "data": null,
    "error": {
        "code": "BAD_REQUEST",
        "message": "invalid product_id",
        "details": {
            "field": "product_id"
        }
    }
}
