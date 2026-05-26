"use client";

import { useState } from "react";
import { Search, ExternalLink, Blocks } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Header() {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
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
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[oklch(0.09_0.015_260/0.85)] backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative flex items-center justify-center w-9 h-9">
              {/* Ethereum diamond icon */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-9 h-9"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 1.5L3 12.5L12 16.5L21 12.5L12 1.5Z"
                  fill="oklch(0.78 0.15 195 / 0.3)"
                  stroke="oklch(0.78 0.15 195)"
                  strokeWidth="1"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 16.5L3 12.5L12 22.5L21 12.5L12 16.5Z"
                  fill="oklch(0.78 0.15 195 / 0.15)"
                  stroke="oklch(0.78 0.15 195)"
                  strokeWidth="1"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="hidden sm:block">
              <h1
                className="text-lg font-bold tracking-tight"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                <span className="text-[oklch(0.78_0.15_195)]">Eth</span>
                <span className="text-foreground">Scan</span>
              </h1>
              <p className="text-[10px] text-muted-foreground -mt-0.5 tracking-wide uppercase">
                Block Explorer
              </p>
            </div>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by address, tx hash, block, or token"
                className="pl-10 bg-white/[0.04] border-white/[0.08] focus:border-primary/50 focus:ring-primary/20 h-10 text-sm placeholder:text-muted-foreground/60"
              />
            </div>
          </form>

          {/* Right side */}
          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hidden sm:flex text-muted-foreground hover:text-foreground"
            >
              <a
                href="https://etherscan.io"
                target="_blank"
                rel="noopener noreferrer"
                className="gap-1.5 text-xs"
              >
                Etherscan <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[oklch(0.72_0.17_155/0.1)] border border-[oklch(0.72_0.17_155/0.2)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span
                className="text-xs font-medium text-emerald-400"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Mainnet
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
