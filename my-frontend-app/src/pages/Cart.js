// GET /cart — current user's cart (requires x-user-id / x-user-role headers).
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/authService";
import { getCart, updateItemQuantity, deleteItem, clearCart } from "../services/cartService";
import Table from "../components/Table";
import BackButton from "../components/back-button";

export default function Cart() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [items, setItems] = useState([]);
  const [cartId, setCartId] = useState(null);
  const [loadingCart, setLoadingCart] = useState(false);
  const [cartError, setCartError] = useState("");
  const [actionError, setActionError] = useState("");

  // Load the user's cart
  async function loadCart() {
    try {
      setItems([]); // clean state
      setCartId(null);
      setLoadingCart(true);
      setCartError("");
      const data = await getCart();
      setCartId(data.cartId);
      setItems(data.item_cart || []);
    } catch (err) {
      setCartError(err.message);
    } finally {
      setLoadingCart(false);
    }
  }

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadCart();
  }, []);

  async function handleUpdateQuantity(cartItemId, currentQty) {
    const input = window.prompt("New quantity:", String(currentQty));
    if (input == null) return;

    const quantity = Number(input);
    if (!Number.isFinite(quantity) || quantity < 1) {
      setActionError("Quantity must be at least 1");
      return;
    }

    try {
      setActionError("");
      await updateItemQuantity(cartItemId, quantity);
      await loadCart();
    } catch (err) {
      setActionError(err.message);
    }
  }

  async function handleDeleteItem(cartItemId) {
    try {
      setActionError("");
      await deleteItem(cartItemId);
      await loadCart();
    } catch (err) {
      setActionError(err.message);
    }
  }

  async function handleClearCart() {
    if (!window.confirm("Remove all items from your cart?")) return;

    try {
      setActionError("");
      await clearCart();
      await loadCart();
    } catch (err) {
      setActionError(err.message);
    }
  }

  return (
    <section>
      <BackButton label="← Back" />
      <h3>My Cart</h3>

      {loadingCart && <p>Loading your cart...</p>}
      {cartError && <p style={{ color: "red" }}>{cartError}</p>}
      {actionError && <p style={{ color: "red" }}>{actionError}</p>}

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
        }))}
        columns={["product_name", "productId", "quantity", "price", "pet"]}
        renderActions={(line) => (
          <>
            <button
              type="button"
              onClick={() => handleUpdateQuantity(line.cart_item_id, line.quantity)}
            >
              Change qty
            </button>
            <button type="button" onClick={() => handleDeleteItem(line.cart_item_id)}>
              Remove
            </button>
          </>
        )}
      />

      {items.length > 0 && (
        <button type="button" onClick={handleClearCart}>
          Clear cart
        </button>
      )}
    </section>
  );
}
