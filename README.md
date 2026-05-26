<div align="center">

# Blockchain Explorer

**Real-time Ethereum blockchain explorer with live blocks, transactions, and network statistics.**

[![Tech Stack](https://skillicons.dev/icons?i=nextjs,typescript,tailwind,github&theme=dark&perline=4)](https://skillicons.dev)

![Next.js](https://img.shields.io/badge/Next.js_16-App_Router-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-Components-000000?style=for-the-badge)

[![GitHub](https://img.shields.io/badge/Source_Code-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/RivaldiDev/blockchain-explorer)

[Overview](#overview) · [Features](#features) · [Tech Stack](#tech-stack) · [Getting Started](#getting-started) · [Architecture](#architecture)

</div>

---

## Overview

A clean, responsive Ethereum blockchain explorer that fetches real-time data from the Etherscan API. Displays latest blocks, live transactions, gas prices, and network statistics with animated UI transitions.

Built with **Next.js 16** (App Router, TypeScript), **shadcn/ui**, **Tailwind CSS 4**, and **Framer Motion**.

## Features

| Area | What it does |
| --- | --- |
| **Block Explorer** | Latest blocks with miner address, gas usage, and timestamps. |
| **Transaction Viewer** | Real transactions from the latest block with from/to addresses and ETH values. |
| **Network Stats** | Live ETH price, gas oracle (safe/fast/base fee), and block height. |
| **Search** | Search by tx hash, address, or block — redirects to Etherscan. |
| **Error Handling** | Graceful error banners with retry on API rate limits. |
| **Loading States** | Skeleton loaders while fetching data. |
| **Responsive** | Mobile-first grid layout, works on all screen sizes. |

## Tech Stack

| Layer | Technology |
| --- | --- |
| **Framework** | Next.js 16 (App Router, TypeScript) |
| **UI Components** | shadcn/ui (Radix + Tailwind) |
| **Styling** | Tailwind CSS 4 with CSS variables |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **API** | Etherscan API (free tier, optional API key for higher limits) |

## Getting Started

```bash
# Clone
git clone https://github.com/RivaldiDev/blockchain-explorer.git
cd blockchain-explorer

# Install
npm install

# Optional: add Etherscan API key for higher rate limits
cp .env.local.example .env.local
# Edit .env.local and add your key from https://etherscan.io/myapikey

# Dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Dashboard — stats, blocks, transactions
│   └── globals.css         # Tailwind + CSS variables
├── components/
│   ├── header.tsx          # Sticky header with search + network status
│   └── ui/                 # shadcn/ui primitives
└── lib/
    ├── api.ts              # Etherscan API client (with optional API key)
    ├── types.ts            # TypeScript interfaces
    └── utils.ts            # cn() helper
```

## API

Uses [Etherscan API](https://docs.etherscan.io/) free tier:

- `eth_blockNumber` — latest block height
- `eth_getBlockByNumber` — block details + transactions
- `gasoracle` — safe/propose/fast gas prices
- `ethprice` — current ETH/USD price

Free tier: 5 req/sec without API key. Add `NEXT_PUBLIC_ETHERSCAN_API_KEY` for 50 req/sec.

---

<div align="center">

![MIT License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</div>
