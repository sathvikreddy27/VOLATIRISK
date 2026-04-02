"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, Activity, BarChart2, LayoutDashboard, PieChart, BellRing, Settings } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("volatirisk_user");
    if (!user) {
      // Small timeout to avoid React state hydration issues if router pushes too fast
      setTimeout(() => router.push("/"), 0);
    } else {
      setUsername(user);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("volatirisk_user");
    router.push("/");
  };

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Analyze", href: "/dashboard/analyze", icon: BarChart2 },
    { name: "Portfolio", href: "/dashboard/portfolio", icon: PieChart },
    { name: "Alerts", href: "/dashboard/alerts", icon: BellRing },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen relative flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      {/* Background gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 -z-10" />
      <div className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1620207418302-439b387441b0?q=80&w=2567&auto=format&fit=crop')] bg-cover bg-center opacity-5 mix-blend-screen pointer-events-none -z-10" />

      {/* Sidebar Navigation */}
      <nav className="fixed bottom-0 w-full md:w-64 md:left-0 md:top-0 md:h-screen bg-white/80 dark:bg-slate-900/50 backdrop-blur-md z-50 flex flex-row md:flex-col border-t md:border-t-0 md:border-r border-slate-200 dark:border-white/5">
        <div className="hidden md:flex items-center gap-3 p-6 mb-4">
          <div className="bg-blue-500/20 p-2 rounded-xl text-blue-400 border border-blue-500/20 shadow-inner">
            <Activity size={24} />
          </div>
          <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            VolatiRisk
          </h1>
        </div>

        <div className="flex-1 flex flex-row md:flex-col items-center md:items-stretch justify-around md:justify-start gap-1 p-3 md:p-4 md:space-y-2 w-full">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={cn(
                  "flex flex-col md:flex-row items-center gap-2 p-3 md:px-4 md:py-3.5 rounded-xl transition-all font-medium text-sm w-full",
                  isActive 
                    ? "bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]" 
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800/50"
                )}
              >
                <div className="relative shrink-0">
                  <Icon size={20} className={isActive ? "animate-pulse" : ""} />
                </div>
                <div className="hidden md:flex flex-1 items-center justify-between pointer-events-none">
                  <span>{link.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
        
        <div className="hidden md:block mx-4 mt-auto mb-6 p-4 bg-slate-100 dark:bg-slate-800/20 rounded-xl border border-slate-200 dark:border-white/5 shadow-inner">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Live Network Status</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
               <span className="text-xs text-slate-400 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/> NSE Server</span>
               <span className="text-xs font-mono text-emerald-400">9ms</span>
            </div>
            <div className="flex justify-between items-center">
               <span className="text-xs text-slate-400 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/> VolatiRisk Eng.</span>
               <span className="text-xs font-mono text-emerald-400">Active</span>
            </div>
            <div className="flex justify-between items-center">
               <span className="text-xs text-slate-400 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"/> Data Sync</span>
               <span className="text-xs font-mono text-blue-400">Live</span>
            </div>
          </div>
        </div>

        <div className="hidden md:block p-4 border-t border-slate-200 dark:border-white/5">
          <div className="flex items-center justify-between px-2 mb-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Session</span>
            <span className="text-xs font-bold text-slate-900 dark:text-white bg-slate-200 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-white/5 truncate max-w-[120px]">{username}</span>
          </div>
          <div className="flex items-center gap-3 mb-4 px-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex-1">Theme</span>
            <ThemeToggle />
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl transition-colors border border-rose-500/10 hover:border-rose-500/30 font-medium text-sm shadow-inner"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 pb-20 md:pb-0 relative min-h-screen">
        {/* Mobile Header */}
        <header className="md:hidden flex justify-between items-center p-4 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md border-b border-slate-200 dark:border-white/5 sticky top-0 z-40 shadow-sm">
           <div className="flex items-center gap-2">
            <Activity size={20} className="text-blue-600 dark:text-blue-400" />
            <h1 className="font-bold text-slate-900 dark:text-white tracking-tight">VolatiRisk</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button onClick={handleLogout} className="p-2 text-rose-600 dark:text-rose-400 bg-rose-500/10 rounded-lg border border-rose-500/20">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
