"use client";

import { useState, useEffect } from "react";

export function Timer({ initialMinutes = 25 }) {
  const [seconds, setSeconds] = useState(initialMinutes * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval!);
    }
    return () => clearInterval(interval!);
  }, [isActive, seconds]);

  const toggle = () => {
    setIsActive(!isActive);
  };

  const reset = () => {
    setSeconds(initialMinutes * 60);
    setIsActive(false);
  };

  const displayTime = `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;

  return (
    <div className="text-center">
      <div className="text-5xl font-bold">{displayTime}</div>
      <button onClick={toggle} className="px-4 py-2 m-2 bg-green-500 text-white rounded">
        {isActive ? "Pause" : "Start"}
      </button>
      <button onClick={reset} className="px-4 py-2 m-2 bg-yellow-500 text-white rounded">
        Reset
      </button>
    </div>
  );
}