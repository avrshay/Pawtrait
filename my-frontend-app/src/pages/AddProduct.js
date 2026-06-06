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

  function handleImageUpload(setter) {
    return (e) => {
      setStatus("");
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => setter(ev.target.result);
      reader.readAsDataURL(file);
    };
  }

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
    if (!original_pet_image_url) {
      setError("Original pet image is required");
      return;
    }
    if (!custom_product_image_url) {
      setError("Custom product image is required");
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
          onChange={(e) => { setName(e.target.value); setStatus(""); }}
        />
        <input
          placeholder="Price"
          value={price}
          onChange={(e) => { setPrice(e.target.value); setStatus(""); }}
        />

        <div>
          <label>Original Pet Image</label>
          {original_pet_image_url && (
            <img src={original_pet_image_url} alt="Original pet" style={{ width: 120, display: "block" }} />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload(setOriginal_pet_image_url)}
          />
        </div>

        <div>
          <label>Custom Product Image</label>
          {custom_product_image_url && (
            <img src={custom_product_image_url} alt="Custom product" style={{ width: 120, display: "block" }} />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload(setCustom_product_image_url)}
          />
        </div>

        <button disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
    </section>
  );
}
