import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import { getAllProducts } from "../services/galleryService";

// Home/gallery page = GET /gallery
// shows them as a row of Cards, and lets the user filter by price range.
export default function Dashboard() {
  const [products, setProducts] = useState([]);//state for the products
  const [loading, setLoading] = useState(true); //state for the loading
  const [error, setError] = useState(null); //state for the error
  const [priceRange, setPriceRange] = useState("all"); //state for the price range

  useEffect(() => {
    getAllProducts()
      .then((data) => setProducts(data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Keep only the products that fall in the selected price range.
  function matchesPrice(price) {
    switch (priceRange) {
      case "low":
        return price <= 40;
      case "mid":
        return price > 40 && price <= 60;
      case "high":
        return price > 60 && price <= 100;
      case "premium":
        return price > 100;
      default:
        return true;
    }
  }

  const visibleProducts = products.filter((p) => matchesPrice(p.price)); //filter the products by the price range

  return (
    <section className="dashboard">
      <h1 className="dashboard__title">Our Products</h1>
      <p className="dashboard__tagline">Turn your pet's photo into a one-of-a-kind masterpiece — crafted with AI, made with love.</p>
      <div className="dashboard__filter">
        <label htmlFor="priceRange">Filter by price: </label>
        <select
          id="priceRange"
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
        >
          <option value="all">All prices</option>
          <option value="low">Up to $40</option>
          <option value="mid">$40 – $60</option>
          <option value="high">$60 – $100</option>
          <option value="premium">Over $100</option>
        </select>
      </div>

      {loading && <p>Loading products…</p>}
      {error && <p>Could not load products: {error}</p>}

      {!loading && !error && (
        <div className="dashboard__cards">
          {visibleProducts.length === 0 ? (
            <p>No products match this price range.</p>
          ) : (
            visibleProducts.map((product) => (
              //wrap each card in a Link so clicking it opens the product details page
              <Link
                key={product.product_id}
                to={`/gallery/${product.product_id}`}
                className="card-link"
              >
                <Card product={product} />
              </Link>
            ))
          )}
        </div>
      )}
    </section>
  );
}
