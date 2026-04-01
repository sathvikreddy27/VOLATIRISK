"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Newspaper, Clock, ArrowRight, Star, TrendingUp, TrendingDown, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";

interface HistoryItem {
  sector: string;
  count: number;
  date: string;
  topStock: { ticker: string; probability: number; direction: string } | null;
}

interface WatchlistItem {
  ticker: string;
  latestPrice: string;
  direction: "UP" | "DOWN";
  finalScore: number;
}

interface NewsItem {
  title: string;
  link: string;
  publisher: string;
  time: string;
}

export default function DashboardHome() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [username, setUsername] = useState("");
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("volatirisk_user");
    if (user) {
      setUsername(user);
      // History
      const storedHist = localStorage.getItem(`volatirisk_history_${user}`);
      if (storedHist) {
        try { setHistory(JSON.parse(storedHist)); } catch(e) {}
      }
      // Watchlist
      const storedWatch = localStorage.getItem(`volatirisk_watchlist_${user}`);
      if (storedWatch) {
        try { setWatchlist(JSON.parse(storedWatch)); } catch(e) {}
      }
    }

    // Fetch Live News
    fetch("/api/news")
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          setNewsItems(data.data);
        }
      })
      .catch(err => console.error("Error fetching news:", err))
      .finally(() => setLoadingNews(false));
  }, []);

  const removeFromWatchlist = (ticker: string) => {
    const updated = watchlist.filter(w => w.ticker !== ticker);
    setWatchlist(updated);
    if (username) {
      localStorage.setItem(`volatirisk_watchlist_${username}`, JSON.stringify(updated));
    }
  };

  const fallbackNews = [
    { title: "Market Volatility Hits 3-Month Low Amidst Stable Earnings Reports", link: "#", publisher: "MarketWatch", time: "2 hours ago" },
    { title: "Tech Sector Prepares for Major Breakout Before Next Quarter", link: "#", publisher: "Financial Times", time: "4 hours ago" }
  ];

  const displayNews = newsItems.length > 0 ? newsItems : fallbackNews;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Market Overview</h1>
        <p className="text-slate-400 font-medium">Welcome to your dashboard. Get the latest insights before analyzing your sectors.</p>
      </header>

      {/* Top Grid: Action & Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Quick Action */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div 
            whileHover={{ scale: 1.02, translateY: -2 }}
            className="glass-panel p-6 rounded-3xl relative overflow-hidden group cursor-pointer border border-blue-500/20 shadow-lg shadow-blue-900/10"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
            <h2 className="text-xl font-bold text-white mb-2">Ready to Analyze?</h2>
            <p className="text-slate-400 text-sm mb-6 pr-4 leading-relaxed">Run the latest algorithm across major sectors to uncover hidden opportunities with VolatiRisk technology.</p>
            <Link href="/dashboard/analyze" className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-900/30 ring-1 ring-white/10">
              Start Analysis <ArrowRight size={18} />
            </Link>
          </motion.div>

          <div className="glass-panel p-6 rounded-3xl border border-white/5 h-full">
            <h3 className="font-bold text-white flex items-center gap-2 mb-5">
              <Clock size={16} className="text-slate-400" /> Recent History
            </h3>
            {history.length === 0 ? (
              <p className="text-sm text-slate-500 italic text-center py-8">No analysis history found.</p>
            ) : (
              <div className="space-y-3">
                {history.slice(0, 5).map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/40 border border-white/5 hover:bg-slate-800/60 transition-colors">
                    <div>
                      <span className="block text-sm font-semibold text-slate-200">{item.sector} Sector</span>
                      <span className="block text-xs text-slate-500 mt-1">{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                    {item.topStock ? (
                      <div className="text-right">
                        <span className="block text-sm font-bold text-white tracking-widest leading-none">{item.topStock.ticker}</span>
                        <span className={`block text-[10px] font-bold mt-1 ${item.topStock.direction === 'UP' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {item.topStock.direction} {item.topStock.probability}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500">{item.count} stocks</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Watchlist and News */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Personal Watchlist */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-yellow-500/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Star size={18} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)] fill-yellow-400 opacity-90" /> 
                My Personal Watchlist
              </h3>
              <span className="text-xs font-bold px-2 py-1 bg-slate-800 rounded-md text-slate-400 border border-white/5">{watchlist.length} saved</span>
            </div>

            {watchlist.length === 0 ? (
              <div className="w-full border border-dashed border-white/10 rounded-2xl p-8 text-center bg-slate-800/20">
                <Star size={32} className="mx-auto text-slate-600 mb-3" />
                <p className="text-slate-400 text-sm font-medium">Your watchlist is empty.</p>
                <p className="text-slate-500 text-xs mt-1">Go to Analyze and click "Save to Watchlist" on any stock.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AnimatePresence>
                  {watchlist.map(stock => {
                    const isUp = stock.direction === "UP";
                    return (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={stock.ticker} 
                        className="group flex flex-col p-4 rounded-2xl bg-slate-800/50 border border-white/5 hover:border-white/10 transition-colors relative"
                      >
                         <div className="flex justify-between items-start mb-2">
                           <div>
                             <h4 className="text-lg font-black text-white">{stock.ticker}</h4>
                             <span className="text-xs font-mono text-slate-400">₹{stock.latestPrice}</span>
                           </div>
                           <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">Score</span>
                            <span className="text-md font-black text-blue-400">{stock.finalScore}</span>
                           </div>
                         </div>
                         <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/5">
                           <div className={`flex items-center gap-1.5 text-xs font-bold ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                              {stock.direction}
                           </div>
                           <button 
                             onClick={() => removeFromWatchlist(stock.ticker)}
                             className="text-slate-500 hover:text-rose-400 transition-colors p-1 opacity-0 group-hover:opacity-100 focus:opacity-100 rounded-md hover:bg-rose-500/10"
                             title="Remove from Watchlist"
                           >
                             <Trash2 size={16} />
                           </button>
                         </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Fintech News Widgets */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5">
            <h3 className="font-bold text-white flex items-center gap-2 mb-6">
              <Newspaper size={18} className="text-blue-400" /> Live Market Intel
            </h3>
            {loadingNews ? (
               <div className="text-sm text-slate-500 animate-pulse text-center py-6">Connecting to Yahoo Finance...</div>
            ) : (
              <div className="space-y-4">
                {displayNews.map((news, i) => (
                  <a href={news.link} target="_blank" rel="noreferrer" key={i} className={`block group p-5 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/60 transition-all cursor-pointer relative overflow-hidden`}>
                    {/* Subtle left glow */}
                    <div className={`absolute top-0 left-0 w-1 h-full bg-blue-500/50`} />
                    
                    <div className="flex items-start justify-between gap-5 pl-2">
                      <div>
                        <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider mb-3 bg-blue-500/10 text-blue-400`}>
                          {news.publisher}
                        </span>
                        <h4 className="text-lg font-semibold text-slate-200 leading-snug group-hover:text-blue-400 transition-colors">
                          {news.title}
                        </h4>
                        <p className="text-xs font-semibold text-slate-500 mt-3 flex items-center gap-1.5 uppercase tracking-wider"><Clock size={12}/> {news.time}</p>
                      </div>
                      <div className="shrink-0 p-2.5 bg-slate-900/60 rounded-xl opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                        <ExternalLink size={18} className="text-blue-400" />
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
