import { useState, useEffect, useRef } from "react";
import { useSocket } from "../context/SocketContext";
import { getCurrentUser } from "../services/authService";
import { apiRequest, getErrorMessage } from "../services/api";
import "./ChatBot.css";

const INITIAL_MSG = { from: "bot", text: "Hi! I'm Paw Assistant 🐾 How can I help you today?" };

// One id per browser session — keeps the AI conversation history tied
// together across messages sent to POST /chat/message.
function getSessionId() {
  let id = sessionStorage.getItem("pawtrait_chat_session");
  if (!id) {
    id = newSessionId();
  }
  return id;
}

function newSessionId() {
  const id = `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  sessionStorage.setItem("pawtrait_chat_session", id);
  return id;
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MSG]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [mode, setMode] = useState("ai"); // "ai" | "human"
  const bottomRef = useRef(null);
  const { userSocket: socket } = useSocket();
  const sessionId = useRef(getSessionId());

  useEffect(() => {
    socket.connect();

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
      setIsTyping(false);
    });

    socket.on("typing", ({ isTyping }) => setIsTyping(isTyping));

    socket.on("handoff_accepted", () => {
      setMode("human");
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "✅ You are now connected to the manager." },
      ]);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("typing");
      socket.off("handoff_accepted");
      socket.disconnect();
    };
  }, []);

  // On login/logout, start a brand-new chat for whoever is now using this browser tab:
  // dropping the socket lets the server tell the manager the previous customer left
  // (if a human chat was active), and a fresh session id starts a clean AI conversation.
  useEffect(() => {
    function handleAuthChange() {
      socket.disconnect();
      socket.connect();
      sessionId.current = newSessionId();
      setMode("ai");
      setMessages([INITIAL_MSG]);
      setIsTyping(false);
    }
    window.addEventListener("pawtrait-auth-change", handleAuthChange);
    return () => window.removeEventListener("pawtrait-auth-change", handleAuthChange);
  }, [socket]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  async function send(text) {
    const trimmed = (text ?? input).trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { from: "user", text: trimmed }]);
    setInput("");

    if (mode === "human") {
      // Live channel: manager is already connected, relay over the socket.
      socket.emit("sendMessage", { text: trimmed });
      return;
    }

    // AI channel: goes through the backend REST endpoint (never calls the AI provider directly).
    setIsTyping(true);
    try {
      const user = getCurrentUser();
      const data = await apiRequest("/chat/message", {
        method: "POST",
        body: { sessionId: sessionId.current, message: trimmed, userId: user?.userId ?? null },
      });
      setMessages((prev) => [...prev, { from: "bot", text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { from: "bot", text: getErrorMessage(err) }]);
    } finally {
      setIsTyping(false);
    }
  }

  function requestHuman() {
    const user = getCurrentUser();
    const userName = user ? `${user.firstName} ${user.lastName}` : "Guest";
    const history = messages.map((m) => ({
      role: m.from === "user" ? "user" : "assistant",
      content: m.text,
    }));
    socket.emit("human_handoff", { userName, history });
    setMessages((prev) => [
      ...prev,
      { from: "user", text: "I'd like to speak with the manager." },
    ]);
  }

  return (
    <div className="chatbot">
      {open && (
        <div className="chatbot__window">
          <div className="chatbot__header">
            <div className="chatbot__header-info">
              <span className="chatbot__paw">🐾</span>
              <div>
                <div className="chatbot__title">Paw Assistant</div>
                <div className="chatbot__status">
                  {mode === "human" ? "Manager" : "AI • ONLINE"}
                </div>
              </div>
            </div>
            <button className="chatbot__close" onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="chatbot__messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chatbot__msg chatbot__msg--${msg.from === "user" ? "user" : "bot"}`}
              >
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="chatbot__msg chatbot__msg--bot chatbot__typing">
                <span /><span /><span />
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="chatbot__quick-replies">
            {mode === "ai" && (
              <button className="chatbot__quick-btn chatbot__quick-btn--human" onClick={requestHuman}>
                👤 Talk to the manager
              </button>
            )}
          </div>

          <div className="chatbot__input-row">
            <input
              className="chatbot__input"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button className="chatbot__send" onClick={() => send()}>&#9658;</button>
          </div>
        </div>
      )}

      <button className="chatbot__fab" onClick={() => setOpen((o) => !o)}>
        🐾
      </button>
    </div>
  );
}
