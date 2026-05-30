import { useParams } from "react-router-dom";

// GET /gallery/:product_id — single product details.
export default function ProductDetails() {
  const { productId } = useParams();
  return (
    <section>
      <h1>Product #{productId}</h1>
      <p>Backend: <code>GET /gallery/{productId}</code></p>
    </section>
  );
}
