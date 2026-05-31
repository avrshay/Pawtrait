import Navbar from "./Navbar";
import Header from "./Header";
import Footer from "./Footer";

// The page shell shared by every screen:
//   - Navbar: the fixed sidebar on the left.
//   - Header: the top bar of the content area (shows the current page `title`).
//   - children: the actual page body (whatever route is being shown).
//   - Footer: the bottom bar of the content area.
// Pages don't repeat this structure; they just get wrapped by <Layout>.
export default function Layout({ title, children }) {
  return (
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
