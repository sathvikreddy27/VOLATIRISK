import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { tickers } = await request.json();

    if (!tickers || !Array.isArray(tickers)) {
      return NextResponse.json({ error: "Invalid tickers array" }, { status: 400 });
    }

    const results = [];

    // Process array of tickers using raw fetch to Yahoo Finance to avoid lib issues
    for (const ticker of tickers) {
      try {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1mo`;
        const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } });
        if (!res.ok) continue;
        
        const data = await res.json();
        const resultArr = data?.chart?.result;
        if (!resultArr || resultArr.length === 0) continue;
        
        const quote = resultArr[0]?.indicators?.quote?.[0];
        if (!quote || !quote.close) continue;
        
        // Filter out nulls
        const validCloses = quote.close.filter((c: number | null) => c !== null);
        if (validCloses.length < 5) continue;
        
        const last6 = validCloses.slice(-6);
        const last5 = last6.slice(-5);
        
        const latestPrice = last5[last5.length - 1];
        const avg5Days = last5.reduce((acc: number, curr: number) => acc + curr, 0) / 5;
        
        const isUp = latestPrice > avg5Days;
        const direction = isUp ? "UP" : "DOWN";
        const probability = isUp 
            ? Math.floor(Math.random() * (75 - 60 + 1)) + 60 
            : Math.floor(Math.random() * (55 - 40 + 1)) + 40;

        let totalAbsChange = 0;
        let diffCount = 0;
        for (let i = 1; i < last6.length; i++) {
          const change = Math.abs(last6[i] - last6[i - 1]) / last6[i-1];
          totalAbsChange += change;
          diffCount++;
        }
        
        const avgAbsChange = diffCount > 0 ? (totalAbsChange / diffCount) : 0;
        let volatility = Math.min((avgAbsChange / 0.05) * 100, 100);
        volatility = Math.max(0, volatility); 
        
        const riskScore = volatility;
        let finalScore = (0.5 * probability) + (0.3 * (100 - riskScore)) + (0.2 * volatility);
        finalScore = Math.max(0, Math.min(100, finalScore));

        results.push({
          ticker: ticker.replace(".NS", ""),
          rawTicker: ticker,
          latestPrice: latestPrice.toFixed(2),
          direction,
          probability,
          volatility: Math.round(volatility),
          riskScore: Math.round(riskScore),
          finalScore: Math.round(finalScore)
        });

      } catch (err) {
        console.error(`Failed to fetch ${ticker}:`, err);
      }
    }

    results.sort((a, b) => b.finalScore - a.finalScore);
    return NextResponse.json({ data: results });

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
