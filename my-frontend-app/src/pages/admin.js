import { useEffect, useState } from "react";
import Table from "../components/Table";
import { getAllUsers,deleteUser } from "../services/usersService";
import { getAllOrders, getOrderItems,deleteOrder } from "../services/ordersService";
import { getAllProducts } from "../services/galleryService";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/authService";
import { deleteProduct } from "../services/galleryService";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [itemsError, setItemsError] = useState("");
  const CurrUser = getCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
       try {
        setLoadingOrders(true);
        setOrdersError("");
      const [users, orders, products] = await Promise.all([
        getAllUsers(),
        getAllOrders(),
        getAllProducts(),
      ]);
      setUsers(users || []);
      setOrders(orders || []);
      setProducts(products || []);
      } 
      catch (err) {
        setOrdersError(err.message);
      } finally {
        setLoadingOrders(false);
      }
    }

    loadData();
    }, []);

    // Load items when order is selected
    async function handleLoadItems(userId,orderId) {
        try {
          setLoadingItems(true);
          setItemsError("");
          setSelectedOrderId(orderId);
          setItems([]); // clean state

          const data = await getOrderItems(userId, orderId);
          setItems(data||[]);
    
        } catch (err) {
          setItemsError(err.message);
        } finally {
          setLoadingItems(false);
        }
    }
    
  // delete user (admin only)
    async function handleDeleteUser(userId) {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");

    if (!confirmDelete) return;

    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.userId !== userId));
    } catch (err) {
      alert(err.message);
    }
  }
  // delete order (admin only)
  async function handleDeleteOrder(orderId) {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this order?"
  );

  if (!confirmDelete) return;

  try {
    await deleteOrder(orderId);

    setOrders((prev) =>prev.filter((o) => o.orderId !== orderId));
    setSelectedOrderId(null);
    setItems([]);
  } catch (err) {
    alert(err.message);
  }
}
  // delete product (admin only)
async function handleDeleteProduct(productId) {
  const confirmDelete = window.confirm("Delete this product?");

  if (!confirmDelete) return;

  try {
    await deleteProduct(productId);

    setProducts((prev) =>
      prev.filter((p) => p.productId !== productId)
    );
  } catch (err) {
    alert(err.message);
  }
}


  return (
    <section>
    <h1>
      {CurrUser?.userRole === "admin" ? "Admin Dashboard" : "Manager Dashboard"}
    </h1>
    {/* users table */}
      <h2>Users</h2>
        <button onClick={() => navigate("/admin/users/new")}>
          + Add User
        </button>
      <Table
        data={users}
        columns={["userId","firstName", "lastName", "email","phone_number", "userRole"]}
        renderActions={(user) => (
          <>
            <button onClick={() => navigate(`/admin/users/${user.userId}`)}>
              Edit
            </button>
            {CurrUser?.userRole === "admin" && (
            <button onClick={() => handleDeleteUser(user.userId)}>
              Delete
            </button>
            )}
          </>
        )}
      />

      {/* orders table  */}
      <h2>Orders</h2>

      {loadingOrders && <p>Loading orders...</p>}
      {ordersError && (<p style={{ color: "red" }}>{ordersError}</p>)}
      {itemsError && (<p style={{ color: "red" }}>{itemsError}</p>)}
      <Table
        data={orders}
        columns={["orderId", "status", "createDate"]}
        renderActions={(order) => ( <>
          <button onClick={() => handleLoadItems(order.userId,order.orderId)}>
            View Items
          </button>
          <button onClick={() => navigate(`/admin/orders/${order.orderId}`)}>
            Edit
          </button>
        {CurrUser.userRole === "admin" && (
          <button onClick={() => handleDeleteOrder(order.userId,order.orderId)}>
            Delete
          </button>
        )}
        </>
        )}
      />

      {/* items table */}
      
      {selectedOrderId && (
        <>
          <h3>Order #{selectedOrderId} Items</h3>
          {loadingItems && <p>Loading items...</p>}

          <Table
            data={items.map((line) => ({
              ...line,
              pet: line.petImageUrl ? (
                <img
                  src={line.petImageUrl}
                  style={{ width: 80 }}
                />
              ) : (
                "—"
              ),
              aiDesign: line.aiDesignImageUrl ? (
                    <img
                      src={line.aiDesignImageUrl}
                      style={{ width: 80 }}
                    />
                  ) : (
                    "—"
                  ),
            }))}
            columns={["productId", "quantity", "pet", "aiDesign"]}
          />
        </>
      )}

      {/* products table  */}
      <h2>Products</h2>

        <button onClick={() => navigate("/admin/products/new")}>
          + Add Product
        </button>

      <Table
        data={products}
        columns={["productId", "name","original image","custom product", "price"]}
        renderActions={(product) => (
          <>
            <button
              onClick={() =>
                navigate(`/admin/products/${product.productId}`)}>
              Edit
            </button>
            {CurrUser?.userRole === "admin" && (
              <button onClick={() => handleDeleteProduct(product.productId)}>
                Delete
              </button>
            )}
          </>
        )}
      />
    </section>
  );
}