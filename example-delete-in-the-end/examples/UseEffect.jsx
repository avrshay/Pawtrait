import { useState, useEffect } from "react";

// ─── Fetch on mount ───────────────────────────────────────────
function UserCard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users/1")
      .then(res => res.json())
      .then(data => setUser(data));
  }, []);

  if (!user) return <p>Loading...</p>;
  return (
    <div>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  );
}

// ─── Run on every render ──────────────────────────────────────
function RenderCount() {
  const [count, setCount] = useState(0);
  const [renders, setRenders] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setRenders(prev => prev + 1);
    }, 2000);
  });

  return (
    <div>
      <p>Effect has run <strong>{renders}</strong> time(s)</p>
    </div>
  );
}

// ─── Run when dependency changes ──────────────────────────────
function SearchLogger() {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (query) console.log("Searching for:", query);
  }, [query]);

  return (
    <input
      placeholder="Type to search..."
      value={query}
      onChange={e => setQuery(e.target.value)}
    />
  );
}

// ─── Page ─────────────────────────────────────────────────────
export default function UseEffect() {
  return (
    <div>
      <h1 className="page-title">useEffect</h1>
      <p className="page-lead">
        Run side effects after render. The dependency array controls when the effect re-runs.
      </p>

      <div className="card">
        <h3 className="card__title">Dependency Array</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Syntax</th>
              <th>When the effect runs</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>useEffect(fn, [])</td>
              <td>Once — after the initial render only</td>
            </tr>
            <tr>
              <td>useEffect(fn, [x])</td>
              <td>After first render, and whenever x changes</td>
            </tr>
            <tr>
              <td>useEffect(fn)</td>
              <td>After every render cycle</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3 className="card__title">Fetch on Mount — <code>[]</code></h3>
        <p>
          Passing an empty array runs the effect once after the first render — ideal for
          data fetching on mount.
        </p>
        <div className="demo-box">
          <UserCard />
        </div>
      </div>

      <div className="card">
        <h3 className="card__title">Run on Every Render — no array</h3>
        <p>
          Omitting the dependency array runs the effect after <em>every</em> render.
        </p>
        <div className="demo-box">
          <RenderCount />
        </div>
      </div>

      <div className="card">
        <h3 className="card__title">Run on Dependency Change — <code>[query]</code></h3>
        <p>
          The effect re-runs only when <code>query</code> changes. Open the console and
          start typing.
        </p>
        <div className="demo-box">
          <SearchLogger />
        </div>
      </div>
    </div>
  );
}
