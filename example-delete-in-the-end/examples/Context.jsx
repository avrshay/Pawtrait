import { useContext, useState } from "react";
import UserContext from "./UserContext";

// ─── Slide 37: Consuming context with useContext ──────────────
function UserProfile() {
  const { user } = useContext(UserContext);

  return (
    <div>
      <p>Name: {user.name}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}

// ─── Slide 38: Updating context state ────────────────────────
function UpdateUser() {
  const { setUser } = useContext(UserContext);

  function changeName() {
    setUser(prev => ({ ...prev, name: "Maya" }));
  }

  return <button onClick={changeName}>Change Name</button>;
}

// ─── Intermediate component — receives no props ───────────────
function Dashboard() {
  return (
    <div>
      <UserProfile />
      <UpdateUser />
    </div>
  );
}

// ─── Slide 36: Provider wrapping the tree ────────────────────
function ContextApp() {
  const [user, setUser] = useState({ name: "Dan", role: "Admin" });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Dashboard />
    </UserContext.Provider>
  );
}

// ─── Page ─────────────────────────────────────────────────────
export default function Context() {
  return (
    <div>
      <h1 className="page-title">React Context</h1>
      <p className="page-lead">
        Context lets you share data across components without manually passing props
        at every level — solving the <em>prop drilling</em> problem.
      </p>

      <div className="card">
        <h3 className="card__title">When to use Context — slide 39</h3>
        <div className="use-avoid">
          <div className="use-avoid__box use-avoid__box--yes">
            <strong>Use for</strong>
            <ul>
              <li>Logged-in user (auth)</li>
              <li>Theme (dark / light)</li>
              <li>Global settings</li>
            </ul>
          </div>
          <div className="use-avoid__box use-avoid__box--no">
            <strong>Avoid for</strong>
            <ul>
              <li>Local component state</li>
              <li>Frequently changing data (causes many re-renders)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="card__title">Full Flow — slides 36–38</h3>
        <ol className="flow-steps">
          <li><code>createContext()</code> — creates the context object (outside components)</li>
          <li><code>&lt;Context.Provider value={"{…}"}&gt;</code> — supplies the value to all descendants</li>
          <li><code>useContext(MyContext)</code> — any child reads the value directly, no props needed</li>
          <li><code>setState</code> — updating the value re-renders all consumers</li>
        </ol>
      </div>

      <div className="card">
        <h3 className="card__title">Live Demo — slides 36, 37, 38</h3>
        <p>
          <code>Dashboard</code> sits between the Provider and the consumers but receives{" "}
          <strong>no props</strong>. Both <code>UserProfile</code> and <code>UpdateUser</code>{" "}
          read from / write to context directly.
        </p>
        <div className="demo-box">
          <p className="demo-label">live demo</p>
          <ContextApp />
        </div>
      </div>
    </div>
  );
}
