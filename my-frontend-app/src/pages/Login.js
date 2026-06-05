import { useState } from "react";
import { login, saveCurrentUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/back-button";

// POST /auth/login.
export default function Login() {
  const navigate = useNavigate();
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
        if (user.userRole === "admin") { // redirect
          navigate("/admin");
        } 
        else if (user.userRole === "manager") {
          navigate("/manager");
        } 
        else {
          navigate("/");
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
return (
  <section>
    <BackButton label="← Back" />
    <h1>Login</h1>
    <form onSubmit={handleLogin}>
    <input
      type="text"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)} //Any changes the user types will be reflected on the screen.
    />

    <input
      type="text"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
    <button type="submit" disabled={loading}>  
      {loading ? "connect..." : "Login"} 
    </button>
    </form>
    {error && <p style={{ color: "red" }}>{error}</p>}
  </section>
); //according to  the state
}
