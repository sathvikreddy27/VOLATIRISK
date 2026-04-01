"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, TrendingUp, TrendingDown, Briefcase, Wallet, Plus, Trash2, X, Check } from "lucide-react";

interface Holding {
  id: string;
  ticker: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  isUp: boolean;
}

const DEFAULT_HOLDINGS: Holding[] = [
  { id: "1", ticker: "TCS", shares: 45, avgPrice: 3100, currentPrice: 3450, isUp: true },
  { id: "2", ticker: "HDFCBANK", shares: 120, avgPrice: 1500, currentPrice: 1620, isUp: true },
  { id: "3", ticker: "RELIANCE", shares: 30, avgPrice: 2400, currentPrice: 2350, isUp: false },
  { id: "4", ticker: "INFY", shares: 80, avgPrice: 1350, currentPrice: 1480, isUp: true },
  { id: "5", ticker: "TATAMOTORS", shares: 200, avgPrice: 650, currentPrice: 910, isUp: true },
];

export default function PortfolioPage() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  
  // Form State
  const [newTicker, setNewTicker] = useState("");
  const [newShares, setNewShares] = useState("");
  const [newAvgPrice, setNewAvgPrice] = useState("");
  const [newCurrentPrice, setNewCurrentPrice] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("volatirisk_portfolio");
    if (stored) {
      try {
        setHoldings(JSON.parse(stored));
      } catch (err) {
        setHoldings(DEFAULT_HOLDINGS);
      }
    } else {
      setHoldings(DEFAULT_HOLDINGS);
    }
  }, []);

  const saveHoldings = (updated: Holding[]) => {
    setHoldings(updated);
    localStorage.setItem("volatirisk_portfolio", JSON.stringify(updated));
  };

  const handleDelete = (id: string) => {
    const updated = holdings.filter(h => h.id !== id);
    saveHoldings(updated);
  };

  const handleAdd = () => {
    if (!newTicker || !newShares || !newAvgPrice || !newCurrentPrice) return;
    
    const s = parseFloat(newShares);
    const avg = parseFloat(newAvgPrice);
    const cur = parseFloat(newCurrentPrice);
    
    const newAsset: Holding = {
      id: Date.now().toString(),
      ticker: newTicker.toUpperCase(),
      shares: s,
      avgPrice: avg,
      currentPrice: cur,
      isUp: cur >= avg
    };
    
    saveHoldings([...holdings, newAsset]);
    setIsAdding(false);
    setNewTicker("");
    setNewShares("");
    setNewAvgPrice("");
    setNewCurrentPrice("");
  };

  const totalValue = holdings.reduce((acc, h) => acc + (h.shares * h.currentPrice), 0);
  const totalCost = holdings.reduce((acc, h) => acc + (h.shares * h.avgPrice), 0);
  const totalProfitList = totalValue - totalCost;
  const totalProfitPercent = totalCost > 0 ? ((totalProfitList / totalCost) * 100).toFixed(2) : "0.00";

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      <header className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-black text-white mb-2 tracking-tight flex items-center justify-center md:justify-start gap-3">
          <Briefcase className="text-blue-400" size={32} /> My Portfolio
        </h1>
        <p className="text-slate-400 font-medium">Track your algorithmic investments and real-time asset allocations.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden md:col-span-2"
        >
          {/* Reduced blur radius from 3xl to 2xl to fix performance lagging */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
          <h2 className="text-slate-400 font-semibold uppercase tracking-wider text-xs mb-2">Total Equity Value</h2>
          <div className="text-4xl sm:text-5xl font-black text-white mb-4">
            ₹{totalValue.toLocaleString()}
          </div>
          <div className={`flex items-center gap-2 font-bold ${totalProfitList >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {totalProfitList >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
            <span>₹{Math.abs(totalProfitList).toLocaleString()} ({totalProfitPercent}%)</span>
            <span className="text-slate-500 font-medium text-sm ml-2">All time</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-panel p-6 rounded-3xl border border-white/5 shadow-lg flex flex-col justify-center items-center text-center relative"
        >
          <div className="w-16 h-16 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 border border-indigo-500/20 shadow-inner">
            <Wallet size={32} />
          </div>
          <h3 className="text-white font-bold mb-1">Available Cash</h3>
          <p className="text-2xl font-black text-indigo-400">₹1,24,500</p>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass-panel p-6 rounded-3xl border border-white/5 shadow-lg"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-white/5 pb-4">
          <h3 className="font-bold text-white flex items-center gap-2">
            <PieChart size={18} className="text-slate-400" /> Current Holdings
          </h3>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors border border-blue-500/20"
          >
            {isAdding ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Add Asset</>}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-white/5">
                <th className="pb-3 pl-2">Asset</th>
                <th className="pb-3 text-right">Shares</th>
                <th className="pb-3 text-right">Avg Cost</th>
                <th className="pb-3 text-right">Current Price</th>
                <th className="pb-3 text-right">Total Return</th>
                <th className="pb-3 text-right pr-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {isAdding && (
                  <motion.tr 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: "auto" }} 
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-b border-blue-500/20 bg-blue-500/5 relative z-10"
                  >
                    <td className="py-4 pl-2">
                      <input type="text" placeholder="Ticker" value={newTicker} onChange={e=>setNewTicker(e.target.value)} className="w-full bg-slate-900/80 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500/50 outline-none transition-colors" />
                    </td>
                    <td className="py-4 px-2">
                      <input type="number" placeholder="0" value={newShares} onChange={e=>setNewShares(e.target.value)} className="w-full bg-slate-900/80 border border-white/10 rounded-lg px-3 py-2 text-sm text-white text-right focus:border-blue-500/50 outline-none transition-colors" />
                    </td>
                    <td className="py-4 px-2">
                      <input type="number" placeholder="0.00" value={newAvgPrice} onChange={e=>setNewAvgPrice(e.target.value)} className="w-full bg-slate-900/80 border border-white/10 rounded-lg px-3 py-2 text-sm text-white text-right focus:border-blue-500/50 outline-none transition-colors" />
                    </td>
                    <td className="py-4 px-2">
                      <input type="number" placeholder="0.00" value={newCurrentPrice} onChange={e=>setNewCurrentPrice(e.target.value)} className="w-full bg-slate-900/80 border border-white/10 rounded-lg px-3 py-2 text-sm text-white text-right focus:border-blue-500/50 outline-none transition-colors" />
                    </td>
                    <td className="py-4 text-right text-xs text-slate-500 font-semibold uppercase tracking-wider">Manual</td>
                    <td className="py-4 pr-2 text-right">
                      <button onClick={handleAdd} className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors shadow-inner flex items-center justify-center w-full">
                        <Check size={16} /> 
                      </button>
                    </td>
                  </motion.tr>
                )}
                
                {holdings.length === 0 ? (
                  <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <td colSpan={6} className="text-center py-10 text-slate-500 text-sm font-medium">
                      No assets in portfolio. Add one to get started tracking.
                    </td>
                  </motion.tr>
                ) : (
                  holdings.map((h) => {
                    const profit = (h.currentPrice - h.avgPrice) * h.shares;
                    const profitPct = h.avgPrice > 0 ? ((h.currentPrice - h.avgPrice) / h.avgPrice) * 100 : 0;
                    return (
                      <motion.tr 
                        layout
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        key={h.id} 
                        className="border-b border-white/5 hover:bg-slate-800/30 transition-colors group"
                      >
                        <td className="py-4 pl-2">
                           <div className="font-bold text-white group-hover:text-blue-400 transition-colors cursor-pointer">{h.ticker}</div>
                           <div className="text-[10px] text-slate-500 font-mono tracking-wider">EQ</div>
                        </td>
                        <td className="py-4 text-right font-medium text-slate-300">{h.shares}</td>
                        <td className="py-4 text-right font-mono text-slate-400">₹{h.avgPrice}</td>
                        <td className="py-4 text-right font-mono text-white font-semibold">₹{h.currentPrice}</td>
                        <td className={`py-4 text-right font-bold ${h.isUp ? "text-emerald-400" : "text-rose-400"}`}>
                          <div>{profit >= 0 ? "+" : "-"}₹{Math.abs(profit).toLocaleString()}</div>
                          <div className="text-xs opacity-80">{profitPct > 0 ? "+" : ""}{profitPct.toFixed(2)}%</div>
                        </td>
                        <td className="py-4 pr-2 text-right">
                          <button 
                            onClick={() => handleDelete(h.id)}
                            className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors md:opacity-0 md:group-hover:opacity-100 float-right"
                            title="Remove Asset"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
