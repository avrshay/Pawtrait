import { useEffect, useState } from "react";
import { getCurrentUser } from "../services/authService";
import { getOrdersOfUser, getOrderItems } from "../services/ordersService";
import { getAllProducts } from "../services/galleryService";
import Table from "../components/Table";
import BackButton from "../components/back-button";


export default function PersonalArea() {
  const user = getCurrentUser();
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState([]);
  const [productImageMap, setProductImageMap] = useState({});
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
        setOrders(data||[]);
      } catch (err) {
        setOrdersError(err.message);
      } finally {
        setLoadingOrders(false);
      }
    }
    loadOrders();
  }, []);

  useEffect(() => {
    getAllProducts().then((products) => {
      const map = {};
      (products || []).forEach((p) => { map[p.product_id] = p.custom_product_image_url; });
      setProductImageMap(map);
    });
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

      {/* USER  */}
      <div>
        <h3>User Info</h3>
        <p>First Name: {user.firstName}</p>
        <p>Last Name: {user.lastName}</p>
        <p>Email: {user.email}</p>
        <p>Phone: {user.phone_number}</p>
      </div>

      {/* ORDERS  */}
      <h3>My Orders</h3>

      {loadingOrders && <p>Loading orders...</p>}
      {ordersError && <p style={{ color: "red" }}>{ordersError}</p>}
      {itemsError && <p style={{ color: "red" }}>{itemsError}</p>}
      <Table
        data={orders.map((o) => ({
          ...o,
          "Create Date": o.createDate
            ? new Date(o.createDate).toLocaleDateString("en-US", {
                year: "numeric", month: "short", day: "numeric",
              })
            : "—",
        }))}
        columns={["orderId", "status", "Create Date"]}
        renderActions={(order) => (
          <button onClick={() => handleLoadItems(order.orderId)}>
            View Items
          </button>
        )}
      />

      {/* ITEMS (only when order selected) */}
      {selectedOrderId && (
        <>
        
          {loadingItems && <p>Loading items...</p>}

          <Table
            data={items.map((line) => ({
              ...line,
              productName: line.Product?.name || "—",
              productPrice: line.Product?.price || "—",
              product: productImageMap[line.productId] ? (
                <img
                  src={productImageMap[line.productId]}
                  alt="Product"
                  className="cart-pet-image"
                  style={{ maxWidth: 100, maxHeight: 100, objectFit: "cover", borderRadius: 8 }}
                />
              ) : (
                "—"
              ),
              pet: line.petImageUrl ? (
                <img
                  src={line.petImageUrl}
                  alt="Your pet"
                  className="cart-pet-image"
                  style={{ maxWidth: 100, maxHeight: 100, objectFit: "cover", borderRadius: 8 }}
                />
              ) : (
                "—"
              ),
            }))}
            columns={["product","productName","productPrice", "quantity", "pet"]}
          />
        </>
      )}
    </section>
  );
}