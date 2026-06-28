import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserById, updateUser } from "../services/usersService";
import BackButton from "../components/back-button";

export default function EditUser() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [userRole, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const { id } = useParams();

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        const user = await getUserById(id);
        setFirstName(user.firstName || "");
        setLastName(user.lastName || "");
        setEmail(user.email || "");
        setPhoneNumber(user.phone_number || "");
        setRole(user.userRole || "user");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [id]);

  async function handleEdit(e) {
    e.preventDefault();
    setError("");
    setStatus("");

    if (!firstName.trim()) {
      setError("First name is required");
      return;
    }
    if (!lastName.trim()) {
      setError("Last name is required");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("A valid email is required");
      return;
    }
    if (!/^\d{10}$/.test(phone_number)) {
      setError("Phone number must contain exactly 10 digits");
      return;
    }
    if (!userRole || !["user", "manager", "admin"].includes(userRole)) {
      setError("Invalid role");
      return;
    }

    try {
      setLoading(true);
      await updateUser(id, { firstName, lastName, email, phone_number, userRole });
      setStatus("User details updated successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <BackButton label="← Back" />
      <h1>User details</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {status && <p style={{ color: "green" }}>{status}</p>}

      <form onSubmit={handleEdit}>
        <input
          placeholder="First Name"
          value={firstName}
          onChange={(e) => { setFirstName(e.target.value); setStatus(""); }}
        />
        <input
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => { setLastName(e.target.value); setStatus(""); }}
        />
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setStatus(""); }}
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone_number}
          onChange={(e) => { setPhoneNumber(e.target.value); setStatus(""); }}
        />
        <select value={userRole} onChange={(e) => { setRole(e.target.value); setStatus(""); }}>
          <option value="user">user</option>
          <option value="manager">manager</option>
          <option value="admin">admin</option>
        </select>
        <button type="submit" disabled={loading}>Save</button>
      </form>
    </section>
  );
}
