import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";


//import the pages:
import Gallery from "./pages/Dashboard";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PersonalArea from "./pages/PersonalArea";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import EditUser from "./pages/EditUser";
import AddUser from "./pages/AddUser";
import EditOrder from "./pages/EditOrder";
import EditProduct from "./pages/EditProduct";
import AddProduct from "./pages/AddProduct";

export default function App() {
  return (
    <BrowserRouter>
      <Layout title="Pawtrait">
        <Routes> 
          <Route path="/"                   element={<Gallery />} />
          <Route path="/gallery/:productId" element={<ProductDetails />} />
          <Route path="/cart"               element={<Cart />} />      
          <Route path="/checkout"           element={<Checkout />} />
          <Route path="/settings"           element={<Settings />} />
          <Route path="/admin/users/new"    element={<AddUser />} />
          <Route path="/admin/users/:id"    element={<EditUser />} />
          <Route path="/login"              element={<Login />} />
          <Route path="/admin"              element={<Admin />} />
          <Route path="/register"           element={<Register />} />
          <Route path="/personalArea"       element={<PersonalArea />} />
          <Route path="/admin/orders/:orderId" element={<EditOrder/>} />
          <Route path="/admin/products/new" element={<AddProduct />} />
          <Route path="/admin/products/:productId" element={<EditProduct />} />
          <Route path="*"                   element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
