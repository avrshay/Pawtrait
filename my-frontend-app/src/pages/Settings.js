import { useState,useEffect  } from "react";
import { getUserById ,updateProfile } from "../services/usersService";
import { getCurrentUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

// PUT /users/profile/:id — the logged-in user editing their own details.
export default function Settings() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhone_number] = useState("");
  const [loading, setLoading] = useState(false); //in order to updaue user about the state
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const currentUser = getCurrentUser();
  

useEffect(() => {
  async function loadUser() {
    try {
       setLoading(true);
      const data = await getUserById(currentUser.userId);

      setFirstName(data.firstName);
      setLastName(data.lastName);
      setEmail(data.email);
      setPhone_number(data.phone_number);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  loadUser();
}, []);

async function handleUpdate(e) {
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

  if (!/^\d{10}$/.test(phone_number)) {
    setError("Phone number must contain exactly 10 digits");
    return;
  }

  if (!email||(!email.includes("@"))) {
    setError("Invalid Email");
    return;
  }

  try {
    setLoading(true);
    await updateProfile(currentUser.userId, {
      firstName,
      lastName,
      email,
      phone_number,
    });

    setStatus("Profile updated successfully");
  } catch (err) {
    setError(err.message);
  }
  finally {
  setLoading(false);
}
}
return (
  <section>
    <h1>Profile Settings</h1>

    {loading && <p>Loading...</p>}
    {error && <p style={{ color: "red" }}>{error}</p>}
    {status && <p style={{ color: "green" }}>{status}</p>}

    <form onSubmit={handleUpdate}>
      <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input value={phone_number} onChange={(e) => setPhone_number(e.target.value)} />

      <button type="submit" disabled={loading}>Save</button>
    </form>
  </section>
); //according to  the state
}
