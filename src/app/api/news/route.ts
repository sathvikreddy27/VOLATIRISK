import { NextResponse } from "next/server";

export async function GET() {
  try {
    const url = "https://query2.finance.yahoo.com/v1/finance/search?q=Indian%20stock%20market%20OR%20NSE%20OR%20BSE&newsCount=6";
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
    if (!res.ok) {
        return NextResponse.json({ error: "API failed" }, { status: res.status });
    }
    const data = await res.json();
    
    // map the data.news to simplified objects
    const news = (data?.news || []).slice(0, 4).map((item: any) => ({
      title: item.title,
      link: item.link,
      publisher: item.publisher,
      time: new Date((item.providerPublishTime || 0) * 1000).toLocaleString()
    }));
    
    return NextResponse.json({ data: news });
  } catch(e) {
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
