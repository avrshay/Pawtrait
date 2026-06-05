import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../services/authService";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());

  useEffect(() => {
    function syncUser() {
      setUser(getCurrentUser());
    }
    window.addEventListener("pawtrait-auth-change", syncUser);

    return () => {
      window.removeEventListener("pawtrait-auth-change", syncUser);
    };
  }, []);

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="navbar">

      <div className="navbar-logo">
        <img src="/logo192.png" alt="PawTrait Logo" />
        <h2>PawTrait</h2>
      </div>

      {!user && (
        <ul className="navbar-links">
          <li>
            <Link to="/login">Login</Link>
          </li>

          <li>
            <Link to="/register">Register</Link>
          </li>
        </ul>
      )}

      {user && (
        <>
          <div className="navbar-user">
            <p>
              {user.firstName} {user.lastName}
            </p>

          </div>

          <ul className="navbar-links">

            {user.userRole === "user" && (
              <>
                <li>
                  <Link to="/">Gallery</Link>
                </li>

                <li>
                  <Link to="/cart">My Cart</Link>
                </li>

                <li>
                  <Link to="/personal-area">My Orders</Link>
                </li>
              </>
            )}

            {user.userRole === "manager" && (
              <li>
                <Link to="/manager">
                  Manager Dashboard
                </Link>
              </li>
            )}

            {user.userRole === "admin" && (
              <li>
                <Link to="/admin">
                  Admin Dashboard
                </Link>
              </li>
            )}

            <li>
              <Link to="/settings">
                Settings
              </Link>
            </li>
          </ul>

          <div className="navbar-logout">
            <button onClick={handleLogout}>
              Logout
            </button>
          </div>
        </>
      )}
    </nav>
  );
}