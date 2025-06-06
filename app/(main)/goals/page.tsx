"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useCompletion } from "ai/react";

export default function GoalsPage() {
  const [goal, setGoal] = useState("");

  const {
    completion,
    complete,
    isLoading,
    error,
  } = useCompletion({
    api: "/api/gemini",
  });

  const [displayedCompletion, setDisplayedCompletion] = useState("");

  // Animation logic to reveal text smoothly
  useEffect(() => {
    // When the full completion string from the stream is longer than what's displayed,
    // we animate the reveal of the new text.
    if (completion.length > displayedCompletion.length) {
      // Get the next character to add
      const nextChar = completion[displayedCompletion.length];

      // Use a very short, non-blocking timeout to create a rapid reveal effect.
      // This is fast enough to look like a smooth wipe, not a slow typewriter.
      const timerId = setTimeout(() => {
        setDisplayedCompletion((prev) => prev + nextChar);
      }, 1); // Speed of the reveal effect. Lower is faster.

      return () => clearTimeout(timerId);
    }
  }, [completion, displayedCompletion]);

  const handleDecomposition = () => {
    if (!goal) return;
    // Clear previous completion when starting a new one
    setDisplayedCompletion("");
    const fullPrompt = `Decompose the following goal into a list of actionable tasks: "${goal}"`;
    complete(fullPrompt);
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        Goal-Oriented Architect
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Enter a high-level goal, and the AI will break it down into smaller,
        actionable tasks for you.
      </p>
      <textarea
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        placeholder="e.g., Launch a new SaaS product by the end of Q3"
        className="w-full mt-4 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
      />
      <button
        onClick={handleDecomposition}
        disabled={isLoading}
        className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
      >
        {isLoading ? "Breaking Down Goal..." : "Break Down Goal"}
      </button>

      {error && (
        <div className="mt-6 p-4 bg-red-100 dark:bg-red-800 border border-red-400 dark:border-red-700 text-red-800 dark:text-red-200 rounded-lg">
          <h2 className="text-xl font-bold">An Error Occurred</h2>
          <p className="mt-2 font-mono text-sm">{error.message}</p>
        </div>
      )}

      {(displayedCompletion || isLoading) && !error && (
        <div className="mt-6 p-5 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-inner">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Actionable Tasks:
          </h2>
          <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert mt-2 max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {displayedCompletion}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}