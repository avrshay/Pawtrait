import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../services/galleryService";
import BackButton from "../components/back-button";

export default function AddProduct() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [original_pet_image_url, setOriginal_pet_image_url] = useState("");
  const [custom_product_image_url, setCustom_product_image_url] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (!Number.isFinite(Number(price)) || Number(price) < 0) {
    setError("Price must be a valid number");
    return;
    }

    if (!/^https?:\/\/.+\..+/.test(original_pet_image_url)) {
        setError("Invalid original image URL");
        return;
    }

    
    if (!/^https?:\/\/.+\..+/.test(custom_product_image_url)) {
        setError("Invalid custom product image URL");
        return;
    }

    try {
      setLoading(true);

      await createProduct({
        name,
        original_pet_image_url,
        custom_product_image_url,
        price: Number(price),
      });
      setStatus("Product added successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
        <BackButton label="← Back" />
        <h1>Add Product</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {status && <p style={{ color: "green" }}>{status}</p>}
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Product name"
          value={name}
          onChange={(e) => {setName(e.target.value);
  setStatus("");}}
        />
        <input
          placeholder="custom product image"
          value={custom_product_image_url}
          onChange={(e) => {setCustom_product_image_url(e.target.value);
  setStatus("");}}
        />
        <input
          placeholder="original pet image"
          value={original_pet_image_url}
          onChange={(e) => {setOriginal_pet_image_url(e.target.value);
  setStatus("");}}
        />        
        <input
          placeholder="Price"
          value={price}
          onChange={(e) => {setPrice(e.target.value);
  setStatus("");}}
        />

        <button disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
    </section>
  );
}