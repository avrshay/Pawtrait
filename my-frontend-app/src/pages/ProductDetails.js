import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../services/galleryService";
import { addItem } from "../services/cartService";
import { uploadPetImage } from "../services/uploadService";
import { getCurrentUser } from "../services/authService";
import BackButton from "../components/back-button";

// GET /gallery/:product_id — single product details.

const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp", "image/bmp", "image/svg+xml"];

// Read the file as a data URL for POST /upload/pet-image (saved as a real /images/clients/... URL).
function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read the image file"));
    reader.readAsDataURL(file);
  });
}

export default function ProductDetails() {

  const { productId } = useParams(); //read the productId from the URL
  const navigate = useNavigate(); //lets us redirect a guest to the login page

  const [product, setProduct] = useState(null);//state for the product
  const [loading, setLoading] = useState(true); //state for the loading
  const [error, setError] = useState(null); //state for the error

  const [petImageFile, setPetImageFile] = useState(null); //the file the user uploads
  const [petImagePreview, setPetImagePreview] = useState(null); //local preview URL (blob)
  const [quantity, setQuantity] = useState("1"); //how many the user wants
  const [cartMessage, setCartMessage] = useState(null); //feedback after adding to cart
  const [addedPetImageUrl, setAddedPetImageUrl] = useState(null); //pet image to show after successful add
  const [AIMessage, setAIMessage] = useState(null); //feedback after showing the AI image

  useEffect(() => {
    getProductById(productId)
      .then((data) => setProduct(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [productId]);

  // free the blob URL when the preview changes or the page unmounts
  useEffect(() => {
    return () => {
      if (petImagePreview && petImagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(petImagePreview);
      }
    };
  }, [petImagePreview]);

  function handlePetImageChange(e) {
    const file = e.target.files[0];
    setCartMessage(null);
    setAddedPetImageUrl(null);
    setAIMessage(null);

    if (!file) {
      setPetImageFile(null);
      setPetImagePreview(null);
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setCartMessage("Please upload an image file (png, jpg, gif, webp, bmp, or svg)");
      setPetImageFile(null);
      setPetImagePreview(null);
      e.target.value = "";
      return;
    }

    setPetImageFile(file);
    setPetImagePreview(URL.createObjectURL(file)); //show preview right after choosing a file
  }

  // POST /cart — add this product with the chosen pet image and quantity.
  async function handleAddToCart() {
    if (!getCurrentUser()) {
      alert("You must be logged in to add items to your cart");
      navigate("/login"); //guest: redirect to login
      return;
    }
    if (!petImageFile) {
      setCartMessage("Please upload a pet image");
      setAddedPetImageUrl(null);
      return;
    }
    if (!quantity || Number(quantity) < 1) {
      setCartMessage("Quantity must be at least 1");
      setAddedPetImageUrl(null);
      return;
    }

    setCartMessage(null);
    setAddedPetImageUrl(null);
    setAIMessage(null);

    try {
      const dataUrl = await readFileAsDataUrl(petImageFile);
      const uploadResult = await uploadPetImage(dataUrl); //save file on server, get real URL string
      const petImageUrl = uploadResult.petImageUrl; //e.g. http://localhost:3000/images/clients/pet-user3-....jpg
      await addItem({ productId, quantity: Number(quantity), petImageUrl });
      setCartMessage("Added to cart!");
      setAddedPetImageUrl(petImageUrl); //show the saved image path after success
      setAIMessage("hi! we are working on your image...");
    } catch (err) {
      setCartMessage(`Could not add to cart: ${err.message}`);
      setAddedPetImageUrl(null);
    }
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
          <div className="product-images">
            <img src={product.original_pet_image_url} alt={product.name} />
            <img src={product.custom_product_image_url} alt={product.name} />
          </div>
          <p>${product.price}</p>

          <label htmlFor="petImage">Upload your pet image</label>
          <input
            id="petImage"
            type="file"
            accept="image/png,image/jpeg,image/gif,image/webp,image/bmp,image/svg+xml"
            onChange={handlePetImageChange}
          />
          <p className="pet-image-hint">
            Required: please provide a clear photo of your pet (png, jpg, gif, webp).
          </p>

          {petImagePreview && !addedPetImageUrl && (
            <div className="pet-image-preview">
              <p>Preview:</p>
              <img src={petImagePreview} alt="Your pet preview" />
            </div>
          )}

          <label htmlFor="quantity">Quantity</label>
          <input
            id="quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          <button type="button" className="add-to-cart" onClick={handleAddToCart}>
            Add to Cart
          </button>

          {cartMessage && <p className="cart-message">{cartMessage}</p>}
          {AIMessage && <p className="ai-message">{AIMessage}</p>}

          {addedPetImageUrl && (
            <div className="pet-image-preview">
              <p>Pet image:</p>
              <img src={addedPetImageUrl} alt="Your pet" />
            </div>
          )}
        </div>
      )}
    </section>
  );
}
