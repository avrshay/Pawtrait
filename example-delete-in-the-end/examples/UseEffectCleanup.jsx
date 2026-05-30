import { useEffect, useState, useCallback } from "react";

function TimerWithoutCleanup({ onTick }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setInterval(() => {
      setCount(c => c + 1);   // ignored after unmount
      onTick("Without Cleanup"); // parent is still mounted — this works
    }, 1000);
  }, []);

  return (
    <div className="box bad">
      <h2>Without Cleanup</h2>
      <p>Count: {count}</p>
      <p>The interval is never cleared — it keeps firing after unmount.</p>
    </div>
  );
}

function TimerWithCleanup({ onTick }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
      onTick("With Cleanup");
    }, 1000);

    return () => clearInterval(id);
  }, []);

  return (
    <div className="box good">
      <h2>With Cleanup</h2>
      <p>Count: {count}</p>
      <p>The interval is cleared when the component is removed.</p>
    </div>
  );
}

export default function UseEffectCleanup() {
  const [showTimers, setShowTimers] = useState(true);
  const [log, setLog] = useState([]);

  const addLog = useCallback((source) => {
    setLog(prev => {
      const time = new Date().toLocaleTimeString();
      return [...prev.slice(-14), { time, source }];
    });
  }, []);

  return (
    <div>
      <h1 className="page-title">useEffect Cleanup</h1>
      <p className="page-lead">
        Return a cleanup function from useEffect to cancel side effects when a
        component unmounts or before the next effect runs.
      </p>

      <div className="card">
        <button onClick={() => setShowTimers(prev => !prev)}>
          {showTimers ? "Remove Components" : "Show Components"}
        </button>

        {showTimers && (
          <div className="container">
            <TimerWithoutCleanup onTick={addLog} />
            <TimerWithCleanup onTick={addLog} />
          </div>
        )}

        <div className="demo-box" style={{ marginTop: "1rem" }}>
          <p className="demo-label">
            interval log — remove the components and watch what happens
          </p>
          {log.length === 0 && <p style={{ color: "#888" }}>Waiting for ticks…</p>}
          {log.map((entry, i) => (
            <div
              key={i}
              style={{ color: entry.source === "Without Cleanup" ? "#c0392b" : "#27ae60" }}
            >
              {entry.time} — {entry.source}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
