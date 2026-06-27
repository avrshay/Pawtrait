import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SocketProvider } from "./context/SocketContext";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";


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
    <SocketProvider>
    <BrowserRouter>
      <Layout title="Pawtrait">
        <Routes> 
          <Route path="/"                   element={<Gallery />} />
          <Route path="/gallery/:productId" element={<ProductDetails />} />
          <Route path="/cart"               element={<RequireAuth><Cart /></RequireAuth>} />
          <Route path="/checkout"           element={<RequireAuth><Checkout /></RequireAuth>} />
          <Route path="/settings"           element={<RequireAuth><Settings /></RequireAuth>} />
          <Route path="/admin/users/new"    element={<RequireAuth><AddUser /></RequireAuth>} />
          <Route path="/admin/users/:id"    element={<RequireAuth><EditUser /></RequireAuth>} />
          <Route path="/login"              element={<Login />} />
          <Route path="/admin"              element={<RequireAuth><Admin /></RequireAuth>} />
          <Route path="/manager"            element={<RequireAuth><Admin /></RequireAuth>} />
          <Route path="/register"           element={<Register />} />
          <Route path="/personal-area"      element={<RequireAuth><PersonalArea /></RequireAuth>} />
          <Route path="/admin/orders/:orderId" element={<RequireAuth><EditOrder/></RequireAuth>} />
          <Route path="/admin/products/new" element={<RequireAuth><AddProduct /></RequireAuth>} />
          <Route path="/admin/products/:productId" element={<RequireAuth><EditProduct /></RequireAuth>} />
          <Route path="*"                   element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
    </SocketProvider>
  );
}
