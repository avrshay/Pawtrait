import { useParams } from "react-router-dom";

// GET /orders/:id/:orderId — line items of a single order.
export default function OrderDetails() {
  const { orderId } = useParams();
  return (
    <section>
      <h1>Order #{orderId}</h1>
      <p>Backend: <code>GET /orders/:id/{orderId}</code></p>
    </section>
  );
}
