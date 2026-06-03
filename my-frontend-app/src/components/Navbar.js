import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../services/authService";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser); //re-read when login/logout happens

  useEffect(() => {
    function syncUser() {
      setUser(getCurrentUser());
    }
    window.addEventListener("pawtrait-auth-change", syncUser);
    return () => window.removeEventListener("pawtrait-auth-change", syncUser);
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  // Guest
  if (!user) {
    return (
      <nav className="navbar">
        <ul className="navbar-links">
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </nav>
    );
  }

  // Logged in user
  return (
    <nav className="navbar">
      <ul className="navbar-links">
        <li>
          <Link to="/settings">Settings</Link>
        </li>

        <li>
          <Link to="/personalArea">Personal Area</Link>
        </li>

        {(user.userRole === "admin" || user.userRole === "manager") && (
          <li>
            <Link to="/admin">Admin Dashboard</Link>
          </li>
        )}
      </ul>

      <div className="navbar-user">
        <span>Hello, {user.firstName}</span>

        <button onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
