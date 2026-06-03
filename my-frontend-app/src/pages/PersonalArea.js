import { useEffect, useState } from "react";
import { getCurrentUser } from "../services/authService";
import { getOrdersOfUser, getOrderItems } from "../services/ordersService";
import Table from "../components/Table";
import BackButton from "../components/back-button";


export default function PersonalArea() {
  const user = getCurrentUser();
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [itemsError, setItemsError] = useState("");
  // Load orders
  useEffect(() => {
    async function loadOrders() {
      try {
        setOrders([]);
        setLoadingOrders(true);
        const data = await getOrdersOfUser(user.userId);
        setOrders(data);
      } catch (err) {
        setOrdersError(err.message);
      } finally {
        setLoadingOrders(false);
      }
    }
    loadOrders();
  }, []);

  // Load items when order is selected
  async function handleLoadItems(orderId) {
    try {
      setItems([]); // clean state
      setLoadingItems(true);
      setSelectedOrderId(orderId);

      const data = await getOrderItems(user.userId, orderId);
      setItems(data);

    } catch (err) {
      setItemsError(err.message);
    } finally {
      setLoadingItems(false);
    }
  }

  return (
    <section>
      <BackButton label="← Back" />
      <h1>Personal Area</h1>

      {/* USER INFO */}
      <div>
        <h3>User Info</h3>
        <p>First Name: {user.firstName}</p>
        <p>Last Name: {user.lastName}</p>
        <p>Email: {user.email}</p>
        <p>Phone: {user.phone_number}</p>
      </div>

      {/* ORDERS TABLE */}
      <h3>My Orders</h3>

      {loadingOrders && <p>Loading orders...</p>}
      {ordersError && <p style={{ color: "red" }}>{ordersError}</p>}
      {itemsError && <p style={{ color: "red" }}>{itemsError}</p>}
      <Table
        data={orders}
        columns={["orderId", "status", "createDate"]}
        renderActions={(order) => (
          <button onClick={() => handleLoadItems(order.orderId)}>
            View Items
          </button>
        )}
      />

      {/* ITEMS TABLE (only when order selected) */}
      {selectedOrderId && (
        <>
        
          {loadingItems && <p>Loading items...</p>}

          <Table
            data={items.map((line) => ({
              ...line,
              pet: line.petImageUrl ? (
                <img
                  src={line.petImageUrl}
                  alt="Your pet"
                  className="cart-pet-image"
                  style={{ maxWidth: 100, maxHeight: 100, objectFit: "cover" }}
                />
              ) : (
                "—"
              ),
              aiDesign:
                line.aiDesignImageUrl && String(line.aiDesignImageUrl).trim() ? (
                  <img
                    src={line.aiDesignImageUrl}
                    alt="AI design"
                    className="cart-pet-image"
                    style={{ maxWidth: 100, maxHeight: 100, objectFit: "cover" }}
                  />
                ) : (
                  "—"
                ),
            }))}
            columns={["productId", "quantity", "pet", "aiDesign"]}
          />
        </>
      )}
    </section>
  );
}