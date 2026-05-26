"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import {
  fetchBlockNumber,
  fetchBlock,
  fetchGasOracle,
  fetchEthPrice,
} from "@/lib/api";
import type { BlockData, TxData, GasOracle, EthPrice } from "@/lib/types";
import {
  Loader2,
  AlertTriangle,
  RefreshCw,
  Box,
  ArrowRightLeft,
  Fuel,
  DollarSign,
  Network,
  Hash,
  Cpu,
  Pickaxe,
} from "lucide-react";

function shortenAddr(addr: string): string {
  if (!addr) return "--";
  if (addr.length <= 12) return addr;
  return addr.slice(0, 8) + "..." + addr.slice(-4);
}

function weiToEth(wei: string): string {
  try {
    const val = BigInt(wei) / BigInt(10 ** 18);
    const remainder = BigInt(wei) % BigInt(10 ** 18);
    const decimal = Number(remainder) / 10 ** 18;
    return (Number(val) + decimal).toFixed(4) + " ETH";
  } catch {
    return "0.0000 ETH";
  }
}

function timeAgo(timestamp: number): string {
  const secs = Math.floor(Date.now() / 1000 - timestamp);
  if (secs < 60) return `${secs} secs ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)} mins ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)} hrs ago`;
  return `${Math.floor(secs / 86400)} days ago`;
}

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  loading: boolean;
}

