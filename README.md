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

---

## About the App

**Pawtrait** is an e-commerce platform for personalized pet products. Users can upload a photo of their pet and receive AI-generated designs printed on merchandise.

---

## Screens Overview

### Public
| Screen | Path | Description |
|--------|------|-------------|
| Login | `/login` | Email + password login |
| Register | `/register` | Create a new user account |

### User (logged in)
| Screen | Path | Description |
|--------|------|-------------|
| Dashboard / Gallery | `/` | Browse available products |
| Product Details | `/products/:id` | View product info and add to cart |
| Cart | `/cart` | Review items before purchase |
| Checkout | `/checkout` | Complete the order |
| Personal Area | `/personal-area` | View past orders and their items |
| Profile Settings | `/settings` | Edit name, email, and phone number |

### Admin / Manager
| Screen | Path | Description |
|--------|------|-------------|
| Admin Panel | `/admin` | Manage all users, products, and orders |
| Add Product | `/admin/products/add` | Create a new product |
| Edit Product | `/admin/products/edit/:id` | Update product details |
| Add User | `/admin/users/add` | Create a new user |
| Edit User | `/admin/users/edit/:id` | Update user details |
| Edit Order | `/admin/orders/edit/:id` | Update order status |
