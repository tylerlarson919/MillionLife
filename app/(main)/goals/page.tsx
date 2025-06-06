"use client";

import { useState } from "react";

export default function GoalsPage() {
  const [goal, setGoal] = useState("");
  const [tasks, setTasks] = useState("");

  const handleDecomposition = async () => {
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: goal, gem_type: "goal_decomposition" }),
    });
    const data = await response.json();
    setTasks(data.result);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Goal-Oriented Architect</h1>
      <textarea
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        placeholder="Enter your high-level goal..."
        className="w-full mt-4 p-2 border rounded"
      />
      <button
        onClick={handleDecomposition}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Break Down Goal
      </button>
      {tasks && (
        <div className="mt-4 p-4 bg-white rounded shadow">
          <h2 className="text-xl font-bold">Actionable Tasks:</h2>
          <pre className="whitespace-pre-wrap mt-2">{tasks}</pre>
        </div>
      )}
    </div>
  );
}