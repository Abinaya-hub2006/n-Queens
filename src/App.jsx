import React, { useState, useEffect } from "react";

// Helper: check if a queen can be placed at (r,c)
function isSafe(placements, r, c) {
  for (let [pr, pc] of placements) {
    if (pr === r || pc === c) return false;
    if (Math.abs(pr - r) === Math.abs(pc - c)) return false;
  }
  return true;
}

// Backtracking solver
function solveKQueens(n, k, limit = 5000) {
  const solutions = [];
  const placements = [];

  function backtrack(startIdx) {
    if (solutions.length >= limit) return;
    if (placements.length === k) {
      solutions.push([...placements]);
      return;
    }
    for (let pos = startIdx; pos < n * n; pos++) {
      const r = Math.floor(pos / n);
      const c = pos % n;
      if (isSafe(placements, r, c)) {
        placements.push([r, c]);
        backtrack(pos + 1);
        placements.pop();
        if (solutions.length >= limit) return;
      }
    }
  }

  backtrack(0);
  return solutions;
}

export default function App() {
  const [n, setN] = useState(8);
  const [k, setK] = useState(8);
  const [solutions, setSolutions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [status, setStatus] = useState("");
  const [searchLimit, setSearchLimit] = useState(1000);

  useEffect(() => {
    if (k > n * n) setK(n * n);
    if (k < 0) setK(0);
  }, [n, k]);

  function findOneSolution() {
    setStatus("Searching...");
    setSolutions([]);
    setCurrentIndex(0);
    setTimeout(() => {
      const sols = solveKQueens(n, k, 1);
      setSolutions(sols);
      setStatus(sols.length ? "Found 1 solution" : "No solution found");
    }, 10);
  }

  function findAllSolutions() {
    setStatus("Searching...");
    setSolutions([]);
    setCurrentIndex(0);
    setTimeout(() => {
      const sols = solveKQueens(n, k, searchLimit);
      setSolutions(sols);
      setStatus(
        sols.length
          ? `Found ${sols.length} solution(s) (limit ${searchLimit})`
          : "No solution found"
      );
    }, 10);
  }

  function renderBoard(sol) {
    const board = Array.from({ length: n }, () => Array(n).fill(""));

    for (let [r, c] of sol) board[r][c] = "Q";

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${n}, 1fr)`,
          width: Math.min(600, n * 50),
          border: "4px solid #ff3333",
          boxShadow: "0 0 20px rgba(255,0,0,0.6)",
        }}
      >
        {board.flatMap((row, r) =>
          row.map((cell, c) => {
            const isDark = (r + c) % 2 === 1;
            return (
              <div
                key={`${r}-${c}`}
                style={{
                  aspectRatio: "1 / 1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  fontWeight: 700,
                  background: isDark ? "#330000" : "#111111", // black-red theme
                  color: cell === "Q" ? "black" : "transparent",
                  textShadow:
                    cell === "Q" ? "0 0 8px rgba(255,0,0,0.8)" : "none",
                }}
              >
                {cell === "Q" ? "♛" : ""}
              </div>
            );
          })
        )}
      </div>
    );
  }

  const currentSolution = solutions.length ? solutions[currentIndex] : null;

  return (
    <div
      style={{
        padding: 24,
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #000000, #330000)",
        color: "#ffcccc",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ color: "#ff4d4d", textShadow: "0 0 8px #ff0000" }}>
        N-Queens Visualizer
      </h1>
      <p>Enter board size (n) and number of queens (k).</p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <label>
          Board size n:{" "}
          <input
            type="number"
            min={1}
            max={20}
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            style={{ padding: 4, background: "#111", color: "#fff" }}
          />
        </label>
        <label>
          Number of queens k:{" "}
          <input
            type="number"
            min={0}
            max={n * n}
            value={k}
            onChange={(e) => setK(Number(e.target.value))}
            style={{ padding: 4, background: "#111", color: "#fff" }}
          />
        </label>
        <label>
          Search limit:{" "}
          <input
            type="number"
            min={1}
            max={100000}
            value={searchLimit}
            onChange={(e) => setSearchLimit(Number(e.target.value))}
            style={{ padding: 4, background: "#111", color: "#fff" }}
          />
        </label>
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 16 }}>
        <button
          onClick={findOneSolution}
          style={{
            padding: "6px 12px",
            background: "#ff3333",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Find one solution
        </button>
        <button
          onClick={findAllSolutions}
          style={{
            padding: "6px 12px",
            background: "#cc0000",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Find all (limited)
        </button>
      </div>

      <div style={{ marginTop: 16 }}>
        <strong>Status:</strong> {status || "Idle"}
      </div>

      {solutions.length > 1 && (
        <div style={{ marginTop: 8 }}>
          <button
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
          >
            Prev
          </button>
          <span style={{ margin: "0 8px" }}>
            {currentIndex + 1} / {solutions.length}
          </span>
          <button
            onClick={() =>
              setCurrentIndex((i) => Math.min(solutions.length - 1, i + 1))
            }
            disabled={currentIndex === solutions.length - 1}
          >
            Next
          </button>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        {currentSolution ? (
          renderBoard(currentSolution)
        ) : (
          <p>No solution to display</p>
        )}
      </div>
    </div>
  );
}
