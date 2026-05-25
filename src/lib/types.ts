export interface BlockData {
  number: string;
  timestamp: string;
  gasUsed: string;
  gasLimit: string;
  miner: string;
  txCount: number;
  reward?: string;
}

export interface TxData {
  hash: string;
  from: string;
  to: string;
  value: string;
  blockNumber: string;
  gas: string;
  gasPrice: string;
  isError: string;
  timeStamp: string;
  methodId?: string;
  functionName?: string;
}

export interface GasOracle {
  SafeGasPrice: string;
  ProposeGasPrice: string;
  FastGasPrice: string;
  suggestBaseFee: string;
}

export interface EthPrice {
  ethbtc: string;
  ethusd: string;
  ethusd_timestamp: string;
}

export interface NetworkStats {
  blockNumber: string;
  gasOracle: GasOracle | null;
  ethPrice: EthPrice | null;
}
