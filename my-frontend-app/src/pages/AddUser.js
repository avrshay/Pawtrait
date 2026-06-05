import { useState } from "react";
import { createUser } from "../services/usersService";
import BackButton from "../components/back-button";

// POST /auth/register.
export default function AddUser() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userRole, setUserRole] = useState("user");
  const [loading, setLoading] = useState(false); //in order to updaue user about the state
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function  handleAdd(e) {
      e.preventDefault();
      setError(""); //clean

      if (!firstName.trim()) {
        setError("First name is required");
        return;
      }
      if (!lastName.trim()) {
        setError("Last name name is required");
        return;
      }

      if (!userRole||!["user", "manager", "admin"].includes(userRole)) {
        setError("Invalid role");
        return;
      }

      try {
        setLoading(true);

        const user = await createUser({ firstName, lastName,userRole });
        setStatus("User added successfully");
        setFirstName("");
        setLastName("");
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
      onChange={(e) => {setFirstName(e.target.value);  
     setStatus(""); }} //Any changes the user types will be reflected on the screen.
    />
    <input
      type="text"
      placeholder="Last Name"
      value={lastName}
      onChange={(e) => {setLastName(e.target.value);  setStatus(""); }} //Any changes the user types will be reflected on the screen.
    />
    <select value={userRole} onChange={(e) => {setUserRole(e.target.value); setStatus(""); }} >
        <option value="user">user</option>
        <option value="manager">manager</option>
        <option value="admin">admin</option>
    </select>
    <button type="submit" disabled={loading}> 
      {loading ? "Adding..." : "New User"} 
    </button>
    </form>
    {error && <p style={{ color: "red" }}>{error}</p>}
  </section>
); //according to the state-While loading, the user will not be able to press the button again 
}
