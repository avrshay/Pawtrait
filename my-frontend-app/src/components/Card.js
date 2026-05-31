//This is the card component that is used to display the products in the gallery page.
export default function Card({ product }) { //Props: product object that is passed to the card component.
  return (
    <div className="card">
      <img src={product.original_pet_image_url} alt={product.name} />
      <img src={product.custom_product_image_url} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.price}</p>
    </div>
  );
}