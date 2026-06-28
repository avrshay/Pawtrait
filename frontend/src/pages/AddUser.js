import { useState } from "react";
import { createUser } from "../services/usersService";
import BackButton from "../components/back-button";

export default function AddUser() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [userRole, setUserRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function handleAdd(e) {
    e.preventDefault();
    setError("");

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
      await createUser({ firstName, lastName, email, phone_number, userRole });
      setStatus("User added successfully");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhoneNumber("");
      setUserRole("user");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <BackButton label="← Back" />
      <h1>New User</h1>
      <form onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => { setFirstName(e.target.value); setStatus(""); }}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => { setLastName(e.target.value); setStatus(""); }}
        />
        <input
          type="email"
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
        <select value={userRole} onChange={(e) => { setUserRole(e.target.value); setStatus(""); }}>
          <option value="user">user</option>
          <option value="manager">manager</option>
          <option value="admin">admin</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "New User"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {status && <p style={{ color: "green" }}>{status}</p>}
    </section>
  );
}
