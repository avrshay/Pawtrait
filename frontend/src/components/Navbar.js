import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../services/authService";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());

  useEffect(() => {
    function syncUser() {
      setUser(getCurrentUser());
    }
    window.addEventListener("pawtrait-auth-change", syncUser);
    return () => window.removeEventListener("pawtrait-auth-change", syncUser);
  }, []);

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="navbar">

      <NavLink to="/" className="navbar-logo">
        <img src="/logo.svg" alt="PawTrait Logo" />
        <h2>PawTrait</h2>
      </NavLink>

      {!user && (
        <ul className="navbar-links">
          <li>
            <NavLink to="/login">
              <span className="material-symbols-outlined">login</span>
              Login
            </NavLink>
          </li>
          <li>
            <NavLink to="/register">
              <span className="material-symbols-outlined">person_add</span>
              Register
            </NavLink>
          </li>
        </ul>
      )}

      {user && (
        <>
          <div className="navbar-user">
            <span className="material-symbols-outlined navbar-user-icon">account_circle</span>
            <p>{user.firstName} {user.lastName}</p>
          </div>

          <ul className="navbar-links">
            {user.userRole === "user" && (
              <>
                <li>
                  <NavLink to="/">
                    <span className="material-symbols-outlined">gallery_thumbnail</span>
                    Gallery
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/cart">
                    <span className="material-symbols-outlined">shopping_cart</span>
                    My Cart
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/personal-area">
                    <span className="material-symbols-outlined">receipt_long</span>
                    My Orders
                  </NavLink>
                </li>
              </>
            )}

            {user.userRole === "manager" && (
              <li>
                <NavLink to="/manager">
                  <span className="material-symbols-outlined">dashboard</span>
                  Manager Dashboard
                </NavLink>
              </li>
            )}

            {user.userRole === "admin" && (
              <li>
                <NavLink to="/admin">
                  <span className="material-symbols-outlined">admin_panel_settings</span>
                  Admin Dashboard
                </NavLink>
              </li>
            )}

            <li>
              <NavLink to="/settings">
                <span className="material-symbols-outlined">manage_accounts</span>
                Settings
              </NavLink>
            </li>
          </ul>

          <div className="navbar-logout">
            <button onClick={handleLogout}>
              <span className="material-symbols-outlined">logout</span>
              Logout
            </button>
          </div>
        </>
      )}
    </nav>
  );
}
