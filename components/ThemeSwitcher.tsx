"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@heroui/button";

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button
      isIconOnly
      onPress={toggleTheme}
      className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden rounded-full"
    >
      <Sun
        className={`w-6 h-6 transition-transform duration-500 ease-in-out transform ${
          theme === "dark" ? "rotate-90 scale-0" : "rotate-0 scale-100"
        }`}
      />
      <Moon
        className={`absolute w-6 h-6 transition-transform duration-500 ease-in-out transform ${
          theme === "dark" ? "rotate-0 scale-100" : "-rotate-90 scale-0"
        }`}
      />
    </Button>
  );
}; 