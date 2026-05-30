// GET /orders/:id — orders that belong to the logged-in user.
export default function Orders() {
  return (
    <section>
      <h1>My Orders</h1>
      <p>Backend: <code>GET /orders/:id</code> (admin/manager: <code>GET /orders</code>)</p>
    </section>
  );
}
