import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackButton from "../components/back-button";
import { getOrderById, updateOrder } from "../services/ordersService";

export default function EditOrder() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // LOAD ORDER
  useEffect(() => {
    async function loadOrder() {
      try {
        setLoading(true);
        setError("");

        const order = await getOrderById(orderId);
        setStatus(order.status);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [orderId]);

  // save
  async function handleSave(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!status.trim()) {
      setError("Status is required");
      return;
    }

    try {
      setSaving(true);

      await updateOrder(orderId, {status,});

      setSuccess("Order updated successfully");

    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <BackButton label="← Back" />

      <h1>Edit Order #{orderId}</h1>

      {loading && <p>Loading order...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      {!loading && (
        <form onSubmit={handleSave}>
          <label>Status</label>

          <select
            value={status}
            onChange={(e) => {setStatus(e.target.value) ;
  setSuccess("");}}
          >
            <option value="processing">processing</option>
            <option value="completed">completed</option>
          </select>

          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      )}
    </section>
  );
}