import Navbar from "./Navbar";
import Header from "./Header";
import Footer from "./Footer";

// This is the layout component that is shared by every screen:
//   - Navbar: the sidebar on the left.
//   - Header: the top bar of the content area (shows the current page `title`).
//   - children: the actual page body (whatever route is being shown).
//   - Footer: the bottom bar of the content area.
// The title is the title of the page that is being shown.
// The children is the actual page body (whatever route is being shown).
export default function Layout({ title, children }) {
  return ( //return the layout component
    <div className="layout">
      <Navbar />
      <div className="layout__main">
        <Header title={title} />
        <main className="main-content">{children}</main>
        <Footer />
      </div>
    </div>
  );
}


