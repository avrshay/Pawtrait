import { useEffect, useState } from "react";
import { getCurrentUser } from "../services/authService";

// Top bar of the content area
// logged-in user's first name, or "Guest" when nobody is logged in.
export default function Header({ username }) {
  const [user, setUser] = useState(getCurrentUser); //re-read when login/logout happens

  useEffect(() => {
    function syncUser() {
      setUser(getCurrentUser());
    }
    window.addEventListener("pawtrait-auth-change", syncUser);
    return () => window.removeEventListener("pawtrait-auth-change", syncUser);
  }, []);

  const name = username || (user && user.firstName) || "Guest";

  const hour = new Date().getHours();
  const timeGreeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <header className="Header">
      <h1 className="header-greeting">
        {name === "Guest" ? (
          "Welcome to Pawtrait Studio!"
        ) : (
          <>
            {timeGreeting}, <span className="user-name">{name}</span>!
          </>
        )}
      </h1>
      {name === "Guest" && (
        <p className="header-subtitle">
          <strong>Let's create something beautiful for your furry friend today.</strong>
        </p>
      )}
    </header>
  );
}
