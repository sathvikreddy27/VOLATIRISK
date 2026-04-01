"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SECTORS } from "@/app/data/sectors";
import { TrendingUp, TrendingDown, Star, Activity, AlertCircle, ShieldAlert, Cpu } from "lucide-react";

interface StockResult {
  ticker: string;
  rawTicker: string;
  latestPrice: string;
  direction: "UP" | "DOWN";
  probability: number;
  volatility: number;
  riskScore: number;
  finalScore: number;
}

export default function AnalyzePage() {
  const [selectedSector, setSelectedSector] = useState<string>("IT");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<StockResult[]>([]);
  const [username, setUsername] = useState("");
  const [savedTickers, setSavedTickers] = useState<Set<string>>(new Set());

  useEffect(() => {
    const user = localStorage.getItem("volatirisk_user");
    if (user) {
      setUsername(user);
      const storedWatch = localStorage.getItem(`volatirisk_watchlist_${user}`);
      if (storedWatch) {
        try {
          const parsed = JSON.parse(storedWatch);
          setSavedTickers(new Set(parsed.map((w: any) => w.ticker)));
        } catch(e) {}
      }
    }
  }, []);

  const runAnalysis = async () => {
    setLoading(true);
    setResults([]);
    
    try {
      const tickers = SECTORS[selectedSector];
      const res = await fetch("/api/stocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tickers })
      });
      const data = await res.json();
      
      if (data && data.data) {
        setResults(data.data);
        
        // Save to History
        if (username) {
          const topStock = data.data.length > 0 ? {
            ticker: data.data[0].ticker,
            probability: data.data[0].probability,
            direction: data.data[0].direction
          } : null;
          
          const newHistory = {
            sector: selectedSector,
            count: data.data.length,
            date: new Date().toISOString(),
            topStock
          };
          
          const histKey = `volatirisk_history_${username}`;
          const existingHistStr = localStorage.getItem(histKey);
          let existingHist = [];
          if (existingHistStr) {
            try { existingHist = JSON.parse(existingHistStr); } catch(e) {}
          }
          existingHist.unshift(newHistory);
          localStorage.setItem(histKey, JSON.stringify(existingHist));
        }
      }
    } catch (err) {
      console.error("Analysis failed", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleWatchlist = (stock: StockResult) => {
    if (!username) return;
    const watchKey = `volatirisk_watchlist_${username}`;
    let existingWatchlist: any[] = [];
    const storedWatch = localStorage.getItem(watchKey);
    if (storedWatch) {
      try { existingWatchlist = JSON.parse(storedWatch); } catch(e) {}
    }

    if (savedTickers.has(stock.ticker)) {
      // Remove
      existingWatchlist = existingWatchlist.filter(w => w.ticker !== stock.ticker);
      const newSaved = new Set(savedTickers);
      newSaved.delete(stock.ticker);
      setSavedTickers(newSaved);
    } else {
      // Add
      existingWatchlist.push({
        ticker: stock.ticker,
        latestPrice: stock.latestPrice,
        direction: stock.direction,
        finalScore: stock.finalScore
      });
      const newSaved = new Set(savedTickers);
      newSaved.add(stock.ticker);
      setSavedTickers(newSaved);
    }
    
    localStorage.setItem(watchKey, JSON.stringify(existingWatchlist));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <header className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-black text-white mb-2 tracking-tight flex items-center justify-center md:justify-start gap-3">
          <Cpu className="text-emerald-400" size={32} /> Algorithmic Analysis
        </h1>
        <p className="text-slate-400 font-medium">Deploy quantitative models to evaluate market sectors in real-time.</p>
      </header>

      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row gap-6 items-end relative z-10">
          <div className="w-full md:flex-1 space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 ml-1">
              Target Sector
            </label>
            <div className="relative">
              <select
                className="glass-input w-full rounded-xl px-4 py-3.5 appearance-none text-white focus:ring-2 focus:ring-emerald-500/50 shadow-inner bg-slate-900/50 border border-white/10"
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                disabled={loading}
              >
                {Object.keys(SECTORS).map(sector => (
                  <option key={sector} value={sector} className="bg-slate-900 text-white">{sector} Market</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                ▼
              </div>
            </div>
          </div>
          
          <motion.button
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            onClick={runAnalysis}
            disabled={loading}
            className={`w-full md:w-auto px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
              loading 
                ? "bg-slate-800 text-slate-400 cursor-not-allowed border border-white/5" 
                : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-900/30 ring-1 ring-white/10"
            }`}
          >
            {loading ? (
              <><Activity size={20} className="animate-spin" /> Processing...</>
            ) : (
              <><Activity size={20} /> Execute Model</>
            )}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Analysis Results <span className="text-xs font-mono bg-blue-500/20 text-blue-400 px-2 py-1 rounded-md">{results.length} Equities</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {results.map((stock, i) => {
                const isUp = stock.direction === "UP";
                const isSaved = savedTickers.has(stock.ticker);
                
                return (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    key={stock.ticker}
                    className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all relative group flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-black text-white">{stock.ticker}</h3>
                        <p className="text-sm font-mono text-slate-400">₹{stock.latestPrice}</p>
                      </div>
                      <button 
                        onClick={() => toggleWatchlist(stock)}
                        className={`p-2 rounded-xl transition-all ${
                          isSaved 
                            ? "bg-yellow-500/20 text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.2)]" 
                            : "bg-slate-800 text-slate-500 hover:text-yellow-400 hover:bg-slate-700"
                        }`}
                        title={isSaved ? "Remove from Watchlist" : "Save to Watchlist"}
                      >
                        <Star size={18} className={isSaved ? "fill-yellow-400" : ""} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4 flex-1">
                      <div className="bg-slate-900/50 rounded-xl p-3 border border-white/5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">Direction</span>
                        <div className={`flex items-center gap-1.5 font-bold ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                          {stock.probability}%
                        </div>
                      </div>
                      <div className="bg-slate-900/50 rounded-xl p-3 border border-white/5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">Risk</span>
                        <div className="flex items-center gap-1.5 font-bold text-amber-400">
                          <ShieldAlert size={16} />
                          {stock.riskScore}/100
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500">Composite Score</span>
                      <span className="text-lg font-black text-blue-400">{stock.finalScore}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
