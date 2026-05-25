<div align="center">

# EthScan Lite

**Lightweight Ethereum blockchain explorer showing latest blocks, transactions, and network statistics.**

[![Tech Stack](https://skillicons.dev/icons?i=nextjs,typescript,tailwind,github&theme=dark&perline=4)](https://skillicons.dev)

![Next.js](https://img.shields.io/badge/Next.js_16-App_Router-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-Components-000000?style=for-the-badge)
![Etherscan-API-blue](https://img.shields.io/badge/Etherscan--API--blue)

[![GitHub](https://img.shields.io/badge/Source_Code-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/RivaldiDev/blockchain-explorer)


[Overview](#overview) · [Features](#features) · [Tech Stack](#tech-stack) · [API](#api) · [Getting Started](#getting-started) · [Architecture](#architecture)

</div>

---

## Overview

Lightweight Ethereum blockchain explorer showing latest blocks, transactions, and network statistics.

Built with **Next.js 16** (App Router, TypeScript), **shadcn/ui** component library, **Tailwind CSS**, and **Framer Motion** for animations. All data is fetched client-side from free public APIs — no API keys required, no backend server.

This project was developed using AI Agent tools (**Claude Code**, **Hermes Agent**) as part of the **Xiaomi MiMo 100T Token Creator** program.

## Features

| Area | What it does |
| --- | --- |
| **Block Explorer** | Latest blocks with miner info, transaction count, and block rewards. |
| **Transaction Viewer** | Recent transactions with from/to addresses and ETH values. |
| **Network Stats** | ETH price, gas price, hash rate, difficulty, and uncle count. |
| **Search** | Search by transaction hash, address, or block number. |
| **UI/UX** | Dark blue/indigo theme with glassmorphism cards and animated transitions. |

## Tech Stack

| Layer | Technology |
| --- | --- |
| **Framework** | Next.js 16 (App Router, TypeScript) |
| **UI Components** | shadcn/ui (Radix + Tailwind) |
| **Styling** | Tailwind CSS 4 |
| **Animations** | Framer Motion |
| **API** | Etherscan API (Free, No API Key) |
| **Deployment** | Vercel |

## API

This project uses **Etherscan API** — completely free, no authentication required.

| Endpoint | Purpose |
| --- | --- |
| Free tier | No rate limiting for reasonable usage |
| No API key | Direct fetch from browser |
| CORS | Enabled for client-side requests |

## Getting Started

```bash
# Clone the repository
git clone https://github.com/RivaldiDev/blockchain-explorer.git
cd blockchain-explorer

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Architecture

```
src/
├── app/
│   ├── layout.tsx        # Root layout with metadata
│   ├── page.tsx          # Main dashboard page (client component)
│   └── globals.css       # Tailwind CSS globals
├── components/
│   └── ui/               # shadcn/ui components (Card, Badge, etc.)
└── lib/
    └── utils.ts          # Utility functions (cn helper)
```

## Deployment

This project is deployed on **Vercel** with automatic deployments from the `main` branch.

```bash
# Deploy to Vercel
npx vercel --prod
```

---

<div align="center">

**Built with AI Agent tools** · Xiaomi MiMo 100T Token Creator Program

![MIT License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</div>
