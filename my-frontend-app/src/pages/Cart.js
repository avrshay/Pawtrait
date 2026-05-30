// GET /cart — current user's cart (requires x-user-id / x-user-role headers).
export default function Cart() {
  return (
    <section>
      <h1>Cart</h1>
      <p>
        Backend: <code>GET /cart</code>, <code>POST /cart</code>,{" "}
        <code>PUT /cart/:item_id</code>, <code>DELETE /cart/:item_id</code>,{" "}
        <code>DELETE /cart/clear</code>
      </p>
    </section>
  );
}
