import { useEffect, useState, useRef } from "react";
import Table from "../components/Table";
import { getAllUsers,deleteUser } from "../services/usersService";
import { getAllOrders, getOrderItems,deleteOrder } from "../services/ordersService";
import { getAllProducts } from "../services/galleryService";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/authService";
import { deleteProduct } from "../services/galleryService";
import { useSocket } from "../context/SocketContext";

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

  //for the live chat support panel
  const [pendingChats, setPendingChats] = useState({});
  const [activeChat, setActiveChat]   = useState(null); // clientSocketId
  const [chatMessages, setChatMessages] = useState({}); // { [clientSocketId]: [{from,text}] }
  const [adminInput, setAdminInput]   = useState("");
  const [isTyping, setIsTyping]       = useState(false);
  const chatBottomRef = useRef(null);
  const { managerSocket: adminSocket } = useSocket();

  useEffect(() => {
    adminSocket.connect();

    adminSocket.on("human_handoff", ({ clientSocketId, userName, history }) => {
      setPendingChats((prev) => ({
        ...prev,
        [clientSocketId]: { userName: userName || "Guest", history, accepted: false },
      }));
      const converted = history.map((m) => ({
        from: m.role === "user" ? "user" : "bot",
        text: m.content,
      }));
      setChatMessages((prev) => ({ ...prev, [clientSocketId]: converted }));
    });

    adminSocket.on("receiveMessage", ({ clientSocketId, text }) => {
      setChatMessages((prev) => ({
        ...prev,
        [clientSocketId]: [...(prev[clientSocketId] ?? []), { from: "user", text }],
      }));
    });

    adminSocket.on("client_disconnected", ({ clientSocketId }) => {
      setChatMessages((prev) => ({
        ...prev,
        [clientSocketId]: [
          ...(prev[clientSocketId] ?? []),
          { from: "system", text: "⚠️ The customer has left the chat." },
        ],
      }));
      setPendingChats((prev) => {
        const next = { ...prev };
        delete next[clientSocketId];
        return next;
      });
    });

    adminSocket.on("joined_room", ({ clientSocketId }) => {
      setPendingChats((prev) => ({
        ...prev,
        [clientSocketId]: { ...prev[clientSocketId], accepted: true },
      }));
      setActiveChat(clientSocketId);
    });

    return () => {
      adminSocket.off("human_handoff");
      adminSocket.off("receiveMessage");
      adminSocket.off("client_disconnected");
      adminSocket.off("joined_room");
      adminSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [chatMessages, activeChat]);

  function acceptChat(clientSocketId) {
    adminSocket.emit("handoff_accepted", { clientSocketId });
  }

  function sendAdminMessage() {
    if (!adminInput.trim() || !activeChat) return;
    adminSocket.emit("sendMessage", { clientSocketId: activeChat, text: adminInput.trim() });
    setChatMessages((prev) => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] ?? []), { from: "admin", text: adminInput.trim() }],
    }));
    setAdminInput("");
  }

  function handleAdminTyping(e) {
    setAdminInput(e.target.value);
    if (!activeChat) return;
    if (!isTyping) {
      setIsTyping(true);
      adminSocket.emit("typing", { clientSocketId: activeChat, isTyping: true });
    }
    clearTimeout(handleAdminTyping._timer);
    handleAdminTyping._timer = setTimeout(() => {
      setIsTyping(false);
      adminSocket.emit("typing", { clientSocketId: activeChat, isTyping: false });
    }, 5500);
  }


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

    {/*Live Chat Panel */}
    <h2>💬 Live Chat Support</h2>
    <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>

      {/* Pending requests list */}
      <div style={{ minWidth: 220, border: "1px solid var(--outline-variant)", borderRadius: "var(--radius-md)", padding: 12 }}>
        <strong>Pending Requests</strong>
        {Object.keys(pendingChats).length === 0 && (
          <p style={{ color: "var(--outline)", fontSize: 13 }}>No active requests</p>
        )}
        {Object.entries(pendingChats).map(([id, chat]) => (
          <div key={id} style={{ marginTop: 10, padding: 8, background: "var(--surface-low)", borderRadius: "var(--radius-sm)" }}>
            <div style={{ fontSize: 12, color: "var(--outline)" }}>{chat.userName}</div>
            {!chat.accepted ? (
              <button onClick={() => acceptChat(id)} style={{ marginTop: 6, background: "var(--primary)", color: "#fff", border: "none", borderRadius: "var(--radius-full)", padding: "4px 12px", cursor: "pointer" }}>
                Accept
              </button>
            ) : (
              <button onClick={() => setActiveChat(id)} style={{ marginTop: 6, background: "var(--secondary)", color: "#fff", border: "none", borderRadius: "var(--radius-full)", padding: "4px 12px", cursor: "pointer" }}>
                Open Chat
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Active chat window */}
      {activeChat ? (
        <div style={{ flex: 1, border: "1px solid var(--outline-variant)", borderRadius: "var(--radius-md)", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "10px 14px", background: "var(--primary)", color: "#fff", borderRadius: "var(--radius-md) var(--radius-md) 0 0", fontWeight: 700, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Chat with {pendingChats[activeChat]?.userName ?? activeChat.slice(0,8)}</span>
            <button
              onClick={() => setActiveChat(null)}
              title="Close chat"
              style={{ background: "transparent", border: "none", color: "#fff", fontSize: 16, cursor: "pointer", lineHeight: 1 }}
            >
              ✕
            </button>
          </div>
          <div style={{ flex: 1, padding: 12, overflowY: "auto", maxHeight: 300, display: "flex", flexDirection: "column", gap: 8, background: "var(--background)" }}>
            {(chatMessages[activeChat] ?? []).map((msg, i) => (
              msg.from === "system" ? (
                <div key={i} style={{
                  alignSelf: "center",
                  color: "var(--outline)",
                  fontSize: 12,
                  fontStyle: "italic",
                  textAlign: "center",
                }}>
                  {msg.text}
                </div>
              ) : (
                <div key={i} style={{
                  alignSelf: msg.from === "admin" ? "flex-end" : "flex-start",
                  background: msg.from === "admin" ? "var(--primary)" : msg.from === "bot" ? "var(--primary-container)" : "var(--surface-container)",
                  color: msg.from === "admin" || msg.from === "bot" ? "#fff" : "var(--on-surface)",
                  padding: "8px 12px",
                  borderRadius: "var(--radius-md)",
                  maxWidth: "75%",
                  fontSize: 14,
                }}>
                  {msg.from === "bot" && <em style={{ fontSize: 11, opacity: 0.8 }}>🤖 AI · </em>}
                  {msg.text}
                </div>
              )
            ))}
            <div ref={chatBottomRef} />
          </div>
          <div style={{ display: "flex", gap: 8, padding: 10, borderTop: "1px solid var(--outline-variant)" }}>
            <input
              value={adminInput}
              onChange={handleAdminTyping}
              onKeyDown={(e) => e.key === "Enter" && sendAdminMessage()}
              placeholder="Reply to customer..."
              style={{ flex: 1, padding: "8px 12px", borderRadius: "var(--radius-full)", border: "1.5px solid var(--outline-variant)", outline: "none" }}
            />
            <button type="button" onClick={sendAdminMessage} style={{ background: "var(--primary)", color: "#fff", border: "none", borderRadius: "var(--radius-full)", padding: "8px 16px", cursor: "pointer" }}>
              Send
            </button>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--outline)", border: "1px dashed var(--outline-variant)", borderRadius: "var(--radius-md)" }}>
          Select a chat to respond
        </div>
      )}
    </div>
    {/* ─────────────────────────────────────────────────────────── */}

    <h1>
      {CurrUser?.userRole === "admin" ? "Admin Dashboard" : "Manager Dashboard"}
    </h1>
    {/* users table */}
      <h2>Users</h2>
        <button onClick={() => navigate("/admin/users/new")}>
          + Add User
        </button>
      <Table
        data={users
          .filter((u) => u.userId !== CurrUser?.userId)
          .map((u) => ({
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
        {CurrUser?.userRole === "admin" && (
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
              productName: line.Product?.name || "—",
              productPrice: line.Product?.price || "—",
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
            columns={["productId","productName","productPrice", "quantity", "pet", "aiDesign"]}
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
