import { NavLink } from "react-router-dom";

// The navigation bar. path: the url, label: the text shown in the sidebar, end: true only for the root path.
const nav = [
  { path: "/",             label: "Gallery", end: true },
  { path: "/cart",         label: "Cart" },
  { path: "/orders",       label: "My Orders" },
  { path: "/checkout",     label: "Checkout" },
  { path: "/profile",      label: "Profile" },
  { path: "/admin/users",  label: "Users (Admin)" },
  { path: "/login",        label: "Login" },
  { path: "/register",     label: "Register" },
];

// The left sidebar (menu) that stays on screen permanently.
//   1. header with logo + subtitle
//   2. navigation links
export default function Navbar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar__logo">Pawtrait</div>
        <div className="sidebar__subtitle">Pet Portrait Store</div>
      </div>
      <nav className="sidebar__nav">
        <ul>
          {nav.map(item => ( // loop through the nav items and render a link for each
            <li key={item.path}>
              <NavLink to={item.path} end={item.end ?? false}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
