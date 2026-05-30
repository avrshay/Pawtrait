import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Gallery from "./pages/Gallery";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import Users from "./pages/Users";
import UserDetails from "./pages/UserDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// App shell: sidebar on the left, routed page content on the right.
// Each route maps to a backend resource (see the service files in ./services).
export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/"                   element={<Gallery />} />
          <Route path="/gallery/:productId" element={<ProductDetails />} />
          <Route path="/cart"               element={<Cart />} />
          <Route path="/orders"             element={<Orders />} />
          <Route path="/orders/:orderId"    element={<OrderDetails />} />
          <Route path="/checkout"           element={<Checkout />} />
          <Route path="/profile"            element={<Profile />} />
          <Route path="/admin/users"        element={<Users />} />
          <Route path="/admin/users/:id"    element={<UserDetails />} />
          <Route path="/login"              element={<Login />} />
          <Route path="/register"           element={<Register />} />
          <Route path="*"                   element={<NotFound />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
