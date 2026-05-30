import { useState } from "react";

// ─── Slide 17: Controlled input ───────────────────────────────
// URL changed from localhost:3000 to JSONPlaceholder so the demo runs without a backend
function UserForm() {
  const [name, setName] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch("https://jsonplaceholder.typicode.com/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
    const data = await res.json();
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Enter name"
      />
      <button type="submit">Send</button>
    </form>
  );
}

// ─── Page ─────────────────────────────────────────────────────
export default function Forms() {
  return (
    <div>
      <h1 className="page-title">Forms</h1>
      <p className="page-lead">
        Controlled inputs bind the element's value to React state. On submit, the
        collected data is serialised and sent to the backend via <code>fetch</code>.
      </p>

      <div className="card">
        <h3 className="card__title">Controlled Input — slide 17</h3>
        <p>
          The input's <code>value</code> prop is driven by state. Every keystroke calls
          <code> setName</code>, keeping React as the single source of truth.
          <code> e.preventDefault()</code> stops the browser's default page reload on submit.
        </p>
        <p>
          Flow: <strong>Input → useState → handleSubmit → fetch (API) → backend → response → console</strong>
        </p>
        <div className="demo-box">
          <p className="demo-label">live demo — response logged to console (F12)</p>
          <UserForm />
        </div>
      </div>

      <div className="card">
        <h3 className="card__title">Key concepts</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Attribute / API</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>value={"{name}"}</td><td>Binds input to React state (controlled)</td></tr>
            <tr><td>onChange</td><td>Updates state on every keystroke</td></tr>
            <tr><td>e.preventDefault()</td><td>Prevents default browser form submission</td></tr>
            <tr><td>JSON.stringify</td><td>Serialises state to JSON for the request body</td></tr>
            <tr><td>Content-Type: application/json</td><td>Tells the server the body format</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
