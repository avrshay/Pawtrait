import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";


//import the pages:
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


export default function App() {
  return (
    <BrowserRouter>
      <Layout> //the layout component
        <Routes> 
          <Route path="/"                   element={<Gallery />} /> //the home page
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
      </Layout>
    </BrowserRouter>
  );
}
