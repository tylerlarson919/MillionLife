"use client";

import { useState } from "react";
import { gemini } from "@/firebase/config";

export default function GoalsPage() {
  const [goal, setGoal] = useState("");
  const [tasks, setTasks] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDecomposition = async () => {
    if (!goal) return;
    setLoading(true);
    setTasks("");
    try {
      const fullPrompt = `Decompose the following goal into a list of actionable tasks: "${goal}"`;
      const result = await gemini.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();
      setTasks(text);
    } catch (error) {
      console.error("Error generating tasks:", error);
      setTasks("Failed to generate tasks. Please check the console for more details.");
    } finally {
      setLoading(false);
    }
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
        disabled={loading}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? "Breaking Down Goal..." : "Break Down Goal"}
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