import { Link, useParams } from "react-router-dom";

// ─── Page components (also registered as real routes in App.jsx) ──
export function Home() {
  return <p>Welcome to the Home page.</p>;
}

export function About() {
  return <p>About this application.</p>;
}

export function UserDetails() {
  const { id } = useParams();
  return <h1>User ID: {id}</h1>;
}

export function Users() {
  const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Carol" },
  ];
  return (
    <div>
      <h2>Users</h2>
      {users.map(u => (
        <p key={u.id}><Link to={`/users/${u.id}`}>{u.name}</Link></p>
      ))}
    </div>
  );
}

// ─── Live demo (uses the real BrowserRouter from App.jsx) ────
function RouterDemo() {
  return (
    <div>
      <nav>
        <Link to="/" style={{ marginRight: 12 }}>Home</Link>
        <Link to="/users" style={{ marginRight: 12 }}>Users</Link>
        <Link to="/about">About</Link>
      </nav>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────
export default function Routing() {
  return (
    <div>
      <h1 className="page-title">React Routing</h1>
      <p className="page-lead">
        <code>react-router-dom</code> enables SPA navigation — the browser stays on the same
        HTML page while components swap in and out based on the URL.
      </p>

      <div className="card">
        <h3 className="card__title">Installation</h3>
        <span className="install-cmd">npm install react-router-dom</span>
        <p>
          Key pieces: <code>BrowserRouter</code>, <code>Routes</code>, <code>Route</code>,{" "}
          <code>Link</code>, <code>useParams</code>.
        </p>
      </div>

      <div className="card">
        <h3 className="card__title">Basic Router Setup — slide 20</h3>
        <p>
          Wrap your app in <code>BrowserRouter</code>, then use <code>Routes</code> and{" "}
          <code>Route</code> to map URL paths to components.
        </p>
      </div>

      <div className="card">
        <h3 className="card__title">Route Map</h3>
        <ul className="route-map">
          <li><code>/</code>          <span className="arrow">→</span> Home</li>
          <li><code>/users</code>     <span className="arrow">→</span> Users</li>
          <li><code>/users/:id</code> <span className="arrow">→</span> UserDetails (route parameter)</li>
          <li><code>/about</code>     <span className="arrow">→</span> About</li>
        </ul>
      </div>

      <div className="card">
        <h3 className="card__title">Route Parameters — slide 22</h3>
        <p>
          Add <code>:paramName</code> to the path, then read it with <code>useParams()</code>.
          Try navigating to <code>/users/1</code> — the <code>id</code> comes from the URL.
        </p>
      </div>

      <div className="card">
        <h3 className="card__title">Live Demo — slides 20, 21, 22</h3>
        <p>Watch the URL bar change as you navigate:</p>
        <RouterDemo />
      </div>
    </div>
  );
}