function StatCard({ label, value, icon, color, loading }: StatCardProps) {
  return (
    <Card className="bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05] transition-colors">
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-white/[0.05] ${color}`}>{icon}</div>
        <div>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">
            {label}
          </p>
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin text-slate-500 mt-1" />
          ) : (
            <p className={`text-lg font-bold ${color}`}>{value}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface ErrorBannerProps {
  message: string;
  onRetry: () => void;
}

function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-6 py-3"
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <span className="text-sm text-red-300">{message}</span>
        </div>
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-300 hover:text-red-200 bg-red-500/10 rounded-md hover:bg-red-500/20 transition-colors"
        >
          <RefreshCw className="h-3 w-3" />
          Retry
        </button>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [ethPrice, setEthPrice] = useState<string>("--");
  const [latestBlock, setLatestBlock] = useState<number>(0);
  const [gasOracle, setGasOracle] = useState<GasOracle | null>(null);
  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [txs, setTxs] = useState<TxData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [blockNum, gas, price] = await Promise.all([
        fetchBlockNumber(),
        fetchGasOracle(),
        fetchEthPrice(),
      ]);

      setLatestBlock(blockNum);
      setGasOracle(gas);
      setEthPrice(price ? "$" + parseFloat(price.ethusd).toLocaleString() : "--");

      // Fetch latest blocks
      const blockPromises: Promise<BlockData>[] = [];
      for (let i = 0; i < 5; i++) {
        blockPromises.push(
          fetchBlock(blockNum - i).then((b) => ({
            number: String(blockNum - i),
            timestamp: String(b?.timestamp || Math.floor(Date.now() / 1000)),
            gasUsed: b?.gasUsed || "0",
            gasLimit: b?.gasLimit || "0",
            miner: shortenAddr(b?.miner || ""),
            txCount: b?.transactions?.length || 0,
          }))
        );
      }

      const resolvedBlocks = await Promise.all(blockPromises);
      setBlocks(resolvedBlocks);

      // Get txs from latest block
      const latestBlockData = await fetchBlock(blockNum);
      if (latestBlockData?.transactions?.length) {
        const blockTxs: TxData[] = latestBlockData.transactions
          .slice(0, 6)
          .map((tx: { hash: string; from: string; to: string; value: string; blockNumber: string; gas: string; gasPrice: string; isError?: string }) => ({
            hash: tx.hash,
            from: tx.from || "",
            to: tx.to || "",
            value: weiToEth(tx.value || "0"),
            blockNumber: tx.blockNumber || "",
            gas: tx.gas || "",
            gasPrice: tx.gasPrice || "",
            isError: tx.isError || "0",
            timeStamp: String(Math.floor(Date.now() / 1000)),
          }));
        setTxs(blockTxs);
      }
    } catch (e) {
      console.error("Failed to load blockchain data:", e);
      setError(
        "Failed to fetch blockchain data. Etherscan API may be rate-limited. Try again in a few seconds."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const stats = [
    {
      label: "ETH Price",
      value: ethPrice,
      icon: <DollarSign className="h-5 w-5" />,
      color: "text-blue-400",
    },
    {
      label: "Latest Block",
      value: latestBlock ? "#" + latestBlock.toLocaleString() : "--",
      icon: <Box className="h-5 w-5" />,
      color: "text-indigo-400",
    },
    {
      label: "Gas Price",
      value: gasOracle ? gasOracle.SafeGasPrice + " Gwei" : "--",
      icon: <Fuel className="h-5 w-5" />,
      color: "text-green-400",
    },
    {
      label: "Network",
      value: "Ethereum Mainnet",
      icon: <Network className="h-5 w-5" />,
      color: "text-purple-400",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />

      <AnimatePresence>
        {error && <ErrorBanner message={error} onRetry={loadData} />}
      </AnimatePresence>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {stats.map((s) => (
          <StatCard key={s.label} {...s} loading={loading} />
        ))}
      </motion.div>

      {/* Blocks + Transactions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Blocks */}
        <Card className="bg-white/[0.03] border-white/[0.06]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-400 rounded-full" />
              Latest Blocks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
              </div>
            ) : blocks.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">
                No blocks loaded
              </p>
            ) : (
              blocks.map((b) => (
                <div
                  key={b.number}
                  className="flex justify-between items-center py-3 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors rounded-sm px-1"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded bg-blue-500/10">
                      <Box className="h-4 w-4 text-blue-400" />
                    </div>
                    <div>
                      <Badge
                        variant="outline"
                        className="text-blue-400 border-blue-400/20 bg-blue-400/10 text-xs font-mono"
                      >
                        {Number(b.number).toLocaleString()}
                      </Badge>
                      <p className="text-xs text-slate-500 mt-1">
                        <strong className="text-slate-300">
                          {b.txCount} txns
                        </strong>{" "}
                        &middot; {timeAgo(Number(b.timestamp))}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">
                      Miner:{" "}
                      <span className="text-slate-300 font-mono">
                        {b.miner}
                      </span>
                    </p>
                    <p className="text-xs text-green-400 font-medium">
                      Gas: {Number(b.gasUsed).toLocaleString()} /{" "}
                      {Number(b.gasLimit).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Transactions */}
        <Card className="bg-white/[0.03] border-white/[0.06]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <span className="w-1 h-4 bg-indigo-400 rounded-full" />
              Latest Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
              </div>
            ) : txs.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">
                No transactions loaded
              </p>
            ) : (
              txs.map((t) => (
                <div
                  key={t.hash}
                  className="flex justify-between items-center py-3 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors rounded-sm px-1"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-xs text-blue-400 truncate">
                      {shortenAddr(t.hash)}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                      <span className="text-slate-400">From:</span>{" "}
                      {shortenAddr(t.from)}{" "}
                      <ArrowRightLeft className="h-3 w-3 inline text-slate-600" />{" "}
                      <span className="text-slate-400">To:</span>{" "}
                      {shortenAddr(t.to)}
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <p className="text-sm font-semibold">{t.value}</p>
                    <Badge
                      variant="outline"
                      className={
                        t.isError === "0"
                          ? "text-green-400 border-green-400/20 bg-green-400/10 text-[10px]"
                          : "text-red-400 border-red-400/20 bg-red-400/10 text-[10px]"
                      }
                    >
                      {t.isError === "0" ? "Success" : "Failed"}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Network Statistics */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Card className="bg-white/[0.03] border-white/[0.06]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Cpu className="h-4 w-4 text-slate-400" />
              Network Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center py-4">
            {[
              {
                label: "Total Blocks",
                value: latestBlock ? latestBlock.toLocaleString() : "--",
                icon: <Box className="h-5 w-5" />,
                color: "text-blue-400",
              },
              {
                label: "Safe Gas",
                value: gasOracle ? gasOracle.SafeGasPrice + " Gwei" : "--",
                icon: <Fuel className="h-5 w-5" />,
                color: "text-green-400",
              },
              {
                label: "Fast Gas",
                value: gasOracle ? gasOracle.FastGasPrice + " Gwei" : "--",
                icon: <Hash className="h-5 w-5" />,
                color: "text-yellow-400",
              },
              {
                label: "Base Fee",
                value: gasOracle ? gasOracle.suggestBaseFee + " Gwei" : "--",
                icon: <Pickaxe className="h-5 w-5" />,
                color: "text-orange-400",
              },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1">
                <div className={`${s.color} mb-1`}>{s.icon}</div>
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
                ) : (
                  <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                )}
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-xs text-slate-600 border-t border-white/5">
        Blockchain Explorer &copy; 2026 &middot; Data from Etherscan API
        &middot; Built with Next.js + shadcn/ui
      </footer>
    </div>
  );
}
