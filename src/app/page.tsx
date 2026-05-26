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
  Blocks,
  Box,
  ArrowRightLeft,
  Fuel,
  DollarSign,
  Network,
  Hash,
  Cpu,
  Layers,
} from "lucide-react";

/* ─── Palette ─── */
const C = {
  indigo: "#2b2d42",
  lavender: "#8d99ae",
  lemon: "#f8f32b",
  white: "#ffffff",
};

function shortenAddr(addr: string): string {
  if (!addr) return "—";
  if (addr.length <= 12) return addr;
  return addr.slice(0, 8) + "…" + addr.slice(-4);
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
  if (secs < 60) return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

/* ─── Stat Card ─── */
interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent: string;
  loading: boolean;
}

function StatCard({ label, value, icon, accent, loading }: StatCardProps) {
  return (
    <Card className="glass border-white/[0.08] hover:border-[#f8f32b]/20 transition-all duration-300 group">
      <CardContent className="p-4 flex items-center gap-3">
        <div
          className={`p-2.5 rounded-lg bg-white/[0.05] ${accent} group-hover:scale-105 transition-transform`}
        >
          {icon}
        </div>
        <div>
          <p
            className="text-[10px] uppercase tracking-widest font-medium"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              color: C.lavender,
            }}
          >
            {label}
          </p>
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin mt-1" style={{ color: C.lavender }} />
          ) : (
            <p
              className="text-lg font-bold text-white"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              {value}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Error Banner ─── */
interface ErrorBannerProps {
  message: string;
  onRetry: () => void;
}

function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
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

/* ─── Section Header ─── */
function SectionHeader({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <CardTitle
      className="text-base flex items-center gap-2.5 text-white"
      style={{ fontFamily: "var(--font-space-grotesk)" }}
    >
      <span
        className="w-1 h-5 rounded-full"
        style={{ background: C.lemon }}
      />
      {icon}
      {title}
    </CardTitle>
  );
}

/* ─── Main Page ─── */
export default function Home() {
  const [ethPrice, setEthPrice] = useState<string>("—");
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
      setEthPrice(price ? "$" + parseFloat(price.ethusd).toLocaleString() : "—");

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
        "Unable to reach the Ethereum network. Rate limit may apply — try again shortly."
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
      accent: "text-[#f8f32b]",
    },
    {
      label: "Latest Block",
      value: latestBlock ? "#" + latestBlock.toLocaleString() : "—",
      icon: <Box className="h-5 w-5" />,
      accent: "text-[#8d99ae]",
    },
    {
      label: "Gas Price",
      value: gasOracle ? gasOracle.SafeGasPrice + " Gwei" : "—",
      icon: <Fuel className="h-5 w-5" />,
      accent: "text-[#f8f32b]",
    },
    {
      label: "Network",
      value: "Ethereum Mainnet",
      icon: <Network className="h-5 w-5" />,
      accent: "text-white",
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: C.indigo }}>
      <Header />

      <AnimatePresence>
        {error && <ErrorBanner message={error} onRetry={loadData} />}
      </AnimatePresence>

      {/* ─── Stats Bar ─── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {stats.map((s) => (
          <StatCard key={s.label} {...s} loading={loading} />
        ))}
      </motion.div>

      {/* ─── Blocks + Transactions ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Blocks */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Card className="glass border-white/[0.08]">
            <CardHeader className="pb-3">
              <SectionHeader
                icon={<Blocks className="h-4 w-4" style={{ color: C.lavender }} />}
                title="Recent Blocks"
              />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin" style={{ color: C.lavender }} />
                </div>
              ) : blocks.length === 0 ? (
                <p className="text-sm text-center py-10" style={{ color: C.lavender }}>
                  Waiting for blocks…
                </p>
              ) : (
                <div className="space-y-0.5">
                  {blocks.map((b) => (
                    <div
                      key={b.number}
                      className="flex justify-between items-center py-3 border-b border-white/[0.06] last:border-0 hover:bg-white/[0.04] transition-colors rounded-sm px-2 -mx-2"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-md bg-[#f8f32b]/10">
                          <Box className="h-4 w-4" style={{ color: C.lemon }} />
                        </div>
                        <div>
                          <Badge
                            variant="outline"
                            className="text-[#f8f32b] border-[#f8f32b]/20 bg-[#f8f32b]/8 text-xs font-mono"
                          >
                            {Number(b.number).toLocaleString()}
                          </Badge>
                          <p className="text-xs mt-1" style={{ color: C.lavender }}>
                            <span className="text-white/80 font-medium">
                              {b.txCount} txns
                            </span>{" "}
                            · {timeAgo(Number(b.timestamp))}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs" style={{ color: C.lavender }}>
                          Miner{" "}
                          <span className="text-white/70 font-mono text-[11px]">
                            {b.miner}
                          </span>
                        </p>
                        <p className="text-xs text-[#f8f32b]/80 font-medium">
                          {Number(b.gasUsed).toLocaleString()} /{" "}
                          {Number(b.gasLimit).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
        >
          <Card className="glass border-white/[0.08]">
            <CardHeader className="pb-3">
              <SectionHeader
                icon={<ArrowRightLeft className="h-4 w-4" style={{ color: C.lavender }} />}
                title="Recent Transactions"
              />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin" style={{ color: C.lavender }} />
                </div>
              ) : txs.length === 0 ? (
                <p className="text-sm text-center py-10" style={{ color: C.lavender }}>
                  Waiting for transactions…
                </p>
              ) : (
                <div className="space-y-0.5">
                  {txs.map((t) => (
                    <div
                      key={t.hash}
                      className="flex justify-between items-center py-3 border-b border-white/[0.06] last:border-0 hover:bg-white/[0.04] transition-colors rounded-sm px-2 -mx-2"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-xs text-[#f8f32b] truncate">
                          {shortenAddr(t.hash)}
                        </p>
                        <p className="text-[11px] mt-1 flex items-center gap-1" style={{ color: C.lavender }}>
                          <span className="text-white/50">From</span>{" "}
                          {shortenAddr(t.from)}{" "}
                          <ArrowRightLeft className="h-3 w-3 inline text-white/20" />{" "}
                          <span className="text-white/50">To</span>{" "}
                          {shortenAddr(t.to)}
                        </p>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <p
                          className="text-sm font-semibold text-white"
                          style={{ fontFamily: "var(--font-space-grotesk)" }}
                        >
                          {t.value}
                        </p>
                        <Badge
                          variant="outline"
                          className={
                            t.isError === "0"
                              ? "text-[#f8f32b] border-[#f8f32b]/20 bg-[#f8f32b]/8 text-[10px]"
                              : "text-red-400 border-red-400/20 bg-red-400/8 text-[10px]"
                          }
                        >
                          {t.isError === "0" ? "Success" : "Failed"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ─── Network Health ─── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4"
      >
        <Card className="glass border-white/[0.08]">
          <CardHeader className="pb-3">
            <SectionHeader
              icon={<Cpu className="h-4 w-4" style={{ color: C.lavender }} />}
              title="Network Health"
            />
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center py-4">
            {[
              {
                label: "Total Blocks",
                value: latestBlock ? latestBlock.toLocaleString() : "—",
                icon: <Layers className="h-5 w-5" />,
                color: C.lemon,
              },
              {
                label: "Safe Gas",
                value: gasOracle ? gasOracle.SafeGasPrice + " Gwei" : "—",
                icon: <Fuel className="h-5 w-5" />,
                color: C.lavender,
              },
              {
                label: "Fast Gas",
                value: gasOracle ? gasOracle.FastGasPrice + " Gwei" : "—",
                icon: <Hash className="h-5 w-5" />,
                color: C.lemon,
              },
              {
                label: "Base Fee",
                value: gasOracle ? gasOracle.suggestBaseFee + " Gwei" : "—",
                icon: <Box className="h-5 w-5" />,
                color: C.lavender,
              },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1.5">
                <div className="mb-1 opacity-60" style={{ color: s.color }}>
                  {s.icon}
                </div>
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" style={{ color: C.lavender }} />
                ) : (
                  <p
                    className="text-xl font-bold"
                    style={{ fontFamily: "var(--font-space-grotesk)", color: s.color }}
                  >
                    {s.value}
                  </p>
                )}
                <p className="text-[11px] tracking-wide uppercase" style={{ color: C.lavender }}>
                  {s.label}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* ─── Footer ─── */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.08] pt-6">
          <div className="flex items-center gap-2 text-xs" style={{ color: C.lavender }}>
            <span
              className="font-semibold text-white/60"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              EthScan Lite
            </span>
            <span>·</span>
            <span>Data from Etherscan API</span>
            <span>·</span>
            <span>Built with Next.js + shadcn/ui</span>
          </div>
          <a
            href="https://github.com/RivaldiDev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs hover:text-white transition-colors"
            style={{ color: C.lavender }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            RivaldiDev
          </a>
        </div>
      </footer>
    </div>
  );
}
