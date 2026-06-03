// POST /orders/:id (place order) + POST /payments/start (begin payment).
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getCurrentUser } from "../services/authService";
import { getCart, clearCart } from "../services/cartService";
import { createOrder } from "../services/ordersService";
import { startPayment, confirmPaymentWebhook } from "../services/paymentService";
import Table from "../components/Table";
import BackButton from "../components/back-button";

function calcTotal(items) {
  return items.reduce((sum, line) => {
    const price = Number(line.price);
    const qty = Number(line.quantity);
    if (!Number.isFinite(price) || !Number.isFinite(qty)) return sum;
    return sum + price * qty;
  }, 0);
}

// Mock card validation only (not sent to the backend).
function validateCardForm({ cardNumber, cardHolder, expiryDate, cvc }) {
  const digits = cardNumber.replace(/\s/g, "");
  if (!/^\d{16}$/.test(digits)) {
    return "Card number must be 16 digits";
  }
  if (!cardHolder.trim() || cardHolder.trim().length < 2) {
    return "Cardholder name is required";
  }
  if (!/^\d{2}\/\d{2}$/.test(expiryDate.trim())) {
    return "Expiry date must be MM/YY";
  }
  if (!/^\d{3,4}$/.test(cvc.trim())) {
    return "CVC must be 3 or 4 digits";
  }
  return null;
}

export default function Checkout() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [items, setItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(false);
  const [cartError, setCartError] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  const [orderId, setOrderId] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [paymentDone, setPaymentDone] = useState(false);

  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");

  const totalAmount = calcTotal(items);

  async function loadCart() {
    try {
      setItems([]);
      setLoadingCart(true);
      setCartError("");
      const data = await getCart();
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

  async function handlePlaceOrder(e) {
    e.preventDefault();

    if (items.length === 0) {
      setCheckoutError("Your cart is empty");
      return;
    }

    const cardError = validateCardForm({ cardNumber, cardHolder, expiryDate, cvc });
    if (cardError) {
      setCheckoutError(cardError);
      return;
    }

    const orderItems = items.map((line) => ({
      productId: line.productId,
      quantity: line.quantity,
      petImageUrl: line.petImageUrl,
    }));

    try {
      setCheckoutError("");
      setPlacingOrder(true);

      const newOrder = await createOrder(user.userId, { items: orderItems });
      const payment = await startPayment({
        userId: user.userId,
        totalAmount,
        orderId: newOrder.orderId,
      });

      await confirmPaymentWebhook({ paymentId: payment.paymentId, status: "success" });
      await clearCart();

      setOrderId(newOrder.orderId);
      setPaymentId(payment.paymentId);
      setItems([]);
      setPaymentDone(true);
    } catch (err) {
      setCheckoutError(err.message);
    } finally {
      setPlacingOrder(false);
    }
  }

  return (
    <section>
      <BackButton label="← Back" />
      <h3>Checkout</h3>

      {loadingCart && <p>Loading your cart...</p>}
      {cartError && <p style={{ color: "red" }}>{cartError}</p>}
      {checkoutError && <p style={{ color: "red" }}>{checkoutError}</p>}

      {!loadingCart && !cartError && !orderId && items.length === 0 && (
        <p>
          Your cart is empty. <Link to="/cart">Go to cart</Link>
        </p>
      )}

      {!orderId && items.length > 0 && (
        <>
          <p>Review your order before payment.</p>
          <p>
            <strong>Total: ${totalAmount.toFixed(2)}</strong>
          </p>

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
          />

          <h4>Payment details (mock)</h4>
          <form className="checkout-payment-form" onSubmit={handlePlaceOrder}>
            <label htmlFor="cardNumber">Card number</label>
            <input
              id="cardNumber"
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              maxLength={19}
            />

            <label htmlFor="cardHolder">Name on card</label>
            <input
              id="cardHolder"
              type="text"
              placeholder="Full name"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
            />

            <label htmlFor="expiryDate">Expiry date</label>
            <input
              id="expiryDate"
              type="text"
              placeholder="MM/YY"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              maxLength={5}
            />

            <label htmlFor="cvc">CVC</label>
            <input
              id="cvc"
              type="text"
              placeholder="123"
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              maxLength={4}
            />

            <button type="submit" disabled={placingOrder}>
              {placingOrder ? "Processing payment..." : `Pay $${totalAmount.toFixed(2)}`}
            </button>
          </form>
        </>
      )}

      {orderId && paymentDone && (
        <div className="checkout-success">
          <p>Order #{orderId} placed.</p>
          <p>Card ending in {cardNumber.replace(/\s/g, "").slice(-4)} charged (mock).</p>
          <p style={{ color: "green" }}>Payment confirmed. AI is processing your designs.</p>
          <p>
            <Link to="/personalArea">View my orders</Link>
          </p>
        </div>
      )}
    </section>
  );
}
