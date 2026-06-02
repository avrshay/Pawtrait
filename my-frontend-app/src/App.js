import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";


//import the pages:
import Gallery from "./pages/Dashboard";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Checkout from "./pages/Checkout";
import Settings from "./pages/Settings";
import Users from "./pages/Users";
import UserDetails from "./pages/UserDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PersonalArea from "./pages/PersonalArea";
import NotFound from "./pages/NotFound";


export default function App() {
  return (
    <BrowserRouter>
      <Layout title="Pawtrait">
        <Routes> 
          <Route path="/"                   element={<Gallery />} />
          <Route path="/gallery/:productId" element={<ProductDetails />} />
          <Route path="/cart"               element={<Cart />} />
          <Route path="/orders"             element={<Orders />} />
          <Route path="/orders/:orderId"    element={<OrderDetails />} />
          <Route path="/checkout"           element={<Checkout />} />
          <Route path="/settings"            element={<Settings />} />
          <Route path="/admin/users"        element={<Users />} />
          <Route path="/admin/users/:id"    element={<UserDetails />} />
          <Route path="/login"              element={<Login />} />
          <Route path="/register"           element={<Register />} />
          <Route path="/personalArea"       element={<PersonalArea />} />
          <Route path="*"                   element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
