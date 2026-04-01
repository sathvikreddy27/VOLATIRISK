"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { TrendingUp, LogIn } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    const activeSession = localStorage.getItem("volatirisk_user");
    if (activeSession) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    try {
      const usersStr = localStorage.getItem("volatirisk_users_db");
      let users: Record<string, string> = {};
      if (usersStr) {
        users = JSON.parse(usersStr);
      }

      if (users[username]) {
        // User exists -> Login
        if (users[username] === password) {
          localStorage.setItem("volatirisk_user", username);
          setSuccess("Login successful! Redirecting...");
          setTimeout(() => router.push("/dashboard"), 800);
        } else {
          setError("Invalid password for existing user.");
        }
      } else {
        // New user -> Register
        users[username] = password;
        localStorage.setItem("volatirisk_users_db", JSON.stringify(users));
        localStorage.setItem("volatirisk_user", username);
        setSuccess("Registration successful! Redirecting...");
        setTimeout(() => router.push("/dashboard"), 800);
      }
    } catch (err) {
      setError("An error occurred during authentication.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-screen" />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-slate-900/90 to-slate-950/95" />
      
      {/* Dynamic abstract background circles */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }} 
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[100px]"
      />
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.12, 0.1] }} 
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600 rounded-full mix-blend-screen filter blur-[100px]"
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass-panel w-full max-w-md rounded-2xl p-8 sm:p-10 relative z-10 border-t border-white/10 shadow-2xl"
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div 
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-16 w-16 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-5 shadow-inner shadow-blue-500/20 ring-1 ring-blue-500/30"
          >
            <TrendingUp size={32} />
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">VolatiRisk</h1>
          <p className="text-slate-400 text-center text-sm leading-relaxed max-w-xs">
            Enter a username and password. If new, it creates an account automatically.
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 ml-1">
              Username
            </label>
            <input
              type="text"
              className="glass-input w-full rounded-xl px-4 py-3.5 placeholder-slate-600 focus:ring-2 focus:ring-blue-500/50 shadow-inner"
              placeholder="e.g. Satoshi"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 ml-1">
              Password
            </label>
            <input
              type="password"
              className="glass-input w-full rounded-xl px-4 py-3.5 placeholder-slate-600 focus:ring-2 focus:ring-blue-500/50 shadow-inner"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="h-6 flex items-center">
            {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm font-medium w-full text-center">{error}</motion.p>}
            {success && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-emerald-400 text-sm font-medium w-full text-center">{success}</motion.p>}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3.5 rounded-xl flex justify-center items-center gap-2 transition-all shadow-lg shadow-blue-900/30 ring-1 ring-white/10"
          >
            <LogIn size={20} className="mr-1" />
            Continue to Dashboard
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
