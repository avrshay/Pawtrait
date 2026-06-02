import { useState } from "react";
import { register, saveCurrentUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

// POST /auth/register.
export default function Register() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhone_number] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); //in order to updaue user about the state
  const [error, setError] = useState("");

  async function  handleRegister(e) {
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

      if (!/^\d{10}$/.test(phone_number)) {
        setError("Phone number must contain exactly 10 digits");
        return;
      }

      if (!email||(!email.includes("@"))) {
        setError("Invalid Email");
        return;
      }


      if (!password||password.length < 6) {
        setError(" Password is required (at least 6 characters)");
        return;
      }
      try {
        setLoading(true);

        const user = await register({ firstName, lastName,email,phone_number,password });

        saveCurrentUser(user);

        alert("נרשמת בהצלחה 🎉");
        navigate("/"); // redirect

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
return (
  <section>
    <h1>Register</h1>
    <form onSubmit={handleRegister}>
    <input
      type="text"
      placeholder="First Name"
      value={firstName}
      onChange={(e) => setFirstName(e.target.value)} //Any changes the user types will be reflected on the screen.
    />
    <input
      type="text"
      placeholder="Last Name"
      value={lastName}
      onChange={(e) => setLastName(e.target.value)} //Any changes the user types will be reflected on the screen.
    />
    <input
      type="text"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)} //Any changes the user types will be reflected on the screen.
    />
    <input
      type="text"
      placeholder="Phone Number"
      value={phone_number}
      onChange={(e) => setPhone_number(e.target.value)} //Any changes the user types will be reflected on the screen.
    />
    <input
      type="text"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
    <button type="submit" disabled={loading}> 
      {loading ? "Registering..." : "Register"} 
    </button>
    </form>
    {error && <p style={{ color: "red" }}>{error}</p>}
  </section>
); //according to the state-While loading, the user will not be able to press the button again 
}
