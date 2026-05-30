import { useState, useEffect } from "react";
import { MemoryRouter, Routes, Route, Link } from "react-router-dom";

// ─── Slide 27: Navbar component ──────────────────────────────
function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/users">Users</Link>
      <Link to="/about">About</Link>
    </nav>
  );
}

// ─── Slide 28: Footer component ──────────────────────────────
function Footer({ year }) {
  return (
    <footer>
      <p>React Course App</p>
      <p>Built for learning components, routing, state, and API communication</p>
      <small>© {year} Web Development Environments</small>
    </footer>
  );
}

// ─── Slide 26: Layout component ──────────────────────────────
function Layout({ children }) {
  const [year, setYear] = useState("");

  useEffect(() => {
    async function fetchYear() {
      try {
        const res = await fetch("https://worldtimeapi.org/api/timezone/Asia/Jerusalem");
        const data = await res.json();
        const currentYear = new Date(data.datetime).getFullYear();
        setYear(currentYear);
      } catch {
        setYear(new Date().getFullYear());
      }
    }
    fetchYear();
  }, []);

  return (
    <div>
      <Navbar />
      <main>
        {children}
      </main>
      <Footer year={year} />
    </div>
  );
}

// ─── Slide 29: App using Layout around Routes ─────────────────
// (uses MemoryRouter instead of BrowserRouter so it's self-contained)
function LayoutApp() {
  return (
    <MemoryRouter>
      <Layout>
        <Routes>
          <Route path="/"      element={<p>Welcome to the Home page.</p>} />
          <Route path="/users" element={<p>This is the Users page.</p>} />
          <Route path="/about" element={<p>About this application.</p>} />
        </Routes>
      </Layout>
    </MemoryRouter>
  );
}

// ─── Page ─────────────────────────────────────────────────────
export default function LayoutExample() {
  return (
    <div>
      <h1 className="page-title">Layout</h1>
      <p className="page-lead">
        A layout is a reusable wrapper that keeps shared UI (Navbar, Footer, Sidebar)
        consistent across all pages. Route-specific content is injected via the{" "}
        <code>children</code> prop.
      </p>

      <div className="card">
        <h3 className="card__title">Terminology</h3>
        <div className="term-grid">
          <div className="term-grid__item">
            <strong>Layout</strong>
            <p>Shared page structure used across multiple routes or screens.</p>
          </div>
          <div className="term-grid__item">
            <strong>Page</strong>
            <p>Route-specific content that changes based on navigation.</p>
          </div>
          <div className="term-grid__item">
            <strong>Component</strong>
            <p>Reusable UI element used within pages or layouts.</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="card__title">Wrapping Routes in a Layout — slide 29</h3>
        <p>
          Place <code>&lt;Layout&gt;</code> around <code>&lt;Routes&gt;</code>. Whatever the active
          route renders is passed as <code>children</code> and injected into the layout's{" "}
          <code>&lt;main&gt;</code>.
        </p>
        <pre>{`<BrowserRouter>
  <Layout>
    <Routes>
      <Route path="/"      element={<Home />} />
      <Route path="/users" element={<Users />} />
      <Route path="/about" element={<About />} />
    </Routes>
  </Layout>
</BrowserRouter>`}</pre>
      </div>

      <div className="card">
        <h3 className="card__title">Live Demo — slides 26, 27, 28, 29</h3>
        <p>
          The Navbar and Footer stay fixed. Only the <code>&lt;main&gt;</code> content changes.
          The footer year is fetched from <code>worldtimeapi.org</code>.
        </p>
        <div className="demo-box layout-demo">
          <LayoutApp />
        </div>
      </div>
    </div>
  );
}
