import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../services/galleryService";
import { addItem } from "../services/cartService";
import { getCurrentUser } from "../services/authService";
import BackButton from "../components/back-button";

// GET /gallery/:product_id — single product details.


export default function ProductDetails() {

  const { productId } = useParams(); //read the productId from the URL
  const navigate = useNavigate(); //lets us redirect a guest to the login page

  const [product, setProduct] = useState(null);//state for the product
  const [loading, setLoading] = useState(true); //state for the loading
  const [error, setError] = useState(null); //state for the error

  const [petImageUrl, setPetImageUrl] = useState(""); //the pet image URL the user types
  const [quantity, setQuantity] = useState(1); //how many the user wants
  const [cartMessage, setCartMessage] = useState(null); //feedback after adding to cart

  useEffect(() => {
    getProductById(productId)
      .then((data) => setProduct(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [productId]);

  // POST /cart — add this product with the chosen pet image and quantity.
 
  function handleAddToCart() {
    if (!getCurrentUser()) {
      navigate("/login"); // A guest (not logged in) is sent to the login page instead.
      return;
    }
    setCartMessage(null);
    addItem({ productId, quantity, petImageUrl })
      .then(() => setCartMessage("Added to cart!"))
      .catch((err) => setCartMessage(`Could not add to cart: ${err.message}`));
  }

  return (
    <section className="ProductDetails">

      {loading && <p>Loading the product…</p>}
      {error && <p>Could not load the product: {error}</p>}

      {!loading && !error && !product && <p>Product not found.</p>}

      {!loading && !error && product && (
        //here we render the product details
        <div className="product-details">
          <BackButton label="← Back to Gallery" />
          <h2>{product.name}</h2>
          <img src={product.original_pet_image_url} alt={product.name} />
          <img src={product.custom_product_image_url} alt={product.name} />
          <p>${product.price}</p>

          <label htmlFor="petImageUrl">Pet image URL</label>
          <input
            id="petImageUrl"
            type="text"
            value={petImageUrl}
            onChange={(e) => setPetImageUrl(e.target.value)}
            placeholder="https://example.com/pet.jpg"
          />

          <label htmlFor="quantity">Quantity</label>
          <input
            id="quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />

          <button type="button" className="add-to-cart" onClick={handleAddToCart}>
            Add to Cart
          </button>

          {cartMessage && <p className="cart-message">{cartMessage}</p>}
        </div>
      )}
    </section>

  );
}
