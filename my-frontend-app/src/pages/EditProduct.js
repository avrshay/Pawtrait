import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BackButton from "../components/back-button";
import { getProductById, updateProduct } from "../services/galleryService";

export default function EditProduct() {
  const { productId } = useParams();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [original_pet_image_url, setOriginalPetImageUrl] = useState("");
  const [custom_product_image_url, setCustomProductImageUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const product = await getProductById(productId);
        setName(product.name || "");
        setPrice(product.price || "");
        setOriginalPetImageUrl(product.original_pet_image_url || "");
        setCustomProductImageUrl(product.custom_product_image_url || "");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [productId]);

  function clearStatus() {
    if (status) setStatus("");
  }

  function handleImageUpload(setter) {
    return (e) => {
      clearStatus();
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
    setStatus("");

    if (!name.trim()) {
      setError("Product name is required");
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
      await updateProduct(productId, {
        name,
        original_pet_image_url,
        custom_product_image_url,
        price: Number(price),
      });
      setStatus("Product updated successfully");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <BackButton label="← Back" />
      <h1>Edit Product</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {status && <p style={{ color: "green" }}>{status}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product name"
          value={name}
          onChange={(e) => { clearStatus(); setName(e.target.value); }}
        />
        <input
          type="text"
          placeholder="Price"
          value={price}
          onChange={(e) => { clearStatus(); setPrice(e.target.value); }}
        />

        <div>
          <label>Original Pet Image</label>
          {original_pet_image_url && (
            <img src={original_pet_image_url} alt="Original pet" style={{ width: 120, display: "block" }} />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload(setOriginalPetImageUrl)}
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
            onChange={handleImageUpload(setCustomProductImageUrl)}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </form>
    </section>
  );
}
