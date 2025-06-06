"use client";

import Link from "next/link";
import { Cog, Sun, Moon, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useSettings } from "@/context/SettingsContext";
import { useTheme } from "next-themes";

export function Sidebar() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const settingsMenuRef = useRef<HTMLDivElement>(null);
  const { voices, selectedVoice, setSelectedVoice } = useSettings();
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        settingsMenuRef.current &&
        !settingsMenuRef.current.contains(event.target as Node)
      ) {
        setIsSettingsOpen(false);
        setIsThemeMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [settingsMenuRef]);

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-5 text-2xl font-bold border-b border-gray-200 dark:border-gray-700">
        MillionLife
      </div>
      <nav className="mt-6 flex-1 px-4">
        <Link
          href="/dashboard"
          className="block py-2.5 px-4 rounded transition duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Dashboard
        </Link>
        <Link
          href="/chat"
          className="block py-2.5 px-4 rounded transition duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Chat
        </Link>
      </nav>
      <div
        ref={settingsMenuRef}
        className="border-t border-gray-200 dark:border-gray-700 p-4 relative"
      >
        <button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className="w-full flex items-center gap-2 p-2 rounded transition duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Cog className="h-5 w-5" />
          <span>Settings & help</span>
        </button>
        {isSettingsOpen && (
          <div className="absolute bottom-16 left-4 right-4 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow-lg">
            <div className="p-4">
              <label
                htmlFor="voice-select"
                className="block text-sm font-medium mb-1"
              >
                Choose a voice:
              </label>
              <select
                id="voice-select"
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              >
                {voices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>
            <ul className="border-t border-gray-200 dark:border-gray-700">
              <li
                className="p-4 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer relative"
                onMouseEnter={() => setIsThemeMenuOpen(true)}
                onMouseLeave={() => setIsThemeMenuOpen(false)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {resolvedTheme === "dark" ? (
                      <Moon className="h-5 w-5" />
                    ) : (
                      <Sun className="h-5 w-5" />
                    )}
                    <span>Theme</span>
                  </div>
                  <span>&gt;</span>
                </div>
                {isThemeMenuOpen && (
                  <div className="absolute left-full top-0 w-40 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow-lg">
                    <ul>
                      <li
                        className="p-4 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer flex justify-between items-center"
                        onClick={() => setTheme("system")}
                      >
                        <span>System</span>
                        {theme === "system" && <Check className="h-5 w-5" />}
                      </li>
                      <li
                        className="p-4 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer flex justify-between items-center"
                        onClick={() => setTheme("light")}
                      >
                        <span>Light</span>
                        {theme === "light" && <Check className="h-5 w-5" />}
                      </li>
                      <li
                        className="p-4 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer flex justify-between items-center"
                        onClick={() => setTheme("dark")}
                      >
                        <span>Dark</span>
                        {theme === "dark" && <Check className="h-5 w-5" />}
                      </li>
                    </ul>
                  </div>
                )}
              </li>
              <li className="p-4 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                Saved info
              </li>
              <li className="p-4 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                Settings
              </li>
              <li className="border-t border-gray-200 dark:border-gray-700 p-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-b-lg cursor-pointer">
                Help
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}