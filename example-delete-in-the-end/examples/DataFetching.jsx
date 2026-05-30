import { useState, useEffect } from "react";

// ─── Slide 12: Basic fetch ────────────────────────────────────
function UsersList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(response => response.json())
      .then(data => setUsers(data));
  }, []);

  return (
    <div>
      <h2>Users</h2>
      {users.map(user => (
        <p key={user.id}>{user.name}</p>
      ))}
    </div>
  );
}

// ─── Slide 31: Error handling ─────────────────────────────────
function UsersPageError() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!res.ok) {
          throw new Error("Request failed");
        }
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError("Could not load users");
      }
    }
    fetchUsers();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Users</h2>
      {users.map(user => (
        <p key={user.id}>{user.name}</p>
      ))}
    </div>
  );
}

// ─── Slide 32: Error + loading state ─────────────────────────
function UsersPageLoading() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!res.ok) {
          throw new Error("Request failed");
        }
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError("Could not load users");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Users</h2>
      {users.map(user => (
        <p key={user.id}>{user.name}</p>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────
export default function DataFetching() {
  return (
    <div>
      <h1 className="page-title">Data Fetching</h1>
      <p className="page-lead">
        Pattern: <strong>initial render → fetch → update state → re-render.</strong> Always handle
        loading and error states so users get meaningful feedback.
      </p>

      <div className="card">
        <h3 className="card__title">Basic Fetch — slide 12</h3>
        <p>
          Fetch inside <code>useEffect(fn, [])</code> so it runs once after mount.
          The resolved data is stored with <code>useState</code>, triggering a re-render.
        </p>
        <div className="demo-box">
          <p className="demo-label">live demo</p>
          <UsersList />
        </div>
      </div>

      <div className="card">
        <h3 className="card__title">Error Handling — slide 31</h3>
        <p>
          Wrap the fetch in <code>try/catch</code>. Check <code>res.ok</code> explicitly —
          HTTP error codes (400, 500, …) do <em>not</em> throw by default.
        </p>
        <div className="demo-box">
          <p className="demo-label">live demo</p>
          <UsersPageError />
        </div>
      </div>

      <div className="card">
        <h3 className="card__title">Error + Loading State — slide 32</h3>
        <p>
          Add a <code>loading</code> flag initialised to <code>true</code> and set it
          to <code>false</code> in <code>finally</code>, so it clears on both success and failure.
        </p>
        <div className="demo-box">
          <p className="demo-label">live demo</p>
          <UsersPageLoading />
        </div>
      </div>
    </div>
  );
}
