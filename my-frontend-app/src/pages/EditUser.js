import { useParams } from "react-router-dom";
import { useState,useEffect  } from "react";
import { getUserById,updateUser } from "../services/usersService";
import BackButton from "../components/back-button";


// PUT /users/:id — the logged-in user editing their own details.
export default function EditUser() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userRole, setRole] = useState("user");
  const [loading, setLoading] = useState(false); //in order to updaue user about the state
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const { id } = useParams();

  

useEffect(() => {
  async function loadUser() {
    try {
      setLoading(true);
      const user = await getUserById(id);
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setRole(user.userRole);
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
    setError("Last name name is required");
    return;
  }

    if (!userRole||!["user", "manager", "admin"].includes(userRole)) {
        setError("Invalid role");
        return;
    }
  setLoading(true);

  try {
    await updateUser(id, {
      firstName,
      lastName,
      userRole
    });

    setStatus("User details updated successfully.");
  } catch (err) {
    setError(err.message);
  }
  finally {
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
      <input value={firstName} onChange={(e) => {setFirstName(e.target.value); setStatus(""); }} />
      <input value={lastName} onChange={(e) => {setLastName(e.target.value); setStatus(""); }} />
      <select value={userRole} onChange={(e) => {setRole(e.target.value);  setStatus(""); }} >
        <option value="user">user</option>
        <option value="manager">manager</option>
        <option value="admin">admin</option>
      </select>
      <button type="submit" disabled={loading}>Save</button>
    </form>
  </section>
); //according to  the state
}
