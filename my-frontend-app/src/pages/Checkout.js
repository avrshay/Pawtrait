// POST /orders/:id (place order) + POST /payments/start (begin payment).
export default function Checkout() {
  return (
    <section>
      <h1>Checkout</h1>
      <p>Backend: <code>POST /orders/:id</code>, then <code>POST /payments/start</code></p>
    </section>
  );
}
