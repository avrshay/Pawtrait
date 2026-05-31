import { useLocation } from "react-router-dom";
import { getCurrentUser } from "../services/authService";

// Maps a URL path to the title shown in the header bar.
const TITLES = {
  "/": "Gallery",
  "/cart": "Cart",
  "/orders": "My Orders",
  "/checkout": "Checkout",
  "/profile": "Profile",
  "/admin/users": "Users (Admin)",
  "/login": "Login",
  "/register": "Register",
};

function titleForPath(pathname) {
  if (TITLES[pathname]) return TITLES[pathname];
  if (pathname.startsWith("/gallery/")) return "Product";
  if (pathname.startsWith("/orders/")) return "Order";
  if (pathname.startsWith("/admin/users/")) return "User";
  return "Pawtrait";
}

// Top bar of the content area: the current page title on the left and the
// logged-in user's role on the right. An explicit `title` prop overrides the
// title auto-detected from the route.
export default function Header({ title }) {
  const { pathname } = useLocation();
  const user = getCurrentUser();
  const heading = title || titleForPath(pathname);
  const role = user && user.userRole ? user.userRole : "Guest";

  return (
    <header className="header">
      <h1 className="header__title">{heading}</h1>
      <span className="header__role">Role: {role}</span>
    </header>
  );
}
