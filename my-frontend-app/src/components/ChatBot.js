import { useState } from "react";
import "./ChatBot.css";

const QUICK_REPLIES = ["ORDER STATUS", "UPLOAD PHOTOS", "STYLES"];

export default function ChatBot() {
  const [open, setOpen] = useState(false);

  return (
    <div className="chatbot">
      {open && (
        <div className="chatbot__window">
          <div className="chatbot__header">
            <div className="chatbot__header-info">
              <span className="chatbot__paw">🐾</span>
              <div>
                <div className="chatbot__title">Paw Assistant</div>
                <div className="chatbot__status">ONLINE TO HELP</div>
              </div>
            </div>
            <button className="chatbot__close" onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="chatbot__messages">
            <div className="chatbot__msg chatbot__msg--bot">
              Hi! How can I help you today?
            </div>
            <div className="chatbot__msg chatbot__msg--bot">
              Are you looking for a specific pet portrait style or need help with your order?
            </div>
          </div>

          <div className="chatbot__quick-replies">
            {QUICK_REPLIES.map((label) => (
              <button key={label} className="chatbot__quick-btn">{label}</button>
            ))}
          </div>

          <div className="chatbot__input-row">
            <input className="chatbot__input" placeholder="Type a message..." />
            <button className="chatbot__send">&#9658;</button>
          </div>
        </div>
      )}

      <button className="chatbot__fab" onClick={() => setOpen((o) => !o)}>
        🐾
      </button>
    </div>
  );
}
