function buildUrl(params: Record<string, string>): string {
  const url = new URL("/api/etherscan", window.location.origin);
  for (const [key, val] of Object.entries(params)) {
    url.searchParams.set(key, val);
  }
  return url.toString();
}

export async function fetchBlockNumber(): Promise<number> {
  const res = await fetch(
    buildUrl({ module: "proxy", action: "eth_blockNumber" })
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (!data.result) throw new Error("No block number in response");
  return parseInt(data.result, 16);
}

export async function fetchBlock(blockNumber: number) {
  const hex = "0x" + blockNumber.toString(16);
  const res = await fetch(
    buildUrl({
      module: "proxy",
      action: "eth_getBlockByNumber",
      tag: hex,
      boolean: "true",
    })
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.result;
}

export async function fetchGasOracle() {
  const res = await fetch(
    buildUrl({ module: "gastracker", action: "gasoracle" })
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.status === "1" ? data.result : null;
}

export async function fetchEthPrice() {
  const res = await fetch(
    buildUrl({ module: "stats", action: "ethprice" })
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.status === "1" ? data.result : null;
}
