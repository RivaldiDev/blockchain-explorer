const ETHERSCAN_API = "https://api.etherscan.io/api";

export async function fetchBlockNumber(): Promise<number> {
  const res = await fetch(`${ETHERSCAN_API}?module=proxy&action=eth_blockNumber`);
  const data = await res.json();
  return parseInt(data.result, 16);
}

export async function fetchBlock(blockNumber: number) {
  const hex = "0x" + blockNumber.toString(16);
  const res = await fetch(
    `${ETHERSCAN_API}?module=proxy&action=eth_getBlockByNumber&tag=${hex}&boolean=true`
  );
  const data = await res.json();
  return data.result;
}

export async function fetchGasOracle() {
  const res = await fetch(`${ETHERSCAN_API}?module=gastracker&action=gasoracle`);
  const data = await res.json();
  return data.status === "1" ? data.result : null;
}

export async function fetchEthPrice() {
  const res = await fetch(`${ETHERSCAN_API}?module=stats&action=ethprice`);
  const data = await res.json();
  return data.status === "1" ? data.result : null;
}
