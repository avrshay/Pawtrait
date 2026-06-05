import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BackButton from "../components/back-button";
import {getProductById,updateProduct} from "../services/galleryService";

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
    if (status) {
      setStatus("");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setStatus("");

    if (!name.trim()) {
      setError("Product name is required");
      return;
    }

    if (
      !Number.isFinite(Number(price)) ||
      Number(price) < 0
    ) {
      setError("Price must be a valid number");
      return;
    }

    if (!/^https?:\/\/.+\..+/.test(original_pet_image_url)) {
      setError("Invalid original image URL");
      return;
    }

    if (!/^https?:\/\/.+\..+/.test(custom_product_image_url)) {
      setError("Invalid custom image URL");
      return;
    }

    try {
      setLoading(true);

      await updateProduct(productId, {
        name,
        original_pet_image_url,
        custom_product_image_url,
        price: Number(price)
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

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {status && (
        <p style={{ color: "green" }}>
          {status}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product name"
          value={name}
          onChange={(e) => {
            clearStatus();
            setName(e.target.value);
          }}
        />

        <input
          type="text"
          placeholder="Price"
          value={price}
          onChange={(e) => {
            clearStatus();
            setPrice(e.target.value);
          }}
        />

        <input
          type="text"
          placeholder="Original pet image URL"
          value={original_pet_image_url}
          onChange={(e) => {
            clearStatus();
            setOriginalPetImageUrl(e.target.value);
          }}
        />

        <input
          type="text"
          placeholder="Custom product image URL"
          value={custom_product_image_url}
          onChange={(e) => {
            clearStatus();
            setCustomProductImageUrl(e.target.value);
          }}
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </form>
    </section>
  );
}