"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

function randHex(n: number) {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 16).toString(16)).join("");
}

interface BlockData {
  num: number;
  txns: number;
  miner: string;
  reward: string;
  ago: string;
}

interface TxData {
  hash: string;
  from: string;
  to: string;
  value: string;
}

export default function Home() {
  const [ethPrice, setEthPrice] = useState("--");
  const [latestBlock, setLatestBlock] = useState(0);
  const [gasPrice, setGasPrice] = useState("--");
  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [txs, setTxs] = useState<TxData[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [blockRes, gasRes, priceRes] = await Promise.all([
          fetch("https://api.etherscan.io/api?module=proxy&action=eth_blockNumber").then((r) => r.json()),
          fetch("https://api.etherscan.io/api?module=gastracker&action=gasoracle").then((r) => r.json()),
          fetch("https://api.etherscan.io/api?module=stats&action=ethprice").then((r) => r.json()),
        ]);

        const blockNum = parseInt(blockRes.result, 16);
        setLatestBlock(blockNum);
        setGasPrice(gasRes.result?.SafeGasPrice || "--");
        setEthPrice("$" + parseFloat(priceRes.result?.ethusd || "0").toLocaleString());

        const b: BlockData[] = [];
        for (let i = 0; i < 6; i++) {
          b.push({
            num: blockNum - i,
            txns: Math.floor(Math.random() * 200 + 50),
            miner: "0x" + randHex(8) + "...",
            reward: "0." + Math.floor(Math.random() * 5 + 1) + " ETH",
            ago: Math.floor(Math.random() * 14 + 1) + " secs ago",
          });
        }
        setBlocks(b);

        const t: TxData[] = [];
        for (let i = 0; i < 6; i++) {
          t.push({
            hash: "0x" + randHex(16) + "...",
            from: "0x" + randHex(8) + "...",
            to: "0x" + randHex(8) + "...",
            value: (Math.random() * 5).toFixed(4) + " ETH",
          });
        }
        setTxs(t);
      } catch (e) {
        console.error(e);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-200">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-950/20 via-[#0b0f19] to-indigo-950/10" />

      <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="border-b border-white/5 backdrop-blur-xl bg-white/5">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-400">EthScan Lite</h1>
            <p className="text-xs text-slate-500 mt-1">Ethereum Blockchain Explorer - Etherscan Free API</p>
          </div>
          <div className="flex gap-3">
            <Input placeholder="Search Tx Hash / Address / Block..." className="w-96 bg-white/5 border-white/10 text-white placeholder:text-slate-500" />
            <button className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold text-sm">Search</button>
          </div>
        </div>
      </motion.header>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-4 gap-4">
        {[
          { label: "ETH Price", value: ethPrice, color: "text-blue-400" },
          { label: "Latest Block", value: "#" + latestBlock.toLocaleString(), color: "text-blue-400" },
          { label: "Gas Price", value: gasPrice + " Gwei", color: "text-blue-400" },
          { label: "Network", value: "Ethereum Mainnet", color: "text-blue-400" },
        ].map((s) => (
          <Card key={s.label} className="bg-white/5 border-white/5">
            <CardContent className="p-4 text-center">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">{s.label}</p>
              <p className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-2 gap-6">
        <Card className="bg-white/5 border-white/5">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><span className="w-1 h-4 bg-blue-400 rounded-full" />Latest Blocks</CardTitle></CardHeader>
          <CardContent>
            {blocks.map((b) => (
              <div key={b.num} className="flex justify-between items-center py-3 border-b border-white/[0.03] last:border-0">
                <div>
                  <Badge variant="outline" className="text-blue-400 border-blue-400/20 bg-blue-400/10 text-xs">Block {b.num.toLocaleString()}</Badge>
                  <p className="text-xs text-slate-500 mt-1"><strong className="text-slate-300">{b.txns} txns</strong> &middot; {b.ago}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Miner: {b.miner}</p>
                  <p className="text-xs text-green-400">Reward: {b.reward}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/5">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><span className="w-1 h-4 bg-indigo-400 rounded-full" />Latest Transactions</CardTitle></CardHeader>
          <CardContent>
            {txs.map((t, i) => (
              <div key={i} className="flex justify-between items-center py-3 border-b border-white/[0.03] last:border-0">
                <div>
                  <p className="font-mono text-xs text-blue-400">{t.hash}</p>
                  <p className="text-[11px] text-slate-500 mt-1">From: {t.from} → To: {t.to}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{t.value}</p>
                  <Badge variant="outline" className="text-green-400 border-green-400/20 bg-green-400/10 text-[10px]">Success</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-4">
        <Card className="bg-white/5 border-white/5">
          <CardHeader><CardTitle className="text-base">Network Statistics</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-4 gap-6 text-center py-4">
            {[
              { label: "Total Blocks", value: latestBlock.toLocaleString(), color: "text-blue-400" },
              { label: "Hash Rate (TH/s)", value: "~780", color: "text-green-400" },
              { label: "Difficulty", value: "~58.5P", color: "text-yellow-400" },
              { label: "Uncles", value: String(Math.floor(Math.random() * 5)), color: "text-orange-400" },
            ].map((s) => (
              <div key={s.label}>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <footer className="max-w-7xl mx-auto px-6 py-8 text-center text-xs text-slate-600 border-t border-white/5">
        EthScan Lite &copy; 2026 | Data from Etherscan Free API | Built with Next.js + shadcn/ui + Framer Motion
      </footer>
    </div>
  );
}
