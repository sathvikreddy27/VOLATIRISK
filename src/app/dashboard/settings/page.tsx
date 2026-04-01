"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, User, Bell, Lock, Smartphone, Globe, Shield } from "lucide-react";

export default function SettingsPage() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [autoTrade, setAutoTrade] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const Toggle = ({ enabled, setEnabled }: { enabled: boolean, setEnabled: (v: boolean) => void }) => (
    <div 
      onClick={() => setEnabled(!enabled)}
      className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 ease-in-out border border-white/10 ${enabled ? "bg-emerald-500" : "bg-slate-700"}`}
    >
      <div 
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${enabled ? "translate-x-6" : ""}`}
      />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto pb-10">
      <header className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-black text-white mb-2 tracking-tight flex items-center justify-center md:justify-start gap-3">
          <Settings className="text-indigo-400" size={32} /> Account Settings
        </h1>
        <p className="text-slate-400 font-medium">Manage your personal preferences and system configurations.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation Sidebar (Simulated) */}
        <div className="md:col-span-1 space-y-2">
          <button className="w-full flex items-center gap-3 p-3.5 bg-blue-500/10 text-blue-400 rounded-xl font-bold border border-blue-500/20 transition-colors pointer-events-none">
            <User size={18} /> Profile Details
          </button>
          <button className="w-full flex items-center gap-3 p-3.5 hover:bg-slate-800/50 text-slate-400 rounded-xl font-medium transition-colors">
            <Bell size={18} /> Notifications
          </button>
          <button className="w-full flex items-center gap-3 p-3.5 hover:bg-slate-800/50 text-slate-400 rounded-xl font-medium transition-colors">
            <Lock size={18} /> Security
          </button>
          <button className="w-full flex items-center gap-3 p-3.5 hover:bg-slate-800/50 text-slate-400 rounded-xl font-medium transition-colors">
            <Globe size={18} /> Connected APIs
          </button>
        </div>

        {/* Main Settings Area */}
        <div className="md:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
            
            <h2 className="text-xl font-black text-white flex items-center gap-2 border-b border-white/5 pb-4">
              System Preferences
            </h2>

            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className="text-white font-bold text-sm">Theme Mode</h3>
                <p className="text-slate-400 text-xs mt-1">Dark mode required for optimal visualization.</p>
              </div>
              <Toggle enabled={darkMode} setEnabled={setDarkMode} />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className="text-white font-bold text-sm">Push Notifications</h3>
                <p className="text-slate-400 text-xs mt-1">Receive alerts instantly on your device.</p>
              </div>
              <Toggle enabled={pushEnabled} setEnabled={setPushEnabled} />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className="text-white font-bold text-sm">Email Reports</h3>
                <p className="text-slate-400 text-xs mt-1">Daily summaries of your algorithmic metrics.</p>
              </div>
              <Toggle enabled={emailEnabled} setEnabled={setEmailEnabled} />
            </div>
          </motion.div>

          {/* Advanced Section */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-6 sm:p-8 rounded-3xl border border-rose-500/10 space-y-6 shadow-xl relative overflow-hidden">
             
            <h2 className="text-xl font-black text-white flex items-center gap-2 border-b border-white/5 pb-4">
              <Shield className="text-rose-400" size={20} /> Advanced Features
            </h2>

            <div className="flex items-center justify-between py-2">
              <div className="pr-4">
                <h3 className="text-rose-400 font-bold text-sm">Autonomous Algorithmic Trading</h3>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">Allow the neural network to execute trades automatically on your behalf based on risk scores.</p>
              </div>
              <Toggle enabled={autoTrade} setEnabled={setAutoTrade} />
            </div>
          </motion.div>

          <div className="flex justify-end pt-4">
             <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-blue-900/30 transition-all border border-blue-500/20">
               Save Changes
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
