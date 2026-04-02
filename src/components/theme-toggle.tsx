"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-xl transition-all border border-transparent hover:border-slate-300 dark:hover:border-white/10 hover:bg-slate-200 dark:hover:bg-slate-800/50 text-slate-500 dark:text-slate-400 focus:outline-none"
      title="Toggle theme"
    >
      <Sun className="h-5 w-5 dark:hidden" />
      <Moon className="hidden h-5 w-5 dark:block" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
