import { useState } from "react";

// ─── Slide 34: Child that writes shared state ─────────────────
function MessageInput({ setMessage }) {
  const [text, setText] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setMessage(text);
    setText("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={text} onChange={e => setText(e.target.value)} placeholder="Write message" />
      <button type="submit">Update Message</button>
    </form>
  );
}

// ─── Slide 34: Child that reads shared state ──────────────────
function MessageDisplay({ message }) {
  return (
    <div>
      <h2>Current Message</h2>
      <p>{message}</p>
    </div>
  );
}

// ─── Slide 34: Parent owns the state ─────────────────────────
function LiftingStateApp() {
  const [message, setMessage] = useState("No message yet");

  return (
    <div>
      <MessageInput setMessage={setMessage} />
      <MessageDisplay message={message} />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────
export default function LiftingState() {
  return (
    <div>
      <h1 className="page-title">Lifting State Up</h1>
      <p className="page-lead">
        When two sibling components need to share data, move the state to their closest
        shared parent. The parent owns the state; children receive it as props.
      </p>

      <div className="card">
        <h3 className="card__title">The Pattern</h3>
        <table className="pattern-table">
          <thead>
            <tr>
              <th>Component</th>
              <th>Role</th>
              <th>Prop received</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>App (parent)</td>
              <td>Owns the shared state</td>
              <td>—</td>
            </tr>
            <tr>
              <td>MessageInput</td>
              <td>Triggers state updates</td>
              <td>setMessage</td>
            </tr>
            <tr>
              <td>MessageDisplay</td>
              <td>Reads the current value</td>
              <td>message</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3 className="card__title">Live Demo — slide 34</h3>
        <p>
          <code>MessageInput</code> and <code>MessageDisplay</code> are siblings — they share
          state only through the parent. Type a message and click Update.
        </p>
        <div className="demo-box">
          <p className="demo-label">live demo</p>
          <LiftingStateApp />
        </div>
      </div>
    </div>
  );
}
