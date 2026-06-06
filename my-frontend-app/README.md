# Pawtrait – Frontend

## Getting Started

### Install dependencies
```bash
npm install
```

### Start the development server
```bash
npm start
```

The app will open at **http://localhost:5173** in your browser.

> The frontend communicates with the backend API at **http://localhost:3000**.  
> Make sure the backend server is running before using the app.

---

## Test Accounts

Use these credentials to log in and test different roles:

| Role    | Email            | Password  |
|---------|------------------|-----------|
| Admin   | dan1@gmail.com   | Dan123    |
| Manager | shani2@gmail.com | Shani123  |
| User    | gal3@gmail.com   | gal123    |

### Role Permissions
- **Admin** – Full access: view, edit, delete, and add users, products, and orders.
- **Manager** – Same as Admin but **cannot delete** users, products, or orders.
- **User** – Can browse the gallery, add to cart, checkout, and view personal order history.

---

## Available Scripts

| Command         | Description                              |
|-----------------|------------------------------------------|
| `npm install`   | Install all dependencies                 |
| `npm start`     | Run the app in development mode          |

---

## Project Structure

```
src/
├── components/   # Reusable UI components (Navbar, Footer, Table, etc.)
├── pages/        # Page components (Login, Register, Dashboard, Cart, etc.)
└── services/     # API service functions (auth, orders, cart, etc.)
```
