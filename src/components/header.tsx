"use client";

import { useState } from "react";
import { Search, Hexagon, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Header() {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    // Open in Etherscan
    const q = query.trim();
    if (q.length === 66 || q.startsWith("0x")) {
      if (q.length === 66) {
        window.open(`https://etherscan.io/tx/${q}`, "_blank");
      } else if (q.length === 42) {
        window.open(`https://etherscan.io/address/${q}`, "_blank");
      } else {
        window.open(`https://etherscan.io/block/${q}`, "_blank");
      }
    } else {
      window.open(`https://etherscan.io/search?f=0&q=${q}`, "_blank");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <Hexagon className="h-8 w-8 text-primary" fill="currentColor" strokeWidth={1} />
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-primary-foreground">E</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                EthScan Lite
              </h1>
              <p className="text-[10px] text-muted-foreground -mt-1">Ethereum Explorer</p>
            </div>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by Address / Txn Hash / Block / Token"
                className="pl-10 bg-secondary/50 border-border/50 focus:border-primary/50 h-10 text-sm"
              />
            </div>
          </form>

          {/* Right side */}
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
              <a
                href="https://etherscan.io"
                target="_blank"
                rel="noopener noreferrer"
                className="gap-1.5 text-xs"
              >
                Etherscan <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs text-emerald-400 font-medium">Mainnet</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
