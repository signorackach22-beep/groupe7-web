import { useState } from "react";

const MAX = 10;

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="counter-box">
      <h3>Compteur (Partie 5 — useState)</h3>
      <div className="counter-display">{count}</div>

      {count >= MAX && (
        <p className="counter-warning">⚠️ Limite maximale atteinte !</p>
      )}

      <div className="counter-buttons">
        <button
          onClick={() => setCount((c) => Math.max(0, c - 1))}
          disabled={count === 0}
        >
          −
        </button>
        <button onClick={() => setCount(0)}>Reset</button>
        <button
          onClick={() => setCount((c) => Math.min(MAX, c + 1))}
          disabled={count >= MAX}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default Counter;
