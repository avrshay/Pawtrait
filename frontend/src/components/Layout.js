import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Header from "./Header";
import Footer from "./Footer";
import ChatBot from "./ChatBot";
import { getCurrentUser } from "../services/authService";

// This is the layout component that is shared by every screen:
//   - Navbar: the sidebar on the left.
//   - Header: the top bar of the content area (shows the current page `title`).
//   - children: the actual page body (whatever route is being shown).
//   - Footer: the bottom bar of the content area.
// The title is the title of the page that is being shown.
// The children is the actual page body (whatever route is being shown).
export default function Layout({ username , children }) {
  const [currentUser, setCurrentUser] = useState(getCurrentUser); // re-read when login/logout happens

  useEffect(() => {
    function syncUser() {
      setCurrentUser(getCurrentUser());
    }
    window.addEventListener("pawtrait-auth-change", syncUser);
    return () => window.removeEventListener("pawtrait-auth-change", syncUser);
  }, []);

  const isCustomer = !currentUser?.userRole || currentUser.userRole === "user";

  return ( //return the layout component
    <div className="layout">
      <Navbar user={username} />
      <div className="layout__main">
        <Header username={username} />
        <main className="main-content">{children}</main>
        <Footer />
      </div>
      {isCustomer && <ChatBot />}
    </div>
  );
}


