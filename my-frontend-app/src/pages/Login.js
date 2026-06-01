import { useState } from "react";
import { login, saveCurrentUser } from "../services/authService";


// POST /auth/login.
export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); //in order to updaue user about the state
  const [error, setError] = useState("");

  async function  handleLogin(e) {
      e.preventDefault();
      setError(""); //clean

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

        const user = await login({ email, password });

        saveCurrentUser(user);

        alert("התחברת בהצלחה 🎉");

        // בהמשך נעשה redirect
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
return (
  <section>
    <h1>Login</h1>
    <form onSubmit={handleLogin}>
    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)} //Any changes the user types will be reflected on the screen.
    />

    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
    <button type="sumbit" disabled={loading}>  
      {loading ? "connect..." : "Login"} 
    </button>
    </form>
    {error && <p style={{ color: "red" }}>{error}</p>}
  </section>
); //according to  the state
}
