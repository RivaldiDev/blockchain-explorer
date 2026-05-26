import { NextRequest, NextResponse } from "next/server";

const ETHERSCAN_API = "https://api.etherscan.io/v2/api";
const API_KEY = process.env.ETHERSCAN_API_KEY || "";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const url = new URL(ETHERSCAN_API);
  url.searchParams.set("chainid", "1");
  if (API_KEY) url.searchParams.set("apikey", API_KEY);

  for (const [key, val] of searchParams.entries()) {
    url.searchParams.set(key, val);
  }

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 5 },
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to fetch from Etherscan" },
      { status: 502 }
    );
  }
}
