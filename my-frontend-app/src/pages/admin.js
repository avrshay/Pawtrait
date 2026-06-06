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
  async function handleDeleteOrder(userId, orderId) {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this order?"
  );

  if (!confirmDelete) return;

  try {
    await deleteOrder(userId, orderId);

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
      prev.filter((p) => p.product_id !== productId)
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
        data={users.map((u) => ({
          ...u,
          "phone number": u.phone_number,
          Role: u.userRole,
        }))}
        columns={["userId","firstName", "lastName", "email","phone number", "Role"]}
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
        data={orders.map((order) => {
          const owner = users.find((u) => u.userId === order.userId);
          return {
            ...order,
            userName: owner ? `${owner.firstName} ${owner.lastName}` : "—",
            "Create Date": order.createDate
              ? new Date(order.createDate).toLocaleDateString("en-US", {
                  year: "numeric", month: "short", day: "numeric",
                })
              : "—",
          };
        })}
        columns={["orderId", "userName", "status", "Create Date"]}
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
        data={products.map((p) => ({
          ...p,
          productId: p.product_id,
          "original image": p.original_pet_image_url ? (
            <img src={p.original_pet_image_url} style={{ width: 80 }} alt="" />
          ) : "—",
          "custom product": p.custom_product_image_url ? (
            <img src={p.custom_product_image_url} style={{ width: 80 }} alt="" />
          ) : "—",
        }))}
        columns={["productId", "name", "original image", "custom product", "price"]}
        renderActions={(product) => (
          <>
            <button
              onClick={() =>
                navigate(`/admin/products/${product.product_id}`)}>
              Edit
            </button>
            {CurrUser?.userRole === "admin" && (
              <button onClick={() => handleDeleteProduct(product.product_id)}>
                Delete
              </button>
            )}
          </>
        )}
      />
    </section>
  );
}