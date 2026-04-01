"use client";

import { motion } from "framer-motion";
import { BellRing, ShieldAlert, Cpu, Zap, Info } from "lucide-react";

export default function AlertsPage() {
  const alerts = [
    { type: "CRITICAL", title: "Volatility Spike Detected", desc: "Auto sector volatility exceeded defined risk threshold of 65%. Auto-hedging protocols recommended.", time: "10 mins ago", icon: ShieldAlert, color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" },
    { type: "AI SIGNAL", title: "Buy Opportunity: TATAMOTORS", desc: "VolatiRisk Neural Engine detects a 78% probability of upward momentum in the next 5 days based on volume breakout.", time: "1 hour ago", icon: Cpu, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { type: "SYSTEM", title: "Portfolio Rebalance Executed", desc: "Successfully shifted 5% equity from IT to Green Energy to maintain beta-neutral status.", time: "3 hours ago", icon: Zap, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { type: "INFO", title: "Market Open: Flat", desc: "NIFTY50 opened at 22,450. Neural sentiment is currently neutral. Monitoring for mid-day macro announcements.", time: "5 hours ago", icon: Info, color: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/20" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <header className="mb-10 text-center md:text-left flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight flex items-center justify-center md:justify-start gap-3">
            <BellRing className="text-yellow-400" size={32} /> Security & System Alerts
          </h1>
          <p className="text-slate-400 font-medium">Real-time notifications from the VolatiRisk analysis engine.</p>
        </div>
        <button className="hidden md:block px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors border border-white/5">
          Mark All as Read
        </button>
      </header>
      
      <div className="space-y-4">
        {alerts.map((alert, i) => {
          const Icon = alert.icon;
          return (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i}
              className={`glass-panel p-5 rounded-2xl border ${alert.border} shadow-lg relative overflow-hidden group hover:bg-slate-800/60 transition-colors cursor-pointer`}
            >
              <div className={`absolute top-0 left-0 w-1 h-full ${alert.bg.replace('/10', '/50')}`} />
              <div className="flex gap-5">
                <div className={`shrink-0 w-12 h-12 rounded-full ${alert.bg} ${alert.color} flex items-center justify-center border ${alert.border}`}>
                  <Icon size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-white text-lg">{alert.title}</h3>
                    <span className="text-xs font-semibold text-slate-500">{alert.time}</span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed mb-3">
                    {alert.desc}
                  </p>
                  <span className={`inline-block px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${alert.bg} ${alert.color}`}>
                    {alert.type}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
